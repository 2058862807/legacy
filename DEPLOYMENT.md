# NexteraEstate Deployment Guide

## Frontend - Vercel Configuration

### Project Settings
- **Root Directory**: `web`
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: `20`

### Environment Variables
Add these to your Vercel project settings:

```bash
NEXTAUTH_URL=https://nexteraestate.com
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
```

### Domain Configuration
- **Primary Domain**: Attach `nexteraestate.com` to the Vercel project
- **DNS Settings**:
  - Apex A record → `76.76.21.21`
  - www CNAME → `cname.vercel-dns.com`

## Backend - Railway Configuration

### Service Settings
- **Service Root**: `backend` folder
- **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Python Version**: `3.11`

### Environment Variables
Add these to your Railway service:

```bash
FRONTEND_BASE_URL=https://nexteraestate.com
ALLOWED_ORIGIN=https://nexteraestate.com
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
OPENAI_API_KEY=sk-your-openai-key
DEEPSEEK_API_KEY=your-deepseek-key
DATABASE_URL=postgres://... (optional)
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured in both services
- [ ] API keys obtained and added to environment
- [ ] Domain DNS records configured
- [ ] Railway backend service deployed first

### Post-deployment
- [ ] Clear Vercel build cache and redeploy if needed
- [ ] Test health endpoints:
  - `GET https://api.nexteraestate.com/health` → `{"ok": true}`
  - `GET https://nexteraestate.com/api/auth/providers` → Google provider
- [ ] Test payment flow on `/pricing` page
- [ ] Verify all API routes work correctly

## Build Verification Commands

From the `web` directory:

```bash
# Check TypeScript configuration
npx tsc --showConfig

# Verify build succeeds
npm run build

# Check that path aliases work
node -c "import('@/lib/api')"
```

## Troubleshooting

### Common Issues
1. **Module resolution errors**: Ensure `tsconfig.json` has correct `baseUrl` and `paths`
2. **API connection errors**: Verify `NEXT_PUBLIC_BACKEND_BASE_URL` is set correctly
3. **Build cache issues**: Clear Vercel build cache and redeploy
4. **CORS errors**: Check backend `ALLOWED_ORIGIN` matches frontend domain

### File Structure (Cleaned)
```
/app/
├── backend/              # FastAPI service (Railway)
│   ├── requirements.txt
│   ├── Procfile
│   └── server.py
└── web/                  # Next.js frontend (Vercel)
    ├── app/             # Next.js 14 app directory
    ├── components/      # React components
    ├── lib/             # Utilities and API helpers
    ├── public/          # Static assets
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.js
    └── .env.example     # Environment template
```