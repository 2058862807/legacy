import json
import os
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional, Any
from sqlalchemy.orm import Session
from database import ComplianceRule, ComplianceChange, get_db, is_database_available
from pydantic import BaseModel

# Cache for compliance data (15 minutes)
cache_duration = timedelta(minutes=15)
_rules_cache = {}
_summary_cache = None
_cache_timestamp = None

class ComplianceRuleResponse(BaseModel):
    state: str
    doc_type: str
    notarization_required: bool
    witnesses_required: int
    ron_allowed: bool
    esign_allowed: bool
    recording_supported: bool
    pet_trust_allowed: bool
    citations: List[str]
    updated_at: str

class ComplianceSummary(BaseModel):
    total_states: int
    total_rules: int
    ron_enabled_states: int
    esign_enabled_states: int
    pet_trust_states: int
    heat_map: Dict[str, int]  # state -> compliance score

class ComplianceService:
    
    @staticmethod
    def _is_cache_valid() -> bool:
        """Check if cache is still valid (15 minutes)"""
        global _cache_timestamp
        if _cache_timestamp is None:
            return False
        return datetime.now(timezone.utc) - _cache_timestamp < cache_duration
    
    @staticmethod
    def _invalidate_cache():
        """Invalidate the cache"""
        global _rules_cache, _summary_cache, _cache_timestamp
        _rules_cache.clear()
        _summary_cache = None
        _cache_timestamp = None
    
    @staticmethod
    def get_rule(state: str, doc_type: str, db: Session) -> Optional[ComplianceRuleResponse]:
        """Get compliance rule for specific state and document type"""
        if not is_database_available() or db is None:
            return None
        
        # Check cache first
        cache_key = f"{state}_{doc_type}"
        if ComplianceService._is_cache_valid() and cache_key in _rules_cache:
            return _rules_cache[cache_key]
        
        # Query database
        rule = db.query(ComplianceRule).filter(
            ComplianceRule.state == state.upper(),
            ComplianceRule.doc_type == doc_type.lower()
        ).first()
        
        if not rule:
            return None
        
        response = ComplianceRuleResponse(
            state=rule.state,
            doc_type=rule.doc_type,
            notarization_required=rule.notarization_required,
            witnesses_required=rule.witnesses_required,
            ron_allowed=rule.ron_allowed,
            esign_allowed=rule.esign_allowed,
            recording_supported=rule.recording_supported,
            pet_trust_allowed=rule.pet_trust_allowed,
            citations=rule.citations or [],
            updated_at=rule.updated_at.isoformat() if rule.updated_at else ""
        )
        
        # Cache the result
        global _cache_timestamp
        _rules_cache[cache_key] = response
        _cache_timestamp = datetime.now(timezone.utc)
        
        return response
    
    @staticmethod
    def get_summary(db: Session) -> Optional[ComplianceSummary]:
        """Get compliance summary across all states"""
        if not is_database_available() or db is None:
            return None
        
        # Check cache first
        global _summary_cache
        if ComplianceService._is_cache_valid() and _summary_cache:
            return _summary_cache
        
        # Query database for summary stats
        all_rules = db.query(ComplianceRule).all()
        
        if not all_rules:
            return None
        
        # Calculate summary statistics
        states = set(rule.state for rule in all_rules)
        ron_enabled_states = len(set(rule.state for rule in all_rules if rule.ron_allowed))
        esign_enabled_states = len(set(rule.state for rule in all_rules if rule.esign_allowed))
        pet_trust_states = len(set(rule.state for rule in all_rules if rule.pet_trust_allowed))
        
        # Calculate heat map (compliance score per state)
        heat_map = {}
        for state in states:
            state_rules = [rule for rule in all_rules if rule.state == state]
            # Simple scoring: count of enabled features
            score = 0
            for rule in state_rules:
                if rule.ron_allowed:
                    score += 2
                if rule.esign_allowed:
                    score += 1
                if rule.pet_trust_allowed:
                    score += 1
                if rule.recording_supported:
                    score += 1
            heat_map[state] = score
        
        summary = ComplianceSummary(
            total_states=len(states),
            total_rules=len(all_rules),
            ron_enabled_states=ron_enabled_states,
            esign_enabled_states=esign_enabled_states,
            pet_trust_states=pet_trust_states,
            heat_map=heat_map
        )
        
        # Cache the result
        global _cache_timestamp
        _summary_cache = summary
        _cache_timestamp = datetime.now(timezone.utc)
        
        return summary
    
    @staticmethod
    def refresh_from_seed(db: Session) -> Dict[str, Any]:
        """Refresh compliance data from seed JSON file"""
        if not is_database_available() or db is None:
            return {"error": "Database not available"}
        
        try:
            # Read seed data
            seed_file = os.path.join(os.path.dirname(__file__), "data", "compliance_seed.json")
            if not os.path.exists(seed_file):
                return {"error": "Seed file not found"}
            
            with open(seed_file, 'r') as f:
                seed_data = json.load(f)
            
            changes_count = 0
            upserted_count = 0
            
            for item in seed_data:
                # Check if rule exists
                existing_rule = db.query(ComplianceRule).filter(
                    ComplianceRule.state == item['state'].upper(),
                    ComplianceRule.doc_type == item['doc_type'].lower()
                ).first()
                
                # Parse datetime
                updated_at = datetime.fromisoformat(item['updated_at'].replace('Z', '+00:00'))
                
                if existing_rule:
                    # Check for changes
                    changes = {}
                    fields_to_check = [
                        'notarization_required', 'witnesses_required', 'ron_allowed',
                        'esign_allowed', 'recording_supported', 'pet_trust_allowed', 'citations'
                    ]
                    
                    for field in fields_to_check:
                        old_value = getattr(existing_rule, field)
                        new_value = item[field]
                        if old_value != new_value:
                            changes[field] = {"old": old_value, "new": new_value}
                    
                    if changes:
                        # Record change
                        change_record = ComplianceChange(
                            state=item['state'].upper(),
                            doc_type=item['doc_type'].lower(),
                            diff=changes,
                            changed_at=datetime.now(timezone.utc)
                        )
                        db.add(change_record)
                        changes_count += 1
                    
                    # Update existing rule
                    for field in fields_to_check:
                        setattr(existing_rule, field, item[field])
                    existing_rule.updated_at = updated_at
                else:
                    # Create new rule
                    new_rule = ComplianceRule(
                        state=item['state'].upper(),
                        doc_type=item['doc_type'].lower(),
                        notarization_required=item['notarization_required'],
                        witnesses_required=item['witnesses_required'],
                        ron_allowed=item['ron_allowed'],
                        esign_allowed=item['esign_allowed'],
                        recording_supported=item['recording_supported'],
                        pet_trust_allowed=item['pet_trust_allowed'],
                        citations=item['citations'],
                        updated_at=updated_at
                    )
                    db.add(new_rule)
                
                upserted_count += 1
            
            db.commit()
            
            # Invalidate cache
            ComplianceService._invalidate_cache()
            
            return {
                "success": True,
                "upserted_rules": upserted_count,
                "changes_detected": changes_count,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            db.rollback()
            return {"error": str(e)}
    
    @staticmethod
    def is_enabled() -> bool:
        """Check if compliance feature is enabled"""
        return os.environ.get('COMPLIANCE_ENABLED', 'false').lower() == 'true'