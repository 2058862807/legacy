# 🚨 PRODUCTION DEPLOYMENT DEBUG GUIDE

## **CURRENT STATUS: 502 ERROR ON RAILWAY**

**Problem:** Both https://api.nexteraestate.com/health and https://api.nexteraestate.com/v1/diagnostics return 502 Bad Gateway

## **IMMEDIATE ACTION REQUIRED:**

### **1. Check Railway Deploy Logs**
```bash
# Go to Railway Dashboard → Your Service → Deploy tab
# Look for these specific errors:
```

**Common Error Patterns to Look For:**
- `ModuleNotFoundError: No module named 'main'`
- `uvicorn: command not found`
- `Port already in use`
- `Application startup failed`
- `Import error`

### **2. Verify Railway Settings (CRITICAL)**

**Go to Railway Dashboard → Settings:**

✅ **Root Directory**: `backend`
✅ **Build Command**: `pip install -r requirements.txt`  
✅ **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
✅ **Deploy Method**: Nixpacks (or auto-detect)

### **3. Verify File Structure on Railway**

**Expected structure in Railway:**
```
backend/
├── main.py          ← Must contain app = FastAPI()
├── requirements.txt ← Must contain fastapi + uvicorn
└── Procfile        ← Backup: web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### **4. Environment Variables on Railway**

**Required Variables:**
```
PORT=8000
AI_ENABLED=false
BLOCKCHAIN_ENABLED=false
COMPLIANCE_ENABLED=true
POLYGON_NETWORK=mainnet
POLYGON_CHAIN_ID=0x89
CORS_ORIGINS=https://www.nexteraestate.com
PYTHONPATH=/app
```

## **MANUAL VERIFICATION STEPS:**

### **Step 1: Commit Hash Verification**
```bash
# In your local repo:
git log --oneline -1

# Compare with Railway Dashboard → Deploy tab → Latest deploy commit
# They MUST match
```

### **Step 2: Railway Deploy Logs Analysis**
```bash
# Look for successful startup message:
🚀 NexteraEstate API Server Starting...
📍 Network: mainnet (Chain ID: 0x89)
🎛️  Feature Flags: AI=False, Blockchain=False, Compliance=True
INFO: Uvicorn running on http://0.0.0.0:8000
```

### **Step 3: Test Local Deployment**
```bash
cd backend
python main.py
# Should show the startup message above
```

## **QUICK FIXES TO TRY:**

### **Fix 1: Redeploy with Correct Settings**
1. Go to Railway → Settings → Deploy
2. Set Root Directory to: `backend`
3. Set Start Command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Redeploy

### **Fix 2: Force Railway to Use Nixpacks**
1. Delete any Dockerfile in root directory
2. Ensure only Python files in backend/
3. Redeploy

### **Fix 3: Clear Railway Cache**
1. Delete the service completely  
2. Create new service
3. Connect same GitHub repo
4. Set settings above
5. Deploy

## **SUCCESS INDICATORS:**

**After successful deploy, these should work:**
- ✅ https://api.nexteraestate.com/health → `{"status":"ok"}`
- ✅ https://api.nexteraestate.com/v1/health → `{"status":"ok","version":"v1"}`
- ✅ https://api.nexteraestate.com/v1/diagnostics → Route list

## **NEXT STEPS AFTER BACKEND IS FIXED:**

1. **Frontend Verification (Vercel)**
2. **Production Smoke Tests**  
3. **Payment System Testing**
4. **Security Testing**
5. **Monitoring Setup**

**PRIORITY: Fix Railway deployment first - everything else depends on it!**