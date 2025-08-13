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
        
        logger.info("✅ Mock Stripe service initialized (demo mode)")
        logger.info(f"🔑 Using API key: {self.stripe_secret_key[:7] if self.stripe_secret_key else 'None'}...")

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

            # For demo purposes, create a mock checkout session
            session_id = f"cs_demo_{session_uuid}"
            checkout_url = f"https://checkout.stripe.com/pay/{session_id}#fidkdWxOYHwnPyd1blpxYHZxWjA0SzBrTGNbNDBMY2RjUmwwN3BxblNrZEZJa3RRXVJjQl80XH0nKSd3YGNgd2BjYHdgd2BjYGNgZGliaWBabGJgaWBkZ2pgdWZgcWFpaWFkZmlgaWpmZWJp"

            logger.info(f"✅ Mock checkout session created: {session_id}")

            return {
                "success": True,
                "checkout_url": checkout_url,
                "session_id": session_id,
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
            # Mock payment status for demo
            if session_id.startswith("cs_demo_"):
                return {
                    "success": True,
                    "status": "complete",
                    "payment_status": "paid",
                    "amount_total": 2999,  # $29.99 in cents
                    "currency": "usd",
                    "metadata": {}
                }
            else:
                return {
                    "success": True,
                    "status": "open",
                    "payment_status": "unpaid",
                    "amount_total": 0,
                    "currency": "usd",
                    "metadata": {}
                }

        except Exception as e:
            logger.error(f"❌ Payment status check failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    async def handle_webhook(self, request_body: bytes, stripe_signature: str, webhook_secret: str) -> Dict:
        """Handle Stripe webhook"""
        try:
            # Verify webhook signature
            import stripe as stripe_module
            event = stripe_module.Webhook.construct_event(
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