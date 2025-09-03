#!/usr/bin/env python3
"""
Quick verification of the numpy.float32 fix for AI bot endpoints
"""

import requests
import json

BACKEND_URL = "http://localhost:8001"

def test_endpoint(name, method, endpoint, data=None, params=None):
    try:
        url = f"{BACKEND_URL}{endpoint}"
        if method == "POST":
            response = requests.post(url, json=data, params=params, timeout=10)
        else:
            response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            print(f"✅ {name}: SUCCESS (200)")
            return True
        else:
            print(f"❌ {name}: FAILED ({response.status_code})")
            return False
    except Exception as e:
        print(f"❌ {name}: ERROR - {str(e)}")
        return False

print("🔧 Quick Fix Verification - AI Bot Endpoints")
print("=" * 50)

# Create test user first
user_data = {
    "email": "fix.test@nexteraestate.com",
    "name": "Fix Test User",
    "provider": "google"
}
test_endpoint("User Creation", "POST", "/api/users", user_data)

# Test the previously failing endpoints
help_data = {
    "message": "What are the requirements for creating a will in California?",
    "user_email": "fix.test@nexteraestate.com"
}

grief_data = {
    "message": "I need help dealing with estate matters after a loss",
    "user_email": "fix.test@nexteraestate.com"
}

rag_data = {
    "message": "What are the legal requirements for will execution?",
    "user_email": "fix.test@nexteraestate.com"
}

print("\nTesting previously failing endpoints:")
help_success = test_endpoint("Help Bot", "POST", "/api/bot/help", help_data, {"user_email": "fix.test@nexteraestate.com"})
grief_success = test_endpoint("Grief Bot", "POST", "/api/bot/grief", grief_data, {"user_email": "fix.test@nexteraestate.com"})
rag_success = test_endpoint("RAG Legal Analysis", "POST", "/api/rag/legal-analysis", rag_data, {"user_email": "fix.test@nexteraestate.com"})

print("\n" + "=" * 50)
if help_success and grief_success:
    print("✅ FIX SUCCESSFUL: AI bot endpoints are now working!")
else:
    print("❌ FIX INCOMPLETE: Some endpoints still failing")

if rag_success:
    print("✅ BONUS: RAG endpoint also working!")
else:
    print("⚠️ RAG endpoint still has issues (may need user_email in body)")