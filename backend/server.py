import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import stripe
import hashlib
import json
import secrets
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import requests
import openai
from openai import OpenAI
from eth_account import Account
from eth_utils import to_hex
from sqlalchemy.orm import Session

# Import database and compliance
from database import create_tables, get_db, is_database_available
from compliance_service import ComplianceService, ComplianceRuleResponse, ComplianceSummary

# Environment variables
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
POLYGON_RPC_URL = os.environ.get('POLYGON_RPC_URL', 'https://rpc-amoy.polygon.technology')
POLYGON_PRIVATE_KEY = os.environ.get('POLYGON_PRIVATE_KEY')
NOTARY_CONTRACT_ADDRESS = os.environ.get('NOTARY_CONTRACT_ADDRESS')
FRONTEND_ORIGIN = os.environ.get('FRONTEND_ORIGIN', 'https://nexteraestate.com')

# Blockchain utilities
class PolygonBlockchain:
    def __init__(self, rpc_url: str, private_key: str = None):
        self.rpc_url = rpc_url
        self.private_key = private_key
        self.account = Account.from_key(private_key) if private_key else None
    
    async def get_nonce(self, address: str) -> int:
        """Get transaction count for address"""
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionCount",
            "params": [address, "latest"],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"RPC Error: {result['error']}")
        
        return int(result['result'], 16)
    
    async def get_gas_price(self) -> int:
        """Get current gas price"""
        payload = {
            "jsonrpc": "2.0", 
            "method": "eth_gasPrice",
            "params": [],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"RPC Error: {result['error']}")
        
        return int(result['result'], 16)
    
    async def send_transaction(self, to_address: str, data: str = "0x") -> str:
        """Send transaction to blockchain"""
        if not self.account:
            raise Exception("Private key not configured")
        
        # Get nonce and gas price
        nonce = await self.get_nonce(self.account.address)
        gas_price = await self.get_gas_price()
        
        # Build transaction
        transaction = {
            'nonce': nonce,
            'gasPrice': gas_price,
            'gas': 21000,  # Standard gas limit
            'to': to_address,
            'value': 0,
            'data': data,
            'chainId': 80002  # Polygon Amoy testnet
        }
        
        # Sign transaction
        signed_txn = self.account.sign_transaction(transaction)
        
        # Send transaction
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_sendRawTransaction", 
            "params": [signed_txn.rawTransaction.hex()],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"Transaction Error: {result['error']}")
        
        return result['result']
    
    async def get_transaction_status(self, tx_hash: str) -> Dict:
        """Get transaction status and confirmations"""
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt", 
            "params": [tx_hash],
            "id": 1
        }
        
        response = requests.post(self.rpc_url, json=payload)
        result = response.json()
        
        if 'error' in result:
            raise Exception(f"RPC Error: {result['error']}")
        
        receipt = result['result']
        if not receipt:
            return {"status": "pending", "confirmations": 0}
        
        # Get current block number for confirmations
        block_payload = {
            "jsonrpc": "2.0",
            "method": "eth_blockNumber",
            "params": [],
            "id": 1
        }
        
        block_response = requests.post(self.rpc_url, json=block_payload)
        block_result = block_response.json()
        current_block = int(block_result['result'], 16)
        tx_block = int(receipt['blockNumber'], 16)
        confirmations = current_block - tx_block + 1
        
        return {
            "status": "confirmed" if receipt['status'] == '0x1' else "failed",
            "confirmations": confirmations,
            "blockNumber": tx_block,
            "gasUsed": int(receipt['gasUsed'], 16)
        }

# Initialize services
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

# Initialize OpenAI client
openai_client = None
if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Polygon blockchain
polygon = PolygonBlockchain(POLYGON_RPC_URL, POLYGON_PRIVATE_KEY)

app = FastAPI()

# Create database tables on startup
create_tables()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexteraestate.com",
        "https://www.nexteraestate.com", 
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3002",
        "*"  # For development - restrict in production
    ],
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
    return {
        "status": "ok", 
        "timestamp": datetime.utcnow().isoformat(),
        "database": is_database_available(),
        "compliance_enabled": ComplianceService.is_enabled()
    }

# Compliance endpoints
@app.get("/api/compliance/rules", response_model=Optional[ComplianceRuleResponse])
async def get_compliance_rules(
    state: str = Query(..., description="State code (e.g., CA, NY)"),
    doc_type: str = Query(..., description="Document type (e.g., will, pet_trust)"),
    db: Session = Depends(get_db)
):
    """Get compliance rules for specific state and document type"""
    if not ComplianceService.is_enabled():
        raise HTTPException(status_code=503, detail="Compliance service is disabled")
    
    if not is_database_available() or db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    rule = ComplianceService.get_rule(state, doc_type, db)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found for this state and document type")
    
    return rule

@app.get("/api/compliance/summary", response_model=Optional[ComplianceSummary])
async def get_compliance_summary(db: Session = Depends(get_db)):
    """Get compliance summary across all states"""
    if not ComplianceService.is_enabled():
        raise HTTPException(status_code=503, detail="Compliance service is disabled")
    
    if not is_database_available() or db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    summary = ComplianceService.get_summary(db)
    if not summary:
        raise HTTPException(status_code=404, detail="No compliance data available")
    
    return summary

@app.post("/api/compliance/refresh")
async def refresh_compliance_data(db: Session = Depends(get_db)):
    """Refresh compliance data from seed file"""
    if not ComplianceService.is_enabled():
        raise HTTPException(status_code=503, detail="Compliance service is disabled")
    
    if not is_database_available() or db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    result = ComplianceService.refresh_from_seed(db)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result

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

# Stripe webhook endpoint
@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    if not STRIPE_SECRET_KEY or not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Handle successful payment
        print(f"Payment succeeded for session: {session['id']}")
        
    elif event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        print(f"Payment intent succeeded: {payment_intent['id']}")
        
    else:
        print(f'Unhandled event type: {event["type"]}')
    
    return {"received": True}

# Bot endpoints
@app.post("/api/bot/help", response_model=BotResponse)
async def help_bot(request: BotRequest):
    if not openai_client:
        return BotResponse(
            reply="I'm here to help with estate planning questions! However, AI services are currently unavailable. Please contact our support team.",
            escalate=False
        )
    
    try:
        messages = [
            {"role": "system", "content": "You are a helpful estate planning assistant. Provide helpful, accurate information about wills, trusts, and estate planning. If asked about specific legal advice, recommend consulting with a qualified attorney."},
            {"role": "user", "content": request.message}
        ]
        
        response = openai_client.chat.completions.create(
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
    
    if not openai_client:
        return BotResponse(
            reply=crisis_resources + "\n\nAI services are currently unavailable, but please reach out to our human support team.",
            escalate=True
        )
    
    try:
        messages = [
            {"role": "system", "content": "You are a compassionate grief support assistant focused on estate planning after loss. Provide empathetic, supportive responses. Never give medical advice. If someone mentions self-harm, suicidal thoughts, or immediate danger, always escalate. Focus on practical estate planning support during grief."},
            {"role": "user", "content": request.message}
        ]
        
        response = openai_client.chat.completions.create(
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
    if not POLYGON_PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Blockchain services not configured - POLYGON_PRIVATE_KEY required")
    
    try:
        # Create data payload with hash
        # This encodes the hash into the transaction data
        hash_data = f"0x{request.hash}"
        
        # Use a default notarization address if contract not specified
        to_address = NOTARY_CONTRACT_ADDRESS or polygon.account.address
        
        # Send transaction to Polygon
        tx_hash = await polygon.send_transaction(
            to_address=to_address,
            data=hash_data
        )
        
        explorer_url = f"https://amoy.polygonscan.com/tx/{tx_hash}"
        
        return {
            "txHash": tx_hash,
            "explorerUrl": explorer_url,
            "network": "Polygon Amoy Testnet",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")

@app.get("/api/notary/status")
async def get_notary_status(tx: str):
    """Check transaction status on blockchain"""
    if not POLYGON_PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Blockchain services not configured")
    
    try:
        status_info = await polygon.get_transaction_status(tx)
        
        return {
            "txHash": tx,
            "status": status_info["status"],
            "confirmations": status_info["confirmations"], 
            "blockNumber": status_info["blockNumber"],
            "explorerUrl": f"https://amoy.polygonscan.com/tx/{tx}",
            "network": "Polygon Amoy Testnet"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check transaction status: {str(e)}")

@app.get("/api/notary/wallet-info")
async def get_wallet_info():
    """Get wallet information for blockchain transactions"""
    if not POLYGON_PRIVATE_KEY:
        raise HTTPException(status_code=500, detail="Blockchain services not configured")
    
    try:
        address = polygon.account.address
        nonce = await polygon.get_nonce(address)
        gas_price = await polygon.get_gas_price()
        
        return {
            "address": address,
            "nonce": nonce,
            "gasPrice": gas_price,
            "network": "Polygon Amoy Testnet",
            "rpcUrl": POLYGON_RPC_URL
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get wallet info: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))