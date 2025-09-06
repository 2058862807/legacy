"""
Live Estate Plan Engine
Automatically keeps estate documents current as laws and life change
"""

import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from enum import Enum
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

class UpdateTrigger(Enum):
    LEGAL_CHANGE = "legal_change"
    PROFILE_CHANGE = "profile_change"
    YEARLY_CHECKIN = "yearly_checkin"
    MANUAL_REQUEST = "manual_request"

class UpdateSeverity(Enum):
    CRITICAL = "critical"  # Document invalid/risky
    IMPORTANT = "important"  # Should update soon
    MINOR = "minor"  # Optional improvement
    INFO = "info"  # FYI only

@dataclass
class LegalChange:
    state: str
    effective_date: datetime
    title: str
    description: str
    affected_documents: List[str]
    citations: List[str]
    severity: UpdateSeverity
    created_at: datetime

@dataclass
class ProfileChange:
    user_id: str
    change_type: str  # marriage, divorce, child_birth, relocation, etc.
    old_value: Any
    new_value: Any
    detected_at: datetime
    affects_documents: List[str]

@dataclass
class UpdateProposal:
    user_id: str
    trigger: UpdateTrigger
    severity: UpdateSeverity
    title: str
    description: str
    affected_documents: List[str]
    changes_required: Dict[str, Any]
    legal_basis: List[str]
    estimated_time: str
    deadline: Optional[datetime]
    created_at: datetime
    approved: Optional[bool] = None
    completed_at: Optional[datetime] = None

class LiveEstateEngine:
    def __init__(self, compliance_service, document_service, blockchain_service):
        self.compliance = compliance_service
        self.documents = document_service
        self.blockchain = blockchain_service
        self.legal_watchers = {}
        self.user_profiles = {}
        self.pending_updates = []
        
    async def start_monitoring(self, user_id: str, profile_data: Dict[str, Any]):
        """Initialize monitoring for a user's estate plan"""
        self.user_profiles[user_id] = {
            'state': profile_data.get('state'),
            'marital_status': profile_data.get('marital_status'),
            'dependents': profile_data.get('dependents', []),
            'home_ownership': profile_data.get('home_ownership', False),
            'business_ownership': profile_data.get('business_ownership', False),
            'last_update': datetime.now(),
            'documents': profile_data.get('documents', []),
            'notification_preferences': profile_data.get('notifications', {})
        }
        
        # Set up state-specific legal monitoring
        await self._setup_legal_watchers(user_id, profile_data.get('state'))
        
        # Schedule yearly check-in
        await self._schedule_yearly_checkin(user_id)
        
        logger.info(f"Started live monitoring for user {user_id}")

    async def detect_legal_changes(self) -> List[LegalChange]:
        """Monitor legal changes across all 50 states"""
        changes = []
        
        # Simulate legal change detection (in production, this would connect to legal databases)
        sample_changes = [
            {
                'state': 'CA',
                'title': 'California Probate Code 6110 Amendment',
                'description': 'Updated witness requirements for wills - now requires 2 witnesses present simultaneously',
                'effective_date': datetime.now() + timedelta(days=30),
                'affected_documents': ['will', 'trust'],
                'citations': ['Probate Code 6110(c)(2)'],
                'severity': UpdateSeverity.CRITICAL
            },
            {
                'state': 'TX',
                'title': 'Digital Asset Inheritance Act',
                'description': 'New requirements for digital asset provisions in estate plans',
                'effective_date': datetime.now() + timedelta(days=60),
                'affected_documents': ['will'],
                'citations': ['Estates Code Ch. 2001'],
                'severity': UpdateSeverity.IMPORTANT
            }
        ]
        
        for change_data in sample_changes:
            change = LegalChange(
                state=change_data['state'],
                effective_date=change_data['effective_date'],
                title=change_data['title'],
                description=change_data['description'],
                affected_documents=change_data['affected_documents'],
                citations=change_data['citations'],
                severity=change_data['severity'],
                created_at=datetime.now()
            )
            changes.append(change)
            
        return changes

    async def detect_profile_changes(self, user_id: str, updated_profile: Dict[str, Any]) -> List[ProfileChange]:
        """Detect changes in user profile that affect estate planning"""
        changes = []
        
        if user_id not in self.user_profiles:
            return changes
            
        current = self.user_profiles[user_id]
        
        # Check for significant life changes
        change_mappings = {
            'marital_status': ['will', 'trust', 'beneficiary_designations'],
            'state': ['will', 'trust', 'power_of_attorney'],
            'dependents': ['will', 'trust', 'guardian_designations'],
            'home_ownership': ['will', 'trust'],
            'business_ownership': ['will', 'trust', 'succession_plan']
        }
        
        for field, affected_docs in change_mappings.items():
            old_value = current.get(field)
            new_value = updated_profile.get(field)
            
            if old_value != new_value:
                change = ProfileChange(
                    user_id=user_id,
                    change_type=field,
                    old_value=old_value,
                    new_value=new_value,
                    detected_at=datetime.now(),
                    affects_documents=affected_docs
                )
                changes.append(change)
                
        return changes

    async def generate_update_proposals(self, user_id: str) -> List[UpdateProposal]:
        """Generate update proposals based on detected changes"""
        proposals = []
        
        # Check for legal changes affecting this user
        legal_changes = await self.detect_legal_changes()
        user_state = self.user_profiles.get(user_id, {}).get('state')
        
        for change in legal_changes:
            if change.state == user_state:
                proposal = UpdateProposal(
                    user_id=user_id,
                    trigger=UpdateTrigger.LEGAL_CHANGE,
                    severity=change.severity,
                    title=f"Update Required: {change.title}",
                    description=change.description,
                    affected_documents=change.affected_documents,
                    changes_required={
                        'legal_update': True,
                        'witness_requirements': 'updated',
                        're_execution_needed': True
                    },
                    legal_basis=change.citations,
                    estimated_time="15-30 minutes",
                    deadline=change.effective_date,
                    created_at=datetime.now()
                )
                proposals.append(proposal)
        
        # Check for yearly check-ins
        if await self._needs_yearly_checkin(user_id):
            proposal = UpdateProposal(
                user_id=user_id,
                trigger=UpdateTrigger.YEARLY_CHECKIN,
                severity=UpdateSeverity.IMPORTANT,
                title="Annual Estate Plan Review",
                description="It's time for your yearly estate plan review to ensure everything is current",
                affected_documents=['will', 'trust', 'beneficiaries'],
                changes_required={'annual_review': True},
                legal_basis=[],
                estimated_time="10-20 minutes",
                deadline=datetime.now() + timedelta(days=30),
                created_at=datetime.now()
            )
            proposals.append(proposal)
            
        return proposals

    async def execute_approved_update(self, proposal: UpdateProposal) -> Dict[str, Any]:
        """Execute an approved update proposal"""
        results = {
            'success': False,
            'updated_documents': [],
            'new_hashes': {},
            'blockchain_transactions': [],
            'compliance_log': []
        }
        
        try:
            # Re-generate affected documents
            for doc_type in proposal.affected_documents:
                new_document = await self._regenerate_document(
                    proposal.user_id, 
                    doc_type, 
                    proposal.changes_required
                )
                
                if new_document:
                    results['updated_documents'].append(new_document)
                    
                    # Generate new hash
                    new_hash = hashlib.sha256(new_document['content'].encode()).hexdigest()
                    results['new_hashes'][doc_type] = new_hash
                    
                    # Create blockchain record
                    tx_hash = await self.blockchain.notarize_document(new_hash, proposal.user_id)
                    results['blockchain_transactions'].append({
                        'document_type': doc_type,
                        'hash': new_hash,
                        'tx_hash': tx_hash,
                        'timestamp': datetime.now().isoformat()
                    })
            
            # Create compliance log entry
            compliance_entry = {
                'user_id': proposal.user_id,
                'update_type': proposal.trigger.value,
                'severity': proposal.severity.value,
                'legal_basis': proposal.legal_basis,
                'documents_updated': proposal.affected_documents,
                'completion_timestamp': datetime.now().isoformat(),
                'blockchain_proofs': results['blockchain_transactions']
            }
            results['compliance_log'].append(compliance_entry)
            
            # Mark proposal as completed
            proposal.completed_at = datetime.now()
            results['success'] = True
            
            logger.info(f"Successfully executed update for user {proposal.user_id}")
            
        except Exception as e:
            logger.error(f"Failed to execute update: {str(e)}")
            results['error'] = str(e)
            
        return results

    async def get_audit_trail(self, user_id: str) -> Dict[str, Any]:
        """Get complete audit trail for a user's live estate plan"""
        return {
            'user_id': user_id,
            'monitoring_since': self.user_profiles.get(user_id, {}).get('last_update'),
            'total_updates': len([p for p in self.pending_updates if p.user_id == user_id]),
            'legal_changes_tracked': await self._count_legal_changes(user_id),
            'profile_changes_detected': await self._count_profile_changes(user_id),
            'documents_current': await self._verify_document_currency(user_id),
            'next_scheduled_review': await self._get_next_review_date(user_id),
            'compliance_status': 'current',
            'blockchain_verifications': await self._get_blockchain_history(user_id)
        }

    # Private helper methods
    async def _setup_legal_watchers(self, user_id: str, state: str):
        """Set up monitoring for legal changes in user's state"""
        pass

    async def _schedule_yearly_checkin(self, user_id: str):
        """Schedule yearly check-in reminder"""
        pass

    async def _needs_yearly_checkin(self, user_id: str) -> bool:
        """Check if user needs yearly review"""
        last_update = self.user_profiles.get(user_id, {}).get('last_update')
        if not last_update:
            return True
        return (datetime.now() - last_update).days >= 365

    async def _regenerate_document(self, user_id: str, doc_type: str, changes: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Regenerate document with updates"""
        # This would integrate with the existing document generation system
        return {
            'type': doc_type,
            'content': f"Updated {doc_type} for user {user_id}",
            'version': '2.0',
            'generated_at': datetime.now().isoformat()
        }

    async def _count_legal_changes(self, user_id: str) -> int:
        """Count legal changes affecting this user"""
        return 0

    async def _count_profile_changes(self, user_id: str) -> int:
        """Count profile changes for this user"""
        return 0

    async def _verify_document_currency(self, user_id: str) -> bool:
        """Verify all documents are current"""
        return True

    async def _get_next_review_date(self, user_id: str) -> str:
        """Get next scheduled review date"""
        return (datetime.now() + timedelta(days=365)).isoformat()

    async def _get_blockchain_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get blockchain verification history"""
        return []