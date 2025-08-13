from typing import Dict, Any

# Simple orchestrator stub
def run_agent_task(goal: str, params: Dict[str, Any]) -> Dict[str, Any]:
    if goal.lower().startswith("deploy"):
        return {"next": "call /vercel/deploy with project_dir", "params": params}
    if goal.lower().startswith("reply"):
        return {"next": "call /email/reply with thread_query and reply_text", "params": params}
    if goal.lower().startswith("push"):
        return {"next": "call /git/push with repo_path and message", "params": params}
    return {"note": "no matching action", "goal": goal, "params": params}
