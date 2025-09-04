import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, JSON, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, timezone
from typing import Optional
import uuid
import logging

logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///./app.db')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://')

# Create engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# User Management Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    image = Column(String, nullable=True)
    provider = Column(String, nullable=False, default="google")  # google, email, etc
    provider_id = Column(String, nullable=True)
    state = Column(String, nullable=True)  # User's state for compliance
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    subscription_status = Column(String, default="free")  # free, basic, premium
    subscription_expires = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    wills = relationship("Will", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")

class Will(Base):
    __tablename__ = "wills"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, default="My Will")
    status = Column(String, default="draft")  # draft, completed, signed, notarized
    completion_percentage = Column(Float, default=0.0)
    
    # Will Content (JSON structure)
    personal_info = Column(JSON, default=dict)  # name, address, marital status, etc
    executors = Column(JSON, default=list)      # list of executors
    beneficiaries = Column(JSON, default=list)  # list of beneficiaries  
    assets = Column(JSON, default=list)         # list of assets
    bequests = Column(JSON, default=list)       # specific bequests
    guardians = Column(JSON, default=list)      # guardians for minor children
    special_instructions = Column(Text, nullable=True)
    
    # Legal Requirements
    state = Column(String, nullable=False)
    witnesses_required = Column(Integer, default=2)
    notarization_required = Column(Boolean, default=False)
    witnesses_signed = Column(Boolean, default=False)
    notarized = Column(Boolean, default=False)
    
    # Document Generation
    pdf_generated = Column(Boolean, default=False)
    pdf_path = Column(String, nullable=True)
    last_generated = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="wills")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, jpg, png, etc
    file_path = Column(String, nullable=False)
    
    # Document Metadata
    document_type = Column(String, nullable=True)  # will, trust, insurance, etc
    tags = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    
    # Blockchain Integration
    blockchain_hash = Column(String, nullable=True)
    blockchain_tx = Column(String, nullable=True)
    blockchain_verified = Column(Boolean, default=False)
    
    # Access Control
    is_shared = Column(Boolean, default=False)
    shared_with = Column(JSON, default=list)  # list of email addresses
    
    uploaded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="documents")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)  # "created_will", "uploaded_document", etc
    details = Column(JSON, default=dict)
    resource_type = Column(String, nullable=True)  # will, document, etc
    resource_id = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class RateLimit(Base):
    __tablename__ = "rate_limits"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    endpoint = Column(String, nullable=False)  # "bot_help", "bot_grief"
    requests_count = Column(Integer, default=0)
    reset_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    bot_type = Column(String, nullable=False)  # "help", "grief"
    session_id = Column(String, nullable=False)  # unique per conversation session
    message_type = Column(String, nullable=False)  # "user", "bot"
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User")

# Compliance Models (existing)
class ComplianceRule(Base):
    __tablename__ = "compliance_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, nullable=False, index=True)
    doc_type = Column(String, nullable=False, index=True)
    notarization_required = Column(Boolean, default=False)
    witnesses_required = Column(Integer, default=0)
    ron_allowed = Column(Boolean, default=False)  # Remote Online Notarization
    esign_allowed = Column(Boolean, default=False)
    recording_supported = Column(Boolean, default=False)
    pet_trust_allowed = Column(Boolean, default=False)
    citations = Column(JSON, default=list)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class ComplianceChange(Base):
    __tablename__ = "compliance_changes"
    
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, nullable=False, index=True)
    doc_type = Column(String, nullable=False, index=True)
    diff = Column(JSON, nullable=False)
    changed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

# Create tables
def create_tables():
    """Create database tables if they don't exist"""
    if engine:
        Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    """Get database session"""
    if SessionLocal is None:
        return None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Live Estate Plan Models
class LiveEvent(Base):
    __tablename__ = "live_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False)  # marriage, divorce, child, move, home, business
    event_data = Column(JSON, default=dict)  # Additional event details
    state_change = Column(String, nullable=True)  # If move, new state
    impact_level = Column(String, default="medium")  # low, medium, high
    status = Column(String, default="pending")  # pending, processed, ignored
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User")

class PlanVersion(Base):
    __tablename__ = "plan_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    version_number = Column(String, nullable=False)  # "1.0", "1.1", "2.0"
    will_id = Column(String, ForeignKey("wills.id"), nullable=True)
    document_hash = Column(String, nullable=False)  # SHA256 hash of documents
    blockchain_tx_hash = Column(String, nullable=True)  # Polygon transaction hash
    blockchain_url = Column(String, nullable=True)  # Polygonscan URL
    status = Column(String, default="draft")  # draft, signed, notarized, current
    trigger_event_id = Column(String, ForeignKey("live_events.id"), nullable=True)
    pdf_path = Column(String, nullable=True)  # Path to generated PDF
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User")
    will = relationship("Will")
    trigger_event = relationship("LiveEvent")

class PlanAudit(Base):
    __tablename__ = "plan_audit"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    plan_version_id = Column(String, ForeignKey("plan_versions.id"), nullable=True)
    action_type = Column(String, nullable=False)  # created, updated, signed, notarized, activated
    trigger_type = Column(String, nullable=True)  # state_law_change, life_event, manual
    trigger_details = Column(JSON, default=dict)  # Details about what triggered the change
    legal_citations = Column(JSON, default=list)  # Array of legal references
    changes_summary = Column(Text, nullable=True)  # AI-generated summary of changes
    blockchain_tx_hash = Column(String, nullable=True)
    blockchain_url = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User")
    plan_version = relationship("PlanVersion")

class UpdateProposal(Base):
    __tablename__ = "update_proposals"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    trigger_type = Column(String, nullable=False)  # state_law_change, life_event
    trigger_id = Column(String, nullable=True)  # Reference to live_event or compliance rule change
    severity = Column(String, default="medium")  # low, medium, high, critical
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    affected_documents = Column(JSON, default=list)  # Array of document types affected
    legal_basis = Column(JSON, default=list)  # Array of legal citations
    estimated_time = Column(String, default="15 minutes")
    deadline = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="pending")  # pending, approved, rejected, expired
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User")

# Check if database is available
def is_database_available() -> bool:
    """Check if database connection is available"""
    return DATABASE_URL is not None and engine is not None

def ensure_database_indexes():
    """Ensure all necessary database indexes exist"""
    try:
        with engine.connect() as conn:
            # Users table indexes
            conn.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
            
            # Wills table indexes  
            conn.execute("CREATE INDEX IF NOT EXISTS idx_wills_id ON wills(id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_wills_user_id ON wills(user_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_wills_status ON wills(status)")
            
            # Rate limits indexes
            conn.execute("CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON rate_limits(user_id, endpoint)")
            
            # Chat history indexes
            conn.execute("CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON chat_history(user_id, session_id)")
            
            # Live events indexes
            conn.execute("CREATE INDEX IF NOT EXISTS idx_live_events_user_id ON live_events(user_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_live_events_status ON live_events(status)")
            
            # Plan versions indexes
            conn.execute("CREATE INDEX IF NOT EXISTS idx_plan_versions_user_id ON plan_versions(user_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_plan_versions_status ON plan_versions(status)")
            
            conn.commit()
            logger.info("✅ Database indexes ensured")
            
    except Exception as e:
        logger.warning(f"Failed to create indexes: {e}")

# Create all tables
def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        ensure_database_indexes()
        logger.info("✅ Database tables and indexes created")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise