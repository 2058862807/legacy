# NexteraEstate Vercel Deployment Guide

## 🔧 Fixed Configuration

The double "web/web" path error has been resolved by:
1. Removing root-level `vercel.json`
2. Adding `vercel.json` inside the `web/` directory
3. Using relative imports instead of path aliases

## 🚀 Deployment Steps

### 1. Vercel Project Settings
```yaml
Framework Preset: Next.js
Root Directory: web
Install Command: npm install
Build Command: npm run build
Output Directory: .next
Node.js Version: 20.x
```

### 2. Environment Variables (in Vercel Dashboard)
```bash
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com
NEXTAUTH_URL=https://nexteraestate.com
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
```

### 3. Deploy Process
1. **Connect Repository**: Link your Git repo to Vercel
2. **Set Root Directory**: Go to Settings → General → Root Directory → Set to `web`
3. **Clear Cache**: Settings → Functions → Clear All Cache
4. **Add Environment Variables**: Settings → Environment Variables → Add all variables above
5. **Deploy**: Trigger a new deployment

### 4. DNS Configuration (Namecheap)
```bash
A     nexteraestate.com        76.76.21.21
CNAME www                      cname.vercel-dns.com
CNAME api                      your-backend-host
```

## ✅ Verification Checklist
- [ ] Build succeeds locally: `cd web && npm run build`
- [ ] Root directory set to `web` in Vercel
- [ ] Environment variables configured
- [ ] No double `web/web` paths in build logs
- [ ] All routes accessible after deployment

## 🔍 If Issues Persist
1. Check Vercel build logs for exact error
2. Verify root directory is set to `web` (not empty)
3. Ensure no conflicting vercel.json files
4. Clear build cache and redeploy