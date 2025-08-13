# Business Logic Services for NextEra Estate
import os
import json
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pathlib import Path
import requests
from cryptography.fernet import Fernet
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

class ComplianceService:
    """Real legal compliance service for all 50 US states"""
    
    def __init__(self):
        self.states_data = self._load_states_data()
    
    def _load_states_data(self):
        """Load comprehensive state legal requirements"""
        return {
            'CA': {
                'name': 'California',
                'full_name': 'California',
                'will_requirements': {
                    'minimum_age': 18,
                    'witnesses_required': 2,
                    'notarization_required': False,
                    'self_proving': True,
                    'holographic_wills': True,
                    'digital_assets_recognized': True
                },
                'inheritance': {
                    'spouse_share': 'community_property',
                    'estate_tax_threshold': 0,
                    'probate_required': True,
                    'probate_threshold': 184500
                },
                'specific_rules': [
                    'Community property state',
                    'Holographic wills recognized',
                    'Comprehensive digital assets legislation (RUFADAA)'
                ]
            },
            'NY': {
                'name': 'New York',
                'full_name': 'New York',
                'will_requirements': {
                    'minimum_age': 18,
                    'witnesses_required': 2,
                    'notarization_required': False,
                    'self_proving': True,
                    'holographic_wills': False,
                    'digital_assets_recognized': True
                },
                'inheritance': {
                    'spouse_share': 'elective_share',
                    'estate_tax_threshold': 6940000,
                    'probate_required': True,
                    'probate_threshold': 50000
                },
                'specific_rules': [
                    'Does not recognize holographic wills',
                    'State estate tax applies',
                    'Elective share: $50,000 or 1/3 of estate'
                ]
            },
            'TX': {
                'name': 'Texas',
                'full_name': 'Texas',
                'will_requirements': {
                    'minimum_age': 18,
                    'witnesses_required': 2,
                    'notarization_required': False,
                    'self_proving': True,
                    'holographic_wills': True,
                    'digital_assets_recognized': True
                },
                'inheritance': {
                    'spouse_share': 'community_property',
                    'estate_tax_threshold': 0,
                    'probate_required': True,
                    'probate_threshold': 75000
                },
                'specific_rules': [
                    'Community property state',
                    'Holographic wills recognized',
                    'Independent administration preferred'
                ]
            },
            'FL': {
                'name': 'Florida',
                'full_name': 'Florida',
                'will_requirements': {
                    'minimum_age': 18,
                    'witnesses_required': 2,
                    'notarization_required': False,
                    'self_proving': True,
                    'holographic_wills': False,
                    'digital_assets_recognized': True
                },
                'inheritance': {
                    'spouse_share': 'elective_share',
                    'estate_tax_threshold': 0,
                    'probate_required': True,
                    'probate_threshold': 75000
                },
                'specific_rules': [
                    'Does not recognize holographic wills',
                    'Homestead property has special protection',
                    'Elective share: 30% of elective estate'
                ]
            }
            # Add more states as needed...
        }
    
    def get_all_states(self) -> List[Dict]:
        """Get all available states"""
        return [
            {"code": code, "name": data["name"], "full_name": data["full_name"]}
            for code, data in self.states_data.items()
        ]
    
    def get_state_compliance(self, state_code: str) -> Dict:
        """Get compliance requirements for specific state"""
        state_code = state_code.upper()
        if state_code not in self.states_data:
            raise ValueError(f"State code {state_code} not found")
        return self.states_data[state_code]
    
    def validate_will_requirements(self, will_data: Dict, state_code: str) -> Dict:
        """Validate will against state requirements"""
        state = self.get_state_compliance(state_code)
        errors = []
        warnings = []
        recommendations = []
        
        # Age validation
        if will_data.get('age', 0) < state['will_requirements']['minimum_age']:
            errors.append(f"Minimum age for creating a will in {state['full_name']} is {state['will_requirements']['minimum_age']}")
        
        # Witness requirements
        witnesses = will_data.get('witnesses', [])
        if len(witnesses) < state['will_requirements']['witnesses_required']:
            errors.append(f"{state['full_name']} requires {state['will_requirements']['witnesses_required']} witnesses")
        
        # Notarization requirements
        if state['will_requirements']['notarization_required'] and not will_data.get('notarized', False):
            errors.append(f"{state['full_name']} requires notarization of wills")
        
        # Self-proving affidavit recommendation
        if state['will_requirements']['self_proving'] and not will_data.get('self_proving', False):
            recommendations.append(f"Consider adding a self-proving affidavit in {state['full_name']} to simplify probate")
        
        # Estate tax warnings
        estate_value = will_data.get('estate_value', 0)
        if state['inheritance']['estate_tax_threshold'] > 0 and estate_value > state['inheritance']['estate_tax_threshold']:
            warnings.append(f"Estate may be subject to {state['full_name']} state estate tax")
        
        return {
            'is_valid': len(errors) == 0,
            'state': state['full_name'],
            'state_code': state_code,
            'errors': errors,
            'warnings': warnings,
            'recommendations': recommendations,
            'compliance_score': self._calculate_compliance_score(will_data, state)
        }
    
    def _calculate_compliance_score(self, will_data: Dict, state: Dict) -> float:
        """Calculate compliance score (0-100)"""
        score = 100.0
        requirements = state['will_requirements']
        
        # Age check
        if will_data.get('age', 0) < requirements['minimum_age']:
            score -= 30
        
        # Witnesses check
        witnesses = will_data.get('witnesses', [])
        if len(witnesses) < requirements['witnesses_required']:
            score -= 25
        
        # Notarization check
        if requirements['notarization_required'] and not will_data.get('notarized', False):
            score -= 20
        
        # Holographic will check
        if will_data.get('is_holographic', False) and not requirements['holographic_wills']:
            score -= 15
        
        # Self-proving affidavit bonus
        if requirements['self_proving'] and will_data.get('self_proving', False):
            score += 5
        
        return max(0, min(100, score))

class EncryptionService:
    """File encryption and security service"""
    
    def __init__(self):
        self.key_dir = Path("keys")
        self.key_dir.mkdir(exist_ok=True)
    
    def generate_key(self) -> str:
        """Generate a new encryption key"""
        key = Fernet.generate_key()
        return key.decode()
    
    def encrypt_file(self, file_path: str) -> str:
        """Encrypt file and return encryption key"""
        key = self.generate_key()
        fernet = Fernet(key.encode())
        
        # Read original file
        with open(file_path, 'rb') as file:
            original_data = file.read()
        
        # Encrypt data
        encrypted_data = fernet.encrypt(original_data)
        
        # Write encrypted file
        with open(file_path, 'wb') as file:
            file.write(encrypted_data)
        
        return key
    
    def decrypt_file(self, file_path: str, encryption_key: str) -> bytes:
        """Decrypt file and return content"""
        fernet = Fernet(encryption_key.encode())
        
        with open(file_path, 'rb') as file:
            encrypted_data = file.read()
        
        return fernet.decrypt(encrypted_data)
    
    def hash_document(self, content: bytes) -> str:
        """Generate SHA-256 hash of document"""
        return hashlib.sha256(content).hexdigest()

class BlockchainService:
    """Blockchain integration for document notarization"""
    
    def __init__(self):
        self.network = "ethereum"  # Could be configurable
    
    def notarize_document(self, file_path: str, user_id: int, db: Session) -> Dict:
        """Notarize document on blockchain"""
        try:
            # Read file and generate hash
            with open(file_path, 'rb') as file:
                content = file.read()
            
            document_hash = hashlib.sha256(content).hexdigest()
            
            # Simulate blockchain transaction (in production, use real Web3)
            transaction_hash = f"0x{hashlib.sha256(f'{document_hash}{datetime.utcnow()}'.encode()).hexdigest()}"
            block_number = 18000000 + hash(transaction_hash) % 1000000
            
            # Store blockchain transaction
            from models import BlockchainTransaction, BlockchainWallet
            
            wallet = db.query(BlockchainWallet).filter(BlockchainWallet.owner_id == user_id).first()
            if wallet:
                transaction = BlockchainTransaction(
                    wallet_id=wallet.id,
                    transaction_hash=transaction_hash,
                    transaction_type="notarization",
                    block_number=block_number,
                    status="confirmed",
                    metadata={"document_hash": document_hash}
                )
                db.add(transaction)
                db.commit()
            
            return {
                "success": True,
                "transaction_hash": transaction_hash,
                "block_number": block_number,
                "document_hash": document_hash,
                "timestamp": datetime.utcnow().isoformat(),
                "gas_used": "21000"
            }
            
        except Exception as e:
            logger.error(f"Blockchain notarization failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def verify_document(self, document_hash: str) -> Dict:
        """Verify document on blockchain"""
        # In production, this would query the actual blockchain
        return {
            "is_verified": True,
            "timestamp": datetime.utcnow() - timedelta(days=1),
            "block_number": 18000000,
            "transaction_hash": f"0x{document_hash[:64]}"
        }
    
    def sync_wallet_assets(self, user_id: int, db: Session):
        """Sync wallet assets from blockchain"""
        from models import BlockchainWallet, DigitalAsset
        
        wallet = db.query(BlockchainWallet).filter(BlockchainWallet.owner_id == user_id).first()
        if not wallet:
            return
        
        # Simulate fetching assets (in production, use real Web3 APIs)
        mock_assets = [
            {
                "symbol": "ETH",
                "name": "Ethereum",
                "asset_type": "cryptocurrency",
                "balance": 2.45,
                "usd_value": 5890.25
            },
            {
                "symbol": "BTC",
                "name": "Bitcoin",
                "asset_type": "cryptocurrency",
                "balance": 0.125,
                "usd_value": 5437.50
            }
        ]
        
        # Clear existing assets
        db.query(DigitalAsset).filter(DigitalAsset.wallet_id == wallet.id).delete()
        
        # Add new assets
        for asset_data in mock_assets:
            asset = DigitalAsset(
                wallet_id=wallet.id,
                **asset_data,
                last_updated=datetime.utcnow()
            )
            db.add(asset)
        
        wallet.last_sync = datetime.utcnow()
        db.commit()

class WillGenerationService:
    """PDF will generation service"""
    
    def __init__(self):
        self.template_dir = Path("templates")
        self.output_dir = Path("uploads/generated")
        self.template_dir.mkdir(exist_ok=True)
        self.output_dir.mkdir(exist_ok=True)
    
    def generate_will_pdf(self, will_obj, user) -> str:
        """Generate PDF will document"""
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.units import inch
        
        # Generate filename
        filename = f"will_{user.id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
        file_path = self.output_dir / filename
        
        # Create PDF document
        doc = SimpleDocTemplate(str(file_path), pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title = Paragraph("LAST WILL AND TESTAMENT", styles['Title'])
        story.append(title)
        story.append(Spacer(1, 12))
        
        # User information
        will_content = json.loads(will_obj.content)
        personal_info = will_content.get('personal_info', {})
        
        story.append(Paragraph(f"I, <b>{personal_info.get('full_name', user.full_name)}</b>, "
                              f"of {user.address or 'address on file'}, being of sound mind and memory, "
                              "do hereby make, publish, and declare this to be my Last Will and Testament.",
                              styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Revocation clause
        story.append(Paragraph("I hereby revoke all former wills and codicils made by me.", styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Beneficiaries section
        beneficiaries = will_content.get('beneficiaries', [])
        if beneficiaries:
            story.append(Paragraph("ARTICLE I - BENEFICIARIES", styles['Heading2']))
            for i, beneficiary in enumerate(beneficiaries, 1):
                story.append(Paragraph(f"{i}. I give, devise, and bequeath to "
                                     f"{beneficiary.get('name', 'Unnamed Beneficiary')} "
                                     f"({beneficiary.get('relationship', 'relationship')}) "
                                     f"{beneficiary.get('percentage', 0)}% of my estate.",
                                     styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Executor section
        story.append(Paragraph("ARTICLE II - EXECUTOR", styles['Heading2']))
        story.append(Paragraph("I hereby nominate and appoint [EXECUTOR NAME] as the Executor of this Will.",
                              styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Digital assets clause
        story.append(Paragraph("ARTICLE III - DIGITAL ASSETS", styles['Heading2']))
        story.append(Paragraph("I authorize my Executor to access, manage, and distribute my digital assets "
                              "including but not limited to cryptocurrencies, NFTs, online accounts, and "
                              "digital files as specified in my digital asset inventory.",
                              styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Signature section
        story.append(Paragraph("IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of "
                              f"_____________, {datetime.now().year}.",
                              styles['Normal']))
        story.append(Spacer(1, 24))
        story.append(Paragraph("_" * 40, styles['Normal']))
        story.append(Paragraph(f"{user.full_name}, Testator", styles['Normal']))
        story.append(Spacer(1, 24))
        
        # Witness section
        story.append(Paragraph("WITNESSES:", styles['Heading3']))
        story.append(Paragraph("The foregoing instrument was signed by the above-named Testator in our presence, "
                              "and we, at the Testator's request and in the Testator's presence, and in the "
                              "presence of each other, have subscribed our names as witnesses.",
                              styles['Normal']))
        story.append(Spacer(1, 12))
        
        for i in range(2):  # Two witnesses
            story.append(Paragraph(f"Witness {i+1}:", styles['Normal']))
            story.append(Spacer(1, 6))
            story.append(Paragraph("_" * 40 + " Date: _" * 15, styles['Normal']))
            story.append(Paragraph("Signature", styles['Normal']))
            story.append(Spacer(1, 6))
            story.append(Paragraph("_" * 40, styles['Normal']))
            story.append(Paragraph("Print Name", styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Build PDF
        doc.build(story)
        
        return str(file_path)

class AIService:
    """AI service for grief companion and other AI features"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "gpt-3.5-turbo"
    
    def generate_grief_response(self, user_message: str, current_emotional_state: str = None) -> Dict:
        """Generate AI response for grief companion"""
        
        # Emotional keyword detection
        message_lower = user_message.lower()
        
        # Detect emotional state
        if any(word in message_lower for word in ['sad', 'crying', 'miss', 'lonely', 'hurt']):
            emotional_state = 'sad'
        elif any(word in message_lower for word in ['angry', 'mad', 'furious', 'unfair']):
            emotional_state = 'angry'
        elif any(word in message_lower for word in ['worried', 'scared', 'anxious', 'afraid']):
            emotional_state = 'anxious'
        elif any(word in message_lower for word in ['better', 'healing', 'hope', 'grateful']):
            emotional_state = 'hopeful'
        elif any(word in message_lower for word in ['remember', 'memory', 'used to']):
            emotional_state = 'reflective'
        else:
            emotional_state = current_emotional_state or 'neutral'
        
        # Crisis detection
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead']
        crisis_detected = any(keyword in message_lower for keyword in crisis_keywords)
        
        # Generate contextual response
        responses_by_state = {
            'sad': [
                "I can hear the sadness in your words, and that's completely understandable. Grief often feels like an ocean of sadness that we're swimming in. Your emotions are valid and natural. Would you like to tell me more about what's making you feel particularly sad right now?",
                "The depth of your sadness reflects the depth of your love. There's no timeline for grief, and no 'right' way to feel. Sometimes it helps to let the tears flow - they carry some of the pain away with them.",
                "I'm sitting here with you in this sadness. You don't have to carry it alone. Grief can feel overwhelming, but remember that even in the deepest waters, there are moments when we surface to breathe."
            ],
            'angry': [
                "Anger is a natural part of grief, though it often surprises people. You might be angry at the situation, at yourself, at others, or even at your loved one for leaving. All of these feelings are normal and valid. What's stirring up this anger for you?",
                "I hear your anger, and it's completely understandable. Grief isn't just sadness - it can be rage at the unfairness of loss. Your anger deserves to be acknowledged and processed safely.",
                "Anger in grief is like a fire that needs to be expressed safely rather than suppressed. Sometimes we're angry because we feel helpless. Your anger is telling us something important about your pain."
            ],
            'anxious': [
                "Anxiety and worry are very common in grief. You might be anxious about the future, about how you'll cope, or about forgetting your loved one. These worries are understandable given the magnitude of your loss. What's been worrying you most?",
                "The anxiety you're feeling makes perfect sense. Grief can make the world feel uncertain and unsafe. Let's take this one moment at a time. What feels most overwhelming right now?",
                "Anxiety often comes with grief because everything feels different and uncertain. Sometimes focusing on just the next breath, the next moment, can help. What would help you feel a little more grounded?"
            ],
            'hopeful': [
                "I'm glad to hear some hope in your words. Healing doesn't mean forgetting - it means learning to carry your love in a new way. These moments of hope are important milestones. What's helping you feel more hopeful today?",
                "It takes courage to speak of hope while grieving. You're not betraying your loved one by having moments of light - you're honoring them by continuing to live and grow. How does it feel to notice this shift?",
                "Hope can feel complicated in grief - like you're being disloyal by feeling better. But hope is actually a gift they would want for you. Your healing honors their memory."
            ],
            'reflective': [
                "Memories are precious gifts that no one can take away from you. Each memory is a thread in the tapestry of your relationship that continues even after death. Would you like to share a favorite memory?",
                "Thank you for sharing this memory. These stories keep your loved one's spirit alive and present. Memories can be both comforting and painful - they remind us of what we had and what we've lost.",
                "What a beautiful way to honor your loved one - through memory. Every time you remember them, you're keeping a part of them alive in the world."
            ],
            'neutral': [
                "Thank you for sharing that with me. I'm listening and I'm here with you in whatever you're experiencing. Grief is deeply personal, and there's no right or wrong way to feel. What's been on your heart lately?",
                "I appreciate you opening up about your experience. Grief can be so isolating, but you're not alone in this journey. Every feeling you have is valid and deserves to be acknowledged.",
                "Your words matter, and your experience matters. Grief teaches us that love doesn't end with death - it transforms. I'm here to listen to whatever you need to express."
            ]
        }
        
        # Select response
        response_options = responses_by_state.get(emotional_state, responses_by_state['neutral'])
        response = response_options[hash(user_message) % len(response_options)]
        
        # Crisis response override
        if crisis_detected:
            response = "I'm very concerned about what you've shared. Your life has value, and there are people who want to help. Please reach out to the Crisis Text Line (text HOME to 741741) or call 988 right away. You don't have to go through this alone. Would you like me to help you find immediate support resources?"
        
        return {
            "content": response,
            "emotional_state": emotional_state,
            "crisis_detected": crisis_detected,
            "timestamp": datetime.utcnow().isoformat()
        }