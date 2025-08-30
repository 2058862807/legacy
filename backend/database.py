import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
from typing import Optional

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://')

# Create engine
engine = create_engine(DATABASE_URL) if DATABASE_URL else None
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None

Base = declarative_base()

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