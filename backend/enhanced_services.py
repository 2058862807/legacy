# Enhanced Services for NextEra Estate - Real AI and Payment Integration
import os
import json
import uuid
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from sqlalchemy.orm import Session
import logging

# Import emergentintegrations
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

logger = logging.getLogger(__name__)

class RealAIService:
    """Real AI service using emergentintegrations with OpenAI and DeepSeek"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        self.default_provider = os.getenv("DEFAULT_AI_PROVIDER", "openai")
        
        if not self.openai_api_key:
            logger.error("OpenAI API key not found in environment variables")
        if not self.deepseek_api_key:
            logger.warning("DeepSeek API key not found in environment variables")

    async def generate_grief_response(self, user_message: str, session_id: str, emotional_state: str = None) -> Dict:
        """Generate AI grief companion response using real AI"""
        try:
            # System message for grief companion
            system_message = """You are a compassionate AI grief companion for NextEra Estate, a digital estate planning platform. Your role is to provide emotional support to users who may be dealing with loss, grief, or the difficult process of estate planning.

Key guidelines:
1. Be empathetic, compassionate, and professional
2. Acknowledge the user's emotions and validate their feelings
3. Provide comfort without being overly clinical or detached
4. Offer gentle guidance and coping strategies when appropriate
5. If you detect crisis language, encourage professional help immediately
6. Keep responses supportive but not overly long
7. Remember this is in the context of estate planning and digital legacy

Do not:
- Provide medical or legal advice
- Make promises about healing timelines
- Be overly cheerful or dismissive of pain
- Share personal anecdotes (you're an AI)

Always respond with empathy and provide genuine emotional support."""

            # Use OpenAI as primary, DeepSeek as fallback
            api_key = self.openai_api_key if self.default_provider == "openai" else self.deepseek_api_key
            provider = self.default_provider
            model = "gpt-4o" if provider == "openai" else "deepseek-chat"

            # Create chat instance
            chat = LlmChat(
                api_key=api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model(provider, model).with_max_tokens(512)

            # Send user message
            user_message_obj = UserMessage(text=user_message)
            response = await chat.send_message(user_message_obj)

            # Detect emotional state from message
            message_lower = user_message.lower()
            detected_state = "neutral"
            
            if any(word in message_lower for word in ['sad', 'crying', 'miss', 'lonely', 'hurt', 'pain']):
                detected_state = 'sad'
            elif any(word in message_lower for word in ['angry', 'mad', 'furious', 'unfair', 'hate']):
                detected_state = 'angry'
            elif any(word in message_lower for word in ['worried', 'scared', 'anxious', 'afraid', 'fear']):
                detected_state = 'anxious'
            elif any(word in message_lower for word in ['better', 'healing', 'hope', 'grateful', 'thankful']):
                detected_state = 'hopeful'
            elif any(word in message_lower for word in ['remember', 'memory', 'used to', 'recall']):
                detected_state = 'reflective'

            # Crisis detection
            crisis_keywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead', 'want to die']
            crisis_detected = any(keyword in message_lower for keyword in crisis_keywords)

            return {
                "content": response,
                "emotional_state": detected_state,
                "crisis_detected": crisis_detected,
                "provider_used": provider,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"AI grief response generation failed: {str(e)}")
            # Fallback response
            return {
                "content": "I'm here to listen and support you through this difficult time. Your feelings are completely valid. Would you like to tell me more about what you're experiencing?",
                "emotional_state": emotional_state or "neutral",
                "crisis_detected": False,
                "provider_used": "fallback",
                "timestamp": datetime.utcnow().isoformat()
            }

    async def generate_will_assistance(self, user_query: str, user_context: Dict, session_id: str) -> Dict:
        """Generate AI assistance for will building"""
        try:
            # System message for will builder assistance
            system_message = f"""You are an AI assistant for NextEra Estate's smart will builder. You help users create legally compliant wills by providing guidance, suggestions, and explanations.

User Context:
- State/Jurisdiction: {user_context.get('jurisdiction', 'Not specified')}
- Age: {user_context.get('age', 'Not specified')}
- Marital Status: {user_context.get('marital_status', 'Not specified')}
- Has Children: {user_context.get('has_children', 'Not specified')}

Key guidelines:
1. Provide helpful, educational guidance on will creation
2. Consider state-specific requirements when relevant
3. Suggest best practices for estate planning
4. Explain legal concepts in simple terms
5. Always remind users that this is guidance, not legal advice
6. Encourage consultation with attorneys for complex situations
7. Focus on practical, actionable advice

Important: Always include a disclaimer that this is educational information only and not legal advice."""

            api_key = self.openai_api_key if self.default_provider == "openai" else self.deepseek_api_key
            provider = self.default_provider
            model = "gpt-4o" if provider == "openai" else "deepseek-chat"

            chat = LlmChat(
                api_key=api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model(provider, model).with_max_tokens(1024)

            user_message_obj = UserMessage(text=user_query)
            response = await chat.send_message(user_message_obj)

            return {
                "content": response,
                "provider_used": provider,
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"AI will assistance generation failed: {str(e)}")
            return {
                "content": "I'd be happy to help you with your will. Could you please be more specific about what aspect of will creation you'd like assistance with? Remember, this is educational guidance only and not legal advice.",
                "provider_used": "fallback",
                "timestamp": datetime.utcnow().isoformat()
            }

    async def generate_onboarding_response(self, user_query: str, session_id: str) -> Dict:
        """Generate responses for the onboarding/introduction chatbot"""
        try:
            system_message = """You are the onboarding assistant for NextEra Estate, a comprehensive digital estate planning platform. Your role is to introduce new users to the platform and help them understand how to use it effectively.

Platform Features to Explain:
1. AI-Powered Will Builder - Smart forms that adapt to user's jurisdiction and needs
2. Secure Document Vault - AES-256 encrypted storage for important documents
3. Blockchain Notarization - Immutable timestamping and verification of documents
4. 50-State Legal Compliance - Real-time validation against all US state laws
5. Heir Management - Digital beneficiary management and verification
6. Death Trigger Systems - Automated or manual estate activation
7. AI Grief Companion - Emotional support during difficult times
8. Digital Asset Management - Cryptocurrency, NFTs, and online account handling

Guidelines:
1. Be welcoming, professional, and helpful
2. Explain features in simple, non-technical terms
3. Provide step-by-step guidance when needed
4. Highlight security and compliance features
5. Encourage users to explore the platform
6. Answer questions about pricing, features, and benefits
7. Keep responses concise but informative

Always be encouraging and emphasize how the platform makes estate planning accessible and secure."""

            api_key = self.openai_api_key
            chat = LlmChat(
                api_key=api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o").with_max_tokens(512)

            user_message_obj = UserMessage(text=user_query)
            response = await chat.send_message(user_message_obj)

            return {
                "content": response,
                "provider_used": "openai",
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Onboarding response generation failed: {str(e)}")
            return {
                "content": "Welcome to NextEra Estate! I'm here to help you get started with our comprehensive estate planning platform. What would you like to know about creating your digital will, securing your documents, or managing your digital legacy?",
                "provider_used": "fallback",
                "timestamp": datetime.utcnow().isoformat()
            }

class StripePaymentService:
    """Real Stripe payment integration using emergentintegrations"""
    
    def __init__(self):
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_publishable_key = os.getenv("STRIPE_PUBLISHABLE_KEY")
        
        if not self.stripe_secret_key:
            logger.error("Stripe secret key not found in environment variables")

    # Define payment packages - server-side only for security
    PAYMENT_PACKAGES = {
        "basic_will": {
            "name": "Basic Will Generation",
            "amount": 29.99,
            "description": "Generate a basic will with AI assistance"
        },
        "premium_will": {
            "name": "Premium Will with Blockchain",
            "amount": 49.99,
            "description": "AI-powered will with blockchain notarization"
        },
        "document_notarization": {
            "name": "Document Notarization",
            "amount": 9.99,
            "description": "Blockchain notarization service for documents"
        },
        "full_estate_plan": {
            "name": "Complete Estate Planning",
            "amount": 99.99,
            "description": "Complete estate planning with all premium features"
        },
        "grief_support_premium": {
            "name": "Premium Grief Support",
            "amount": 19.99,
            "description": "Enhanced AI grief companion with unlimited sessions"
        }
    }

    def get_checkout_service(self, host_url: str):
        """Get configured StripeCheckout service"""
        webhook_url = f"{host_url}/api/webhook/stripe"
        return StripeCheckout(
            api_key=self.stripe_secret_key,
            webhook_url=webhook_url
        )

    async def create_checkout_session(self, package_id: str, origin_url: str, user_id: int = None, metadata: Dict = None) -> Dict:
        """Create Stripe checkout session for predefined package"""
        try:
            # Validate package exists
            if package_id not in self.PAYMENT_PACKAGES:
                raise ValueError(f"Invalid package ID: {package_id}")

            package = self.PAYMENT_PACKAGES[package_id]
            
            # Generate session ID
            session_uuid = str(uuid.uuid4())
            
            # Build URLs
            success_url = f"{origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{origin_url}/payment-cancel"

            # Prepare metadata
            checkout_metadata = {
                "package_id": package_id,
                "user_id": str(user_id) if user_id else "guest",
                "session_uuid": session_uuid,
                **(metadata or {})
            }

            # Create checkout session
            stripe_checkout = self.get_checkout_service(origin_url)
            
            checkout_request = CheckoutSessionRequest(
                amount=package["amount"],
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=checkout_metadata
            )

            session_response = await stripe_checkout.create_checkout_session(checkout_request)

            return {
                "success": True,
                "checkout_url": session_response.url,
                "session_id": session_response.session_id,
                "session_uuid": session_uuid,
                "amount": package["amount"],
                "package_info": package
            }

        except Exception as e:
            logger.error(f"Stripe checkout session creation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def check_payment_status(self, session_id: str, host_url: str) -> Dict:
        """Check payment status for session"""
        try:
            stripe_checkout = self.get_checkout_service(host_url)
            status_response = await stripe_checkout.get_checkout_status(session_id)

            return {
                "success": True,
                "status": status_response.status,
                "payment_status": status_response.payment_status,
                "amount_total": status_response.amount_total,
                "currency": status_response.currency,
                "metadata": status_response.metadata
            }

        except Exception as e:
            logger.error(f"Stripe payment status check failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def handle_webhook(self, request_body: bytes, stripe_signature: str, host_url: str) -> Dict:
        """Handle Stripe webhook"""
        try:
            stripe_checkout = self.get_checkout_service(host_url)
            webhook_response = await stripe_checkout.handle_webhook(request_body, stripe_signature)

            return {
                "success": True,
                "event_type": webhook_response.event_type,
                "event_id": webhook_response.event_id,
                "session_id": webhook_response.session_id,
                "payment_status": webhook_response.payment_status,
                "metadata": webhook_response.metadata
            }

        except Exception as e:
            logger.error(f"Stripe webhook handling failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

class UserGuidanceService:
    """Service for user onboarding and guidance"""
    
    def __init__(self, ai_service: RealAIService):
        self.ai_service = ai_service

    def get_welcome_tutorial(self) -> Dict:
        """Get structured welcome tutorial"""
        return {
            "title": "Welcome to NextEra Estate",
            "subtitle": "Your Complete Digital Estate Planning Platform",
            "steps": [
                {
                    "step": 1,
                    "title": "Create Your Profile",
                    "description": "Set up your profile with your jurisdiction and basic information",
                    "action": "Go to Profile Settings",
                    "url": "/profile"
                },
                {
                    "step": 2,
                    "title": "Build Your Will",
                    "description": "Use our AI-powered will builder to create a legally compliant will",
                    "action": "Start Will Builder",
                    "url": "/will-builder"
                },
                {
                    "step": 3,
                    "title": "Upload Documents",
                    "description": "Securely store important documents in your encrypted vault",
                    "action": "Open Document Vault",
                    "url": "/vault"
                },
                {
                    "step": 4,
                    "title": "Manage Heirs",
                    "description": "Add and verify your beneficiaries and heirs",
                    "action": "Manage Heirs",
                    "url": "/heirs"
                },
                {
                    "step": 5,
                    "title": "Enable Blockchain",
                    "description": "Connect your wallet for blockchain notarization",
                    "action": "Connect Blockchain",
                    "url": "/blockchain"
                }
            ],
            "features": [
                {
                    "icon": "🤖",
                    "title": "AI-Powered",
                    "description": "Smart will builder that adapts to your state's laws"
                },
                {
                    "icon": "🔐",
                    "title": "Military-Grade Security",
                    "description": "AES-256 encryption protects all your sensitive data"
                },
                {
                    "icon": "🏛️",
                    "title": "50-State Compliance",
                    "description": "Real-time validation against all US state laws"
                },
                {
                    "icon": "⛓️",
                    "title": "Blockchain Verified",
                    "description": "Immutable timestamping and notarization"
                }
            ]
        }

    async def get_contextual_help(self, page: str, user_query: str, session_id: str) -> Dict:
        """Get contextual help for specific pages"""
        page_contexts = {
            "dashboard": "User is on the main dashboard and needs help understanding the overview features",
            "will-builder": "User is creating a will and needs guidance on form fields and requirements",
            "vault": "User is managing documents and needs help with upload and organization",
            "heirs": "User is managing beneficiaries and needs help adding or verifying heirs",
            "blockchain": "User is setting up blockchain features and needs help with wallet connection",
            "compliance": "User is checking state compliance and needs help understanding requirements",
            "grief-companion": "User needs emotional support and guidance on using the grief companion"
        }

        context = page_contexts.get(page, "User needs general help with the platform")
        enhanced_query = f"Context: {context}. User question: {user_query}"

        return await self.ai_service.generate_onboarding_response(enhanced_query, session_id)

    def get_feature_tour(self, feature: str) -> Dict:
        """Get detailed tour for specific features"""
        feature_tours = {
            "will-builder": {
                "title": "AI-Powered Will Builder",
                "description": "Create a legally compliant will with AI assistance",
                "highlights": [
                    "State-specific form adaptation",
                    "Real-time compliance checking",
                    "Blockchain notarization option",
                    "PDF generation with legal formatting"
                ],
                "steps": [
                    "Enter personal information",
                    "Select your state for compliance",
                    "Define your assets and beneficiaries",
                    "Review and generate your will",
                    "Optional blockchain notarization"
                ]
            },
            "document-vault": {
                "title": "Secure Document Vault",
                "description": "Store and organize your important documents",
                "highlights": [
                    "AES-256 encryption",
                    "Blockchain notarization",
                    "Secure sharing with heirs",
                    "Version control and history"
                ],
                "steps": [
                    "Upload documents securely",
                    "Organize into folders",
                    "Add descriptions and tags",
                    "Enable blockchain notarization",
                    "Share with designated heirs"
                ]
            }
        }
        
        return feature_tours.get(feature, {
            "title": "Feature Help",
            "description": "Explore this feature to learn more",
            "highlights": [],
            "steps": []
        })