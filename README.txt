DREAM, a local AI assistant for deployment and ops.

WHAT YOU GET
- Local FastAPI server
- Web UI with voice in and voice out
- GitHub push helper
- Vercel deploy helper
- Email reply helper
- Namecheap DNS helper

QUICK START ON WINDOWS
1. Install Python 3.11 and Git.
2. Open PowerShell. Run:  ./installer_windows.ps1
3. After install, start the server:  .\.venv\Scripts\python.exe backend\app.py
4. Open the UI at http://localhost:7861

SECURITY
Use OAuth where possible. Store tokens in .env, not in code. Rotate keys often.

CREDENTIALS
Copy .env.example to .env and fill values.

VOICE
The UI uses the browser Web Speech API for speech synthesis and recognition.
