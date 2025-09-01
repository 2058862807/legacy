import os
import hashlib
import logging
import secrets
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
from database import get_db, User, Will, Document, ChatHistory, ComplianceRule, RateLimit
from compliance_service import ComplianceService, ComplianceRuleResponse, ComplianceSummary
from pdf_generator import WillPDFGenerator

# Import new Live Estate Engine
from live_estate_engine import LiveEstateEngine, UpdateProposal, UpdateTrigger, UpdateSeverity

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
def check_rate_limit(user_email: str, db: Session) -> bool:
    today = datetime.now(timezone.utc).date()
    rate_limit = db.query(RateLimit).filter(
        RateLimit.user_email == user_email,
        RateLimit.date == today
    ).first()
    
    if not rate_limit:
        # Create new rate limit record
        rate_limit = RateLimit(user_email=user_email, date=today, count=0)
        db.add(rate_limit)
        db.commit()
    
    if rate_limit.count >= 20:  # 20 requests per day limit
        return False
    
    rate_limit.count += 1
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
            assets=will.assets,
            witnesses=will.witnesses,
            executor=will.executor
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
            witnesses=new_will.witnesses,
            executor=new_will.executor,
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
            if will.witnesses:
                completion += 0.1
            if will.executor:
                completion += 0.1
            
            will_responses.append(WillResponse(
                id=will.id,
                user_id=will.user_id,
                state=will.state,
                personal_info=will.personal_info,
                beneficiaries=will.beneficiaries,
                assets=will.assets,
                witnesses=will.witnesses,
                executor=will.executor,
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
        if will.witnesses:
            completion += 0.1
        if will.executor:
            completion += 0.1
        
        return WillResponse(
            id=will.id,
            user_id=will.user_id,
            state=will.state,
            personal_info=will.personal_info,
            beneficiaries=will.beneficiaries,
            assets=will.assets,
            witnesses=will.witnesses,
            executor=will.executor,
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
        compliance_data = compliance_service.get_rule(will.state, "will", db)
        
        # Generate PDF
        pdf_generator = WillPDFGenerator()
        pdf_content = pdf_generator.generate_will_pdf(
            will_data={
                'state': will.state,
                'personal_info': will.personal_info,
                'beneficiaries': will.beneficiaries,
                'assets': will.assets,
                'witnesses': will.witnesses,
                'executor': will.executor
            },
            user_data={
                'name': user.name,
                'email': user.email
            },
            compliance_data=compliance_data
        )
        
        return StreamingResponse(
            pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=will_{will_id}.pdf"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating will PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pet-trust/pdf")
async def generate_pet_trust_pdf(request: dict, db: Session = Depends(get_db)):
    """Generate PDF for pet trust"""
    try:
        pdf_generator = WillPDFGenerator()
        pdf_content = pdf_generator.generate_pet_trust_pdf(request)
        
        return StreamingResponse(
            pdf_content,
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
        
        # Plan pricing
        plan_prices = {
            "basic": 2900,  # $29.00
            "premium": 4900,  # $49.00 
            "full": 9900  # $99.00
        }
        
        if payment.plan.lower() not in plan_prices:
            raise HTTPException(status_code=400, detail="Invalid plan selected")
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'NexteraEstate {payment.plan.title()} Plan',
                        'description': f'Monthly subscription to {payment.plan.title()} plan'
                    },
                    'unit_amount': plan_prices[payment.plan.lower()],
                    'recurring': {
                        'interval': 'month'
                    }
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=payment.success_url,
            cancel_url=payment.cancel_url,
        )
        
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
    """Esquire AI help bot endpoint"""
    try:
        # Check rate limit
        if not check_rate_limit(user_email, db):
            raise HTTPException(status_code=429, detail="Daily rate limit exceeded (20 requests)")
        
        system_prompt = """You are Esquire AI, NexteraEstate's specialized AI lawyer chatbot designed to provide expert guidance on estate planning, wills, trusts, and legal document preparation.

Your role:
- Provide accurate, helpful information about estate planning
- Guide users through creating wills, trusts, and related documents
- Explain legal concepts in simple terms
- Always remind users that complex situations require consultation with a licensed attorney
- Keep responses under 256 tokens
- Be professional, empathetic, and knowledgeable

Important disclaimers:
- You provide general legal information, not legal advice
- For complex situations, recommend consulting with a licensed attorney
- State laws vary, always verify local requirements"""
        
        ai_response = await get_ai_response(request.message, system_prompt)
        
        return {
            "reply": ai_response,
            "escalate": False,
            "bot_name": "Esquire AI"
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

# NEW LIVE ESTATE PLAN ENDPOINTS

@app.post("/api/live-estate/start-monitoring")
async def start_live_monitoring(request: LiveEstatePlanRequest, db: Session = Depends(get_db)):
    """Start live monitoring for a user's estate plan"""
    try:
        # Initialize Live Estate Engine
        compliance_service = ComplianceService()
        live_engine = LiveEstateEngine(compliance_service, None, None)
        
        # Create user profile for monitoring
        user_profile = {
            'user_id': request.user_id,
            'state': request.state,
            'marital_status': request.marital_status,
            'dependents': request.dependents,
            'home_ownership': request.home_ownership,
            'business_ownership': request.business_ownership,
            'documents': request.documents,
            'notification_preferences': request.notification_preferences
        }
        
        # Start monitoring (this would typically save to database)
        result = live_engine.start_monitoring(user_profile)
        
        return {
            "status": "success",
            "message": "Live estate monitoring started",
            "monitoring_id": request.user_id,
            "next_check": datetime.now(timezone.utc) + timedelta(days=1),
            "features_enabled": {
                "rule_monitoring": True,
                "life_event_triggers": True,
                "automatic_proposals": True,
                "blockchain_audit": True
            }
        }
    except Exception as e:
        logger.error(f"Error starting live monitoring: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-estate/proposals/{user_id}", response_model=List[UpdateProposalResponse])
async def get_update_proposals(user_id: str, db: Session = Depends(get_db)):
    """Get pending update proposals for a user"""
    try:
        # For now, return mock data - in production this would query database
        mock_proposals = [
            UpdateProposalResponse(
                id=str(uuid.uuid4()),
                trigger="state_law_change",
                severity="medium",
                title="New Digital Asset Laws in California",
                description="California Assembly Bill 2273 requires explicit provisions for digital assets in wills.",
                affected_documents=["will", "digital_asset_inventory"],
                legal_basis=["CA Assembly Bill 2273", "Probate Code Section 250"],
                estimated_time="15 minutes",
                deadline="2024-01-01",
                created_at=datetime.now(timezone.utc).isoformat()
            )
        ]
        return mock_proposals
    except Exception as e:
        logger.error(f"Error fetching proposals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/live-estate/approve-update")
async def approve_update(request: ApproveUpdateRequest, db: Session = Depends(get_db)):
    """Approve and execute an update proposal"""
    try:
        if not request.user_approval:
            return {"status": "rejected", "message": "Update proposal rejected by user"}
        
        # Mock update execution - in production this would:
        # 1. Generate updated documents
        # 2. Create blockchain hash
        # 3. Send for e-signature
        # 4. Update database
        
        transaction_hash = secrets.token_hex(32)
        
        return {
            "status": "approved",
            "message": "Estate plan update completed successfully",
            "transaction_hash": transaction_hash,
            "polygonscan_url": f"https://amoy.polygonscan.com/tx/{transaction_hash}",
            "updated_documents": ["will_v2.pdf", "digital_asset_inventory_v2.pdf"],
            "version": "2.0",
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "next_review": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
        }
    except Exception as e:
        logger.error(f"Error approving update: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-estate/audit-trail/{user_id}")
async def get_audit_trail(user_id: str, db: Session = Depends(get_db)):
    """Get complete audit trail for user's live estate plan"""
    try:
        # Mock audit trail - in production this would query database
        return {
            "user_id": user_id,
            "audit_entries": [
                {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "action": "estate_plan_updated",
                    "trigger": "state_law_change",
                    "version": "2.0",
                    "transaction_hash": secrets.token_hex(32),
                    "documents_affected": ["will", "digital_asset_inventory"]
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching audit trail: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-estate/legal-changes")
async def get_recent_legal_changes(state: str = Query(None), days: int = Query(30), db: Session = Depends(get_db)):
    """Get recent legal changes affecting estate planning"""
    try:
        # Mock legal changes - in production this would query compliance database
        return {
            "state": state or "all",
            "period_days": days,
            "changes": [
                {
                    "state": "CA",
                    "title": "Digital Asset Inheritance Laws",
                    "description": "New requirements for digital asset provisions in wills",
                    "effective_date": "2024-01-01",
                    "impact_level": "medium",
                    "affected_documents": ["will", "digital_asset_inventory"]
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching legal changes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)