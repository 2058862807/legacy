import os
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Optional providers. Guarded to prevent startup crashes.
try:
    from providers.github_client import github_commit_push
except Exception:
    github_commit_push = None

try:
    from providers.vercel_client import vercel_deploy
except Exception:
    vercel_deploy = None

try:
    from providers.email_client import fetch_unread, send_reply
except Exception:
    fetch_unread = None
    send_reply = None

# DNS helper with safe fallback
try:
    from providers.dns_client import set_a_record
except Exception:
    def set_a_record(*args, **kwargs):
        return False, "dns_unavailable"

# LLM and agent helpers with safe fallbacks
try:
    from ai.llm import llm_complete as llm_complete_fn
except Exception:
    def llm_complete_fn(provider: str, model: str, prompt: str) -> str:
        raise HTTPException(503, "llm_unavailable")

try:
    from automation.agent import run_agent_task as run_agent_task_fn
except Exception:
    def run_agent_task_fn(goal: str, params: Dict[str, Any]) -> Dict[str, Any]:
        raise HTTPException(503, "agent_unavailable")

load_dotenv()

PORT = int(os.getenv("PORT", "7861"))

app = FastAPI(title="Legacy API", version="0.1.0")

# CORS
cors_env = os.getenv("CORS_ORIGINS", "")
if cors_env.strip():
    origins = [o.strip() for o in cors_env.split(",") if o.strip()]
else:
    vercel_url = os.getenv("VERCEL_URL", "").strip()
    origins = [
        "https://nexteraestate.com",
        "https://www.nexteraestate.com",
    ]
    if vercel_url:
        origins.append(f"https://{vercel_url}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas
class EmailReplyRequest(BaseModel):
    thread_query: str
    reply_text: str
    dry_run: bool = True

class GitPushRequest(BaseModel):
    repo_path: str
    message: str = "update"
    remote: str = "origin"
    branch: str = "main"

class VercelDeployRequest(BaseModel):
    project_dir: str
    prod: bool = True

class DNSRequest(BaseModel):
    domain: str
    host: str
    ip: str
    ttl: int = 300

class LLMRequest(BaseModel):
    provider: str = "openai"
    model: str = "gpt-4o-mini"
    prompt: str

class AgentTaskRequest(BaseModel):
    goal: str
    params: Dict[str, Any] = {}

# Routes
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/email/reply")
def email_reply(req: EmailReplyRequest):
    if fetch_unread is None or send_reply is None:
        raise HTTPException(503, "email_client_unavailable")
    msgs = fetch_unread(search=req.thread_query)
    if not msgs:
        return {"status": "no_matches"}
    if req.dry_run:
        return {"status": "dry_run", "matches": len(msgs)}
    send_reply(msgs[0], req.reply_text)
    return {"status": "sent"}

@app.post("/git/push")
def git_push(req: GitPushRequest):
    if github_commit_push is None:
        raise HTTPException(503, "github_client_unavailable")
    ok, out = github_commit_push(req.repo_path, req.message, req.remote, req.branch)
    if not ok:
        raise HTTPException(400, out)
    return {"status": "pushed", "detail": out}

@app.post("/vercel/deploy")
def vercel_push(req: VercelDeployRequest):
    if vercel_deploy is None:
        raise HTTPException(503, "vercel_client_unavailable")
    ok, out = vercel_deploy(req.project_dir, prod=req.prod)
    if not ok:
        raise HTTPException(400, out)
    return {"status": "deployed", "detail": out}

@app.post("/dns/a")
def dns_a(req: DNSRequest):
    ok, out = set_a_record(req.domain, req.host, req.ip, req.ttl)
    if not ok:
        raise HTTPException(400, out)
    return {"status": "updated", "detail": out}

@app.post("/llm/complete")
def llm_complete_ep(req: LLMRequest):
    text = llm_complete_fn(provider=req.provider, model=req.model, prompt=req.prompt)
    return {"output": text}

@app.post("/agent/run")
def run_agent(req: AgentTaskRequest):
    report = run_agent_task_fn(req.goal, req.params)
    return {"report": report}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
