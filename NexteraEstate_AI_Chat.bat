@echo off
setlocal enabledelayedexpansion
color 0A
title NexteraEstate AI Team Communication

echo.
echo ================================================
echo    NexteraEstate AI Team Communication v2.0
echo ================================================
echo    Critical AI Agent Access for Windows 11
echo ================================================
echo.

REM Set your Emergent backend URL here
REM Replace YOUR_EMERGENT_URL with your actual Emergent preview URL
REM Examples:
REM   set BACKEND_URL=https://8001-username-project.emergent.com/api
REM   set BACKEND_URL=https://preview-username.emergent.com:8001/api

echo [SETUP] Detecting your Emergent backend URL...
echo.
echo Please enter your Emergent preview URL (the one you see when you click Preview):
echo Example: https://3001-username-project.emergent.com
set /p PREVIEW_URL="Preview URL: "

REM Convert frontend URL to backend URL
set BACKEND_URL=%PREVIEW_URL:3001-=8001-%
set BACKEND_URL=%BACKEND_URL%/api

echo.
echo [INFO] Using backend URL: %BACKEND_URL%
echo.

REM Test connection first
echo [TEST] Testing connection to your AI team...
curl -s -o nul -w "HTTP Status: %%{http_code}" "%BACKEND_URL:~0,-4%/health" --connect-timeout 10
if errorlevel 1 (
    echo.
    echo [ERROR] Cannot connect to your AI team backend.
    echo [INFO] Please check:
    echo   1. Your Emergent environment is running
    echo   2. Backend is running on port 8001
    echo   3. URL is correct: %BACKEND_URL%
    echo.
    pause
    exit /b 1
)
echo  - Connection successful!
echo.

:MAIN_MENU
cls
echo.
echo ================================================
echo    NexteraEstate AI Team - Select Agent
echo ================================================
echo.
echo Choose your AI agent:
echo   [1] AutoLex Core      - Legal intelligence and development help
echo   [2] Senior AI Manager - System monitoring and optimization
echo   [3] Full AI Team      - Coordinated response from all agents
echo   [4] System Status     - Get current system health report
echo   [5] Exit
echo.
set /p CHOICE="Select option (1-5): "

if "%CHOICE%"=="1" (
    set RECIPIENT=autolex
    set AGENT_NAME=AutoLex Core
    goto INPUT_MESSAGE
)
if "%CHOICE%"=="2" (
    set RECIPIENT=senior_manager
    set AGENT_NAME=Senior AI Manager
    goto INPUT_MESSAGE
)
if "%CHOICE%"=="3" (
    set RECIPIENT=team
    set AGENT_NAME=Full AI Team
    goto INPUT_MESSAGE
)
if "%CHOICE%"=="4" (
    set RECIPIENT=senior_manager
    set AGENT_NAME=Senior AI Manager
    set MESSAGE=Give me a complete system status report including all components and their operational status
    goto SEND_MESSAGE
)
if "%CHOICE%"=="5" goto EXIT

echo Invalid choice. Please try again.
pause
goto MAIN_MENU

:INPUT_MESSAGE
echo.
echo ================================================
echo    Talking to: %AGENT_NAME%
echo ================================================
echo.
echo Quick options:
echo   [1] What is the current system status?
echo   [2] Help me with California will requirements
echo   [3] How can I optimize my platform for production?
echo   [4] What are my platform's competitive advantages?
echo   [5] Custom message
echo.
set /p MSG_CHOICE="Select quick option or 5 for custom (1-5): "

if "%MSG_CHOICE%"=="1" set MESSAGE=What is the current system status? Please provide detailed information about all components.
if "%MSG_CHOICE%"=="2" set MESSAGE=What are the requirements for a valid will in California? Please provide comprehensive legal guidance.
if "%MSG_CHOICE%"=="3" set MESSAGE=Help me optimize my NexteraEstate platform for production launch. What should I focus on?
if "%MSG_CHOICE%"=="4" set MESSAGE=What are my platform's competitive advantages over LegalZoom and other estate planning services?
if "%MSG_CHOICE%"=="5" (
    echo.
    echo Enter your message for %AGENT_NAME%:
    set /p MESSAGE="Message: "
)

if not defined MESSAGE (
    echo No message entered. Returning to menu.
    pause
    goto MAIN_MENU
)

:SEND_MESSAGE
echo.
echo [SENDING] Communicating with %AGENT_NAME%...
echo [MESSAGE] %MESSAGE%
echo.
echo Please wait while your AI agent processes your request...
echo.

REM Create temporary JSON file for the request
echo {"message":"%MESSAGE%","recipient":"%RECIPIENT%","priority":"high"} > temp_request.json

REM Send request and save response
curl -X POST "%BACKEND_URL%/ai-team/communicate" ^
  -H "Content-Type: application/json" ^
  -d @temp_request.json ^
  -w "\n\nHTTP Status: %%{http_code}\nResponse Time: %%{time_total}s\n" ^
  -o temp_response.json ^
  --connect-timeout 30 ^
  --max-time 60

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to communicate with AI team.
    echo [INFO] This could be due to:
    echo   - Network connectivity issues
    echo   - Backend service unavailable
    echo   - Incorrect URL configuration
    echo.
    echo Backend URL used: %BACKEND_URL%
    pause
    goto MAIN_MENU
)

echo.
echo ================================================
echo    AI TEAM RESPONSE
echo ================================================
echo.

REM Display the response (basic parsing)
type temp_response.json 2>nul
if errorlevel 1 (
    echo [ERROR] Could not read AI response.
    echo [DEBUG] Check temp_response.json for raw response.
)

REM Clean up temporary files
del temp_request.json 2>nul
del temp_response.json 2>nul

echo.
echo ================================================
echo.
set /p CONTINUE="Press Enter to continue, or type 'exit' to quit: "
if /i "%CONTINUE%"=="exit" goto EXIT
goto MAIN_MENU

:EXIT
echo.
echo ================================================
echo    Thank you for using NexteraEstate AI Team!
echo ================================================
echo.
echo Your AI agents are always available to help with:
echo   - Estate planning legal guidance
echo   - System optimization and monitoring  
echo   - Platform development assistance
echo   - Business strategy recommendations
echo.
pause
exit /b 0