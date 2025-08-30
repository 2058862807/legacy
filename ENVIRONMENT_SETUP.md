# 🔧 NexteraEstate Environment Variables Setup

## 📋 Required Environment Variables for Vercel

### **Frontend (.env in Vercel Dashboard)**
```bash
# NextAuth Configuration
NEXTAUTH_URL=https://nexteraestate.com
NEXTAUTH_SECRET=generate-a-32-character-random-string-here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Backend API
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com

# Optional: Stripe Public Key
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
```

## 🚀 Required Environment Variables for Railway (Backend)

### **Backend (.env in Railway Dashboard)**
```bash
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# OpenAI for AI Features
OPENAI_API_KEY=sk-your-openai-api-key

# Polygon Blockchain (for Notarization)
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_PRIVATE_KEY=your-polygon-wallet-private-key
NOTARY_CONTRACT_ADDRESS=your-deployed-contract-address

# Frontend CORS
FRONTEND_ORIGIN=https://nexteraestate.com
```

## 🔑 How to Generate NEXTAUTH_SECRET

Run this command to generate a secure 32-character secret:
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## 🔍 Google OAuth Setup Checklist

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Create OAuth 2.0 Client ID**
3. **Authorized JavaScript Origins:**
   - `https://nexteraestate.com`
   - `https://www.nexteraestate.com`
   - `http://localhost:3000` (for development)
4. **Authorized Redirect URIs:**
   - `https://nexteraestate.com/api/auth/callback/google`
   - `https://www.nexteraestate.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`

## 🚨 Important Notes

### **For Local Development:**
Create `/app/web/.env.local`:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-same-secret-from-vercel
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
```

### **Security Best Practices:**
- ✅ Never commit `.env` files to git
- ✅ Use different secrets for development and production
- ✅ Rotate secrets periodically
- ✅ Keep Stripe keys separate (test vs live)

### **Deployment Order:**
1. Set environment variables in Vercel
2. Set environment variables in Railway
3. Deploy backend to Railway first
4. Deploy frontend to Vercel
5. Test Google OAuth login

## 🔧 Troubleshooting OAuth Issues

### **"OAuth Error" or "Configuration Error"**
- ✅ Check NEXTAUTH_URL matches your domain exactly
- ✅ Verify Google OAuth redirect URLs are correct
- ✅ Ensure NEXTAUTH_SECRET is set
- ✅ Check browser console for detailed error messages

### **"Invalid Redirect URI"**
- ✅ Add your Vercel preview URLs to Google Console
- ✅ Format: `https://your-app-git-main-username.vercel.app`

### **"Session Not Found"**
- ✅ Clear browser cookies and try again
- ✅ Check if NEXTAUTH_URL is set correctly
- ✅ Verify NextAuth configuration matches domain

## 📧 Required Policy Links for Google

When setting up Google OAuth consent screen:
- **Privacy Policy:** `https://nexteraestate.com/privacy`
- **Terms of Service:** `https://nexteraestate.com/terms`

These pages are already created and ready to use!