# Real Stripe Integration for NextEra Estate - Production Ready
import os
import uuid
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

# Import Stripe at module level
try:
    import stripe
    STRIPE_AVAILABLE = True
    logger.info("✅ Stripe library imported successfully")
except ImportError as e:
    logger.error(f"❌ Stripe library not available: {str(e)}")
    STRIPE_AVAILABLE = False

class RealStripeService:
    """Production Stripe service with real API integration"""
    
    def __init__(self):
        if not STRIPE_AVAILABLE:
            logger.error("Stripe library not installed")
            raise ValueError("Stripe library is required")
        
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_publishable_key = os.getenv("STRIPE_PUBLISHABLE_KEY")
        
        if not self.stripe_secret_key:
            logger.error("Stripe secret key not found in environment variables")
            raise ValueError("Stripe secret key is required")
            
        # Initialize Stripe with real API key
        stripe.api_key = self.stripe_secret_key
        
        # Test the API connection
        try:
            # Simple API test
            account = stripe.Account.retrieve()
            logger.info("✅ Real Stripe service initialized and API connection verified")
            logger.info(f"🔑 Using API key: {self.stripe_secret_key[:7]}...")
            logger.info(f"📧 Connected to Stripe account: {account.get('email', 'N/A')}")
        except Exception as e:
            logger.warning(f"⚠️ Stripe API test failed: {str(e)}")
            logger.info("✅ Stripe service initialized (API test failed but continuing)")
            logger.info(f"🔑 Using API key: {self.stripe_secret_key[:7]}...")

    # Define payment packages - server-side only for security
    PAYMENT_PACKAGES = {
        "basic_will": {
            "name": "Basic Will Generation",
            "amount": 29.99,
            "description": "Generate a basic will with AI assistance",
            "features": ["AI-powered will creation", "State compliance checking", "PDF generation"]
        },
        "premium_will": {
            "name": "Premium Will with Blockchain",
            "amount": 49.99,
            "description": "AI-powered will with blockchain notarization",
            "features": ["Everything in Basic", "Blockchain notarization", "Enhanced AI features", "Priority support"]
        },
        "document_notarization": {
            "name": "Document Notarization",
            "amount": 9.99,
            "description": "Blockchain notarization service for documents",
            "features": ["Blockchain timestamps", "Immutable verification", "Certificate generation"]
        },
        "full_estate_plan": {
            "name": "Complete Estate Planning",
            "amount": 99.99,
            "description": "Complete estate planning with all premium features",
            "features": ["Everything in Premium", "Advanced trust creation", "Tax optimization", "Legal review"]
        },
        "grief_support_premium": {
            "name": "Premium Grief Support",
            "amount": 19.99,
            "description": "Enhanced AI grief companion with unlimited sessions",
            "features": ["Unlimited AI sessions", "Crisis support", "Emotional tracking", "Professional resources"]
        }
    }

    async def create_checkout_session(self, package_id: str, origin_url: str, user_id: int = None, metadata: Dict = None) -> Dict:
        """Create real Stripe checkout session for predefined package"""
        try:
            # Validate package exists
            if package_id not in self.PAYMENT_PACKAGES:
                raise ValueError(f"Invalid package ID: {package_id}")

            package = self.PAYMENT_PACKAGES[package_id]
            
            # Generate session ID
            session_uuid = str(uuid.uuid4())
            
            # Build URLs - dynamic from frontend
            success_url = f"{origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{origin_url}/payment-cancel"

            # Prepare metadata
            checkout_metadata = {
                "package_id": package_id,
                "user_id": str(user_id) if user_id else "guest",
                "session_uuid": session_uuid,
                **(metadata or {})
            }

            # Create real Stripe checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': package["name"],
                                'description': package["description"],
                                'metadata': {
                                    'package_id': package_id,
                                    'features': ', '.join(package["features"])
                                }
                            },
                            'unit_amount': int(package["amount"] * 100),  # Convert to cents
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=checkout_metadata,
                expires_at=int(datetime.utcnow().timestamp()) + (30 * 60),  # 30 minutes
                allow_promotion_codes=True,
                billing_address_collection='required',
                shipping_address_collection=None,
                customer_email=None,  # Will be collected during checkout
                payment_intent_data={
                    'metadata': checkout_metadata,
                    'description': f"NextEra Estate - {package['name']}"
                }
            )

            logger.info(f"✅ Real Stripe checkout session created: {session.id}")
            logger.info(f"💰 Amount: ${package['amount']} for package: {package['name']}")

            return {
                "success": True,
                "checkout_url": session.url,
                "session_id": session.id,
                "session_uuid": session_uuid,
                "amount": package["amount"],
                "package_info": package
            }

        except stripe.error.StripeError as e:
            logger.error(f"❌ Stripe API error: {str(e)}")
            return {
                "success": False,
                "error": f"Payment processing error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"❌ Stripe checkout session creation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def check_payment_status(self, session_id: str) -> Dict:
        """Check real payment status for session"""
        try:
            # Retrieve real session from Stripe
            session = stripe.checkout.Session.retrieve(session_id)

            # Also get payment intent for more details
            payment_intent = None
            if session.payment_intent:
                payment_intent = stripe.PaymentIntent.retrieve(session.payment_intent)

            logger.info(f"🔍 Checking payment status for session: {session_id}")
            logger.info(f"📊 Session status: {session.status}, Payment status: {session.payment_status}")

            return {
                "success": True,
                "status": session.status,
                "payment_status": session.payment_status,
                "amount_total": session.amount_total,
                "currency": session.currency,
                "customer_email": session.customer_details.email if session.customer_details else None,
                "metadata": session.metadata or {},
                "payment_intent": {
                    "status": payment_intent.status if payment_intent else None,
                    "created": payment_intent.created if payment_intent else None
                }
            }

        except stripe.error.StripeError as e:
            logger.error(f"❌ Stripe API error checking payment: {str(e)}")
            return {
                "success": False,
                "error": f"Payment status check error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"❌ Payment status check failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def handle_webhook(self, request_body: bytes, stripe_signature: str, webhook_secret: str) -> Dict:
        """Handle real Stripe webhooks"""
        try:
            # Verify webhook signature with real Stripe
            event = stripe.Webhook.construct_event(
                request_body,
                stripe_signature,
                webhook_secret
            )

            logger.info(f"🎣 Received Stripe webhook: {event['type']}")

            # Process the event
            event_type = event['type']
            event_data = event['data']['object']

            if event_type == 'checkout.session.completed':
                session = event_data
                logger.info(f"💰 Payment completed for session: {session.get('id')}")
                return {
                    "success": True,
                    "event_type": event_type,
                    "event_id": event['id'],
                    "session_id": session.get('id'),
                    "payment_status": session.get('payment_status'),
                    "amount_total": session.get('amount_total'),
                    "customer_email": session.get('customer_details', {}).get('email'),
                    "metadata": session.get('metadata', {})
                }
            
            elif event_type == 'checkout.session.expired':
                session = event_data
                logger.info(f"⏰ Payment session expired: {session.get('id')}")
                return {
                    "success": True,
                    "event_type": event_type,
                    "event_id": event['id'],
                    "session_id": session.get('id'),
                    "payment_status": "expired",
                    "metadata": session.get('metadata', {})
                }
            
            elif event_type == 'payment_intent.succeeded':
                payment_intent = event_data
                logger.info(f"✅ Payment intent succeeded: {payment_intent.get('id')}")
                return {
                    "success": True,
                    "event_type": event_type,
                    "event_id": event['id'],
                    "payment_intent_id": payment_intent.get('id'),
                    "amount": payment_intent.get('amount'),
                    "metadata": payment_intent.get('metadata', {})
                }
            
            elif event_type == 'payment_intent.payment_failed':
                payment_intent = event_data
                logger.warning(f"❌ Payment failed: {payment_intent.get('id')}")
                return {
                    "success": True,
                    "event_type": event_type,
                    "event_id": event['id'],
                    "payment_intent_id": payment_intent.get('id'),
                    "failure_reason": payment_intent.get('last_payment_error', {}).get('message'),
                    "metadata": payment_intent.get('metadata', {})
                }
            
            else:
                # Unhandled event type
                logger.info(f"📝 Unhandled Stripe webhook event: {event_type}")
                return {
                    "success": True,
                    "event_type": event_type,
                    "event_id": event['id'],
                    "session_id": None,
                    "payment_status": "unknown",
                    "metadata": {}
                }

        except ValueError as e:
            logger.error(f"❌ Invalid Stripe webhook signature: {str(e)}")
            return {
                "success": False,
                "error": "Invalid webhook signature"
            }
        except self.stripe.error.StripeError as e:
            logger.error(f"❌ Stripe webhook error: {str(e)}")
            return {
                "success": False,
                "error": f"Stripe webhook error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"❌ Webhook handling failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def get_packages(self) -> Dict:
        """Get available payment packages"""
        return {
            "packages": self.PAYMENT_PACKAGES,
            "currency": "USD",
            "tax_info": "Sales tax calculated at checkout based on billing address",
            "security": "Payments processed securely by Stripe",
            "refund_policy": "30-day money-back guarantee on all premium features"
        }

    async def create_refund(self, payment_intent_id: str, amount: int = None, reason: str = None) -> Dict:
        """Create refund for a payment"""
        try:
            refund = self.stripe.Refund.create(
                payment_intent=payment_intent_id,
                amount=amount,  # If None, refunds full amount
                reason=reason or 'requested_by_customer'
            )
            
            logger.info(f"💸 Refund created: {refund.id} for payment: {payment_intent_id}")
            
            return {
                "success": True,
                "refund_id": refund.id,
                "amount": refund.amount,
                "status": refund.status
            }
        
        except self.stripe.error.StripeError as e:
            logger.error(f"❌ Refund creation failed: {str(e)}")
            return {
                "success": False,
                "error": f"Refund error: {str(e)}"
            }

    async def list_customer_payments(self, customer_email: str) -> Dict:
        """List payments for a customer by email"""
        try:
            # Find checkout sessions by customer email
            sessions = self.stripe.checkout.Session.list(
                limit=50,
                expand=['data.payment_intent']
            )
            
            # Filter by customer email
            customer_sessions = []
            for session in sessions.data:
                if (session.customer_details and 
                    session.customer_details.email == customer_email):
                    customer_sessions.append({
                        "session_id": session.id,
                        "amount": session.amount_total / 100,
                        "currency": session.currency.upper(),
                        "status": session.payment_status,
                        "created": datetime.fromtimestamp(session.created).isoformat(),
                        "metadata": session.metadata
                    })
            
            return {
                "success": True,
                "payments": customer_sessions,
                "total_payments": len(customer_sessions)
            }
            
        except self.stripe.error.StripeError as e:
            logger.error(f"❌ Customer payments lookup failed: {str(e)}")
            return {
                "success": False,
                "error": f"Payments lookup error: {str(e)}"
            }