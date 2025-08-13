import os
import subprocess
from pathlib import Path
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from providers.github_client import github_commit_push
from providers.vercel_client import vercel_deploy
from providers.email_client import fetch_unread, send_reply
def set_a_record(*args, **kwargs):
    return False, "namecheap disabled"

from ai.llm import llm_complete
from automation.agent import run_agent_task

load_dotenv()

PORT = int(os.getenv("PORT", "7861"))

app = FastAPI(title="Dream Assistant", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/email/reply")
def email_reply(req: EmailReplyRequest):
    msgs = fetch_unread(search=req.thread_query)
    if not msgs:
        return {"status": "no_matches"}
    if req.dry_run:
        return {"status": "dry_run", "matches": len(msgs)}
    send_reply(msgs[0], req.reply_text)
    return {"status": "sent"}

@app.post("/git/push")
def git_push(req: GitPushRequest):
    ok, out = github_commit_push(req.repo_path, req.message, req.remote, req.branch)
    if not ok:
        raise HTTPException(400, out)
    return {"status": "pushed", "detail": out}

@app.post("/vercel/deploy")
def vercel_push(req: VercelDeployRequest):
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
    text = llm_complete(provider=req.provider, model=req.model, prompt=req.prompt)
    return {"output": text}

@app.post("/agent/run")
def run_agent(req: AgentTaskRequest):
    report = run_agent_task(req.goal, req.params)
    return {"report": report}


from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory=str(Path(__file__).resolve().parent.parent / "frontend"), html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
