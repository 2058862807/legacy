# 🚨 PRODUCTION SMOKE TEST SCRIPT

## **RUN AFTER RAILWAY BACKEND IS FIXED**

### **1. Automated Smoke Test**
```bash
# Run our comprehensive smoke test against production:
bash /app/scripts/api_smoke.sh https://api.nexteraestate.com

# Save output to file:
bash /app/scripts/api_smoke.sh https://api.nexteraestate.com > production_smoke_results.txt 2>&1

# Expected result: 15/15 tests PASSED
```

### **2. Critical Endpoint Manual Tests**
```bash
# Health check
curl -s https://api.nexteraestate.com/health
# Expected: {"status":"ok"}

# V1 Health  
curl -s https://api.nexteraestate.com/v1/health
# Expected: {"status":"ok","version":"v1"}

# Diagnostics (most important)
curl -s https://api.nexteraestate.com/v1/diagnostics | jq '{ok, version, total_routes}'
# Expected: {"ok":true,"version":"v1","total_routes":27}

# Business endpoint
curl -s "https://api.nexteraestate.com/v1/documents/list?user_email=test@example.com"
# Expected: JSON array with sample documents

# API compatibility shim
curl -s "https://api.nexteraestate.com/api/documents/list?user_email=test@example.com"  
# Expected: Same JSON array (proving /api/* → /v1/* redirect works)
```

### **3. Payment Endpoints Test**
```bash
# Stripe checkout endpoint
curl -s -X POST https://api.nexteraestate.com/v1/payments/checkout \
  -H "Content-Type: application/json" \
  -d '{"price_id":"price_test","success_url":"https://www.nexteraestate.com/success"}'
# Expected: {"session_url":"https://checkout.stripe.com/...","session_id":"cs_...","status":"created"}

# Stripe webhook endpoint  
curl -s -X POST https://api.nexteraestate.com/v1/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed","id":"evt_test_123"}'
# Expected: {"received":true,"event_id":"evt_test_123"}
```

### **4. AI Bot Test (Feature Flag)**
```bash
# AI bot (should be disabled)
curl -s -X POST https://api.nexteraestate.com/v1/ai/esquire \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is estate planning?"}'
# Expected: {"error":"AI features are currently disabled","status":"disabled","coming_soon":true}
```

## **SUCCESS CRITERIA:**

### **Must Pass:**
- ✅ All 15 smoke tests pass
- ✅ Health endpoints return 200
- ✅ Diagnostics shows 27 routes
- ✅ Business endpoints return data
- ✅ API shim redirects working
- ✅ Payment endpoints respond correctly
- ✅ AI bot shows "disabled" gracefully

### **Response Time Criteria:**
- ✅ Health endpoints: < 500ms
- ✅ Business endpoints: < 2000ms
- ✅ Payment endpoints: < 1000ms

## **SAVE ALL OUTPUT:**
```bash
# Create comprehensive test report:
echo "PRODUCTION SMOKE TEST REPORT - $(date)" > production_test_report.txt
echo "========================================" >> production_test_report.txt
bash /app/scripts/api_smoke.sh https://api.nexteraestate.com >> production_test_report.txt
echo "========================================" >> production_test_report.txt
echo "Manual endpoint tests:" >> production_test_report.txt
curl -s https://api.nexteraestate.com/v1/diagnostics >> production_test_report.txt
```

## **IF TESTS FAIL:**
1. Note the failing endpoint URL
2. Note the HTTP status code  
3. Note the error message
4. Provide these 3 items for immediate debugging