import os, stripe
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckoutIn(BaseModel):
    planId: str

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/api/user/dashboard-stats")
def dashboard_stats():
    return {
        "compliance": {"percent": 85, "state": "CA"},
        "documents": [{"name": "Will.pdf", "status": "Valid"}],
        "recentActivity": [{"action": "Document uploaded", "details": "Will_v3.pdf", "timestamp": 1724670000000}]
    }

@app.post("/api/payments/create-checkout")
def create_checkout(payload: CheckoutIn):
    prices = {
        "basic": {"name": "Basic Will", "amount": 2999},
        "premium": {"name": "Premium Will", "amount": 4999},
        "full": {"name": "Full Estate Plan", "amount": 9999},
    }
    plan = prices.get(payload.planId)
    if not plan:
        raise HTTPException(status_code=400, detail="invalid_plan")

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": plan["name"]},
                    "unit_amount": plan["amount"],
                },
                "quantity": 1,
            }],
            success_url=f"{FRONTEND_BASE_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_BASE_URL}/checkout/cancel",
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/payments/status")
def payment_status(session_id: str):
    try:
        sess = stripe.checkout.Session.retrieve(session_id)
        return {"status": sess.status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    if not STRIPE_WEBHOOK_SECRET:
        return {"received": True}
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"received": True}
