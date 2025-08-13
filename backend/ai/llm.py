import os, requests

def llm_complete(provider: str, model: str, prompt: str) -> str:
    if provider == "openai":
        key = os.getenv("OPENAI_API_KEY", "")
        if not key:
            return "OPENAI_API_KEY missing"
        # Using Responses API style
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        body = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        r = requests.post(url, headers=headers, json=body, timeout=60)
        if r.status_code != 200:
            return f"openai error {r.status_code} {r.text[:200]}"
        return r.json()["choices"][0]["message"]["content"].strip()
    elif provider == "deepseek":
        key = os.getenv("DEEPSEEK_API_KEY", "")
        if not key:
            return "DEEPSEEK_API_KEY missing"
        # Generic JSON API pattern
        url = "https://api.deepseek.com/chat/completions"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        body = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        r = requests.post(url, headers=headers, json=body, timeout=60)
        if r.status_code != 200:
            return f"deepseek error {r.status_code} {r.text[:200]}"
        return r.json()["choices"][0]["message"]["content"].strip()
    else:
        return "unknown provider"
