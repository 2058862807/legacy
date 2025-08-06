# Payment and Enhanced AI Endpoints for NextEra Estate
from fastapi import APIRouter, HTTPException, Depends, Request, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import json
import logging
import os
from datetime import datetime

# Import our modules
from models import get_db, PaymentTransaction, User, GriefSession
from auth import get_current_user, get_current_user_optional
from enhanced_services import RealAIService, UserGuidanceService
from real_stripe_service import RealStripeService

logger = logging.getLogger(__name__)

# Create router
payment_router = APIRouter()

# Initialize services lazily
real_ai_service = None
stripe_service = None
guidance_service = None

def get_services():
    """Get initialized services (lazy loading)"""
    global real_ai_service, stripe_service, guidance_service
    if real_ai_service is None:
        real_ai_service = RealAIService()
        stripe_service = RealStripeService()
        guidance_service = UserGuidanceService(real_ai_service)
    return real_ai_service, stripe_service, guidance_service

# Payment Endpoints
@payment_router.get("/api/payments/packages")
async def get_payment_packages():
    """Get available payment packages"""
    _, stripe_service, _ = get_services()
    return {
        "packages": stripe_service.PAYMENT_PACKAGES,
        "currency": "USD",
        "tax_info": "Taxes calculated at checkout"
    }

@payment_router.post("/api/payments/checkout")
async def create_payment_checkout(
    request: Request,
    package_id: str = Form(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Create Stripe checkout session"""
    try:
        # Get origin URL from request
        origin_url = str(request.base_url).rstrip('/')
        
        # Create checkout session
        result = await stripe_service.create_checkout_session(
            package_id=package_id,
            origin_url=origin_url,
            user_id=current_user.id if current_user else None,
            metadata={"source": "web_checkout"}
        )

        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])

        # Create payment transaction record
        payment_transaction = PaymentTransaction(
            user_id=current_user.id if current_user else None,
            session_id=result["session_id"],
            amount=result["amount"],
            currency="usd",
            payment_status="pending",
            status="initiated",
            package_type=package_id,
            description=result["package_info"]["description"],
            payment_metadata={
                "package_info": result["package_info"],
                "session_uuid": result["session_uuid"]
            }
        )
        
        db.add(payment_transaction)
        db.commit()

        return {
            "checkout_url": result["checkout_url"],
            "session_id": result["session_id"]
        }

    except Exception as e:
        logger.error(f"Payment checkout creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment session")

@payment_router.get("/api/payments/status/{session_id}")
async def get_payment_status(
    request: Request,
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get payment status"""
    try:
        # Check payment status with Stripe
        stripe_result = await stripe_service.check_payment_status(session_id)
        
        if not stripe_result["success"]:
            raise HTTPException(status_code=400, detail=stripe_result["error"])

        # Update local payment record
        payment_transaction = db.query(PaymentTransaction).filter(
            PaymentTransaction.session_id == session_id
        ).first()

        if payment_transaction:
            # Prevent duplicate processing
            if payment_transaction.payment_status != stripe_result["payment_status"]:
                payment_transaction.payment_status = stripe_result["payment_status"]
                payment_transaction.status = "complete" if stripe_result["payment_status"] == "paid" else "pending"
                payment_transaction.updated_at = datetime.utcnow()
                
                # Add payment completion logic here (enable features, etc.)
                if stripe_result["payment_status"] == "paid" and payment_transaction.status != "complete":
                    await process_successful_payment(payment_transaction, db)
                
                db.commit()

        return {
            "status": stripe_result["status"],
            "payment_status": stripe_result["payment_status"],
            "amount_total": stripe_result["amount_total"] / 100,  # Convert from cents
            "currency": stripe_result["currency"]
        }

    except Exception as e:
        logger.error(f"Payment status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check payment status")

@payment_router.post("/api/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhooks"""
    try:
        # Get request body and signature
        body = await request.body()
        stripe_signature = request.headers.get("stripe-signature")
        
        if not stripe_signature:
            raise HTTPException(status_code=400, detail="Missing Stripe signature")

        # Get webhook secret from environment
        webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
        if not webhook_secret:
            logger.error("STRIPE_WEBHOOK_SECRET not configured")
            raise HTTPException(status_code=500, detail="Webhook secret not configured")
        
        # Handle webhook
        webhook_result = await stripe_service.handle_webhook(body, stripe_signature, webhook_secret)
        
        if not webhook_result["success"]:
            logger.error(f"Webhook processing failed: {webhook_result['error']}")
            raise HTTPException(status_code=400, detail="Webhook processing failed")

        # Process webhook data
        session_id = webhook_result.get("session_id")
        if session_id:
            payment_transaction = db.query(PaymentTransaction).filter(
                PaymentTransaction.session_id == session_id
            ).first()

            if payment_transaction:
                payment_transaction.payment_status = webhook_result["payment_status"]
                payment_transaction.status = "complete" if webhook_result["payment_status"] == "paid" else payment_transaction.status
                payment_transaction.updated_at = datetime.utcnow()
                
                if webhook_result["payment_status"] == "paid":
                    await process_successful_payment(payment_transaction, db)
                
                db.commit()

        return {"received": True}

    except Exception as e:
        logger.error(f"Stripe webhook processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def process_successful_payment(payment_transaction: PaymentTransaction, db: Session):
    """Process successful payment - enable features, send confirmations, etc."""
    try:
        # Enable premium features based on package type
        package_type = payment_transaction.package_type
        
        if payment_transaction.user_id:
            user = db.query(User).filter(User.id == payment_transaction.user_id).first()
            if user:
                # Add premium features logic here
                # For example: user.premium_features = True
                logger.info(f"Enabled premium features for user {user.id}, package: {package_type}")
        
        # Add additional success processing here
        logger.info(f"Successfully processed payment for session: {payment_transaction.session_id}")
        
    except Exception as e:
        logger.error(f"Payment success processing failed: {str(e)}")

# Enhanced Grief Companion Endpoints
@payment_router.post("/api/grief/session")
async def create_enhanced_grief_session(
    session_id: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Create or get enhanced grief support session"""
    import uuid
    
    if not session_id:
        session_id = str(uuid.uuid4())
    
    session = db.query(GriefSession).filter(GriefSession.session_id == session_id).first()
    
    if not session:
        session = GriefSession(
            user_id=current_user.id if current_user else None,
            session_id=session_id,
            messages=[]
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    return {
        "session_id": session.session_id,
        "messages": session.messages or [],
        "emotional_state": session.emotional_state,
        "enhanced_features": current_user is not None  # Premium features for logged-in users
    }

@payment_router.post("/api/grief/message")
async def send_enhanced_grief_message(
    session_id: str = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db)
):
    """Send message to enhanced AI grief companion"""
    try:
        session = db.query(GriefSession).filter(GriefSession.session_id == session_id).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Generate AI response using real AI service
        ai_response = await real_ai_service.generate_grief_response(
            user_message=message,
            session_id=session_id,
            emotional_state=session.emotional_state
        )
        
        # Update session with new messages
        messages = session.messages or []
        messages.extend([
            {
                "id": len(messages) + 1,
                "type": "user",
                "content": message,
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": len(messages) + 2,
                "type": "ai",
                "content": ai_response["content"],
                "timestamp": ai_response["timestamp"],
                "provider": ai_response["provider_used"]
            }
        ])
        
        session.messages = messages
        session.emotional_state = ai_response["emotional_state"]
        session.session_length = len(messages)
        session.last_activity = datetime.utcnow()
        session.crisis_detected = ai_response.get("crisis_detected", False)
        
        db.commit()
        
        return {
            "response": ai_response["content"],
            "emotional_state": ai_response["emotional_state"],
            "crisis_detected": ai_response.get("crisis_detected", False),
            "provider_used": ai_response["provider_used"]
        }
        
    except Exception as e:
        logger.error(f"Enhanced grief message processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process message")

# Will Builder AI Assistance
@payment_router.post("/api/will/ai-assistance")
async def get_will_ai_assistance(
    query: str = Form(...),
    context: str = Form("{}"),  # JSON string of user context
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI assistance for will building"""
    try:
        # Parse user context
        user_context = json.loads(context)
        user_context.update({
            "jurisdiction": current_user.jurisdiction,
            "age": 25,  # Calculate from date_of_birth if available
            "marital_status": current_user.marital_status or "single"
        })
        
        # Generate AI assistance
        session_id = f"will_assistance_{current_user.id}"
        ai_response = await real_ai_service.generate_will_assistance(
            user_query=query,
            user_context=user_context,
            session_id=session_id
        )
        
        return {
            "assistance": ai_response["content"],
            "provider_used": ai_response["provider_used"],
            "timestamp": ai_response["timestamp"]
        }
        
    except Exception as e:
        logger.error(f"Will AI assistance failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate AI assistance")

# User Guidance and Onboarding
@payment_router.get("/api/guidance/welcome")
async def get_welcome_tutorial():
    """Get welcome tutorial and onboarding guide"""
    return guidance_service.get_welcome_tutorial()

@payment_router.get("/api/guidance/feature-tour/{feature}")
async def get_feature_tour(feature: str):
    """Get detailed tour for specific feature"""
    return guidance_service.get_feature_tour(feature)

@payment_router.post("/api/guidance/help")
async def get_contextual_help(
    page: str = Form(...),
    query: str = Form(...),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get contextual help for specific pages"""
    try:
        session_id = f"help_{current_user.id if current_user else 'anonymous'}"
        help_response = await guidance_service.get_contextual_help(page, query, session_id)
        
        return {
            "help_content": help_response["content"],
            "provider_used": help_response["provider_used"]
        }
        
    except Exception as e:
        logger.error(f"Contextual help failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get help")

# Enhanced Dashboard Stats
@payment_router.get("/api/dashboard/enhanced-stats")
async def get_enhanced_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get enhanced dashboard stats including premium features"""
    try:
        # Get basic stats
        from server import get_dashboard_stats
        basic_stats = await get_dashboard_stats(current_user, db)
        
        # Add premium stats
        payment_transactions = db.query(PaymentTransaction).filter(
            PaymentTransaction.user_id == current_user.id,
            PaymentTransaction.payment_status == "paid"
        ).all()
        
        premium_features = []
        total_spent = sum(t.amount for t in payment_transactions)
        
        for transaction in payment_transactions:
            if transaction.package_type == "premium_will":
                premium_features.append("Premium Will Builder")
            elif transaction.package_type == "document_notarization":
                premium_features.append("Blockchain Notarization")
            elif transaction.package_type == "full_estate_plan":
                premium_features.append("Complete Estate Planning")
        
        return {
            **basic_stats,
            "premium_features": premium_features,
            "total_spent": total_spent,
            "payment_history": len(payment_transactions),
            "ai_assistance_available": True
        }
        
    except Exception as e:
        logger.error(f"Enhanced dashboard stats failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get enhanced stats")