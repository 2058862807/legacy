# 🔧 URGENT FIX: Vercel Double "web/web" Path Error

## ❌ Current Error
```
The file "/vercel/path0/web/web/.next/routes-manifest.json" couldn't be found
```

## ✅ Root Cause
Vercel project settings have incorrect configuration causing double "web" paths.

## 🚨 IMMEDIATE FIX STEPS

### Step 1: Go to Vercel Dashboard Settings
1. Open your Vercel project
2. Go to **Settings** → **General**
3. Look for **Root Directory** setting

### Step 2: Fix Root Directory Setting
**Current Setting (WRONG):**
- Root Directory: `web/web` or nested path

**Correct Setting:**
- Root Directory: `web` (exactly this, no slashes, no nesting)

### Step 3: Clear Everything and Redeploy
1. **Settings** → **Functions** → **Clear All Cache**
2. **Settings** → **Build & Development Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: web
   Install Command: npm install
   Build Command: npm run build  
   Output Directory: .next
   Node.js Version: 20.x
   ```

### Step 4: Environment Variables
Add these in **Settings** → **Environment Variables**:
```bash
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com
NEXTAUTH_URL=https://nexteraestate.com
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
```

### Step 5: Force Fresh Deployment
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Check **"Use existing Build Cache"** = ❌ UNCHECKED
4. Click **Redeploy**

## 🔍 Alternative Solution (If Above Doesn't Work)

### Option A: Create New Vercel Project
1. **Delete current Vercel project**
2. **Import fresh** from GitHub
3. During setup:
   - Framework: Next.js
   - Root Directory: `web`
   - Add environment variables

### Option B: Manual Import Structure
1. Create empty Vercel project
2. Connect to GitHub repo
3. **During initial setup**, set Root Directory to `web`
4. Do NOT change it after creation

## ✅ Expected Result
After fix, Vercel should look for:
```
/vercel/path0/web/.next/routes-manifest.json  ✅ CORRECT
```

NOT:
```
/vercel/path0/web/web/.next/routes-manifest.json  ❌ WRONG
```

## 🚨 Critical Points
- Root Directory must be exactly: `web`
- No trailing slashes: `/web/` ❌
- No leading slashes: `/web` ❌  
- No nesting: `web/web` ❌
- Just: `web` ✅

The build will succeed once Vercel stops looking for the double path!