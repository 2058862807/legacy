@echo off
color 0A
title NexteraEstate AI Team - Quick Chat

echo.
echo ================================================
echo    NexteraEstate AI Quick Chat
echo ================================================
echo.

REM Auto-detect common Emergent URL patterns
echo [INFO] Setting up connection to your AI team...

REM You need to replace this URL with your actual Emergent backend URL
REM Get this from your Emergent preview URL and change 3001 to 8001
set BACKEND_URL=https://8001-your-username-your-project.emergent.com/api

echo [URL] Backend: %BACKEND_URL%
echo.

REM Quick test
echo [TEST] Testing connection...
curl -s "%BACKEND_URL:~0,-4%/health" -o nul --connect-timeout 5
if errorlevel 1 (
    echo [ERROR] Cannot connect. Please edit this file and set your correct Emergent URL.
    echo [HELP] Replace 'your-username-your-project' with your actual Emergent URL.
    pause
    exit /b 1
)
echo [SUCCESS] Connected to AI team!
echo.

:CHAT
echo ================================================
echo Choose AI Agent:
echo [1] AutoLex Core [2] Senior Manager [3] Full Team
echo ================================================
set /p AGENT="Select (1-3): "

if "%AGENT%"=="1" set RECIPIENT=autolex
if "%AGENT%"=="2" set RECIPIENT=senior_manager  
if "%AGENT%"=="3" set RECIPIENT=team

echo.
echo Enter your message (or 'quit' to exit):
set /p MESSAGE="Message: "

if /i "%MESSAGE%"=="quit" exit /b 0
if "%MESSAGE%"=="" goto CHAT

echo.
echo [AI] Processing your request...

REM Send message using curl
curl -X POST "%BACKEND_URL%/ai-team/communicate" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"%MESSAGE%\",\"recipient\":\"%RECIPIENT%\",\"priority\":\"normal\"}" ^
  --silent ^
  --show-error

echo.
echo.
goto CHAT