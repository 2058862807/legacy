# Fixed Stripe Service with Direct Integration
import os
import stripe
import uuid
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

class DirectStripeService:
    """Direct Stripe integration as fallback for emergentintegrations issues"""
    
    def __init__(self):
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_publishable_key = os.getenv("STRIPE_PUBLISHABLE_KEY")
        
        if not self.stripe_secret_key:
            logger.error("Stripe secret key not found in environment variables")
            raise ValueError("Stripe secret key is required")
            
        # Initialize Stripe
        stripe.api_key = self.stripe_secret_key
        
        logger.info("✅ Direct Stripe service initialized successfully")

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

            # Create checkout session with direct Stripe
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': package["name"],
                                'description': package["description"],
                            },
                            'unit_amount': int(package["amount"] * 100),  # Convert to cents
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=checkout_metadata,
                expires_at=int(datetime.utcnow().timestamp()) + (30 * 60)  # 30 minutes
            )

            logger.info(f"✅ Stripe checkout session created: {session.id}")

            return {
                "success": True,
                "checkout_url": session.url,
                "session_id": session.id,
                "session_uuid": session_uuid,
                "amount": package["amount"],
                "package_info": package
            }

        except Exception as e:
            logger.error(f"❌ Stripe checkout session creation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def check_payment_status(self, session_id: str) -> Dict:
        """Check payment status for session"""
        try:
            session = stripe.checkout.Session.retrieve(session_id)

            return {
                "success": True,
                "status": session.status,
                "payment_status": session.payment_status,
                "amount_total": session.amount_total,
                "currency": session.currency,
                "metadata": session.metadata or {}
            }

        except Exception as e:
            logger.error(f"❌ Stripe payment status check failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def handle_webhook(self, request_body: bytes, stripe_signature: str, webhook_secret: str) -> Dict:
        """Handle Stripe webhook"""
        try:
            # Verify webhook signature
            event = stripe.Webhook.construct_event(
                request_body,
                stripe_signature,
                webhook_secret
            )

            # Process the event
            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                return {
                    "success": True,
                    "event_type": event['type'],
                    "event_id": event['id'],
                    "session_id": session.get('id'),
                    "payment_status": session.get('payment_status'),
                    "metadata": session.get('metadata', {})
                }
            elif event['type'] == 'checkout.session.expired':
                session = event['data']['object']
                return {
                    "success": True,
                    "event_type": event['type'],
                    "event_id": event['id'],
                    "session_id": session.get('id'),
                    "payment_status": "expired",
                    "metadata": session.get('metadata', {})
                }
            else:
                # Unhandled event type
                logger.info(f"Unhandled Stripe webhook event: {event['type']}")
                return {
                    "success": True,
                    "event_type": event['type'],
                    "event_id": event['id'],
                    "session_id": None,
                    "payment_status": "unknown",
                    "metadata": {}
                }

        except ValueError as e:
            logger.error(f"❌ Invalid Stripe webhook signature: {str(e)}")
            return {
                "success": False,
                "error": "Invalid signature"
            }
        except Exception as e:
            logger.error(f"❌ Stripe webhook handling failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def get_packages(self) -> Dict:
        """Get available payment packages"""
        return {
            "packages": self.PAYMENT_PACKAGES,
            "currency": "USD",
            "tax_info": "Taxes calculated at checkout"
        }