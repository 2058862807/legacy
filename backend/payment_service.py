# Stripe Payment Processing Service
import stripe
import os
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from payment_models import SubscriptionPlan, UserSubscription, Payment, Usage
from models import User
import logging

logger = logging.getLogger(__name__)

class PaymentService:
    def __init__(self):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        self.success_url = os.getenv("STRIPE_SUCCESS_URL")
        self.cancel_url = os.getenv("STRIPE_CANCEL_URL")
    
    def create_subscription_plans(self, db: Session):
        """Create default subscription plans"""
        plans = [
            {
                "name": "Basic",
                "stripe_price_id": "price_basic_monthly",
                "price": 9.99,
                "billing_period": "month",
                "features": [
                    "Basic will creation",
                    "Document storage (up to 10 documents)",
                    "2 beneficiaries",
                    "Email support",
                    "Basic compliance checking"
                ],
                "max_documents": 10,
                "max_heirs": 2,
                "blockchain_notarization": False,
                "priority_support": False
            },
            {
                "name": "Professional",
                "stripe_price_id": "price_professional_monthly", 
                "price": 29.99,
                "billing_period": "month",
                "features": [
                    "Advanced will builder with AI guidance",
                    "Unlimited document storage",
                    "Unlimited beneficiaries",
                    "Blockchain document notarization",
                    "50-state compliance monitoring",
                    "Death trigger configuration",
                    "Priority email support",
                    "AI grief companion"
                ],
                "max_documents": None,
                "max_heirs": None,
                "blockchain_notarization": True,
                "priority_support": True
            },
            {
                "name": "Premium",
                "stripe_price_id": "price_premium_monthly",
                "price": 59.99,
                "billing_period": "month",
                "features": [
                    "Everything in Professional",
                    "White-glove estate planning consultation",
                    "Legal document review",
                    "Advanced crypto/NFT management",
                    "Family vault sharing",
                    "24/7 phone support",
                    "Personal account manager"
                ],
                "max_documents": None,
                "max_heirs": None,
                "blockchain_notarization": True,
                "priority_support": True
            }
        ]
        
        for plan_data in plans:
            existing_plan = db.query(SubscriptionPlan).filter(
                SubscriptionPlan.stripe_price_id == plan_data["stripe_price_id"]
            ).first()
            
            if not existing_plan:
                plan = SubscriptionPlan(**plan_data)
                db.add(plan)
        
        db.commit()
    
    def get_subscription_plans(self, db: Session) -> List[Dict]:
        """Get all active subscription plans"""
        plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()
        
        return [{
            "id": plan.id,
            "name": plan.name,
            "price": plan.price,
            "billing_period": plan.billing_period,
            "features": plan.features,
            "max_documents": plan.max_documents,
            "max_heirs": plan.max_heirs,
            "blockchain_notarization": plan.blockchain_notarization,
            "priority_support": plan.priority_support
        } for plan in plans]
    
    def create_customer(self, user: User) -> str:
        """Create Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name,
                metadata={
                    "user_id": str(user.id),
                    "app": "nextera_estate"
                }
            )
            return customer.id
        except Exception as e:
            logger.error(f"Failed to create Stripe customer: {str(e)}")
            raise
    
    def create_checkout_session(self, user_id: int, plan_id: int, db: Session) -> Dict:
        """Create Stripe checkout session"""
        try:
            user = db.query(User).filter(User.id == user_id).first()
            plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
            
            if not user or not plan:
                raise ValueError("User or plan not found")
            
            # Create customer if not exists
            customer_id = self.create_customer(user)
            
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': plan.stripe_price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f"{self.success_url}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=self.cancel_url,
                metadata={
                    "user_id": str(user_id),
                    "plan_id": str(plan_id)
                }
            )
            
            return {
                "checkout_url": session.url,
                "session_id": session.id
            }
            
        except Exception as e:
            logger.error(f"Failed to create checkout session: {str(e)}")
            raise
    
    def handle_successful_payment(self, session_id: str, db: Session):
        """Handle successful payment webhook"""
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            user_id = int(session.metadata["user_id"])
            plan_id = int(session.metadata["plan_id"])
            
            # Get subscription details
            subscription = stripe.Subscription.retrieve(session.subscription)
            
            # Create user subscription record
            user_subscription = UserSubscription(
                user_id=user_id,
                plan_id=plan_id,
                stripe_subscription_id=subscription.id,
                stripe_customer_id=session.customer,
                status=subscription.status,
                current_period_start=datetime.fromtimestamp(subscription.current_period_start),
                current_period_end=datetime.fromtimestamp(subscription.current_period_end)
            )
            
            db.add(user_subscription)
            
            # Create payment record
            payment = Payment(
                user_id=user_id,
                stripe_payment_intent_id=session.payment_intent,
                amount=session.amount_total / 100,  # Convert from cents
                currency=session.currency,
                status="succeeded",
                description=f"Subscription to {db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first().name}"
            )
            
            db.add(payment)
            db.commit()
            
            logger.info(f"Successfully processed payment for user {user_id}")
            
        except Exception as e:
            logger.error(f"Failed to handle successful payment: {str(e)}")
            db.rollback()
            raise
    
    def cancel_subscription(self, user_id: int, db: Session) -> bool:
        """Cancel user subscription"""
        try:
            user_subscription = db.query(UserSubscription).filter(
                UserSubscription.user_id == user_id,
                UserSubscription.status == "active"
            ).first()
            
            if not user_subscription:
                return False
            
            # Cancel in Stripe
            stripe.Subscription.modify(
                user_subscription.stripe_subscription_id,
                cancel_at_period_end=True
            )
            
            # Update local record
            user_subscription.cancel_at_period_end = True
            user_subscription.updated_at = datetime.utcnow()
            db.commit()
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to cancel subscription: {str(e)}")
            return False
    
    def get_user_subscription(self, user_id: int, db: Session) -> Optional[Dict]:
        """Get user's current subscription"""
        subscription = db.query(UserSubscription).filter(
            UserSubscription.user_id == user_id
        ).order_by(UserSubscription.created_at.desc()).first()
        
        if not subscription:
            return None
        
        return {
            "id": subscription.id,
            "plan_name": subscription.plan.name,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end,
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "features": subscription.plan.features,
            "max_documents": subscription.plan.max_documents,
            "max_heirs": subscription.plan.max_heirs,
            "blockchain_notarization": subscription.plan.blockchain_notarization
        }
    
    def check_feature_access(self, user_id: int, feature: str, db: Session) -> bool:
        """Check if user has access to specific feature"""
        subscription = self.get_user_subscription(user_id, db)
        
        if not subscription or subscription["status"] != "active":
            # Free tier limitations
            if feature == "documents":
                doc_count = db.query(User).filter(User.id == user_id).first().documents
                return len(doc_count) < 3  # Free tier: 3 documents max
            elif feature == "heirs":
                heir_count = db.query(User).filter(User.id == user_id).first().heirs
                return len(heir_count) < 2  # Free tier: 2 heirs max
            elif feature == "blockchain_notarization":
                return False
            elif feature == "ai_grief_support":
                return True  # Available in free tier
            else:
                return False
        
        # Paid subscription - check plan limits
        if feature == "documents":
            max_docs = subscription["max_documents"]
            if max_docs is None:
                return True
            doc_count = len(db.query(User).filter(User.id == user_id).first().documents)
            return doc_count < max_docs
        
        elif feature == "heirs":
            max_heirs = subscription["max_heirs"]
            if max_heirs is None:
                return True
            heir_count = len(db.query(User).filter(User.id == user_id).first().heirs)
            return heir_count < max_heirs
        
        elif feature == "blockchain_notarization":
            return subscription["blockchain_notarization"]
        
        return True
    
    def track_usage(self, user_id: int, feature: str, db: Session):
        """Track feature usage for billing"""
        now = datetime.utcnow()
        
        usage_record = db.query(Usage).filter(
            Usage.user_id == user_id,
            Usage.feature == feature,
            Usage.month == now.month,
            Usage.year == now.year
        ).first()
        
        if usage_record:
            usage_record.count += 1
            usage_record.updated_at = now
        else:
            usage_record = Usage(
                user_id=user_id,
                feature=feature,
                count=1,
                month=now.month,
                year=now.year
            )
            db.add(usage_record)
        
        db.commit()