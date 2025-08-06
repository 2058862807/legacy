# NextEra Estate - Production FastAPI Backend
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import os
import uuid
import shutil
from pathlib import Path
import logging

# Import our modules
from models import *
from auth import AuthService, get_current_user, get_current_user_optional
from services import *
from enhanced_services import RealAIService, StripePaymentService, UserGuidanceService
from payment_endpoints import payment_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="NextEra Estate API",
    description="Comprehensive Digital Estate Planning Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
create_tables()

# Include payment and enhanced AI router
app.include_router(payment_router)

# Create upload directories
os.makedirs("uploads/documents", exist_ok=True)
os.makedirs("uploads/generated", exist_ok=True)

# Authentication Endpoints
@app.post("/api/auth/register")
async def register(
    email: str = Form(...),
    password: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    jurisdiction: str = Form(...),
    phone: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        user = AuthService.create_user(
            db=db,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            jurisdiction=jurisdiction,
            phone=phone
        )
        
        # Create access token
        access_token = AuthService.create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.full_name,
                "jurisdiction": user.jurisdiction,
                "biometric_enabled": user.biometric_enabled
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/auth/login")
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Authenticate user and return token"""
    user = AuthService.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = AuthService.create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "jurisdiction": user.jurisdiction,
            "biometric_enabled": user.biometric_enabled
        }
    }

# User Profile Endpoints
@app.get("/api/user/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "full_name": current_user.full_name,
        "jurisdiction": current_user.jurisdiction,
        "phone": current_user.phone,
        "address": current_user.address,
        "date_of_birth": current_user.date_of_birth,
        "marital_status": current_user.marital_status,
        "biometric_enabled": current_user.biometric_enabled,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at
    }

@app.put("/api/user/profile")
async def update_profile(
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    marital_status: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if first_name:
        current_user.first_name = first_name
    if last_name:
        current_user.last_name = last_name
    if phone:
        current_user.phone = phone
    if address:
        current_user.address = address
    if marital_status:
        current_user.marital_status = marital_status
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Profile updated successfully"}

# Dashboard Endpoints
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    # Count documents
    documents_count = db.query(Document).filter(Document.owner_id == current_user.id).count()
    
    # Count heirs
    heirs_count = db.query(Heir).filter(Heir.owner_id == current_user.id).count()
    
    # Get will completion
    will = db.query(Will).filter(Will.owner_id == current_user.id).first()
    will_completion = will.completion_percentage if will else 0
    
    # Get last backup (most recent document)
    last_document = db.query(Document).filter(Document.owner_id == current_user.id).order_by(desc(Document.created_at)).first()
    last_backup = last_document.created_at.strftime("%Y-%m-%d") if last_document else None
    
    return {
        "documents_stored": documents_count,
        "will_completion": will_completion,
        "heirs_configured": heirs_count,
        "last_backup": last_backup
    }

@app.get("/api/dashboard/compliance")
async def get_compliance_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get real-time compliance status for user's jurisdiction"""
    compliance_service = ComplianceService()
    
    # Get user's will data for validation
    will = db.query(Will).filter(Will.owner_id == current_user.id).first()
    will_data = {
        "age": 25,  # Would calculate from date_of_birth
        "witnesses": [],
        "notarized": will.is_notarized if will else False,
        "marital_status": current_user.marital_status or "single"
    }
    
    compliance = compliance_service.validate_will_requirements(will_data, current_user.jurisdiction)
    
    # Log compliance check
    log = ComplianceLog(
        user_id=current_user.id,
        jurisdiction=current_user.jurisdiction,
        compliance_check=compliance,
        is_compliant=compliance["is_valid"]
    )
    db.add(log)
    db.commit()
    
    return compliance

# Will Builder Endpoints
@app.get("/api/will/current")
async def get_current_will(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current will"""
    will = db.query(Will).filter(Will.owner_id == current_user.id).first()
    if not will:
        return None
    
    return {
        "id": will.id,
        "title": will.title,
        "content": json.loads(will.content),
        "status": will.status,
        "completion_percentage": will.completion_percentage,
        "jurisdiction": will.jurisdiction,
        "is_notarized": will.is_notarized,
        "blockchain_hash": will.blockchain_hash,
        "created_at": will.created_at,
        "updated_at": will.updated_at
    }

@app.post("/api/will/save")
async def save_will(
    title: str = Form(...),
    content: str = Form(...),  # JSON string
    completion_percentage: float = Form(0.0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save or update will"""
    will = db.query(Will).filter(Will.owner_id == current_user.id).first()
    
    if will:
        will.title = title
        will.content = content
        will.completion_percentage = completion_percentage
        will.updated_at = datetime.utcnow()
    else:
        will = Will(
            owner_id=current_user.id,
            title=title,
            content=content,
            completion_percentage=completion_percentage,
            jurisdiction=current_user.jurisdiction
        )
        db.add(will)
    
    db.commit()
    db.refresh(will)
    
    return {"message": "Will saved successfully", "will_id": will.id}

@app.post("/api/will/generate")
async def generate_will(
    blockchain_enabled: bool = Form(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate final will document"""
    will = db.query(Will).filter(Will.owner_id == current_user.id).first()
    if not will:
        raise HTTPException(status_code=404, detail="No will found")
    
    will_service = WillGenerationService()
    
    # Generate PDF document
    pdf_path = will_service.generate_will_pdf(will, current_user)
    
    # Blockchain notarization if enabled
    if blockchain_enabled:
        blockchain_service = BlockchainService()
        result = blockchain_service.notarize_document(pdf_path, current_user.id, db)
        
        if result["success"]:
            will.blockchain_hash = result["document_hash"]
            will.blockchain_transaction = result["transaction_hash"]
            will.is_notarized = True
    
    will.status = "complete"
    will.completion_percentage = 100.0
    db.commit()
    
    return {
        "message": "Will generated successfully",
        "pdf_path": pdf_path,
        "blockchain_notarized": blockchain_enabled,
        "transaction_hash": will.blockchain_transaction if blockchain_enabled else None
    }

# Document Vault Endpoints
@app.get("/api/documents")
async def get_documents(
    folder: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's documents"""
    query = db.query(Document).filter(Document.owner_id == current_user.id)
    
    if folder:
        query = query.filter(Document.folder == folder)
    
    documents = query.order_by(desc(Document.created_at)).all()
    
    return [{
        "id": doc.id,
        "filename": doc.original_filename,
        "file_size": doc.file_size,
        "mime_type": doc.mime_type,
        "folder": doc.folder,
        "description": doc.description,
        "is_encrypted": doc.is_encrypted,
        "is_notarized": doc.is_notarized,
        "blockchain_hash": doc.blockchain_hash,
        "tags": doc.tags,
        "created_at": doc.created_at,
        "updated_at": doc.updated_at
    } for doc in documents]

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),  # JSON string
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a new document"""
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"uploads/documents/{unique_filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Parse tags
    parsed_tags = json.loads(tags) if tags else []
    
    # Encrypt file
    encryption_service = EncryptionService()
    encryption_key = encryption_service.encrypt_file(file_path)
    
    # Create document record
    document = Document(
        owner_id=current_user.id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=file.content_type,
        folder=folder,
        description=description,
        is_encrypted=True,
        encryption_key=encryption_key,
        tags=parsed_tags
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {
        "message": "Document uploaded successfully",
        "document_id": document.id,
        "filename": document.original_filename
    }

@app.post("/api/documents/{document_id}/notarize")
async def notarize_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Notarize document on blockchain"""
    document = db.query(Document).filter(
        and_(Document.id == document_id, Document.owner_id == current_user.id)
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    blockchain_service = BlockchainService()
    result = blockchain_service.notarize_document(document.file_path, current_user.id, db)
    
    if result["success"]:
        document.is_notarized = True
        document.blockchain_hash = result["document_hash"]
        document.blockchain_transaction = result["transaction_hash"]
        db.commit()
        
        return {
            "message": "Document notarized successfully",
            "transaction_hash": result["transaction_hash"],
            "block_number": result["block_number"]
        }
    else:
        raise HTTPException(status_code=500, detail=f"Notarization failed: {result['error']}")

# Heir Management Endpoints
@app.get("/api/heirs")
async def get_heirs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's heirs"""
    heirs = db.query(Heir).filter(Heir.owner_id == current_user.id).all()
    
    return [{
        "id": heir.id,
        "first_name": heir.first_name,
        "last_name": heir.last_name,
        "full_name": heir.full_name,
        "email": heir.email,
        "phone": heir.phone,
        "relationship": heir.relationship,
        "role": heir.role,
        "percentage": heir.percentage,
        "is_verified": heir.is_verified,
        "blockchain_address": heir.blockchain_address,
        "created_at": heir.created_at
    } for heir in heirs]

@app.post("/api/heirs")
async def create_heir(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    relationship: str = Form(...),
    role: str = Form(...),
    percentage: float = Form(...),
    phone: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new heir"""
    heir = Heir(
        owner_id=current_user.id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        relationship=relationship,
        role=role,
        percentage=percentage
    )
    
    db.add(heir)
    db.commit()
    db.refresh(heir)
    
    return {
        "message": "Heir created successfully",
        "heir_id": heir.id
    }

# Blockchain Endpoints
@app.get("/api/blockchain/wallet")
async def get_wallet_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get blockchain wallet information"""
    wallet = db.query(BlockchainWallet).filter(BlockchainWallet.owner_id == current_user.id).first()
    
    if not wallet:
        return {"connected": False}
    
    # Get digital assets
    assets = db.query(DigitalAsset).filter(DigitalAsset.wallet_id == wallet.id).all()
    
    return {
        "connected": wallet.is_connected,
        "address": wallet.wallet_address,
        "network": wallet.network,
        "balance": wallet.balance,
        "assets": [{
            "symbol": asset.symbol,
            "name": asset.name,
            "balance": asset.balance,
            "usd_value": asset.usd_value,
            "asset_type": asset.asset_type
        } for asset in assets]
    }

@app.post("/api/blockchain/connect")
async def connect_wallet(
    wallet_address: str = Form(...),
    network: str = Form(...),
    wallet_type: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect blockchain wallet"""
    # Check if wallet already exists
    existing_wallet = db.query(BlockchainWallet).filter(
        BlockchainWallet.owner_id == current_user.id
    ).first()
    
    if existing_wallet:
        existing_wallet.wallet_address = wallet_address
        existing_wallet.network = network
        existing_wallet.wallet_type = wallet_type
        existing_wallet.is_connected = True
        existing_wallet.last_sync = datetime.utcnow()
    else:
        wallet = BlockchainWallet(
            owner_id=current_user.id,
            wallet_address=wallet_address,
            network=network,
            wallet_type=wallet_type,
            is_connected=True,
            last_sync=datetime.utcnow()
        )
        db.add(wallet)
    
    db.commit()
    
    # Sync wallet data
    blockchain_service = BlockchainService()
    blockchain_service.sync_wallet_assets(current_user.id, db)
    
    return {"message": "Wallet connected successfully"}

# Compliance Endpoints
@app.get("/api/compliance/states")
async def get_all_states():
    """Get all 50 states compliance information"""
    compliance_service = ComplianceService()
    return compliance_service.get_all_states()

@app.get("/api/compliance/state/{state_code}")
async def get_state_compliance(state_code: str):
    """Get compliance requirements for specific state"""
    compliance_service = ComplianceService()
    return compliance_service.get_state_compliance(state_code)

@app.post("/api/compliance/validate")
async def validate_compliance(
    will_data: str = Form(...),  # JSON string
    state_code: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    """Validate will compliance for specific state"""
    compliance_service = ComplianceService()
    will_data_dict = json.loads(will_data)
    return compliance_service.validate_will_requirements(will_data_dict, state_code)

# Grief Companion Endpoints
@app.post("/api/grief/session")
async def create_grief_session(
    session_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Create or get grief support session"""
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
        "messages": session.messages,
        "emotional_state": session.emotional_state
    }

@app.post("/api/grief/message")
async def send_grief_message(
    session_id: str = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db)
):
    """Send message to grief companion"""
    session = db.query(GriefSession).filter(GriefSession.session_id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Use AI service to generate response
    ai_service = AIService()
    response = ai_service.generate_grief_response(message, session.emotional_state)
    
    # Update session
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
            "content": response["content"],
            "timestamp": datetime.utcnow().isoformat()
        }
    ])
    
    session.messages = messages
    session.emotional_state = response["emotional_state"]
    session.session_length = len(messages)
    session.last_activity = datetime.utcnow()
    session.crisis_detected = response.get("crisis_detected", False)
    
    db.commit()
    
    return {
        "response": response["content"],
        "emotional_state": response["emotional_state"],
        "crisis_detected": response.get("crisis_detected", False)
    }

# Health Check
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)