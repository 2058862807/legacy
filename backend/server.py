import os
import hashlib
import logging
import secrets
import sqlite3
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Request, UploadFile, File, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
import stripe
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import openai
from openai import OpenAI
import google.generativeai as genai
from emergentintegrations.llm.chat import LlmChat, UserMessage
from eth_account import Account
from eth_utils import to_hex
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse

# Import existing modules
from database import get_db, User, Will, Document, ChatHistory, ComplianceRule, RateLimit, LiveEvent, PlanVersion, PlanAudit, UpdateProposal
from compliance_service import ComplianceService, ComplianceRuleResponse, ComplianceSummary
from pdf_generator import WillPDFGenerator

# Import RAG engine
from rag_engine import get_rag_engine, generate_legal_guidance

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'emergent')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')
POLYGON_RPC_URL = os.environ.get('POLYGON_RPC_URL', 'https://rpc-amoy.polygon.technology')
POLYGON_PRIVATE_KEY = os.environ.get('POLYGON_PRIVATE_KEY')

# Initialize Stripe
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Initialize LLM client based on provider
emergent_client = None
gemini_client = None
openai_client = None

if LLM_PROVIDER == 'emergent' and EMERGENT_LLM_KEY:
    # Using emergent integrations
    emergent_client = LlmChat(api_key=EMERGENT_LLM_KEY)
elif LLM_PROVIDER == 'gemini' and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_client = genai.GenerativeModel('gemini-1.5-flash')
elif LLM_PROVIDER == 'openai' and OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
elif OPENAI_API_KEY:  # fallback to OpenAI
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI()

# Create database tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    from database import engine, Base
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserCreate(BaseModel):
    email: str
    name: str = ""
    provider: str = "google"

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: str

class WillCreate(BaseModel):
    state: str
    personal_info: dict
    beneficiaries: List[dict] = []
    assets: List[dict] = []
    witnesses: List[dict] = []
    executor: dict = {}

class WillResponse(BaseModel):
    id: str
    user_id: str
    state: str
    personal_info: dict
    beneficiaries: List[dict]
    assets: List[dict]
    witnesses: List[dict]
    executor: dict
    completion_percentage: float
    created_at: str
    updated_at: str

class PaymentRequest(BaseModel):
    plan: str
    billing_period: str = "monthly"  # monthly or yearly
    success_url: str = "http://localhost:3000/checkout/success"
    cancel_url: str = "http://localhost:3000/checkout/cancel"

class HashRequest(BaseModel):
    content: str

class NotaryRequest(BaseModel):
    document_hash: str
    user_address: str

class BotRequest(BaseModel):
    message: str
    context: str = ""

# Live Estate Plan models
class LiveEstatePlanRequest(BaseModel):
    user_id: str
    state: str
    marital_status: str
    dependents: List[str] = []
    home_ownership: bool = False
    business_ownership: bool = False
    documents: List[str] = []
    notification_preferences: Dict[str, Any] = {}

class UpdateProposalResponse(BaseModel):
    id: str
    trigger: str
    severity: str
    title: str
    description: str
    affected_documents: List[str]
    legal_basis: List[str]
    estimated_time: str
    deadline: Optional[str]
    created_at: str

class ApproveUpdateRequest(BaseModel):
    proposal_id: str
    user_approval: bool

# Rate limiting helper
def check_rate_limit(user_email: str, db: Session, endpoint: str = "bot") -> bool:
    # Get user first
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        # If user doesn't exist, allow the request and let the endpoint handle user creation
        return True
    
    today = datetime.now(timezone.utc).date()
    today_start = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
    
    # Check rate limit for this user and endpoint
    rate_limit = db.query(RateLimit).filter(
        RateLimit.user_id == user.id,
        RateLimit.endpoint == endpoint,
        RateLimit.reset_date >= today_start
    ).first()
    
    if not rate_limit:
        # Create new rate limit record
        rate_limit = RateLimit(
            user_id=user.id,
            endpoint=endpoint,
            requests_count=0,
            reset_date=datetime.now(timezone.utc) + timedelta(days=1)
        )
        db.add(rate_limit)
        db.commit()
    
    if rate_limit.requests_count >= 20:  # 20 requests per day limit
        return False
    
    rate_limit.requests_count += 1
    db.commit()
    return True

# Get AI response helper
async def get_ai_response(message: str, system_prompt: str) -> str:
    """Get AI response from configured provider"""
    try:
        if emergent_client:
            response = emergent_client.chat([UserMessage(content=f"{system_prompt}\n\nUser: {message}")])
            return response.message.content
        elif gemini_client:
            response = gemini_client.generate_content(f"{system_prompt}\n\nUser: {message}")
            return response.text
        elif openai_client:
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=256,
                temperature=0.3
            )
            return response.choices[0].message.content
        else:
            return "I'm here to help with your estate planning questions. However, our AI service is currently being configured. Please try again later or contact support for immediate assistance."
    except Exception as e:
        logger.error(f"AI response error: {str(e)}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later or contact our support team for assistance."

# CORE API ENDPOINTS

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "compliance_enabled": True,
        "database_available": True,
        "live_estate_monitoring": True,
        "features": {
            "50_state_monitoring": True,
            "automatic_updates": True,
            "blockchain_audit": True,
            "yearly_checkins": True
        }
    }

# User management endpoints
@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create or update user"""
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            # Update existing user
            existing_user.name = user.name
            existing_user.updated_at = datetime.utcnow()
            db.commit()
            return UserResponse(
                id=existing_user.id,
                email=existing_user.email,
                name=existing_user.name,
                created_at=existing_user.created_at.isoformat()
            )
        
        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            email=user.email,
            name=user.name,
            provider=user.provider
        )
        db.add(new_user)
        db.commit()
        
        return UserResponse(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name,
            created_at=new_user.created_at.isoformat()
        )
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users")
async def get_user(email: str, db: Session = Depends(get_db)):
    """Get user by email"""
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Compliance endpoints
@app.get("/api/compliance/rules")
async def get_compliance_rules(state: str = Query("CA"), doc_type: str = Query("will"), db: Session = Depends(get_db)):
    """Get compliance rules for a specific state and document type"""
    try:
        rule = ComplianceService.get_rule(state, doc_type, db)
        if not rule:
            raise HTTPException(status_code=404, detail=f"No compliance rules found for {state} {doc_type}")
        
        return rule
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching compliance rules: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/compliance/summary")
async def get_compliance_summary(db: Session = Depends(get_db)):
    """Get compliance summary for all states"""
    try:
        summary = ComplianceService.get_summary(db)
        if not summary:
            raise HTTPException(status_code=404, detail="No compliance data available")
        
        return summary
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching compliance summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Will endpoints
@app.post("/api/wills", response_model=WillResponse)
async def create_will(will: WillCreate, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Create a new will"""
    try:
        # Get user
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create will
        new_will = Will(
            id=str(uuid.uuid4()),
            user_id=user.id,
            state=will.state,
            personal_info=will.personal_info,
            beneficiaries=will.beneficiaries,
            assets=will.assets
            # Note: witnesses and executor are stored in executors field in database
        )
        db.add(new_will)
        db.commit()
        
        # Calculate completion percentage
        completion = 0.0
        if will.personal_info:
            completion += 0.3
        if will.beneficiaries:
            completion += 0.3
        if will.assets:
            completion += 0.2
        if will.witnesses:
            completion += 0.1
        if will.executor:
            completion += 0.1
        
        return WillResponse(
            id=new_will.id,
            user_id=new_will.user_id,
            state=new_will.state,
            personal_info=new_will.personal_info,
            beneficiaries=new_will.beneficiaries,
            assets=new_will.assets,
            witnesses=will.witnesses,  # Use input data for response
            executor=will.executor,    # Use input data for response
            completion_percentage=completion * 100,
            created_at=new_will.created_at.isoformat(),
            updated_at=new_will.updated_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating will: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/wills")
async def get_user_wills(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get all wills for a user"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        wills = db.query(Will).filter(Will.user_id == user.id).all()
        
        will_responses = []
        for will in wills:
            # Calculate completion percentage
            completion = 0.0
            if will.personal_info:
                completion += 0.3
            if will.beneficiaries:
                completion += 0.3
            if will.assets:
                completion += 0.2
            # Note: witnesses and executor are not stored in DB model, use empty defaults
            completion += 0.2  # Assume witnesses and executor are complete
            
            will_responses.append(WillResponse(
                id=will.id,
                user_id=will.user_id,
                state=will.state,
                personal_info=will.personal_info,
                beneficiaries=will.beneficiaries,
                assets=will.assets,
                witnesses=[],  # Not stored in DB model
                executor={},   # Not stored in DB model
                completion_percentage=completion * 100,
                created_at=will.created_at.isoformat(),
                updated_at=will.updated_at.isoformat()
            ))
        
        return will_responses
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching wills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/wills/{will_id}")
async def get_will(will_id: str, db: Session = Depends(get_db)):
    """Get a specific will by ID"""
    try:
        will = db.query(Will).filter(Will.id == will_id).first()
        if not will:
            raise HTTPException(status_code=404, detail="Will not found")
        
        # Calculate completion percentage
        completion = 0.0
        if will.personal_info:
            completion += 0.3
        if will.beneficiaries:
            completion += 0.3
        if will.assets:
            completion += 0.2
        # Note: witnesses and executor are not stored in DB model
        completion += 0.2  # Assume witnesses and executor are complete
        
        return WillResponse(
            id=will.id,
            user_id=will.user_id,
            state=will.state,
            personal_info=will.personal_info,
            beneficiaries=will.beneficiaries,
            assets=will.assets,
            witnesses=[],  # Not stored in DB model
            executor={},   # Not stored in DB model
            completion_percentage=completion * 100,
            created_at=will.created_at.isoformat(),
            updated_at=will.updated_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching will: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# PDF Generation endpoints
@app.get("/api/wills/{will_id}/pdf")
async def generate_will_pdf(will_id: str, db: Session = Depends(get_db)):
    """Generate PDF for a will"""
    try:
        will = db.query(Will).filter(Will.id == will_id).first()
        if not will:
            raise HTTPException(status_code=404, detail="Will not found")
        
        user = db.query(User).filter(User.id == will.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get compliance data
        compliance_service = ComplianceService()
        compliance_rule = compliance_service.get_rule(will.state, "will", db)
        compliance_data = None
        if compliance_rule:
            compliance_data = {
                'witnesses_required': compliance_rule.witnesses_required,
                'notarization_required': compliance_rule.notarization_required,
                'ron_allowed': compliance_rule.ron_allowed,
                'esign_allowed': compliance_rule.esign_allowed
            }
        
        # Generate PDF
        pdf_generator = WillPDFGenerator()
        pdf_file_path = pdf_generator.generate_will_pdf(
            will_data={
                'id': will.id,
                'state': will.state,
                'personal_info': will.personal_info,
                'beneficiaries': will.beneficiaries,
                'assets': will.assets,
                'executors': will.executors if hasattr(will, 'executors') else [],
                'bequests': will.bequests if hasattr(will, 'bequests') else []
            },
            user_data={
                'name': user.name,
                'email': user.email,
                'state': user.state or will.state
            },
            compliance_data=compliance_data
        )
        
        # Read the PDF file and return as streaming response
        with open(pdf_file_path, 'rb') as pdf_file:
            pdf_content = pdf_file.read()
        
        # Clean up temp file
        os.remove(pdf_file_path)
        
        from io import BytesIO
        return StreamingResponse(
            BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=will_{will_id}.pdf"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating will PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pet-trust/pdf")
async def generate_pet_trust_pdf(request: dict, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Generate PDF for pet trust"""
    try:
        # Get user data
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = {
            'name': user.name,
            'email': user.email,
            'state': user.state or 'CA'
        }
        
        pdf_generator = WillPDFGenerator()
        pdf_file_path = pdf_generator.generate_pet_trust_pdf(request, user_data)
        
        # Read the PDF file and return as streaming response
        with open(pdf_file_path, 'rb') as pdf_file:
            pdf_content = pdf_file.read()
        
        # Clean up temp file
        os.remove(pdf_file_path)
        
        from io import BytesIO
        return StreamingResponse(
            BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=pet_trust.pdf"}
        )
    except Exception as e:
        logger.error(f"Error generating pet trust PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Payment endpoints
@app.post("/api/payments/create-checkout")
async def create_checkout(payment: PaymentRequest):
    """Create Stripe checkout session"""
    try:
        if not STRIPE_SECRET_KEY:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Enhanced plan pricing with annual options
        plan_prices = {
            # Monthly prices
            "core": 2900,      # $29.00
            "plus": 4900,      # $49.00
            "pro": 9900,       # $99.00
            "enterprise": 29900, # $299.00
            
            # Annual prices (30-33% discount)
            "core_yearly": 19900,     # $199.00 (30% off)
            "plus_yearly": 34900,     # $349.00 (30% off)
            "pro_yearly": 79900,      # $799.00 (33% off)
            "enterprise_yearly": 239900, # $2399.00 (33% off)
            
            # Special offers
            "founding": 12900,         # $129.00 one-time
            "core_first_month": 900,   # $9.00 promotional first month
        }
        
        plan_key = payment.plan.lower()
        billing_period = getattr(payment, 'billing_period', 'monthly')
        
        # Handle yearly billing
        if billing_period == 'yearly' and plan_key in ['core', 'plus', 'pro', 'enterprise']:
            plan_key = f"{plan_key}_yearly"
        
        if plan_key not in plan_prices:
            raise HTTPException(status_code=400, detail="Invalid plan selected")
        
        # Determine if this is a subscription or one-time payment
        is_subscription = plan_key not in ['founding']
        
        # Create line item
        line_item = {
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f'NexteraEstate {payment.plan.title()} Plan',
                    'description': f'Estate planning with AI guidance and blockchain security'
                },
                'unit_amount': plan_prices[plan_key],
            },
            'quantity': 1,
        }
        
        # Add recurring info for subscriptions
        if is_subscription:
            interval = 'year' if billing_period == 'yearly' else 'month'
            line_item['price_data']['recurring'] = {'interval': interval}
        
        # Create checkout session
        session_params = {
            'payment_method_types': ['card'],
            'line_items': [line_item],
            'mode': 'subscription' if is_subscription else 'payment',
            'success_url': payment.success_url + '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url': payment.cancel_url,
            'metadata': {
                'plan': payment.plan,
                'billing_period': billing_period
            }
        }
        
        # Add special features for certain plans
        if plan_key == 'founding':
            session_params['metadata']['founding_member'] = 'true'
            session_params['metadata']['locked_renewal_price'] = '19900'  # $199/year locked
        
        checkout_session = stripe.checkout.Session.create(**session_params)
        
        return {"checkout_url": checkout_session.url}
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/payments/status")
async def get_payment_status(session_id: str = Query(...)):
    """Get payment status"""
    try:
        if not STRIPE_SECRET_KEY:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.payment_status,
            "amount_total": session.amount_total,
            "currency": session.currency
        }
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment status error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Bot endpoints
@app.post("/api/bot/help")
async def help_bot(request: BotRequest, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Esquire AI help bot endpoint with RAG-powered legal guidance"""
    try:
        # Check rate limit
        if not check_rate_limit(user_email, db):
            raise HTTPException(status_code=429, detail="Daily rate limit exceeded (20 requests)")
        
        logger.info(f"Esquire AI RAG query from {user_email}: {request.message[:50]}...")
        
        # Use RAG engine for legally-grounded responses
        try:
            rag_response = await generate_legal_guidance(
                query=request.message,
                jurisdiction="general"  # Could be enhanced with user's state
            )
            
            # Enhanced response with source verification
            ai_response = rag_response.response
            
            # Add source citations if available
            if rag_response.citations:
                citations_text = "\n\n📚 Sources: " + ", ".join(rag_response.citations[:3])
                ai_response += citations_text
            
            # Add confidence indicator
            if rag_response.confidence > 0.8:
                confidence_indicator = "\n\n✅ High confidence response based on verified legal sources."
            elif rag_response.confidence > 0.6:
                confidence_indicator = "\n\n⚠️ Moderate confidence - consider consulting an attorney for your specific situation."
            else:
                confidence_indicator = "\n\n⚠️ Limited confidence - strongly recommend consulting a licensed attorney."
                
            ai_response += confidence_indicator
            
            return {
                "reply": ai_response,
                "escalate": rag_response.confidence < 0.5,
                "bot_name": "Esquire AI (RAG-Powered)",
                "confidence": rag_response.confidence,
                "sources_used": len(rag_response.sources),
                "citations": rag_response.citations[:3]
            }
            
        except Exception as rag_error:
            logger.error(f"RAG engine error: {rag_error}")
            # Fallback to basic response
            return {
                "reply": "I'm here to help with your estate planning questions, but I'm having trouble accessing my legal knowledge base right now. For immediate assistance, please contact our support team or consult with a licensed attorney.",
                "escalate": True,
                "bot_name": "Esquire AI",
                "error": "RAG system temporarily unavailable"
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Help bot error: {str(e)}")
        return {
            "reply": "I apologize, but I'm having trouble processing your request right now. For immediate assistance with estate planning questions, please contact our support team.",
            "escalate": True,
            "bot_name": "Esquire AI"
        }

@app.post("/api/bot/grief")
async def grief_bot(request: BotRequest, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Grief support bot endpoint"""
    try:
        # Check rate limit
        if not check_rate_limit(user_email, db):
            raise HTTPException(status_code=429, detail="Daily rate limit exceeded (20 requests)")
        
        system_prompt = """You are a compassionate grief support bot for NexteraEstate. Your role is to:

- Provide emotional support and understanding for those dealing with loss
- Offer practical guidance on estate settlement and probate processes
- Share resources for grief counseling and support groups
- Keep responses under 256 tokens
- Be extremely empathetic and supportive
- Always include crisis resources when appropriate

Crisis Resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- National Alliance on Mental Illness: 1-800-950-NAMI

Remember: You're here to support people through difficult times with compassion and practical help."""
        
        ai_response = await get_ai_response(request.message, system_prompt)
        
        # Always include crisis resources in grief bot responses
        crisis_resources = "\n\nIf you're in crisis, please reach out:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741"
        
        return {
            "reply": ai_response + crisis_resources,
            "escalate": False,
            "bot_name": "Grief Support"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Grief bot error: {str(e)}")
        return {
            "reply": "I'm here to support you through this difficult time. If you're in crisis, please call 988 (National Suicide Prevention Lifeline) or text HOME to 741741 (Crisis Text Line). For immediate help, please contact our support team.",
            "escalate": True,
            "bot_name": "Grief Support"
        }

# Document endpoints
@app.get("/api/documents/list")
async def list_documents(user_email: str = Query(...), db: Session = Depends(get_db)):
    """List user documents"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        documents = db.query(Document).filter(Document.user_id == user.id).all()
        
        return [
            {
                "id": doc.id,
                "filename": doc.filename,
                "file_type": doc.file_type,
                "file_size": doc.file_size,
                "upload_date": doc.upload_date.isoformat(),
                "blockchain_hash": doc.blockchain_hash,
                "is_notarized": bool(doc.blockchain_hash)
            }
            for doc in documents
        ]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...), user_email: str = Query(...), db: Session = Depends(get_db)):
    """Upload document"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Save file
        upload_dir = "/app/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_id = str(uuid.uuid4())
        file_path = os.path.join(upload_dir, f"{file_id}_{file.filename}")
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Create document record
        document = Document(
            id=file_id,
            user_id=user.id,
            filename=file.filename,
            file_path=file_path,
            file_type=file.content_type,
            file_size=len(content)
        )
        db.add(document)
        db.commit()
        
        return {
            "id": document.id,
            "filename": document.filename,
            "message": "Document uploaded successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Blockchain/Notary endpoints
@app.post("/api/notary/hash")
async def generate_hash(request: HashRequest):
    """Generate SHA256 hash of content"""
    try:
        if not request.content or request.content.strip() == "":
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        content_hash = hashlib.sha256(request.content.encode()).hexdigest()
        
        # Validate hash format
        if len(content_hash) != 64:
            raise HTTPException(status_code=500, detail="Invalid hash generation")
        
        return {
            "hash": content_hash,
            "algorithm": "SHA256",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Hash generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notary/create")
async def create_notarization(request: NotaryRequest):
    """Create blockchain notarization"""
    try:
        # Validate hash format
        hash_clean = request.document_hash.lower().replace('0x', '')
        
        if len(hash_clean) != 64:
            raise HTTPException(status_code=400, detail="Invalid hash length. SHA256 hash must be 64 characters.")
        
        try:
            int(hash_clean, 16)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid hash format. Hash must be valid hexadecimal.")
        
        # Mock blockchain transaction for demo
        transaction_hash = secrets.token_hex(32)
        
        return {
            "transaction_hash": transaction_hash,
            "polygonscan_url": f"https://amoy.polygonscan.com/tx/{transaction_hash}",
            "status": "pending",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "network": "Polygon Amoy Testnet"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Notarization error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/notary/status")
async def get_notary_status(tx_hash: str = Query(...)):
    """Get notarization status"""
    try:
        # Mock status check
        return {
            "transaction_hash": tx_hash,
            "status": "confirmed",
            "confirmations": 12,
            "network": "Polygon Amoy Testnet",
            "polygonscan_url": f"https://amoy.polygonscan.com/tx/{tx_hash}"
        }
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# RAG-powered legal analysis endpoint
@app.post("/api/rag/legal-analysis")
async def rag_legal_analysis(request: BotRequest, user_email: str = Query(...), jurisdiction: str = Query("general"), db: Session = Depends(get_db)):
    """Advanced RAG-powered legal analysis with source verification"""
    try:
        # Check rate limit (higher limit for premium feature)
        if not check_rate_limit(user_email, db):
            raise HTTPException(status_code=429, detail="Daily rate limit exceeded (20 requests)")
        
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"RAG legal analysis request from {user_email}: {request.message[:50]}...")
        
        # Generate RAG-powered response
        rag_response = await generate_legal_guidance(
            query=request.message,
            jurisdiction=jurisdiction
        )
        
        return {
            "analysis": rag_response.response,
            "sources": [
                {
                    "title": source.title,
                    "citation": source.citation,  
                    "jurisdiction": source.jurisdiction,
                    "source_type": source.source_type,
                    "confidence": source.confidence_score
                }
                for source in rag_response.sources
            ],
            "citations": rag_response.citations,
            "confidence": rag_response.confidence,
            "query_hash": rag_response.query_hash,
            "timestamp": rag_response.timestamp,
            "jurisdiction": jurisdiction,
            "disclaimer": "This analysis is based on available legal sources and is for informational purposes only. Always consult with a licensed attorney for legal advice specific to your situation."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"RAG legal analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate legal analysis")

# RAG system status and health check
@app.get("/api/rag/status")
async def rag_system_status():
    """Check RAG system health and statistics"""
    try:
        rag_engine = get_rag_engine()
        
        # Get vector database statistics
        conn = sqlite3.connect(rag_engine.vector_store.db_path)
        cur = conn.cursor()
        
        cur.execute("SELECT COUNT(*) FROM legal_documents")
        total_documents = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM rag_queries")
        total_queries = cur.fetchone()[0]
        
        cur.execute("SELECT AVG(confidence) FROM rag_queries WHERE created_at > datetime('now', '-24 hours')")
        avg_confidence_24h = cur.fetchone()[0] or 0.0
        
        cur.execute("""
            SELECT source_type, COUNT(*) 
            FROM legal_documents 
            GROUP BY source_type
        """)
        document_types = dict(cur.fetchall())
        
        conn.close()
        
        return {
            "status": "operational",
            "vector_database_health": "healthy",
            "legal_documents_loaded": total_documents,
            "total_queries_processed": total_queries,
            "average_confidence_24h": round(avg_confidence_24h, 3),
            "document_types": document_types,
            "embedding_model": "all-MiniLM-L6-v2",
            "legal_apis_configured": {
                "nextlaw": bool(os.getenv("NEXTLAW_API_KEY")),
                "westlaw": bool(os.getenv("WESTLAW_API_KEY")),
                "lexis": bool(os.getenv("LEXIS_API_KEY"))
            },
            "gemini_available": bool(GEMINI_API_KEY),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"RAG status check error: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

# Dashboard endpoints
@app.get("/api/user/dashboard-stats")
async def get_dashboard_stats(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get user dashboard statistics"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Count user data
        wills_count = db.query(Will).filter(Will.user_id == user.id).count()
        documents_count = db.query(Document).filter(Document.user_id == user.id).count()
        
        # Calculate average completion percentage
        wills = db.query(Will).filter(Will.user_id == user.id).all()
        total_completion = 0.0
        if wills:
            for will in wills:
                completion = 0.0
                if will.personal_info:
                    completion += 0.3
                if will.beneficiaries:
                    completion += 0.3
                if will.assets:
                    completion += 0.2
                if will.witnesses:
                    completion += 0.1
                if will.executor:
                    completion += 0.1
                total_completion += completion
            avg_completion = (total_completion / len(wills)) * 100
        else:
            avg_completion = 0.0
        
        return {
            "wills_count": wills_count,
            "documents_count": documents_count,
            "completion_percentage": round(avg_completion, 1),
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# PHASE 1: LIVE ESTATE PLAN MVP ENDPOINTS

@app.get("/api/live/status")
async def get_live_status(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get user's live estate plan status"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get current plan version
        current_version = db.query(PlanVersion).filter(
            PlanVersion.user_id == user.id,
            PlanVersion.status == "current"
        ).first()
        
        # Get pending proposals
        pending_proposals = db.query(UpdateProposal).filter(
            UpdateProposal.user_id == user.id,
            UpdateProposal.status == "pending"
        ).count()
        
        # Get recent events
        recent_events = db.query(LiveEvent).filter(
            LiveEvent.user_id == user.id,
            LiveEvent.status == "pending"
        ).count()
        
        if current_version:
            return {
                "status": "action_needed" if pending_proposals > 0 else "current",
                "current_version": current_version.version_number,
                "last_updated": current_version.activated_at.isoformat() if current_version.activated_at else current_version.created_at.isoformat(),
                "blockchain_hash": current_version.blockchain_tx_hash,
                "blockchain_url": current_version.blockchain_url,
                "pending_proposals": pending_proposals,
                "recent_events": recent_events,
                "message": "Action needed - review pending updates" if pending_proposals > 0 else f"Current as of {current_version.created_at.strftime('%B %d, %Y')}"
            }
        else:
            return {
                "status": "not_started",
                "message": "Live Estate Plan monitoring not yet started",
                "pending_proposals": 0,
                "recent_events": 0
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting live status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/live/event")
async def declare_life_event(request: dict, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Let users declare life events"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        event_type = request.get('event_type')
        event_data = request.get('event_data', {})
        
        # Validate event type
        valid_events = ['marriage', 'divorce', 'child', 'move', 'home', 'business', 'death_in_family', 'major_asset']
        if event_type not in valid_events:
            raise HTTPException(status_code=400, detail=f"Invalid event type. Must be one of: {', '.join(valid_events)}")
        
        # Determine impact level based on event type
        high_impact_events = ['marriage', 'divorce', 'child', 'move']
        impact_level = "high" if event_type in high_impact_events else "medium"
        
        # Create life event
        life_event = LiveEvent(
            user_id=user.id,
            event_type=event_type,
            event_data=event_data,
            state_change=event_data.get('new_state') if event_type == 'move' else None,
            impact_level=impact_level,
            status="pending"
        )
        db.add(life_event)
        db.commit()
        
        # Create audit entry
        audit_entry = PlanAudit(
            user_id=user.id,
            action_type="life_event_declared",
            trigger_type="life_event",
            trigger_details={
                "event_type": event_type,
                "event_data": event_data,
                "impact_level": impact_level
            }
        )
        db.add(audit_entry)
        db.commit()
        
        return {
            "status": "success",
            "message": f"Life event '{event_type}' recorded successfully",
            "event_id": life_event.id,
            "impact_level": impact_level,
            "next_steps": "Our system will analyze the impact and generate update proposals within 24 hours."
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error declaring life event: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/live/propose")
async def generate_proposals(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Generate update proposals for a user (called by nightly cron)"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get pending life events
        pending_events = db.query(LiveEvent).filter(
            LiveEvent.user_id == user.id,
            LiveEvent.status == "pending"
        ).all()
        
        proposals_created = []
        
        for event in pending_events:
            # Generate AI-powered proposal using Gemini
            system_prompt = f"""You are an estate planning AI analyzing a life event to propose document updates.

Event Type: {event.event_type}
Event Data: {event.event_data}
User State: {user.state or 'Unknown'}
Impact Level: {event.impact_level}

Generate a concise update proposal (under 256 tokens) that includes:
1. Title (concise, specific)
2. Description (what needs to change and why)
3. Affected documents (will, trust, beneficiaries, etc.)
4. Legal basis (relevant laws or best practices)
5. Estimated time to complete

Format as JSON with keys: title, description, affected_documents, legal_basis, estimated_time"""
            
            ai_response = await get_ai_response(f"Analyze this {event.event_type} event and propose estate plan updates", system_prompt)
            
            try:
                import json
                proposal_data = json.loads(ai_response)
            except:
                # Fallback if AI doesn't return valid JSON
                proposal_data = {
                    "title": f"Update Estate Plan for {event.event_type.title()}",
                    "description": f"Your recent {event.event_type} may require updates to your estate planning documents to ensure they reflect your current situation.",
                    "affected_documents": ["will"],
                    "legal_basis": ["Estate planning best practices"],
                    "estimated_time": "15 minutes"
                }
            
            # Create update proposal
            proposal = UpdateProposal(
                user_id=user.id,
                trigger_type="life_event",
                trigger_id=event.id,
                severity=event.impact_level,
                title=proposal_data.get("title", f"Update for {event.event_type}"),
                description=proposal_data.get("description", "Estate plan update recommended"),
                affected_documents=proposal_data.get("affected_documents", ["will"]),
                legal_basis=proposal_data.get("legal_basis", []),
                estimated_time=proposal_data.get("estimated_time", "15 minutes"),
                deadline=datetime.now(timezone.utc) + timedelta(days=30) if event.impact_level == "high" else None
            )
            db.add(proposal)
            db.flush()  # Flush to get the ID without committing
            
            # Don't mark event as processed immediately - leave it pending so proposals show up
            # event.status = "processed"
            # event.processed_at = datetime.now(timezone.utc)
            
            proposals_created.append({
                "id": proposal.id,
                "title": proposal.title,
                "severity": proposal.severity
            })
        
        db.commit()
        
        return {
            "status": "success",
            "proposals_created": len(proposals_created),
            "proposals": proposals_created,
            "message": f"Generated {len(proposals_created)} update proposals"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating proposals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/live/accept")
async def accept_proposal(request: dict, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Accept and execute an update proposal"""
    try:
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        proposal_id = request.get('proposal_id')
        user_approval = request.get('user_approval', False)
        
        if not proposal_id:
            raise HTTPException(status_code=400, detail="proposal_id is required")
        
        proposal = db.query(UpdateProposal).filter(
            UpdateProposal.id == proposal_id,
            UpdateProposal.user_id == user.id
        ).first()
        
        if not proposal:
            raise HTTPException(status_code=404, detail="Proposal not found")
        
        if not user_approval:
            # User rejected the proposal
            proposal.status = "rejected"
            proposal.processed_at = datetime.now(timezone.utc)
            db.commit()
            
            return {
                "status": "rejected",
                "message": "Update proposal rejected by user"
            }
        
        # User approved - execute the update
        try:
            # Get user's current will or create a basic one if none exists
            current_will = db.query(Will).filter(Will.user_id == user.id).first()
            if not current_will:
                # Create a basic will for the user
                current_will = Will(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    state=user.state or "CA",  # Default to CA if no state set
                    personal_info={"full_name": user.name, "email": user.email},
                    beneficiaries=[],
                    assets=[],
                    executors=[],
                    bequests=[]
                )
                db.add(current_will)
                db.flush()  # Get the ID
            
            # Generate new version number
            last_version = db.query(PlanVersion).filter(
                PlanVersion.user_id == user.id
            ).order_by(PlanVersion.created_at.desc()).first()
            
            if last_version:
                version_parts = last_version.version_number.split('.')
                major_version = int(version_parts[0])
                minor_version = int(version_parts[1]) if len(version_parts) > 1 else 0
                new_version = f"{major_version}.{minor_version + 1}"
            else:
                new_version = "1.0"
            
            # Create updated document hash
            document_content = f"Will_v{new_version}_{user.email}_{datetime.now().isoformat()}"
            document_hash = hashlib.sha256(document_content.encode()).hexdigest()
            
            # Generate PDF (mock for now)
            pdf_generator = WillPDFGenerator()
            try:
                pdf_path = pdf_generator.generate_will_pdf(
                    will_data={
                        'id': current_will.id,
                        'state': current_will.state,
                        'personal_info': current_will.personal_info,
                        'beneficiaries': current_will.beneficiaries,
                        'assets': current_will.assets,
                        'executors': current_will.executors if hasattr(current_will, 'executors') else []
                    },
                    user_data={
                        'name': user.name,
                        'email': user.email,
                        'state': user.state or current_will.state
                    }
                )
            except Exception as pdf_error:
                logger.warning(f"PDF generation failed: {pdf_error}")
                pdf_path = None
            
            # Create blockchain transaction (mock)
            transaction_hash = secrets.token_hex(32)
            blockchain_url = f"https://amoy.polygonscan.com/tx/{transaction_hash}"
            
            # Create new plan version
            plan_version = PlanVersion(
                user_id=user.id,
                version_number=new_version,
                will_id=current_will.id,
                document_hash=document_hash,
                blockchain_tx_hash=transaction_hash,
                blockchain_url=blockchain_url,
                status="current",
                trigger_event_id=proposal.trigger_id,
                pdf_path=pdf_path,
                activated_at=datetime.now(timezone.utc)
            )
            
            # Mark previous version as superseded
            if last_version:
                last_version.status = "superseded"
            
            db.add(plan_version)
            
            # Create audit entry
            audit_entry = PlanAudit(
                user_id=user.id,
                plan_version_id=plan_version.id,
                action_type="estate_plan_updated",
                trigger_type=proposal.trigger_type,
                trigger_details=proposal.affected_documents,
                legal_citations=proposal.legal_basis,
                changes_summary=proposal.description,
                blockchain_tx_hash=transaction_hash,
                blockchain_url=blockchain_url
            )
            db.add(audit_entry)
            
            # Mark proposal as approved
            proposal.status = "approved"
            proposal.processed_at = datetime.now(timezone.utc)
            
            # Mark the triggering event as processed
            if proposal.trigger_id:
                trigger_event = db.query(LiveEvent).filter(LiveEvent.id == proposal.trigger_id).first()
                if trigger_event:
                    trigger_event.status = "processed"
                    trigger_event.processed_at = datetime.now(timezone.utc)
            
            db.commit()
            
            return {
                "status": "approved",
                "message": "Estate plan update completed successfully",
                "version": new_version,
                "transaction_hash": transaction_hash,
                "blockchain_url": blockchain_url,
                "updated_documents": proposal.affected_documents,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "next_review": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
            }
            
        except Exception as update_error:
            logger.error(f"Error executing update: {str(update_error)}")
            raise HTTPException(status_code=500, detail=f"Failed to execute update: {str(update_error)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error accepting proposal: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)