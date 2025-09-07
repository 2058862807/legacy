# 🌐 VERCEL FRONTEND VERIFICATION GUIDE

## **VERCEL ENVIRONMENT VARIABLES CHECK**

### **Required Variables (ONLY THESE):**
```bash
NEXT_PUBLIC_API_URL=https://api.nexteraestate.com
NEXTAUTH_URL=https://www.nexteraestate.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_public_key
```

### **Variables to REMOVE (if present):**
```bash
API_BASE_URL                    ← DELETE
NEXT_PUBLIC_API_BASE           ← DELETE  
NEXT_PUBLIC_BACKEND_BASE_URL   ← DELETE
REACT_APP_BACKEND_URL          ← DELETE
```

## **VERIFICATION STEPS:**

### **1. Check Vercel Dashboard**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify only the 3 required variables above are set
3. Delete any extra/old variables

### **2. Redeploy Frontend**
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on latest deployment
3. Wait for build to complete

### **3. Test Frontend Environment**
```bash
# After deployment, open browser console on your site:
console.log(process.env.NEXT_PUBLIC_API_URL)
# Should show: https://api.nexteraestate.com
```

## **SUCCESS INDICATORS:**

### **Frontend Should:**
- ✅ Load without errors
- ✅ Show correct API base URL in console
- ✅ Make calls to https://api.nexteraestate.com/v1/* (once backend is fixed)
- ✅ Redirect to login when accessing /will, /vault, /notary, /compliance without auth

### **DevTools Network Tab Should Show:**
- ✅ All API calls to `https://api.nexteraestate.com/v1/*`
- ✅ No calls to `/api/*` (all converted to `/v1/*`)
- ✅ No 404 or 502 errors (once backend is fixed)

## **COMMON ISSUES:**

### **Issue 1: Old Environment Variables**
**Solution:** Clean up Vercel environment variables, keep only the 3 required ones

### **Issue 2: Cached Old API Calls**  
**Solution:** Hard refresh (Ctrl+Shift+R), unregister service workers

### **Issue 3: Build-time Environment Issues**
**Solution:** Redeploy with clean environment variables

## **POST-BACKEND-FIX TESTING:**

Once Railway backend is working, test these frontend flows:
1. Homepage loads
2. Login/logout works
3. Protected pages redirect properly
4. API calls succeed (no 404/502)
5. Payment checkout initiates correctly