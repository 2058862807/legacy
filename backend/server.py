import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import stripe
import hashlib
import json
import secrets
import uuid
import shutil
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Depends, Query, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import requests
import openai
from openai import OpenAI
import google.generativeai as genai
from eth_account import Account
from eth_utils import to_hex
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse

# Import database and compliance
from database import create_tables, get_db, is_database_available, User, Will, Document, ActivityLog, RateLimit, ChatHistory
from compliance_service import ComplianceService, ComplianceRuleResponse, ComplianceSummary
from pdf_generator import WillPDFGenerator

# Environment variables
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'openai')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
POLYGON_RPC_URL = os.environ.get('POLYGON_RPC_URL', 'https://rpc-amoy.polygon.technology')
POLYGON_PRIVATE_KEY = os.environ.get('POLYGON_PRIVATE_KEY')
NOTARY_CONTRACT_ADDRESS = os.environ.get('NOTARY_CONTRACT_ADDRESS')
FRONTEND_ORIGIN = os.environ.get('FRONTEND_ORIGIN', 'https://nexteraestate.com')

# Blockchain utilities
class PolygonBlockchain:
    def __init__(self, rpc_url: str, private_key: str = None):
        self.rpc_url = rpc_url
        self.private_key = private_key
        self.account = Account.from_key(private_key) if private_key else None
    
    async def get_nonce(self, address: str) -> int:
        """Get transaction count for address"""
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionCount",
            "params": [address, "latest"],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"RPC Error: {result['error']}")
        
        return int(result['result'], 16)
    
    async def get_gas_price(self) -> int:
        """Get current gas price"""
        payload = {
            "jsonrpc": "2.0", 
            "method": "eth_gasPrice",
            "params": [],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"RPC Error: {result['error']}")
        
        return int(result['result'], 16)
    
    async def send_transaction(self, to_address: str, data: str = "0x") -> str:
        """Send transaction to blockchain"""
        if not self.account:
            raise Exception("Private key not configured")
        
        # Get nonce and gas price
        nonce = await self.get_nonce(self.account.address)
        gas_price = await self.get_gas_price()
        
        # Build transaction
        transaction = {
            'nonce': nonce,
            'gasPrice': gas_price,
            'gas': 21000,  # Standard gas limit
            'to': to_address,
            'value': 0,
            'data': data,
            'chainId': 80002  # Polygon Amoy testnet
        }
        
        # Sign transaction
        signed_txn = self.account.sign_transaction(transaction)
        
        # Send transaction
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_sendRawTransaction", 
            "params": [signed_txn.rawTransaction.hex()],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"Transaction Error: {result['error']}")
        
        return result['result']
    
    async def get_transaction_status(self, tx_hash: str) -> Dict:
        """Get transaction status and confirmations"""
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt", 
            "params": [tx_hash],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"RPC Error: {result['error']}")
        
        receipt = result['result']
        if not receipt:
            return {"status": "pending", "confirmations": 0}
        
        # Get current block number for confirmations
        block_payload = {
            "jsonrpc": "2.0",
            "method": "eth_blockNumber",
            "params": [],
            "id": 1
        }
        
        block_response = requests.post(self.rpc_url, json=block_payload)
        block_result = block_response.json()
        current_block = int(block_result['result'], 16)
        tx_block = int(receipt['blockNumber'], 16)
        confirmations = current_block - tx_block + 1
        
        return {
            "status": "confirmed" if receipt['status'] == '0x1' else "failed",
            "confirmations": confirmations,
            "blockNumber": tx_block,
            "gasUsed": int(receipt['gasUsed'], 16)
        }

# Initialize services
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Initialize AI clients
openai_client = None
gemini_client = None

if LLM_PROVIDER == 'gemini' and GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_client = genai.GenerativeModel('gemini-1.5-flash')
elif LLM_PROVIDER == 'openai' and OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
elif OPENAI_API_KEY:  # fallback to OpenAI
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Polygon blockchain
polygon = PolygonBlockchain(POLYGON_RPC_URL, POLYGON_PRIVATE_KEY)

app = FastAPI()

# Create database tables on startup
create_tables()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexteraestate.com",
        "https://www.nexteraestate.com", 
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3002",
        "*"  # For development - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for requests/responses
class BotRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[Dict[str, Any]]] = []

class BotResponse(BaseModel):
    reply: str
    escalate: bool = False

class HashRequest(BaseModel):
    content: str

class NotarizeRequest(BaseModel):
    hash: str

class PaymentRequest(BaseModel):
    plan: str

# User Management Models
class UserCreate(BaseModel):
    email: str
    name: str
    image: Optional[str] = None
    provider: str = "google"
    provider_id: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    image: Optional[str]
    state: Optional[str]
    subscription_status: str
    created_at: str

class WillCreate(BaseModel):
    title: Optional[str] = "My Will"
    state: str
    personal_info: Optional[Dict[str, Any]] = {}

class WillUpdate(BaseModel):
    title: Optional[str] = None
    personal_info: Optional[Dict[str, Any]] = None
    executors: Optional[List[Dict[str, Any]]] = None
    beneficiaries: Optional[List[Dict[str, Any]]] = None
    assets: Optional[List[Dict[str, Any]]] = None
    bequests: Optional[List[Dict[str, Any]]] = None
    guardians: Optional[List[Dict[str, Any]]] = None
    special_instructions: Optional[str] = None

class WillResponse(BaseModel):
    id: str
    title: str
    status: str
    completion_percentage: float
    state: str
    created_at: str
    updated_at: str

class DocumentUpload(BaseModel):
    filename: str
    file_size: int
    file_type: str
    document_type: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = []

class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_size: int
    file_type: str
    document_type: Optional[str]
    blockchain_verified: bool
    uploaded_at: str

class DashboardStats(BaseModel):
    total_documents: int
    total_wills: int
    completion_percentage: float
    recent_activity: List[Dict[str, Any]]
    compliance_status: Optional[Dict[str, Any]] = None

class CheckoutRequest(BaseModel):
    planId: str

# Health check
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "compliance_enabled": os.environ.get('COMPLIANCE_ENABLED', 'false').lower() == 'true',
        "database_available": is_database_available()
    }

# User Management Endpoints
@app.post("/api/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create or update user from OAuth"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    
    if existing_user:
        # Update existing user
        existing_user.name = user_data.name
        existing_user.image = user_data.image
        existing_user.updated_at = datetime.now(timezone.utc)
        db.commit()
        user = existing_user
    else:
        # Create new user
        user = User(
            email=user_data.email,
            name=user_data.name,
            image=user_data.image,
            provider=user_data.provider,
            provider_id=user_data.provider_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Log user creation
        log_activity(db, user.id, "user_registered", {"provider": user_data.provider})
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        image=user.image,
        state=user.state,
        subscription_status=user.subscription_status,
        created_at=user.created_at.isoformat()
    )

@app.get("/api/users/{user_email}", response_model=UserResponse)
async def get_user(user_email: str, db: Session = Depends(get_db)):
    """Get user by email"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        image=user.image,
        state=user.state,
        subscription_status=user.subscription_status,
        created_at=user.created_at.isoformat()
    )

@app.put("/api/users/{user_id}/state")
async def update_user_state(user_id: str, state_data: dict, db: Session = Depends(get_db)):
    """Update user's state for compliance"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.state = state_data.get("state")
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    
    log_activity(db, user_id, "updated_state", {"state": user.state})
    
    return {"success": True, "state": user.state}

# Will Management Endpoints
@app.post("/api/wills", response_model=WillResponse)
async def create_will(will_data: WillCreate, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Create a new will for user"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Get user
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get compliance requirements for the state
    compliance = await get_compliance_rule(will_data.state, "will", db)
    
    # Create will
    will = Will(
        user_id=user.id,
        title=will_data.title,
        state=will_data.state,
        personal_info=will_data.personal_info,
        witnesses_required=compliance.witnesses_required if compliance else 2,
        notarization_required=compliance.notarization_required if compliance else False
    )
    db.add(will)
    db.commit()
    db.refresh(will)
    
    # Update user's state if not set
    if not user.state:
        user.state = will_data.state
        db.commit()
    
    log_activity(db, user.id, "created_will", {"will_id": will.id, "state": will.state})
    
    return WillResponse(
        id=will.id,
        title=will.title,
        status=will.status,
        completion_percentage=will.completion_percentage,
        state=will.state,
        created_at=will.created_at.isoformat(),
        updated_at=will.updated_at.isoformat()
    )

@app.get("/api/wills", response_model=List[WillResponse])
async def get_user_wills(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get all wills for a user"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    wills = db.query(Will).filter(Will.user_id == user.id).order_by(Will.updated_at.desc()).all()
    
    return [
        WillResponse(
            id=will.id,
            title=will.title,
            status=will.status,
            completion_percentage=will.completion_percentage,
            state=will.state,
            created_at=will.created_at.isoformat(),
            updated_at=will.updated_at.isoformat()
        ) for will in wills
    ]

@app.put("/api/wills/{will_id}")
async def update_will(will_id: str, will_update: WillUpdate, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Update a will"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    will = db.query(Will).filter(Will.id == will_id, Will.user_id == user.id).first()
    if not will:
        raise HTTPException(status_code=404, detail="Will not found")
    
    # Update fields
    update_data = will_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(will, field, value)
    
    # Calculate completion percentage
    will.completion_percentage = calculate_will_completion(will)
    will.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    
    log_activity(db, user.id, "updated_will", {"will_id": will.id})
    
    return {"success": True, "completion_percentage": will.completion_percentage}

@app.get("/api/wills/{will_id}")
async def get_will_details(will_id: str, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get detailed will information"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    will = db.query(Will).filter(Will.id == will_id, Will.user_id == user.id).first()
    if not will:
        raise HTTPException(status_code=404, detail="Will not found")
    
    return {
        "id": will.id,
        "title": will.title,
        "status": will.status,
        "completion_percentage": will.completion_percentage,
        "state": will.state,
        "personal_info": will.personal_info,
        "executors": will.executors,
        "beneficiaries": will.beneficiaries,
        "assets": will.assets,
        "bequests": will.bequests,
        "guardians": will.guardians,
        "special_instructions": will.special_instructions,
        "witnesses_required": will.witnesses_required,
        "notarization_required": will.notarization_required,
        "witnesses_signed": will.witnesses_signed,
        "notarized": will.notarized,
        "created_at": will.created_at.isoformat(),
        "updated_at": will.updated_at.isoformat()
    }

# Dashboard Endpoint
@app.get("/api/user/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get dashboard statistics for user"""
    if not db:
        # Return demo data if database not available
        return DashboardStats(
            total_documents=0,
            total_wills=0,
            completion_percentage=0.0,
            recent_activity=[
                {"action": "Database not configured", "timestamp": datetime.now().isoformat()}
            ]
        )
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user statistics
    total_documents = db.query(Document).filter(Document.user_id == user.id).count()
    total_wills = db.query(Will).filter(Will.user_id == user.id).count()
    
    # Calculate average completion percentage
    wills = db.query(Will).filter(Will.user_id == user.id).all()
    avg_completion = sum(will.completion_percentage for will in wills) / len(wills) if wills else 0.0
    
    # Get recent activity
    recent_activity = db.query(ActivityLog).filter(
        ActivityLog.user_id == user.id
    ).order_by(ActivityLog.timestamp.desc()).limit(10).all()
    
    # Get compliance status if user has a state
    compliance_status = None
    if user.state:
        try:
            compliance_rule = await get_compliance_rule(user.state, "will", db)
            if compliance_rule:
                compliance_status = {
                    "state": user.state,
                    "witnesses_required": compliance_rule.witnesses_required,
                    "notarization_required": compliance_rule.notarization_required,
                    "ron_allowed": compliance_rule.ron_allowed
                }
        except:
            pass
    
    return DashboardStats(
        total_documents=total_documents,
        total_wills=total_wills,
        completion_percentage=avg_completion,
        recent_activity=[
            {
                "action": activity.action,
                "details": activity.details,
                "timestamp": activity.timestamp.isoformat()
            } for activity in recent_activity
        ],
        compliance_status=compliance_status
    )

# Utility Functions
def log_activity(db: Session, user_id: str, action: str, details: dict = None):
    """Log user activity"""
    activity = ActivityLog(
        user_id=user_id,
        action=action,
        details=details or {}
    )
    db.add(activity)
    db.commit()

def calculate_will_completion(will: Will) -> float:
    """Calculate will completion percentage"""
    total_sections = 7  # personal_info, executors, beneficiaries, assets, bequests, guardians, special_instructions
    completed_sections = 0
    
    if will.personal_info and len(will.personal_info) > 0:
        completed_sections += 1
    if will.executors and len(will.executors) > 0:
        completed_sections += 1
    if will.beneficiaries and len(will.beneficiaries) > 0:
        completed_sections += 1
    if will.assets and len(will.assets) > 0:
        completed_sections += 1
    if will.bequests and len(will.bequests) > 0:
        completed_sections += 1
    if will.guardians and len(will.guardians) > 0:
        completed_sections += 1
    if will.special_instructions and len(will.special_instructions.strip()) > 0:
        completed_sections += 1
    
    return (completed_sections / total_sections) * 100.0

async def get_compliance_rule(state: str, doc_type: str, db: Session):
    """Get compliance rule for state and document type"""
    try:
        from compliance_service import ComplianceService
        compliance_service = ComplianceService()
        await compliance_service.load_rules(db)
        return await compliance_service.get_rule(state, doc_type)
    except:
        return None

# Compliance endpoints
@app.get("/api/compliance/rules", response_model=Optional[ComplianceRuleResponse])
async def get_compliance_rules(
    state: str = Query(..., description="State code (e.g., CA, NY)"),
    doc_type: str = Query(..., description="Document type (e.g., will, pet_trust)"),
    db: Session = Depends(get_db)
):
    """Get compliance rules for specific state and document type"""
    if not ComplianceService.is_enabled():
        raise HTTPException(status_code=503, detail="Compliance service is disabled")
    
    if not is_database_available() or db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    rule = ComplianceService.get_rule(state, doc_type, db)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found for this state and document type")
    
    return rule

@app.get("/api/compliance/summary", response_model=Optional[ComplianceSummary])
async def get_compliance_summary(db: Session = Depends(get_db)):
    """Get compliance summary across all states"""
    if not ComplianceService.is_enabled():
        raise HTTPException(status_code=503, detail="Compliance service is disabled")
    
    if not is_database_available() or db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    summary = ComplianceService.get_summary(db)
    if not summary:
        raise HTTPException(status_code=404, detail="No compliance data available")
    
    return summary

@app.post("/api/compliance/refresh")
async def refresh_compliance_data(db: Session = Depends(get_db)):
    """Refresh compliance data from seed file"""
    if not ComplianceService.is_enabled():
        raise HTTPException(status_code=503, detail="Compliance service is disabled")
    
    if not is_database_available() or db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    result = ComplianceService.refresh_from_seed(db)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result

# Stripe Payments
@app.post("/api/payments/create-checkout")
async def create_checkout_session(request: CheckoutRequest):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    plans = {
        'basic': {'price': 2999, 'name': 'Basic Will'},
        'premium': {'price': 4999, 'name': 'Premium Will'},
        'full': {'price': 9999, 'name': 'Full Estate Plan'}
    }
    
    plan = plans.get(request.planId)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': plan['name'],
                        'description': f'NexteraEstate {plan["name"]} Plan'
                    },
                    'unit_amount': plan['price'],
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://nexteraestate.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://nexteraestate.com/checkout/cancel',
            metadata={'planId': request.planId}
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/payments/status")
async def payment_status(session_id: str):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.payment_status,
            "planId": session.metadata.get('planId')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Stripe webhook endpoint
@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    if not STRIPE_SECRET_KEY or not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Handle successful payment
        print(f"Payment succeeded for session: {session['id']}")
        
    elif event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        print(f"Payment intent succeeded: {payment_intent['id']}")
        
    else:
        print(f'Unhandled event type: {event["type"]}')
    
    return {"received": True}

# Rate limiting helper
async def check_rate_limit(user_email: str, endpoint: str, db: Session, limit: int = 20):
    """Check if user has exceeded rate limit"""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        # For anonymous users, allow access but create a temporary user record
        user = User(
            email=user_email,
            name="Anonymous User",
            subscription_status="free"
        )
        db.add(user)
        db.commit()
    
    # Get today's date
    today = datetime.now(timezone.utc).date()
    
    # Get or create rate limit record
    rate_limit = db.query(RateLimit).filter(
        RateLimit.user_id == user.id,
        RateLimit.endpoint == endpoint
    ).first()
    
    if not rate_limit:
        rate_limit = RateLimit(
            user_id=user.id,
            endpoint=endpoint,
            requests_count=1,
            reset_date=datetime.now(timezone.utc)
        )
        db.add(rate_limit)
        db.commit()
        return True
    
    # Reset if it's a new day
    if rate_limit.reset_date.date() < today:
        rate_limit.requests_count = 1
        rate_limit.reset_date = datetime.now(timezone.utc)
        db.commit()
        return True
    
    # Check if under limit
    if rate_limit.requests_count >= limit:
        return False
    
    # Increment counter
    rate_limit.requests_count += 1
    db.commit()
    return True

# Bot endpoints
@app.post("/api/bot/help", response_model=BotResponse)
async def help_bot(request: BotRequest, user_email: str = Query(...), db: Session = Depends(get_db)):
    if not db or not await check_rate_limit(user_email, "bot_help", db):
        return BotResponse(
            reply="Daily limit reached (20 requests). Please try again tomorrow.",
            escalate=False
        )
    
    if not gemini_client and not openai_client:
        return BotResponse(
            reply="AI services currently unavailable. Please contact support.",
            escalate=False
        )
    
    try:
        # Get or create user
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=user_email,
                name="Anonymous User",
                subscription_status="free",
                created_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.commit()
        
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get conversation history from database
        chat_history = db.query(ChatHistory).filter(
            ChatHistory.user_id == user.id,
            ChatHistory.bot_type == "help",
            ChatHistory.session_id == session_id
        ).order_by(ChatHistory.timestamp).all()
        
        # Build conversation context
        conversation_context = ""
        for chat in chat_history[-10:]:  # Last 10 messages for context
            role = "User" if chat.message_type == "user" else "Assistant"
            conversation_context += f"{role}: {chat.message}\n"
        
        system_prompt = "You are Esquire AI, a helpful estate planning assistant. Provide concise, accurate information about wills, trusts, and estate planning. Keep responses under 256 tokens. Remember the conversation context and provide personalized advice based on previous messages."
        
        # Save user message to database
        user_chat = ChatHistory(
            user_id=user.id,
            bot_type="help",
            session_id=session_id,
            message_type="user",
            message=request.message
        )
        db.add(user_chat)
        
        if gemini_client:
            prompt = f"{system_prompt}\n\nConversation History:\n{conversation_context}\nUser: {request.message}"
            response = gemini_client.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=256,
                    temperature=0.7,
                )
            )
            reply = response.text
        else:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ]
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=256,
                temperature=0.7
            )
            reply = response.choices[0].message.content
        
        escalate_keywords = ['emergency', 'urgent', 'dying', 'hospital', 'immediate']
        escalate = any(keyword in request.message.lower() for keyword in escalate_keywords)
        
        # Save bot response to database
        bot_chat = ChatHistory(
            user_id=user.id,
            bot_type="help",
            session_id=session_id,
            message_type="bot",
            message=reply
        )
        db.add(bot_chat)
        db.commit()
        
        return BotResponse(reply=reply, escalate=escalate)
        
    except Exception as e:
        return BotResponse(
            reply="I'm having trouble processing your request. Please try again or contact support.",
            escalate=False
        )

@app.post("/api/bot/grief", response_model=BotResponse)
async def grief_bot(request: BotRequest, user_email: str = Query(...), db: Session = Depends(get_db)):
    crisis_resources = """🚨 CRISIS RESOURCES 🚨
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741  
• National Alliance on Mental Illness: 1-800-950-6264

Please note: I cannot provide medical advice. For emergencies, call 911."""
    
    if not db or not await check_rate_limit(user_email, "bot_grief", db):
        return BotResponse(
            reply=crisis_resources + "\n\nDaily limit reached (20 requests). Please try again tomorrow.",
            escalate=True
        )
    
    if not gemini_client and not openai_client:
        return BotResponse(
            reply=crisis_resources + "\n\nAI services currently unavailable, but please reach out to our support team.",
            escalate=True
        )
    
    try:
        system_prompt = "You are a compassionate grief support assistant focused on estate planning after loss. Provide empathetic, supportive responses under 256 tokens. Never give medical advice. If someone mentions self-harm, suicidal thoughts, or immediate danger, always escalate. Focus on practical estate planning support during grief."
        
        if gemini_client:
            response = gemini_client.generate_content(
                f"{system_prompt}\n\nUser: {request.message}",
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=256,
                    temperature=0.6,
                )
            )
            reply = response.text
        else:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ]
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=256,
                temperature=0.6
            )
            reply = response.choices[0].message.content
        
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself']
        escalate = any(keyword in request.message.lower() for keyword in crisis_keywords)
        
        return BotResponse(reply=f"{crisis_resources}\n\n{reply}", escalate=escalate)
        
    except Exception as e:
        return BotResponse(
            reply=crisis_resources + "\n\nI'm sorry you're going through this difficult time. While I'm having technical difficulties, please know that support is available. Consider reaching out to the crisis resources above or our support team.",
            escalate=True
        )

# Document Upload and Management
@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    user_email: str = Query(...),
    blockchain_notarize: bool = Form(False),
    db: Session = Depends(get_db)
):
    """Upload a document to user's vault"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Get or create user
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            email=user_email,
            name="Anonymous User",
            subscription_status="free",
            created_at=datetime.now(timezone.utc)
        )
        db.add(user)
        db.commit()
    
    try:
        # Validate file
        if file.size > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=413, detail="File too large (max 10MB)")
        
        allowed_types = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
        file_ext = file.filename.split('.')[-1].lower() if file.filename else ''
        if file_ext not in allowed_types:
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        # Create upload directory
        upload_dir = f"/app/uploads/{user.id}"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"{file_id}.{file_ext}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse tags
        tags_list = []
        if tags:
            tags_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
        
        # Generate blockchain hash if requested
        blockchain_hash = None
        if blockchain_notarize:
            with open(file_path, 'rb') as f:
                file_content = f.read()
                blockchain_hash = hashlib.sha256(file_content).hexdigest()
        
        # Save to database
        document = Document(
            id=file_id,
            user_id=user.id,
            filename=filename,
            original_filename=file.filename or "unknown",
            file_size=file.size or 0,
            file_type=file_ext,
            file_path=file_path,
            document_type=document_type,
            tags=tags_list,
            description=description,
            blockchain_hash=blockchain_hash,
            blockchain_verified=blockchain_notarize,
            uploaded_at=datetime.now(timezone.utc)
        )
        db.add(document)
        
        # Log activity
        log_activity(db, user.id, "uploaded_document", {
            "document_id": file_id,
            "filename": file.filename,
            "document_type": document_type,
            "file_size": file.size
        })
        
        db.commit()
        
        return {
            "id": file_id,
            "filename": file.filename,
            "document_type": document_type,
            "file_size": file.size,
            "blockchain_hash": blockchain_hash,
            "uploaded_at": document.uploaded_at.isoformat(),
            "message": "Document uploaded successfully"
        }
        
    except Exception as e:
        if hasattr(e, 'status_code'):
            raise e
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/documents/list")
async def list_documents(user_email: str = Query(...), db: Session = Depends(get_db)):
    """Get user's document list"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        return {"documents": []}
    
    documents = db.query(Document).filter(Document.user_id == user.id).order_by(Document.uploaded_at.desc()).all()
    
    return {
        "documents": [
            {
                "id": doc.id,
                "filename": doc.original_filename,
                "document_type": doc.document_type,
                "file_size": doc.file_size,
                "file_type": doc.file_type,
                "description": doc.description,
                "tags": doc.tags,
                "blockchain_verified": doc.blockchain_verified,
                "blockchain_hash": doc.blockchain_hash,
                "uploaded_at": doc.uploaded_at.isoformat(),
                "is_shared": doc.is_shared
            }
            for doc in documents
        ]
    }

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str, user_email: str = Query(...), db: Session = Depends(get_db)):
    """Delete a document"""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        # Delete file from filesystem
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        # Delete from database
        db.delete(document)
        
        # Log activity
        log_activity(db, user.id, "deleted_document", {
            "document_id": document_id,
            "filename": document.original_filename
        })
        
        db.commit()
        
        return {"message": "Document deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# Blockchain Notarization
@app.post("/api/notary/hash")
async def generate_hash(request: HashRequest):
    """Generate SHA256 hash of content"""
    try:
        content_bytes = request.content.encode('utf-8')
        hash_object = hashlib.sha256(content_bytes)
        hex_hash = hash_object.hexdigest()
        return {"hash": hex_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notary/create")
async def create_notarization(request: NotarizeRequest):
    """Send transaction to Polygon blockchain"""
    if not POLYGON_PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Blockchain services not configured - POLYGON_PRIVATE_KEY required")
    
    try:
        # Create data payload with hash
        # This encodes the hash into the transaction data
        hash_data = f"0x{request.hash}"
        
        # Use a default notarization address if contract not specified
        to_address = NOTARY_CONTRACT_ADDRESS or polygon.account.address
        
        # Send transaction to Polygon
        tx_hash = await polygon.send_transaction(
            to_address=to_address,
            data=hash_data
        )
        
        explorer_url = f"https://amoy.polygonscan.com/tx/{tx_hash}"
        
        return {
            "txHash": tx_hash,
            "explorerUrl": explorer_url,
            "network": "Polygon Amoy Testnet",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")

@app.get("/api/notary/status")
async def get_notary_status(tx: str):
    """Check transaction status on blockchain"""
    if not POLYGON_PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Blockchain services not configured")
    
    try:
        status_info = await polygon.get_transaction_status(tx)
        
        return {
            "txHash": tx,
            "status": status_info["status"],
            "confirmations": status_info["confirmations"], 
            "blockNumber": status_info["blockNumber"],
            "explorerUrl": f"https://amoy.polygonscan.com/tx/{tx}",
            "network": "Polygon Amoy Testnet"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check transaction status: {str(e)}")

@app.get("/api/notary/wallet-info")
async def get_wallet_info():
    """Get wallet information for blockchain transactions"""
    if not POLYGON_PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Blockchain services not configured")
    
    try:
        address = polygon.account.address
        nonce = await polygon.get_nonce(address)
        gas_price = await polygon.get_gas_price()
        
        return {
            "address": address,
            "nonce": nonce,
            "gasPrice": gas_price,
            "network": "Polygon Amoy Testnet",
            "rpcUrl": POLYGON_RPC_URL
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get wallet info: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))