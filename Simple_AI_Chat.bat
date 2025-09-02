@echo off
title NexteraEstate AI Team
color 0A

echo.
echo 🤖 NexteraEstate AI Team Chat
echo ==============================
echo Connecting to your AI team...
echo.

REM Simple curl command to test connection first
curl -s http://localhost:8001/api/ai-team/test-connection >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Cannot connect to AI team
    echo Please make sure:
    echo 1. Docker Desktop is running
    echo 2. Your NexteraEstate backend is running
    echo.
    pause
    exit /b 1
)

echo ✅ Connected! 
echo.

REM Get user input and send to AI team
set /p "message=💬 Ask your AI team: "
if "%message%"=="" (
    echo No message entered. Goodbye!
    pause
    exit /b 0
)

echo.
echo ⏳ Processing your request...
echo.

REM Send message to AI team using curl
curl -X POST "http://localhost:8001/api/ai-team/communicate" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"%message%\",\"recipient\":\"team\",\"priority\":\"normal\"}"

echo.
echo.
echo 🎯 Want to ask another question? Just run this again!
pause