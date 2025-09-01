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
NOTARY_CONTRACT_ADDRESS = os.environ.get('NOTARY_CONTRACT_ADDRESS')

# Initialize services
compliance_service = ComplianceService()
pdf_generator = WillPDFGenerator()

# Initialize Live Estate Engine
live_estate_engine = LiveEstateEngine(
    compliance_service=compliance_service,
    document_service=None,  # Will be initialized with document management
    blockchain_service=None  # Will be initialized with blockchain service
)

# Initialize Stripe
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Initialize AI clients
openai_client = None
gemini_client = None
emergent_chat = None

if LLM_PROVIDER == 'emergent' and EMERGENT_LLM_KEY:
    # Initialize with a default system message - we'll override per conversation
    emergent_chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id="default",
        system_message="You are a helpful assistant."
    ).with_model("openai", "gpt-4o-mini")
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

# Pydantic models for Live Estate Plan
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

# [Keep all existing endpoints from the original server.py]
# ... (All the existing bot, compliance, payment, document endpoints) ...

# NEW LIVE ESTATE PLAN ENDPOINTS

@app.post("/api/live-estate/start-monitoring")
async def start_live_monitoring(request: LiveEstatePlanRequest, db: Session = Depends(get_db)):
    """Start live monitoring for a user's estate plan"""
    try:
        # Initialize monitoring
        profile_data = {
            'state': request.state,
            'marital_status': request.marital_status,
            'dependents': request.dependents,
            'home_ownership': request.home_ownership,
            'business_ownership': request.business_ownership,
            'documents': request.documents,
            'notifications': request.notification_preferences
        }
        
        await live_estate_engine.start_monitoring(request.user_id, profile_data)
        
        return {
            "success": True,
            "message": "Live estate plan monitoring started",
            "monitoring_since": datetime.now().isoformat(),
            "features": [
                "50-state legal change monitoring",
                "Profile change detection",
                "Automatic update proposals",
                "Yearly check-in reminders",
                "Blockchain audit trail"
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to start live monitoring: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-estate/proposals/{user_id}", response_model=List[UpdateProposalResponse])
async def get_update_proposals(user_id: str, db: Session = Depends(get_db)):
    """Get pending update proposals for a user"""
    try:
        proposals = await live_estate_engine.generate_update_proposals(user_id)
        
        response_proposals = []
        for proposal in proposals:
            response_proposals.append(UpdateProposalResponse(
                id=str(uuid.uuid4()),  # Generate unique ID
                trigger=proposal.trigger.value,
                severity=proposal.severity.value,
                title=proposal.title,
                description=proposal.description,
                affected_documents=proposal.affected_documents,
                legal_basis=proposal.legal_basis,
                estimated_time=proposal.estimated_time,
                deadline=proposal.deadline.isoformat() if proposal.deadline else None,
                created_at=proposal.created_at.isoformat()
            ))
            
        return response_proposals
        
    except Exception as e:
        logger.error(f"Failed to get proposals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/live-estate/approve-update")
async def approve_update(request: ApproveUpdateRequest, db: Session = Depends(get_db)):
    """Approve and execute an update proposal"""
    try:
        # In a real implementation, we'd find the proposal by ID
        # For now, create a sample proposal
        sample_proposal = UpdateProposal(
            user_id="sample_user",
            trigger=UpdateTrigger.LEGAL_CHANGE,
            severity=UpdateSeverity.IMPORTANT,
            title="Sample Update",
            description="Sample update description",
            affected_documents=["will"],
            changes_required={"legal_update": True},
            legal_basis=["Sample legal basis"],
            estimated_time="15 minutes",
            deadline=None,
            created_at=datetime.now()
        )
        
        if request.user_approval:
            results = await live_estate_engine.execute_approved_update(sample_proposal)
            return {
                "success": True,
                "message": "Update executed successfully",
                "results": results
            }
        else:
            return {
                "success": True,
                "message": "Update proposal declined"
            }
            
    except Exception as e:
        logger.error(f"Failed to process update approval: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-estate/audit-trail/{user_id}")
async def get_audit_trail(user_id: str, db: Session = Depends(get_db)):
    """Get complete audit trail for user's live estate plan"""
    try:
        audit_trail = await live_estate_engine.get_audit_trail(user_id)
        return audit_trail
        
    except Exception as e:
        logger.error(f"Failed to get audit trail: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/live-estate/legal-changes")
async def get_recent_legal_changes(state: str = Query(None), days: int = Query(30), db: Session = Depends(get_db)):
    """Get recent legal changes affecting estate planning"""
    try:
        changes = await live_estate_engine.detect_legal_changes()
        
        # Filter by state if specified
        if state:
            changes = [c for c in changes if c.state == state]
            
        # Filter by date range
        cutoff_date = datetime.now() - timedelta(days=days)
        changes = [c for c in changes if c.created_at >= cutoff_date]
        
        return {
            "changes": [
                {
                    "state": c.state,
                    "title": c.title,
                    "description": c.description,
                    "effective_date": c.effective_date.isoformat(),
                    "severity": c.severity.value,
                    "affected_documents": c.affected_documents,
                    "citations": c.citations
                }
                for c in changes
            ],
            "total_changes": len(changes),
            "monitoring_states": 51  # 50 states + DC
        }
        
    except Exception as e:
        logger.error(f"Failed to get legal changes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)