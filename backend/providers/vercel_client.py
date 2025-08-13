import os, subprocess
from pathlib import Path
from typing import Tuple

def vercel_deploy(project_dir: str, prod: bool = True) -> Tuple[bool, str]:
    token = os.getenv("VERCEL_TOKEN", "")
    if not token:
        return False, "VERCEL_TOKEN missing"
    cmd = ["vercel", "--token", token]
    if prod:
        cmd.append("--prod")
    try:
        cp = subprocess.run(cmd, cwd=Path(project_dir), capture_output=True, text=True)
        if cp.returncode != 0:
            return False, cp.stderr or cp.stdout
        return True, cp.stdout
    except Exception as e:
        return False, str(e)
