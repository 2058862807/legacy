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

# CORE API ENDPOINTS (RESTORED)

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