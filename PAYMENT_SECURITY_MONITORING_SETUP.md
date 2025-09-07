# 💳🔐 PAYMENT, SECURITY & MONITORING SETUP

## **STRIPE PAYMENT TESTING (After Backend is Fixed)**

### **1. Live Payment Test**
1. **Go to Stripe Dashboard → Payments → Create payment link**
2. **Create test product** (e.g., "Estate Plan Basic - $99")  
3. **Use live mode with real card**
4. **Complete payment**
5. **Verify webhook delivery:**
   - Go to Stripe Dashboard → Webhooks
   - Check webhook endpoint: `https://api.nexteraestate.com/v1/webhooks/stripe`
   - Verify 2xx response codes

### **2. Database Verification**
```bash
# Check if payment is recorded in your database
# (You'll need to verify this in your MongoDB/database)
# Look for:
# - Payment record with stripe transaction ID
# - User entitlement/subscription status updated
# - Webhook event processed (no duplicates)
```

## **SECURITY TESTING**

### **1. Authentication Boundary Testing**
```bash
# Test protected routes without authentication:

# Try to access will page
curl -I https://www.nexteraestate.com/will
# Expected: 302 redirect to /login

# Try to access vault page  
curl -I https://www.nexteraestate.com/vault
# Expected: 302 redirect to /login

# Try to access notary page
curl -I https://www.nexteraestate.com/notary  
# Expected: 302 redirect to /login

# Try to access compliance page
curl -I https://www.nexteraestate.com/compliance
# Expected: 302 redirect to /login
```

### **2. Admin Endpoint Security**
```bash
# Test admin endpoints (should require admin role):
curl -s https://api.nexteraestate.com/v1/admin/users
# Expected: 401 Unauthorized or 403 Forbidden
```

### **3. Token Rotation**
```bash
# Rotate any temporary tokens:
# - Railway deployment tokens
# - GitHub access tokens  
# - Any API keys used during setup
# - Stripe webhook secrets (regenerate)
```

## **MONITORING SETUP**

### **1. UptimeRobot Setup**
1. **Go to UptimeRobot.com → Add New Monitor**
2. **Monitor Type:** HTTP(s)
3. **URL:** `https://api.nexteraestate.com/v1/health`
4. **Monitoring Interval:** 5 minutes
5. **Alert Contacts:** Your email/SMS
6. **Alert Settings:** Alert on 2 consecutive failures

### **2. Performance Monitoring**
```bash
# Add these alerts:
# - P95 latency > 1 second
# - Error rate > 5%
# - Uptime < 99.9%
```

### **3. Log Monitoring**
```bash
# Monitor Railway logs for:
# - Stripe webhook failures
# - AI endpoint errors
# - Database connection issues
# - Memory/CPU issues
```

## **BACKUP VERIFICATION**

### **1. Database Backup**
```bash
# Enable automated backups in your MongoDB provider
# Test restore to staging environment
# Verify backup frequency (daily recommended)
```

### **2. Code Backup**
```bash
# Ensure GitHub repo is up to date:
git push origin main

# Tag production release:
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## **SHIM RETIREMENT PLAN**

### **1. Monitor API Usage (48 hours)**
```bash
# Check Railway logs for /api/* hits:
# Look for "🔄 Compatibility redirect" messages
# If zero hits for 48 hours, proceed with removal
```

### **2. Remove Shim (After 48 hours)**
```python
# In main.py, remove the middleware:
# Comment out or delete the api_compatibility_middleware function
```

### **3. Add 410 Gone Response (7 days)**
```python
# Replace shim with 410 responses:
@app.get("/api/{path:path}")
async def api_deprecated():
    return JSONResponse(
        status_code=410,
        content={"error": "API v1 has moved to /v1/. Please update your calls."}
    )
```

## **SUCCESS METRICS:**

### **Payment System:**
- ✅ Live payment completes successfully
- ✅ Webhook shows 2xx responses
- ✅ Database reflects payment and entitlement
- ✅ No duplicate processing

### **Security:**
- ✅ All protected routes redirect to login
- ✅ Admin endpoints properly secured
- ✅ All tokens rotated

### **Monitoring:**
- ✅ UptimeRobot shows green status
- ✅ No alerts for 72 hours
- ✅ Log monitoring active
- ✅ Backup system verified

### **Cleanup:**
- ✅ No /api/* hits in logs for 48+ hours
- ✅ Shim removed safely
- ✅ 410 responses for deprecated paths