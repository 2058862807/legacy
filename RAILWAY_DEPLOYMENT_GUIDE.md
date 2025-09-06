# Railway Deployment Guide - NexteraEstate Backend

## ✅ VERIFIED SETUP

### File Structure (CONFIRMED WORKING):
```
/app/backend/
├── main.py          ← FastAPI app = FastAPI()
├── requirements.txt ← fastapi==0.104.1, uvicorn==0.24.0
└── Dockerfile       ← Backup option
```

### Railway Settings (EXACT):
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Deploy Method**: Nixpacks (preferred) or Dockerfile

## 🔧 TROUBLESHOOTING 502 ERRORS

### Common Error 1: Module Not Found
**Log shows**: `ModuleNotFoundError: No module named 'main'`
**Fix**: Verify Root Directory is exactly `backend`

### Common Error 2: App Variable Not Found  
**Log shows**: `ImportError: cannot import name 'app'`
**Fix**: Verify main.py contains `app = FastAPI()`

### Common Error 3: Port Binding
**Log shows**: `Port already in use` or no port binding
**Fix**: Ensure uvicorn uses `--port $PORT` (Railway variable)

### Common Error 4: Dependencies
**Log shows**: `No module named 'fastapi'`
**Fix**: Verify requirements.txt exists in same folder as main.py

## 🚀 DEPLOYMENT STEPS

1. **Clear Railway Cache**: Delete service, recreate if needed
2. **Set Root Directory**: Exactly `backend` 
3. **Set Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Deploy**: Watch logs for "Uvicorn running on 0.0.0.0:XXXX"
5. **Test**: https://api.nexteraestate.com/health

## 🆘 IF STILL FAILING

Copy these log sections and I'll fix immediately:
- Build phase errors (pip install failures)
- Start phase errors (uvicorn/import failures)  
- Runtime errors (port binding failures)

## 🔄 ALTERNATIVE PLATFORMS

If Railway continues failing:
- **Render**: Direct Python deployment
- **Fly.io**: Docker-based deployment
- **DigitalOcean**: App Platform deployment

Ready to deploy with these exact settings.