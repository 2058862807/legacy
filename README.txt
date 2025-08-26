NexteraEstate mono-repo
Structure
- web  Next.js 14 App Router frontend
- backend  FastAPI backend with Stripe endpoints

Deploy
Frontend: Vercel
- Project root directory: web
- Install command: npm install
- Build command: next build
- Output directory: .next
- Node 20

Backend: Railway
- Service from backend folder
- Start command: uvicorn server:app --host 0.0.0.0 --port $PORT
- Python 3.11

Env
Frontend (Vercel)
- NEXTAUTH_URL=https://nexteraestate.com
- NEXTAUTH_SECRET=your-secret
- GOOGLE_CLIENT_ID=...
- GOOGLE_CLIENT_SECRET=...
- BACKEND_BASE_URL=https://api.nexteraestate.com
- STRIPE_PUBLIC_KEY=pk_test_...

Backend (Railway)
- FRONTEND_BASE_URL=https://nexteraestate.com
- ALLOWED_ORIGIN=https://nexteraestate.com
- STRIPE_SECRET_KEY=sk_test_...
- STRIPE_WEBHOOK_SECRET=whsec_...
- OPENAI_API_KEY=sk-...
- DEEPSEEK_API_KEY=...
- DATABASE_URL=postgres://... (optional)

Smoke
- GET https://api.nexteraestate.com/health → ok
- GET https://nexteraestate.com/api/auth/providers → google
- Visit /pricing → Upgrade, redirect to stripe.com
