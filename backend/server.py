import os
import stripe
import hashlib
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from web3 import Web3
import openai

# Environment variables
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
POLYGON_RPC_URL = os.environ.get('POLYGON_RPC_URL', 'https://rpc-amoy.polygon.technology')
POLYGON_PRIVATE_KEY = os.environ.get('POLYGON_PRIVATE_KEY')
NOTARY_CONTRACT_ADDRESS = os.environ.get('NOTARY_CONTRACT_ADDRESS')

# Initialize services
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CheckoutRequest(BaseModel):
    planId: str

class BotRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = []

class HashRequest(BaseModel):
    content: str

class NotarizeRequest(BaseModel):
    hash: str

class BotResponse(BaseModel):
    reply: str
    escalate: Optional[bool] = False

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# Stripe Payments
@app.post("/api/payments/create-checkout")
async def create_checkout_session(request: CheckoutRequest):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    plans = {
        'basic': {'price': 2999, 'name': 'Basic Will'},
        'premium': {'price': 4999, 'name': 'Premium Will'},
        'full': {'price': 9999, 'name': 'Full Estate Plan'}
    }
    
    plan = plans.get(request.planId)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': plan['name'],
                        'description': f'NexteraEstate {plan["name"]} Plan'
                    },
                    'unit_amount': plan['price'],
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://nexteraestate.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://nexteraestate.com/checkout/cancel',
            metadata={'planId': request.planId}
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/payments/status")
async def payment_status(session_id: str):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.payment_status,
            "planId": session.metadata.get('planId')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Bot endpoints
@app.post("/api/bot/help", response_model=BotResponse)
async def help_bot(request: BotRequest):
    if not OPENAI_API_KEY:
        return BotResponse(
            reply="I'm here to help with estate planning questions! However, AI services are currently unavailable. Please contact our support team.",
            escalate=False
        )
    
    try:
        messages = [
            {"role": "system", "content": "You are a helpful estate planning assistant. Provide helpful, accurate information about wills, trusts, and estate planning. If asked about specific legal advice, recommend consulting with a qualified attorney."},
            {"role": "user", "content": request.message}
        ]
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        
        reply = response.choices[0].message.content
        
        # Check if escalation is needed based on keywords
        escalate_keywords = ['emergency', 'urgent', 'dying', 'hospital', 'immediate']
        escalate = any(keyword in request.message.lower() for keyword in escalate_keywords)
        
        return BotResponse(reply=reply, escalate=escalate)
        
    except Exception as e:
        return BotResponse(
            reply="I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.",
            escalate=False
        )

@app.post("/api/bot/grief", response_model=BotResponse)
async def grief_bot(request: BotRequest):
    # Crisis resources message for first interaction
    crisis_resources = """
    I understand you may be going through a difficult time. Here are some crisis resources:
    
    • National Suicide Prevention Lifeline: 988
    • Crisis Text Line: Text HOME to 741741
    • National Alliance on Mental Illness: 1-800-950-6264
    
    Please note: I cannot provide medical advice. For emergencies, call 911.
    
    I'm here to listen and provide support regarding grief and estate planning concerns.
    """
    
    if not OPENAI_API_KEY:
        return BotResponse(
            reply=crisis_resources + "\n\nAI services are currently unavailable, but please reach out to our human support team.",
            escalate=True
        )
    
    try:
        messages = [
            {"role": "system", "content": "You are a compassionate grief support assistant focused on estate planning after loss. Provide empathetic, supportive responses. Never give medical advice. If someone mentions self-harm, suicidal thoughts, or immediate danger, always escalate. Focus on practical estate planning support during grief."},
            {"role": "user", "content": request.message}
        ]
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200,
            temperature=0.6
        )
        
        reply = response.choices[0].message.content
        
        # Check for crisis indicators
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself']
        escalate = any(keyword in request.message.lower() for keyword in crisis_keywords)
        
        return BotResponse(reply=reply, escalate=escalate)
        
    except Exception as e:
        return BotResponse(
            reply="I'm sorry you're going through this difficult time. While I'm having technical difficulties right now, please know that support is available. Consider reaching out to the crisis resources listed above or our support team.",
            escalate=True
        )

# Blockchain Notarization
@app.post("/api/notary/hash")
async def generate_hash(request: HashRequest):
    """Generate SHA256 hash of content"""
    try:
        content_bytes = request.content.encode('utf-8')
        hash_object = hashlib.sha256(content_bytes)
        hex_hash = hash_object.hexdigest()
        return {"hash": hex_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notary/create")
async def create_notarization(request: NotarizeRequest):
    """Send transaction to Polygon blockchain"""
    if not POLYGON_PRIVATE_KEY or not NOTARY_CONTRACT_ADDRESS:
        raise HTTPException(status_code=500, detail="Blockchain services not configured")
    
    try:
        # For demo purposes, return mock transaction data
        # In production, this would interact with actual Polygon network
        mock_tx_hash = f"0x{''.join([hex(ord(c))[2:] for c in request.hash[:32]])}"
        explorer_url = f"https://amoy.polygonscan.com/tx/{mock_tx_hash}"
        
        return {
            "txHash": mock_tx_hash,
            "explorerUrl": explorer_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/notary/status")
async def get_notary_status(tx: str):
    """Check transaction status on blockchain"""
    try:
        # Mock response for demo - in production would query actual blockchain
        return {
            "confirmations": 12,
            "status": "confirmed",
            "blockNumber": 12345678
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)