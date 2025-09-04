# NexteraEstate - AI-Powered Estate Planning Platform

A comprehensive estate planning platform with AI agents, blockchain notarization, and 50-state compliance.

## 🚀 Features

- **AI-Powered Legal Guidance**: Three-layer AI verification system with AutoLex Core
- **50-State Compliance**: Real-time legal requirement tracking
- **Blockchain Notarization**: Gasless notarization on Polygon
- **Live Estate Plan**: Automatic document updates based on law changes
- **Professional UI**: Modern React interface with Tailwind CSS
- **Payment Integration**: Stripe-powered subscription management

## 🏗️ Architecture

### Backend (FastAPI)
- **Location**: `/backend/`
- **Framework**: FastAPI with Uvicorn
- **Database**: SQLite with SQLAlchemy (production: PostgreSQL)
- **AI System**: Multi-agent architecture with Gemini integration

### Frontend (Next.js)
- **Location**: `/web/` 
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5 with Google OAuth

## 🛠️ Environment Setup

### Backend Environment Variables
```bash
# Copy from .env.example and configure
cp backend/.env.example backend/.env
```

Required variables:
- `OPENAI_API_KEY` or `GEMINI_API_KEY`: AI model access
- `STRIPE_SECRET_KEY`: Payment processing
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth authentication
- `POLYGON_PRIVATE_KEY` & `POLYGON_RPC_URL`: Blockchain features (optional)

### Frontend Environment Variables
```bash
# Copy from .env.example and configure
cp web/.env.example web/.env.local
```

Required variables:
- `NEXTAUTH_SECRET`: NextAuth.js secret key
- `NEXT_PUBLIC_BACKEND_BASE_URL`: Backend API URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `STRIPE_PUBLIC_KEY`: Stripe public key

## 🚀 Deployment

### Railway (Recommended)

1. **Backend Service**:
   ```bash
   # Set these environment variables in Railway:
   OPENAI_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   STRIPE_SECRET_KEY=your_key_here
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   POLYGON_PRIVATE_KEY=your_private_key
   POLYGON_RPC_URL=https://polygon-rpc.com/
   DATABASE_URL=postgresql://user:pass@railway.db/nexteraestate
   ```

2. **Frontend Service**:
   ```bash
   # Set these environment variables in Railway:
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=https://your-domain.com
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_BACKEND_BASE_URL=https://your-backend-railway-url.up.railway.app
   STRIPE_PUBLIC_KEY=your_public_key
   ```

### Docker Deployment

```bash
# Build backend
docker build -f Dockerfile.backend -t nexteraestate-backend .

# Build frontend  
docker build -f Dockerfile.web -t nexteraestate-web .

# Run with docker-compose (create your own docker-compose.yml)
```

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:8001/api/health
```

### AI Agent Communication
```bash
curl -X POST "http://localhost:8001/api/ai-team/communicate" \
  -H "Content-Type: application/json" \
  -d '{"message":"Test AI system","recipient":"team","priority":"normal"}'
```

### Frontend Health
```bash
curl http://localhost:3000/api/health
```

## 📱 API Endpoints

### Core APIs
- `GET /api/health` - System health check
- `GET /api/ready` - Readiness probe
- `POST /api/users` - User management
- `GET|POST /api/wills` - Will creation and management
- `POST /api/bot/help` - Legal guidance AI
- `POST /api/ai-team/communicate` - Multi-agent AI system

### Payment APIs
- `POST /api/payments/create-checkout` - Stripe checkout
- `POST /api/payments/webhook` - Stripe webhooks
- `GET /api/payments/status` - Payment status

### Compliance APIs
- `GET /api/compliance/states` - 50-state legal data
- `GET /api/compliance/requirements` - State requirements

## 🔧 Development

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend
cd web
yarn install
yarn dev
```

### Database Migrations
```bash
# Tables and indexes are created automatically on startup
# Check logs for: "✅ Database tables and indexes created"
```

## 🔐 Security Features

- **Environment-based configuration**: No hardcoded secrets
- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Production-ready origin controls
- **Webhook Verification**: Stripe signature validation
- **Database Indexes**: Optimized query performance

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/health` (liveness)
- Backend: `GET /api/ready` (readiness)
- Frontend: Health check via Next.js built-in monitoring

### Logging
- Structured logging with timestamps
- AI system initialization tracking
- Error tracking with context
- Payment processing audit trail

## 🎯 Production Checklist

- [ ] All environment variables configured
- [ ] Database connection established
- [ ] AI models accessible (Gemini/OpenAI)
- [ ] Stripe webhooks configured
- [ ] Google OAuth credentials valid
- [ ] HTTPS/SSL certificates active
- [ ] Domain DNS configured
- [ ] Backup strategy implemented

## 📞 Support

For deployment assistance:
1. Check logs for initialization messages
2. Verify all environment variables are set
3. Test API endpoints individually
4. Review Stripe webhook configuration

## 🏆 Success Metrics

- Will creation time: < 12 minutes
- AI response time: < 5 seconds
- API uptime: > 99.9%
- Payment success rate: > 99%
- 50-state compliance: 100%