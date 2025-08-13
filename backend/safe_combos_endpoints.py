# Personal Safe Combos API Endpoints for NextEra Estate
from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import logging
from datetime import datetime
from cryptography.fernet import Fernet
import base64
import os

# Import our modules
from models import get_db, PersonalSafe, User
from auth import get_current_user

logger = logging.getLogger(__name__)

# Create router
safe_combos_router = APIRouter()

# Encryption key for safe combinations (in production, use proper key management)
ENCRYPTION_KEY = os.getenv("SAFE_ENCRYPTION_KEY", Fernet.generate_key().decode())
fernet = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)

def encrypt_combination_data(data: Dict) -> str:
    """Encrypt sensitive combination data"""
    try:
        json_data = json.dumps(data)
        encrypted = fernet.encrypt(json_data.encode())
        return base64.b64encode(encrypted).decode()
    except Exception as e:
        logger.error(f"Encryption failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to encrypt combination data")

def decrypt_combination_data(encrypted_data: str) -> Dict:
    """Decrypt sensitive combination data"""
    try:
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted = fernet.decrypt(encrypted_bytes)
        return json.loads(decrypted.decode())
    except Exception as e:
        logger.error(f"Decryption failed: {str(e)}")
        return {}

# Get all personal safes for user
@safe_combos_router.get("/api/safes")
async def get_personal_safes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all personal safes for the authenticated user"""
    try:
        safes = db.query(PersonalSafe).filter(
            PersonalSafe.user_id == current_user.id,
            PersonalSafe.is_active == True
        ).all()

        safe_list = []
        for safe in safes:
            # Decrypt combination data for response
            combination_data = {}
            if safe.combination_data:
                try:
                    combination_data = decrypt_combination_data(safe.combination_data)
                except:
                    combination_data = {"error": "Failed to decrypt combination"}

            safe_list.append({
                "id": safe.id,
                "safe_name": safe.safe_name,
                "safe_type": safe.safe_type,
                "location": safe.location,
                "combination_data": combination_data,
                "access_instructions": safe.access_instructions,
                "contents_description": safe.contents_description,
                "emergency_contact": safe.emergency_contact,
                "last_accessed": safe.last_accessed.isoformat() if safe.last_accessed else None,
                "created_at": safe.created_at.isoformat(),
                "updated_at": safe.updated_at.isoformat()
            })

        return {
            "safes": safe_list,
            "total": len(safe_list)
        }

    except Exception as e:
        logger.error(f"Get personal safes failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve personal safes")

# Add new personal safe
@safe_combos_router.post("/api/safes")
async def create_personal_safe(
    safe_name: str = Form(...),
    safe_type: str = Form(...),  # combination, digital, key, biometric
    location: str = Form(None),
    combination_code: str = Form(None),
    backup_codes: str = Form(None),
    access_instructions: str = Form(None),
    contents_description: str = Form(None),
    emergency_contact: str = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new personal safe record"""
    try:
        # Prepare combination data
        combination_data = {}
        if combination_code:
            combination_data["primary_code"] = combination_code
        if backup_codes:
            combination_data["backup_codes"] = backup_codes.split(",") if "," in backup_codes else [backup_codes]
        
        # Add timestamp
        combination_data["added_on"] = datetime.utcnow().isoformat()

        # Encrypt combination data
        encrypted_combination = None
        if combination_data:
            encrypted_combination = encrypt_combination_data(combination_data)

        # Create safe record
        safe = PersonalSafe(
            user_id=current_user.id,
            safe_name=safe_name,
            safe_type=safe_type,
            location=location,
            combination_data=encrypted_combination,
            access_instructions=access_instructions,
            contents_description=contents_description,
            emergency_contact=emergency_contact
        )

        db.add(safe)
        db.commit()
        db.refresh(safe)

        logger.info(f"Personal safe created: {safe.id} for user {current_user.id}")

        return {
            "success": True,
            "safe_id": safe.id,
            "message": "Personal safe added successfully",
            "safe": {
                "id": safe.id,
                "safe_name": safe.safe_name,
                "safe_type": safe.safe_type,
                "location": safe.location,
                "created_at": safe.created_at.isoformat()
            }
        }

    except Exception as e:
        logger.error(f"Create personal safe failed: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create personal safe")

# Update personal safe
@safe_combos_router.put("/api/safes/{safe_id}")
async def update_personal_safe(
    safe_id: int,
    safe_name: str = Form(None),
    safe_type: str = Form(None),
    location: str = Form(None),
    combination_code: str = Form(None),
    backup_codes: str = Form(None),
    access_instructions: str = Form(None),
    contents_description: str = Form(None),
    emergency_contact: str = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing personal safe record"""
    try:
        # Find the safe
        safe = db.query(PersonalSafe).filter(
            PersonalSafe.id == safe_id,
            PersonalSafe.user_id == current_user.id,
            PersonalSafe.is_active == True
        ).first()

        if not safe:
            raise HTTPException(status_code=404, detail="Personal safe not found")

        # Update fields if provided
        if safe_name is not None:
            safe.safe_name = safe_name
        if safe_type is not None:
            safe.safe_type = safe_type
        if location is not None:
            safe.location = location
        if access_instructions is not None:
            safe.access_instructions = access_instructions
        if contents_description is not None:
            safe.contents_description = contents_description
        if emergency_contact is not None:
            safe.emergency_contact = emergency_contact

        # Update combination data if provided
        if combination_code is not None or backup_codes is not None:
            # Get existing combination data
            existing_data = {}
            if safe.combination_data:
                try:
                    existing_data = decrypt_combination_data(safe.combination_data)
                except:
                    existing_data = {}

            # Update with new data
            if combination_code is not None:
                existing_data["primary_code"] = combination_code
            if backup_codes is not None:
                existing_data["backup_codes"] = backup_codes.split(",") if "," in backup_codes else [backup_codes]
            
            existing_data["updated_on"] = datetime.utcnow().isoformat()

            # Re-encrypt
            safe.combination_data = encrypt_combination_data(existing_data)

        safe.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(safe)

        logger.info(f"Personal safe updated: {safe.id} for user {current_user.id}")

        return {
            "success": True,
            "message": "Personal safe updated successfully",
            "safe": {
                "id": safe.id,
                "safe_name": safe.safe_name,
                "safe_type": safe.safe_type,
                "location": safe.location,
                "updated_at": safe.updated_at.isoformat()
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update personal safe failed: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update personal safe")

# Delete personal safe
@safe_combos_router.delete("/api/safes/{safe_id}")
async def delete_personal_safe(
    safe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Soft delete a personal safe record"""
    try:
        # Find the safe
        safe = db.query(PersonalSafe).filter(
            PersonalSafe.id == safe_id,
            PersonalSafe.user_id == current_user.id,
            PersonalSafe.is_active == True
        ).first()

        if not safe:
            raise HTTPException(status_code=404, detail="Personal safe not found")

        # Soft delete
        safe.is_active = False
        safe.updated_at = datetime.utcnow()

        db.commit()

        logger.info(f"Personal safe deleted: {safe.id} for user {current_user.id}")

        return {
            "success": True,
            "message": "Personal safe deleted successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete personal safe failed: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete personal safe")

# Access personal safe (log access)
@safe_combos_router.post("/api/safes/{safe_id}/access")
async def access_personal_safe(
    safe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log access to a personal safe and return combination data"""
    try:
        # Find the safe
        safe = db.query(PersonalSafe).filter(
            PersonalSafe.id == safe_id,
            PersonalSafe.user_id == current_user.id,
            PersonalSafe.is_active == True
        ).first()

        if not safe:
            raise HTTPException(status_code=404, detail="Personal safe not found")

        # Update last accessed time
        safe.last_accessed = datetime.utcnow()
        safe.updated_at = datetime.utcnow()

        db.commit()

        # Decrypt combination data
        combination_data = {}
        if safe.combination_data:
            try:
                combination_data = decrypt_combination_data(safe.combination_data)
            except:
                combination_data = {"error": "Failed to decrypt combination"}

        logger.info(f"Personal safe accessed: {safe.id} by user {current_user.id}")

        return {
            "success": True,
            "safe": {
                "id": safe.id,
                "safe_name": safe.safe_name,
                "safe_type": safe.safe_type,
                "location": safe.location,
                "combination_data": combination_data,
                "access_instructions": safe.access_instructions,
                "contents_description": safe.contents_description,
                "emergency_contact": safe.emergency_contact,
                "last_accessed": safe.last_accessed.isoformat()
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Access personal safe failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to access personal safe")

# Get safe types for dropdown
@safe_combos_router.get("/api/safes/types")
async def get_safe_types():
    """Get available safe types for the form dropdown"""
    return {
        "safe_types": [
            {"value": "combination", "label": "Combination Lock", "description": "Traditional dial or digital combination"},
            {"value": "digital", "label": "Digital/Electronic", "description": "Digital keypad or electronic lock"},
            {"value": "key", "label": "Key Lock", "description": "Traditional key-operated lock"},
            {"value": "biometric", "label": "Biometric", "description": "Fingerprint or other biometric locks"},
            {"value": "smart", "label": "Smart Lock", "description": "App-controlled or WiFi-enabled locks"},
            {"value": "dual", "label": "Dual Authentication", "description": "Requires multiple authentication methods"},
            {"value": "bank_deposit", "label": "Bank Safety Deposit Box", "description": "Bank safety deposit box access"},
            {"value": "other", "label": "Other", "description": "Other type of secure storage"}
        ]
    }

# Emergency access endpoint (for heirs/emergency contacts)
@safe_combos_router.get("/api/emergency/safes/{user_email}")
async def emergency_safe_access(
    user_email: str,
    emergency_code: str = Form(...),
    requester_info: str = Form(...),
    db: Session = Depends(get_db)
):
    """Emergency access to personal safes (requires special authorization)"""
    # This would typically require additional authentication/verification
    # For now, return a placeholder response
    return {
        "message": "Emergency safe access requests must be processed through official channels",
        "contact": "legal@nexteraestate.com",
        "phone": "1-800-ESTATE1"
    }