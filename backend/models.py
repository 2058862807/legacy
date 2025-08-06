# Database Models for NextEra Estate
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON, ForeignKey, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
import os
from passlib.context import CryptContext
import jwt
from typing import Optional

Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    jurisdiction = Column(String, nullable=False)  # State code (e.g., 'CA', 'NY')
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    marital_status = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    biometric_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    wills = relationship("Will", back_populates="owner")
    documents = relationship("Document", back_populates="owner")
    heirs = relationship("Heir", back_populates="owner")
    blockchain_wallets = relationship("BlockchainWallet", back_populates="owner")
    personal_safes = relationship("PersonalSafe", back_populates="user")
    
    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)
    
    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return pwd_context.hash(password)
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

# Personal Safe Combos Model
class PersonalSafe(Base):
    __tablename__ = "personal_safes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    safe_name = Column(String, nullable=False)  # e.g., "Home Safe", "Bank Safety Deposit Box"
    safe_type = Column(String, nullable=False)  # "combination", "digital", "key", "biometric"
    location = Column(String, nullable=True)  # "Bedroom closet", "Bank of America Branch"
    combination_data = Column(JSON, nullable=True)  # Encrypted combination/code data
    access_instructions = Column(Text, nullable=True)  # How to access the safe
    contents_description = Column(Text, nullable=True)  # What's stored in the safe
    emergency_contact = Column(String, nullable=True)  # Who should access in emergency
    last_accessed = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="personal_safes")

# Will Model
class Will(Base):
    __tablename__ = "wills"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)  # JSON string of will content
    status = Column(String, default="draft")  # draft, complete, executed
    completion_percentage = Column(Float, default=0.0)
    jurisdiction = Column(String, nullable=False)
    is_notarized = Column(Boolean, default=False)
    blockchain_hash = Column(String, nullable=True)
    blockchain_transaction = Column(String, nullable=True)
    witnesses_required = Column(Integer, default=2)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="wills")
    beneficiaries = relationship("Beneficiary", back_populates="will")

# Document Model
class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    folder = Column(String, default="general")
    description = Column(Text, nullable=True)
    is_encrypted = Column(Boolean, default=True)
    encryption_key = Column(String, nullable=True)
    is_notarized = Column(Boolean, default=False)
    blockchain_hash = Column(String, nullable=True)
    blockchain_transaction = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)  # List of tags
    shared_with = Column(JSON, nullable=True)  # List of heir IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="documents")

# Heir/Beneficiary Model
class Heir(Base):
    __tablename__ = "heirs"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    heir_relationship = Column(String, nullable=False)  # spouse, child, parent, etc.
    role = Column(String, nullable=False)  # primary, secondary, charity, etc.
    percentage = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_method = Column(String, nullable=True)
    blockchain_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="heirs")
    beneficiaries = relationship("Beneficiary", back_populates="heir")
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

# Beneficiary assignments in wills
class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    
    id = Column(Integer, primary_key=True, index=True)
    will_id = Column(Integer, ForeignKey("wills.id"), nullable=False)
    heir_id = Column(Integer, ForeignKey("heirs.id"), nullable=False)
    asset_type = Column(String, nullable=False)  # real_estate, bank_account, etc.
    asset_description = Column(Text, nullable=False)
    percentage = Column(Float, nullable=False)
    conditions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    will = relationship("Will", back_populates="beneficiaries")
    heir = relationship("Heir", back_populates="beneficiaries")

# Death Trigger Model
class DeathTrigger(Base):
    __tablename__ = "death_triggers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trigger_type = Column(String, nullable=False)  # manual, timer, api, biometric
    is_active = Column(Boolean, default=True)
    configuration = Column(JSON, nullable=False)  # Trigger-specific config
    last_checked = Column(DateTime, nullable=True)
    last_response = Column(DateTime, nullable=True)
    attempts = Column(Integer, default=0)
    max_attempts = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Blockchain Wallet Model
class BlockchainWallet(Base):
    __tablename__ = "blockchain_wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    wallet_address = Column(String, nullable=False)
    network = Column(String, nullable=False)  # ethereum, polygon, etc.
    wallet_type = Column(String, nullable=False)  # metamask, walletconnect, etc.
    is_connected = Column(Boolean, default=False)
    balance = Column(Float, default=0.0)
    last_sync = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="blockchain_wallets")
    transactions = relationship("BlockchainTransaction", back_populates="wallet")
    assets = relationship("DigitalAsset", back_populates="wallet")

# Blockchain Transaction Model
class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("blockchain_wallets.id"), nullable=False)
    transaction_hash = Column(String, nullable=False, unique=True)
    transaction_type = Column(String, nullable=False)  # notarization, will_creation, etc.
    block_number = Column(Integer, nullable=True)
    gas_used = Column(Integer, nullable=True)
    gas_price = Column(Float, nullable=True)
    status = Column(String, nullable=False)  # pending, confirmed, failed
    transaction_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    wallet = relationship("BlockchainWallet", back_populates="transactions")

# Digital Asset Model (Crypto, NFTs)
class DigitalAsset(Base):
    __tablename__ = "digital_assets"
    
    id = Column(Integer, primary_key=True, index=True)
    wallet_id = Column(Integer, ForeignKey("blockchain_wallets.id"), nullable=False)
    asset_type = Column(String, nullable=False)  # cryptocurrency, nft
    symbol = Column(String, nullable=True)  # BTC, ETH, etc.
    name = Column(String, nullable=False)
    contract_address = Column(String, nullable=True)
    token_id = Column(String, nullable=True)  # For NFTs
    balance = Column(Float, default=0.0)
    usd_value = Column(Float, nullable=True)
    asset_metadata = Column(JSON, nullable=True)  # NFT metadata, etc.
    image_url = Column(String, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    wallet = relationship("BlockchainWallet", back_populates="assets")

# Legal Compliance Log
class ComplianceLog(Base):
    __tablename__ = "compliance_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    jurisdiction = Column(String, nullable=False)
    compliance_check = Column(JSON, nullable=False)  # Full compliance result
    is_compliant = Column(Boolean, nullable=False)
    issues_found = Column(JSON, nullable=True)  # List of compliance issues
    recommendations = Column(JSON, nullable=True)
    checked_at = Column(DateTime, default=datetime.utcnow)

# Grief Support Session
class GriefSession(Base):
    __tablename__ = "grief_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Can be anonymous
    session_id = Column(String, nullable=False, unique=True)
    messages = Column(JSON, nullable=False)  # Full conversation
    emotional_state = Column(String, nullable=True)
    topics_discussed = Column(JSON, nullable=True)
    crisis_detected = Column(Boolean, default=False)
    session_length = Column(Integer, default=0)  # Number of messages
    started_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)

# Payment Transaction Model (for Stripe integration)
class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Optional for guest payments
    session_id = Column(String, nullable=False, unique=True)  # Stripe session ID
    payment_id = Column(String, nullable=True)  # Stripe payment intent ID
    amount = Column(Float, nullable=False)
    currency = Column(String, default="usd")
    payment_status = Column(String, nullable=False)  # pending, paid, failed, expired
    status = Column(String, nullable=False)  # initiated, pending, complete, failed
    payment_metadata = Column(JSON, nullable=True)  # Additional payment metadata
    package_type = Column(String, nullable=True)  # e.g., "premium_will", "notarization"
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nextera_estate.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()