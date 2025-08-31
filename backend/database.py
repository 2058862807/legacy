import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, JSON, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, timezone
from typing import Optional
import uuid

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://')

# Create engine
engine = create_engine(DATABASE_URL) if DATABASE_URL else None
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None

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

# Check if database is available
def is_database_available() -> bool:
    """Check if database connection is available"""
    return DATABASE_URL is not None and engine is not None