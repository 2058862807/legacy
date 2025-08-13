import os
from pathlib import Path
from typing import Tuple
from git import Repo, GitCommandError

def github_commit_push(repo_path: str, message: str, remote: str, branch: str) -> Tuple[bool, str]:
    try:
        repo = Repo(Path(repo_path))
        repo.git.add(all=True)
        if repo.is_dirty(untracked_files=True):
            repo.index.commit(message)
        else:
            # still push in case remote changed
            pass
        origin = repo.remote(remote)
        out = origin.push(refspec=f"{branch}:{branch}")
        return True, str(out)
    except GitCommandError as e:
        return False, f"git error {e}"
    except Exception as e:
        return False, f"error {e}"
