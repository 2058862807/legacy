# NexteraEstate Production Deployment Guide

## Frontend - Vercel Deployment

### Project Configuration
```bash
Project Root Directory: web
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

### Production Environment Variables
```
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com
NEXTAUTH_URL=https://nexteraestate.com
NEXTAUTH_SECRET=<32-byte-random-string>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Preview Environment Variables
```
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com
NEXTAUTH_URL=<exact-preview-url>
NEXTAUTH_SECRET=<same-as-production>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

## Backend - Railway Deployment

### Start Command
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Environment Variables
```
FRONTEND_ORIGIN=https://nexteraestate.com
DATABASE_URL=<postgresql-connection-string>
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
LLM_PROVIDER=gemini
GEMINI_API_KEY=<gemini-api-key>
EMERGENT_LLM_KEY=<emergent-llm-key>
COMPLIANCE_ENABLED=true
POLYGON_RPC_URL=<polygon-rpc-url>
POLYGON_PRIVATE_KEY=<polygon-private-key>
NOTARY_CONTRACT_ADDRESS=<contract-address>
POLYGON_CHAIN_ID=80002
```

### Custom Domain
```
api.nexteraestate.com
```

## Google OAuth Configuration

### Consent Screen
- Type: External
- Support email: support@nexteraestate.com

### Authorized JavaScript Origins
```
https://nexteraestate.com
https://www.nexteraestate.com
<preview-url>
http://localhost:3000
```

### Authorized Redirect URIs
```
https://nexteraestate.com/api/auth/callback/google
https://www.nexteraestate.com/api/auth/callback/google
<preview-url>/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

## Stripe Configuration

### Webhook Endpoint
```
https://api.nexteraestate.com/api/stripe/webhook
```

### Success/Cancel URLs
```
Success: https://nexteraestate.com/checkout/success
Cancel: https://nexteraestate.com/checkout/cancel
```

## DNS Configuration (Namecheap)

### A Record
```
@ → 76.76.21.21
```

### CNAME Records
```
www → cname.vercel-dns.com
api → <railway-host>
```

## Frontend Environment Variables for Polygon

### Production `.env.production`
```
NEXT_PUBLIC_NOTARY_ADDRESS=<contract-address>
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_EXPLORER=https://polygonscan.com
```

## Definition of Done Checklist

- [ ] https://api.nexteraestate.com/health returns OK
- [ ] Styled pages load on mobile and desktop
- [ ] Google login works on preview and production
- [ ] Stripe test checkout opens
- [ ] Notary submits and shows Polygonscan link
- [ ] Compliance page shows rules and citations
- [ ] Lighthouse score 85+ on homepage
- [ ] No console errors