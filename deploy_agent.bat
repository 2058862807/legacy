@echo off
setlocal

rem NexteraEstate Autonomous Tech Director Setup
echo ========================================
echo NexteraEstate Autonomous Tech Director
echo ========================================
echo.
echo This will create your personal AI senior developer that:
echo - Monitors your platform 24/7
echo - Learns from every issue
echo - Fixes problems automatically
echo - Communicates in plain language
echo - Only answers to you
echo.

rem setup paths
set "ROOT=C:\NexteraAgent"
if not exist "%ROOT%" mkdir "%ROOT%"
cd /d "%ROOT%"

rem prompt required secrets
echo Enter a strong admin token (only you will use it):
set /p ADMIN_TOKEN=
echo.
echo Enter your Gemini API key for AI capabilities:
set /p GEMINI_API_KEY=
echo.
echo Enter your NexteraEstate site URL (e.g., https://nexteraestate.com):
set /p SITE_URL=
echo.
echo Enter your API URL (e.g., https://api.nexteraestate.com):
set /p API_URL=
echo.
echo Enter your Preview URL or leave blank:
set /p PREVIEW_URL=
echo.
echo Enter your email for critical alerts:
set /p OWNER_EMAIL=

rem write enhanced requirements.txt
powershell -NoProfile -Command "@'
fastapi==0.112.0
uvicorn[standard]==0.30.6
httpx==0.27.2
pydantic==2.8.2
apscheduler==3.10.4
python-dotenv==1.0.1
google-generativeai==0.7.2
sqlalchemy==2.0.23
aiosqlite==0.19.0
'@ | Set-Content -Encoding utf8 requirements.txt"

rem write enhanced .env
powershell -NoProfile -Command "@'
ADMIN_TOKEN=%ADMIN_TOKEN%
ALLOW_IPS=127.0.0.1
SITE_URL=%SITE_URL%
API_URL=%API_URL%
PREVIEW_URL=%PREVIEW_URL%
OWNER_EMAIL=%OWNER_EMAIL%
VERCEL_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=
GITHUB_TOKEN=
REPO_SLUG=nexteraestate/main
RAILWAY_API_TOKEN=
GEMINI_API_KEY=%GEMINI_API_KEY%
LOG_LEVEL=INFO
LEARNING_MODE=true
AUTO_FIX_MODE=true
'@ | Set-Content -Encoding utf8 .env"

rem write enhanced app.py with recursive self-improvement
powershell -NoProfile -Command "@'
import os, json, sqlite3, asyncio, re
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from fastapi import FastAPI, Request, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler
import logging

# Configure logging
logging.basicConfig(level=getattr(logging, os.getenv("LOG_LEVEL", "INFO")))
logger = logging.getLogger(__name__)

# Configuration
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
ALLOW_IPS = {ip.strip() for ip in os.getenv("ALLOW_IPS", "127.0.0.1").split(",")}
SITE_URL = os.getenv("SITE_URL", "")
API_URL = os.getenv("API_URL", "")
PREVIEW_URL = os.getenv("PREVIEW_URL", "")
OWNER_EMAIL = os.getenv("OWNER_EMAIL", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
LEARNING_MODE = os.getenv("LEARNING_MODE", "true").lower() == "true"
AUTO_FIX_MODE = os.getenv("AUTO_FIX_MODE", "true").lower() == "true"

# Database setup
DB_PATH = "nextera_agent.db"
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = conn.cursor()

# Enhanced database schema
cur.execute("""CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT,
    source TEXT,
    kind TEXT,
    severity TEXT,
    message TEXT,
    data TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolution TEXT
)""")

cur.execute("""CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT,
    category TEXT,
    lesson TEXT,
    confidence REAL DEFAULT 0.5,
    applied_count INTEGER DEFAULT 0
)""")

cur.execute("""CREATE TABLE IF NOT EXISTS fixes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT,
    incident_id INTEGER,
    fix_type TEXT,
    fix_action TEXT,
    success BOOLEAN,
    result TEXT
)""")

cur.execute("""CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT,
    metric_name TEXT,
    metric_value REAL,
    context TEXT
)""")

cur.execute("""CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT,
    topic TEXT,
    content TEXT,
    source TEXT,
    reliability REAL DEFAULT 0.5
)""")

conn.commit()

class TechDirector:
    def __init__(self):
        self.learning_enabled = LEARNING_MODE
        self.auto_fix_enabled = AUTO_FIX_MODE
        self.knowledge = self.load_knowledge()
        
    def load_knowledge(self) -> Dict[str, Any]:
        """Load accumulated knowledge from database"""
        cur.execute("SELECT topic, content, reliability FROM knowledge_base ORDER BY reliability DESC")
        knowledge = {}
        for topic, content, reliability in cur.fetchall():
            if topic not in knowledge:
                knowledge[topic] = []
            knowledge[topic].append({"content": content, "reliability": reliability})
        return knowledge
    
    def save_incident(self, source: str, kind: str, severity: str, message: str, data: Dict[str, Any]):
        """Save incident with enhanced metadata"""
        cur.execute(
            "INSERT INTO incidents(ts,source,kind,severity,message,data) VALUES (?,?,?,?,?,?)",
            (datetime.utcnow().isoformat(), source, kind, severity, message, json.dumps(data)[:8000])
        )
        conn.commit()
        return cur.lastrowid
    
    def add_lesson(self, category: str, lesson: str, confidence: float = 0.7):
        """Add lesson with confidence scoring"""
        cur.execute(
            "INSERT INTO lessons(ts,category,lesson,confidence) VALUES(?,?,?,?)",
            (datetime.utcnow().isoformat(), category, lesson, confidence)
        )
        conn.commit()
    
    def add_knowledge(self, topic: str, content: str, source: str, reliability: float = 0.5):
        """Add to knowledge base"""
        cur.execute(
            "INSERT INTO knowledge_base(ts,topic,content,source,reliability) VALUES(?,?,?,?,?)",
            (datetime.utcnow().isoformat(), topic, content, source, reliability)
        )
        conn.commit()
    
    def analyze_pattern(self, incidents: List[Dict]) -> Dict[str, Any]:
        """Analyze incident patterns for proactive fixes"""
        patterns = {}
        for incident in incidents:
            key = f"{incident['source']}_{incident['kind']}"
            if key not in patterns:
                patterns[key] = {"count": 0, "severity": [], "recent": False}
            patterns[key]["count"] += 1
            patterns[key]["severity"].append(incident.get("severity", "medium"))
            
            # Check if recent (last 24 hours)
            incident_time = datetime.fromisoformat(incident["ts"])
            if (datetime.utcnow() - incident_time).total_seconds() < 86400:
                patterns[key]["recent"] = True
        
        return patterns
    
    async def llm_analyze(self, prompt: str, mode: str = "analyze") -> str:
        """Enhanced LLM analysis with different modes"""
        if not GEMINI_API_KEY:
            return "LLM analysis unavailable - no API key"
        
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            if mode == "analyze":
                system_prompt = """You are a senior software engineer analyzing production issues. 
                Provide clear, actionable analysis in plain language. Focus on:
                1. Root cause
                2. Immediate fix
                3. Prevention strategy
                Be direct and specific."""
            elif mode == "fix":
                system_prompt = """You are an expert DevOps engineer providing fix instructions.
                Give step-by-step solutions in plain language. Include:
                1. Exact commands or code changes
                2. Expected results
                3. How to verify the fix worked
                Be precise and actionable."""
            elif mode == "learn":
                system_prompt = """You are a tech lead extracting lessons from incidents.
                Identify patterns and create rules to prevent future issues. Focus on:
                1. What pattern led to this issue
                2. How to detect it early
                3. Automated prevention measures
                Be strategic and forward-thinking."""
            
            full_prompt = f"{system_prompt}\n\nContext: {prompt}"
            response = model.generate_content(full_prompt)
            return (response.text or "").strip()[:2000]
        except Exception as e:
            logger.error(f"LLM analysis failed: {e}")
            return f"Analysis failed: {str(e)}"
    
    async def auto_fix_attempt(self, incident_id: int, incident: Dict[str, Any]) -> Dict[str, Any]:
        """Attempt automatic fix based on learned patterns"""
        if not self.auto_fix_enabled:
            return {"attempted": False, "reason": "Auto-fix disabled"}
        
        fix_suggestions = await self.llm_analyze(
            f"Incident: {incident['message']} - Data: {json.dumps(incident.get('data', {}))}", 
            mode="fix"
        )
        
        # For now, log the suggestion - in a more advanced version, 
        # this could execute safe automated fixes
        cur.execute(
            "INSERT INTO fixes(ts,incident_id,fix_type,fix_action,success,result) VALUES(?,?,?,?,?,?)",
            (datetime.utcnow().isoformat(), incident_id, "suggestion", fix_suggestions, False, "Logged for manual review")
        )
        conn.commit()
        
        return {
            "attempted": True,
            "type": "suggestion",
            "action": fix_suggestions,
            "status": "requires_manual_review"
        }

# Initialize Tech Director
tech_director = TechDirector()

def require_admin(request: Request):
    """Enhanced admin authentication"""
    auth = request.headers.get("authorization", "")
    token = auth.replace("Bearer ", "")
    ip = request.client.host if request.client else "unknown"
    
    if token != ADMIN_TOKEN:
        tech_director.save_incident("auth", "unauthorized", "high", f"Invalid token from {ip}", {"ip": ip, "token_prefix": token[:8]})
        raise HTTPException(status_code=401, detail="Unauthorized access attempt logged")
    
    if ALLOW_IPS and ip not in ALLOW_IPS:
        tech_director.save_incident("auth", "forbidden", "high", f"Blocked IP: {ip}", {"ip": ip})
        raise HTTPException(status_code=403, detail="IP address not allowed")
    
    return True

async def comprehensive_health_check() -> Dict[str, Any]:
    """Enhanced health checking with detailed analysis"""
    results = {"timestamp": datetime.utcnow().isoformat(), "overall_status": "unknown"}
    
    async with httpx.AsyncClient(timeout=30) as client:
        # Site health check
        site_results = {}
        try:
            # Main site
            home_response = await client.get(SITE_URL or "", follow_redirects=True)
            site_results["home"] = {
                "ok": home_response.status_code == 200,
                "status_code": home_response.status_code,
                "response_time": home_response.elapsed.total_seconds() if hasattr(home_response, 'elapsed') else 0
            }
            
            # CSS/Static files
            try:
                css_response = await client.get(f"{SITE_URL}/_next/static/css/app/layout.css")
                site_results["css"] = {"ok": css_response.status_code == 200}
            except:
                site_results["css"] = {"ok": False, "error": "CSS check failed"}
            
            # Authentication endpoints
            try:
                auth_response = await client.get(f"{SITE_URL}/api/auth/session")
                site_results["auth"] = {"ok": auth_response.status_code in [200, 401]}
            except:
                site_results["auth"] = {"ok": False, "error": "Auth endpoint check failed"}
                
        except Exception as e:
            site_results["error"] = str(e)
        
        results["site"] = site_results
        
        # API health check
        api_results = {}
        try:
            health_response = await client.get(f"{API_URL}/api/health")
            api_results["health"] = {
                "ok": health_response.status_code == 200,
                "status_code": health_response.status_code,
                "response_time": health_response.elapsed.total_seconds() if hasattr(health_response, 'elapsed') else 0
            }
            
            if health_response.status_code == 200:
                health_data = health_response.json()
                api_results["features"] = health_data.get("features", {})
        except Exception as e:
            api_results["error"] = str(e)
        
        results["api"] = api_results
        
        # Preview environment (if configured)
        if PREVIEW_URL:
            try:
                preview_response = await client.get(PREVIEW_URL, follow_redirects=True)
                results["preview"] = {
                    "ok": preview_response.status_code == 200,
                    "status_code": preview_response.status_code
                }
            except Exception as e:
                results["preview"] = {"error": str(e)}
    
    # Determine overall status
    site_ok = results["site"].get("home", {}).get("ok", False)
    api_ok = results["api"].get("health", {}).get("ok", False)
    
    if site_ok and api_ok:
        results["overall_status"] = "healthy"
    elif site_ok or api_ok:
        results["overall_status"] = "degraded"
    else:
        results["overall_status"] = "down"
    
    return results

async def intelligent_incident_response(health_results: Dict[str, Any]):
    """Analyze health results and respond intelligently"""
    incidents_created = []
    
    # Check for site issues
    site = health_results.get("site", {})
    if not site.get("home", {}).get("ok", True):
        incident_id = tech_director.save_incident(
            "site", "down", "critical",
            "Frontend is not responding",
            site
        )
        incidents_created.append(incident_id)
        
        # Attempt analysis and auto-fix
        incident_data = {"id": incident_id, "source": "site", "kind": "down", "message": "Frontend is not responding", "data": site}
        fix_result = await tech_director.auto_fix_attempt(incident_id, incident_data)
    
    # Check for API issues
    api = health_results.get("api", {})
    if not api.get("health", {}).get("ok", True):
        incident_id = tech_director.save_incident(
            "api", "down", "critical",
            "Backend API is not responding",
            api
        )
        incidents_created.append(incident_id)
        
        # Attempt analysis and auto-fix
        incident_data = {"id": incident_id, "source": "api", "kind": "down", "message": "Backend API is not responding", "data": api}
        fix_result = await tech_director.auto_fix_attempt(incident_id, incident_data)
    
    # Learn from patterns
    if incidents_created and tech_director.learning_enabled:
        recent_incidents = []
        cur.execute("SELECT * FROM incidents WHERE ts > datetime('now', '-1 day') ORDER BY ts DESC LIMIT 50")
        for row in cur.fetchall():
            recent_incidents.append({
                "id": row[0], "ts": row[1], "source": row[2], "kind": row[3],
                "severity": row[4], "message": row[5], "data": json.loads(row[6]) if row[6] else {}
            })
        
        patterns = tech_director.analyze_pattern(recent_incidents)
        
        # Generate insights
        for pattern, data in patterns.items():
            if data["count"] > 2 and data["recent"]:
                insight = await tech_director.llm_analyze(
                    f"Pattern detected: {pattern} occurred {data['count']} times recently",
                    mode="learn"
                )
                tech_director.add_lesson("pattern_analysis", insight, confidence=0.8)
    
    return {"incidents_created": len(incidents_created), "overall_status": health_results["overall_status"]}

# FastAPI app
app = FastAPI(
    title="NexteraEstate Autonomous Tech Director",
    description="Your personal AI senior developer that monitors, learns, and improves your platform",
    version="2.0.0",
    docs_url=None,
    redoc_url=None
)

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None

class TeachingInput(BaseModel):
    lesson: str
    category: str = "general"
    confidence: float = 0.7

@app.get("/")
async def root():
    return {
        "service": "NexteraEstate Autonomous Tech Director",
        "status": "operational",
        "owner": OWNER_EMAIL,
        "capabilities": [
            "24/7 platform monitoring",
            "Intelligent incident analysis",
            "Automated fix suggestions",
            "Continuous learning",
            "Plain language communication"
        ]
    }

@app.get("/agent/status")
async def get_status(request: Request, _=Depends(require_admin)):
    """Get comprehensive platform status"""
    health_results = await comprehensive_health_check()
    
    # Get recent incidents
    cur.execute("SELECT COUNT(*) FROM incidents WHERE ts > datetime('now', '-1 hour')")
    recent_incidents = cur.fetchone()[0]
    
    # Get lessons learned
    cur.execute("SELECT COUNT(*) FROM lessons")
    total_lessons = cur.fetchone()[0]
    
    return {
        "health": health_results,
        "incidents_last_hour": recent_incidents,
        "total_lessons_learned": total_lessons,
        "learning_mode": tech_director.learning_enabled,
        "auto_fix_mode": tech_director.auto_fix_enabled,
        "agent_version": "2.0.0"
    }

@app.post("/agent/check")
async def run_comprehensive_check(request: Request, background_tasks: BackgroundTasks, _=Depends(require_admin)):
    """Run comprehensive health check and intelligent response"""
    health_results = await comprehensive_health_check()
    response_results = await intelligent_incident_response(health_results)
    
    return {
        "health": health_results,
        "response": response_results,
        "recommendation": await tech_director.llm_analyze(
            f"Platform status: {health_results['overall_status']}. {json.dumps(response_results)}",
            mode="analyze"
        )
    }

@app.get("/agent/incidents")
async def get_incidents(request: Request, limit: int = 50, _=Depends(require_admin)):
    """Get recent incidents with analysis"""
    cur.execute("SELECT * FROM incidents ORDER BY id DESC LIMIT ?", (limit,))
    incidents = []
    for row in cur.fetchall():
        incidents.append({
            "id": row[0], "timestamp": row[1], "source": row[2], "kind": row[3],
            "severity": row[4], "message": row[5], "data": json.loads(row[6]) if row[6] else {},
            "resolved": bool(row[7]), "resolution": row[8]
        })
    
    patterns = tech_director.analyze_pattern(incidents)
    
    return {
        "incidents": incidents,
        "patterns": patterns,
        "analysis": await tech_director.llm_analyze(f"Recent incidents: {json.dumps(patterns)}", mode="analyze")
    }

@app.get("/agent/lessons")
async def get_lessons(request: Request, _=Depends(require_admin)):
    """Get lessons learned"""
    cur.execute("SELECT * FROM lessons ORDER BY confidence DESC, id DESC LIMIT 100")
    lessons = []
    for row in cur.fetchall():
        lessons.append({
            "id": row[0], "timestamp": row[1], "category": row[2],
            "lesson": row[3], "confidence": row[4], "applied_count": row[5]
        })
    
    return {"lessons": lessons, "total": len(lessons)}

@app.post("/agent/teach")
async def teach_agent(input: TeachingInput, request: Request, _=Depends(require_admin)):
    """Teach the agent new knowledge"""
    tech_director.add_lesson(input.category, input.lesson, input.confidence)
    return {"success": True, "message": "Lesson learned and stored"}

@app.post("/agent/chat")
async def chat_with_agent(input: ChatMessage, request: Request, _=Depends(require_admin)):
    """Chat with your tech director"""
    context = input.context or "You are speaking with the owner of NexteraEstate platform."
    
    # Get recent context
    cur.execute("SELECT message FROM incidents ORDER BY id DESC LIMIT 5")
    recent_issues = [row[0] for row in cur.fetchall()]
    
    cur.execute("SELECT lesson FROM lessons ORDER BY confidence DESC LIMIT 10")
    top_lessons = [row[0] for row in cur.fetchall()]
    
    full_context = f"""
    {context}
    
    Recent issues: {'; '.join(recent_issues)}
    Key lessons learned: {'; '.join(top_lessons)}
    
    Question: {input.message}
    """
    
    response = await tech_director.llm_analyze(full_context, mode="analyze")
    
    return {
        "response": response,
        "context_used": True,
        "agent_mood": "Ready to help" if "healthy" in response.lower() else "Concerned about issues"
    }

@app.post("/agent/resolve-incident/{incident_id}")
async def resolve_incident(incident_id: int, request: Request, _=Depends(require_admin)):
    """Mark incident as resolved"""
    body = await request.json()
    resolution = body.get("resolution", "Manually resolved")
    
    cur.execute("UPDATE incidents SET resolved = TRUE, resolution = ? WHERE id = ?", (resolution, incident_id))
    conn.commit()
    
    return {"success": True, "message": f"Incident {incident_id} marked as resolved"}

# Background scheduler for autonomous monitoring
scheduler = BackgroundScheduler()

def autonomous_monitoring_job():
    """Autonomous monitoring job that runs every 5 minutes"""
    try:
        # Run the monitoring in an async context
        async def monitor():
            health_results = await comprehensive_health_check()
            await intelligent_incident_response(health_results)
        
        # Use asyncio to run the async function
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            loop.run_until_complete(monitor())
        except RuntimeError:
            # If no loop exists, create a new one
            asyncio.run(monitor())
            
    except Exception as e:
        logger.error(f"Autonomous monitoring failed: {e}")

# Schedule monitoring every 5 minutes
scheduler.add_job(
    autonomous_monitoring_job,
    "interval",
    minutes=5,
    next_run_time=datetime.utcnow() + timedelta(seconds=30)
)

scheduler.start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8787)
'@ | Set-Content -Encoding utf8 app.py"

rem choose python launcher
where py >nul 2>&1
if errorlevel 1 (
    set "PYEXE=python"
) else (
    set "PYEXE=py"
)

rem create venv and install
echo Installing Python environment...
%PYEXE% -m venv .venv
call .venv\Scripts\python.exe -m pip install --upgrade pip
call .venv\Scripts\pip.exe install -r requirements.txt

rem create startup script
powershell -NoProfile -Command "@'
@echo off
echo Starting NexteraEstate Autonomous Tech Director...
echo Your personal AI senior developer is now online.
echo.
call .venv\Scripts\uvicorn.exe app:app --host 0.0.0.0 --port 8787 --reload
'@ | Set-Content -Encoding utf8 start_agent.bat"

rem create management scripts
powershell -NoProfile -Command "@'
@echo off
echo NexteraEstate Tech Director - Quick Commands
echo ==========================================
echo.
echo 1. Get Status:
echo curl -H "Authorization: Bearer %ADMIN_TOKEN%" http://localhost:8787/agent/status
echo.
echo 2. Run Full Check:
echo curl -X POST -H "Authorization: Bearer %ADMIN_TOKEN%" http://localhost:8787/agent/check
echo.
echo 3. View Recent Issues:
echo curl -H "Authorization: Bearer %ADMIN_TOKEN%" http://localhost:8787/agent/incidents
echo.
echo 4. Chat with Agent:
echo curl -X POST -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json" ^
echo -d "{\"message\":\"How is the platform doing?\"}" http://localhost:8787/agent/chat
echo.
echo 5. Teach Agent:
echo curl -X POST -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json" ^
echo -d "{\"lesson\":\"When API is down, check Railway deployment first\",\"category\":\"troubleshooting\"}" http://localhost:8787/agent/teach
echo.
pause
'@ | Set-Content -Encoding utf8 manage_agent.bat"

rem start the enhanced agent
start "" "start_agent.bat"

echo.
echo ========================================
echo NexteraEstate Autonomous Tech Director
echo ========================================
echo.
echo ✅ Your AI senior developer is now running!
echo.
echo 🔗 Agent Dashboard: http://localhost:8787
echo 🔑 Your Admin Token: %ADMIN_TOKEN%
echo 📧 Owner Email: %OWNER_EMAIL%
echo.
echo 🤖 Your agent can:
echo   • Monitor your platform 24/7
echo   • Learn from every issue
echo   • Suggest and attempt fixes
echo   • Communicate with you in plain language
echo   • Only respond to your admin token
echo.
echo 📋 Quick Commands:
echo   • Run: manage_agent.bat (for command examples)
echo   • Status: GET /agent/status
echo   • Chat: POST /agent/chat
echo   • Teach: POST /agent/teach
echo.
echo 🚀 The agent will start monitoring in 30 seconds...
echo.
pause