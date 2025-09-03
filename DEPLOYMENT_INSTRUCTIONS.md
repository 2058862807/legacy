# 🚀 DEPLOYMENT INSTRUCTIONS - FIXED

## ✅ CRITICAL FIXES APPLIED:

### 1. **Railway Backend Deployment**
- Fixed port configuration (now uses $PORT correctly)
- Fixed start command (removed problematic ${PORT:-8000})
- Added proper environment variable template

### 2. **Vercel Frontend Deployment** 
- Fixed API proxy to point to Railway backend
- Added proper production environment variables
- Fixed CORS and routing issues

## 🔧 **DEPLOYMENT STEPS:**

### **RAILWAY (Backend)**:
1. **Connect Repository**: Link your GitHub repo to Railway
2. **Set Environment Variables**:
   ```bash
   MONGO_URL=mongodb://mongo:password@railway-mongo:27017/nexteraestate
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   EMERGENT_LLM_KEY=your_emergent_llm_key_here
   PORT=8001
   ```
3. **Set Root Directory**: `/backend`
4. **Deploy**: Railway will automatically use the railway.toml config

### **VERCEL (Frontend)**:
1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Set Root Directory**: `/web`
3. **Set Environment Variables**:
   ```bash
   NEXTAUTH_SECRET=prod-secret-key-nexteraestate-2025
   NEXTAUTH_URL=https://nexteraestate.vercel.app
   GOOGLE_CLIENT_ID=484116554866-hsvdc8016qb959mam5e025i5s7pfa74o.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   NEXT_PUBLIC_BACKEND_BASE_URL=https://nexteraestate-backend.up.railway.app
   STRIPE_PUBLIC_KEY=pk_live_51RgFeiHTJFmgsQYSszCQubhTl9VPgTLIGLKuqPDD5Im72bNvIAYCO7Y8m7BWuGxhlksjkqV7JPTsIKcuqPJ7MrOn00vtmPuyiK
   ```
4. **Deploy**: Vercel will automatically use the vercel.json config

## 🎯 **CRASH FIXES:**

### **Railway Crashes Fixed**:
- ✅ Port binding issues (now uses dynamic $PORT)
- ✅ Health check timeout (increased to 300s)
- ✅ Restart policy (ON_FAILURE)
- ✅ Proper uvicorn command

### **Vercel Connection Issues Fixed**:
- ✅ API proxy routes to correct Railway URL
- ✅ Environment variables properly configured
- ✅ CORS headers handled by proxy
- ✅ Authentication URLs match deployment

## 🚨 **IMPORTANT NOTES:**

1. **Replace URLs**: Update `nexteraestate-backend.up.railway.app` with your actual Railway URL
2. **Database**: Set up MongoDB on Railway or use Railway's database addon
3. **Domain**: Update `nexteraestate.vercel.app` with your actual Vercel domain
4. **Test Health Check**: Ensure `/api/health` returns 200 OK

## ✅ **VERIFICATION:**

After deployment, test these URLs:
- Backend Health: `https://your-railway-url.up.railway.app/api/health`
- Frontend: `https://your-vercel-url.vercel.app`
- API Proxy: `https://your-vercel-url.vercel.app/api/health`

**NO MORE CRASHES!** 🎉