#!/usr/bin/env python3
"""
Simple NexteraEstate System Monitor
Provides basic system status without authentication
"""

import asyncio
import json
import time
from datetime import datetime
from typing import Dict, Any
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn

app = FastAPI(title="NexteraEstate System Monitor", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICES = {
    "frontend": "http://localhost:3000",
    "backend": "http://localhost:8001/api/health", 
    "rag": "http://localhost:8001/api/rag/status",
    "compliance": "http://localhost:8001/api/compliance/summary",
    "tech_director": "http://localhost:8787/"
}

async def check_service(name: str, url: str) -> Dict[str, Any]:
    """Check if a service is healthy"""
    try:
        start_time = time.time()
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
        response_time = int((time.time() - start_time) * 1000)
        
        return {
            "name": name,
            "url": url,
            "status": "healthy" if response.status_code == 200 else "unhealthy",
            "status_code": response.status_code,
            "response_time_ms": response_time,
            "timestamp": datetime.now().isoformat(),
            "data": response.json() if response.status_code == 200 else None
        }
    except Exception as e:
        return {
            "name": name,
            "url": url, 
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.get("/")
async def root():
    """Basic service info"""
    return {
        "service": "NexteraEstate System Monitor",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "/status": "Get all service statuses",
            "/status/{service}": "Get specific service status",
            "/dashboard": "Web dashboard interface"
        }
    }

@app.get("/status")
async def get_all_status():
    """Get status of all monitored services"""
    results = {}
    tasks = [check_service(name, url) for name, url in SERVICES.items()]
    statuses = await asyncio.gather(*tasks, return_exceptions=True)
    
    for status in statuses:
        if isinstance(status, Exception):
            continue
        results[status["name"]] = status
    
    # Calculate overall health
    healthy_count = sum(1 for s in results.values() if s.get("status") == "healthy")
    total_count = len(results)
    overall_health = "healthy" if healthy_count == total_count else "degraded"
    
    return {
        "overall_status": overall_health,
        "healthy_services": healthy_count,
        "total_services": total_count,
        "timestamp": datetime.now().isoformat(),
        "services": results
    }

@app.get("/status/{service}")
async def get_service_status(service: str):
    """Get status of a specific service"""
    if service not in SERVICES:
        return {"error": f"Service '{service}' not found", "available": list(SERVICES.keys())}
    
    return await check_service(service, SERVICES[service])

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard():
    """Return the monitoring dashboard"""
    try:
        with open("/app/simple_monitor.html", "r") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Dashboard not found</h1>", status_code=404)

if __name__ == "__main__":
    print("🚀 Starting NexteraEstate System Monitor...")
    print("📊 Dashboard: http://localhost:9000/dashboard")
    print("🔍 API Status: http://localhost:9000/status")
    uvicorn.run(app, host="0.0.0.0", port=9000, log_level="info")