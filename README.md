# NexteraEstate - Estate Planning Platform

NexteraEstate is a comprehensive estate planning platform that combines cutting-edge technology with legal compliance to help users create, manage, and secure their estate planning documents.

## 🏛️ **Key Feature: 50-State Real-Time Jurisdictional Compliance**

NexteraEstate features an **enterprise-grade 50-state real-time jurisdictional compliance system** - the industry's first comprehensive legal requirement checker for estate planning documents across all US jurisdictions.

### **Compliance System Highlights:**
- ✅ **Complete Coverage**: All 50 US states + Washington DC
- ⚖️ **Real Legal Citations**: Professional statute references (Probate Codes, EPTL, etc.)
- 🔄 **Real-Time Updates**: Automated change tracking with audit trails
- 📱 **Professional UI**: State selector, document type tabs, visual compliance scoring
- 🎯 **Instant Results**: Get witness requirements, notarization rules, RON availability instantly

**API Example:**
```bash
GET /api/compliance/rules?state=CA&doc_type=will
# Returns: witnesses_required: 2, notarization_required: false, ron_allowed: true, citations: ["Probate Code 6110"]
```

*See `/COMPLIANCE_FEATURE_OVERVIEW.md` for complete technical documentation.*

## 🚀 Features

### Core Estate Planning
- **Will Builder** - Step-by-step will creation with state-specific requirements
- **Document Vault** - Secure document storage and management
- **AI Assistant** - Intelligent guidance throughout the planning process
- **Compliance Checking** - Real-time legal requirement validation

### Advanced Technology
- **Blockchain Notarization** - Immutable document timestamping on Polygon network
- **MetaMask Integration** - User-controlled blockchain transactions
- **NextAuth Authentication** - Secure Google OAuth integration
- **Stripe Payments** - Professional payment processing

### Legal Compliance
- **50-State Coverage** - Comprehensive jurisdictional compliance system
- **Professional Citations** - Real legal statute references
- **Remote Online Notarization (RON)** - State-by-state RON availability
- **Electronic Signatures** - E-signature compliance by jurisdiction

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with responsive design
- **Authentication**: NextAuth v5 with Google provider
- **State Management**: React hooks with TypeScript
- **Blockchain**: Ethers.js for MetaMask integration

### Backend (FastAPI + PostgreSQL)
- **API**: FastAPI with async/await patterns
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Compliance**: Real-time 50-state legal requirement system
- **Caching**: 15-minute in-memory caching for optimal performance
- **Integrations**: Stripe, OpenAI, Polygon blockchain

### Deployment
- **Frontend**: Vercel with custom domain support
- **Backend**: Railway with PostgreSQL database
- **DNS**: Custom domain with API subdomain routing
- **SSL**: Automatic HTTPS with proper certificate management

## 📋 Getting Started

### Environment Setup

**Frontend (.env.local):**
```env
NEXTAUTH_URL=https://nexteraestate.com
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.nexteraestate.com
```

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:pass@host/dbname
COMPLIANCE_ENABLED=true
STRIPE_SECRET_KEY=sk_...
OPENAI_API_KEY=sk-...
```

### Local Development

```bash
# Frontend
cd web
npm install
npm run dev

# Backend  
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

## 🎯 Compliance System Usage

### Check State Requirements
```bash
# Get compliance rules for specific state and document type
curl "https://api.nexteraestate.com/api/compliance/rules?state=CA&doc_type=will"

# Get compliance summary across all states
curl "https://api.nexteraestate.com/api/compliance/summary"

# Refresh compliance data from seed
curl -X POST "https://api.nexteraestate.com/api/compliance/refresh"
```

### Frontend Integration
- Visit `/compliance` for full compliance center
- Dashboard shows compliance badge for user's state
- Real-time state/document type selection
- Professional legal citations display

## 🔧 API Documentation

### Compliance Endpoints
- `GET /api/compliance/rules` - Get specific state/document requirements
- `GET /api/compliance/summary` - Get system-wide compliance statistics
- `POST /api/compliance/refresh` - Update compliance data from seed

### Estate Planning Endpoints  
- `POST /api/payments/create-checkout` - Create Stripe payment session
- `POST /api/bot/help` - AI assistance for estate planning
- `POST /api/notary/hash` - Generate document hash for notarization
- `POST /api/notary/create` - Create blockchain notarization

## 📊 Database Schema

### Compliance Tables
```sql
-- Core compliance rules by state and document type
compliance_rules (
  id, state, doc_type, notarization_required, witnesses_required,
  ron_allowed, esign_allowed, recording_supported, pet_trust_allowed,
  citations, updated_at
)

-- Change tracking for compliance updates
compliance_changes (
  id, state, doc_type, diff, changed_at
)
```

## 🌟 Unique Value Proposition

**NexteraEstate is the first and only estate planning platform to offer:**

1. **Real-Time 50-State Compliance** - Instant legal requirements for all US jurisdictions
2. **Professional Legal Citations** - Actual statute references, not generic advice
3. **Integrated Workflow** - Compliance checking → document creation → blockchain notarization
4. **User-Controlled Blockchain** - MetaMask integration for secure, decentralized transactions
5. **Enterprise Architecture** - Professional-grade backend with PostgreSQL and caching

## 📞 Support

For questions about the compliance system or estate planning features:
- Technical documentation: `/COMPLIANCE_FEATURE_OVERVIEW.md`
- API documentation: Available at runtime endpoints
- Legal compliance: Professional statute citations included with each rule

---

**NexteraEstate**: *Securing legacies through technology, compliance, and innovation.*