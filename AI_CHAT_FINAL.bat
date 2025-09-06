@echo off
color 0A
title NexteraEstate AI Team - FINAL VERSION

echo.
echo ================================================
echo    NexteraEstate AI Team - estate-genius-1
echo ================================================
echo.

echo [INFO] Testing connection patterns for your Emergent setup...
echo.

REM Test multiple URL patterns for Emergent
set URL1=https://legal-guardian.preview.emergentagent.com/api/8001
set URL2=https://legal-guardian.preview.emergentagent.com:8001/api  
set URL3=https://legal-guardian.preview.emergentagent.com/api
set BACKEND_URL=

echo [TEST 1] Trying: %URL1%/health
curl -s "%URL1%/health" -o nul --connect-timeout 5
if not errorlevel 1 (
    set BACKEND_URL=%URL1%
    echo [SUCCESS] ✅ Found working URL: %URL1%
    goto START_CHAT
)

echo [TEST 2] Trying: %URL2%/health  
curl -s "%URL2%/health" -o nul --connect-timeout 5
if not errorlevel 1 (
    set BACKEND_URL=%URL2%
    echo [SUCCESS] ✅ Found working URL: %URL2%
    goto START_CHAT
)

echo [TEST 3] Trying: %URL3%/health
curl -s "%URL3%/health" -o nul --connect-timeout 5  
if not errorlevel 1 (
    set BACKEND_URL=%URL3%
    echo [SUCCESS] ✅ Found working URL: %URL3%
    goto START_CHAT
)

REM If none work, ask user to provide the backend URL
echo [ERROR] ❌ Could not auto-detect backend URL.
echo.
echo 💡 MANUAL SETUP REQUIRED:
echo 1. In Emergent, check if you have multiple preview URLs
echo 2. Look for a URL ending with port 8001 or containing "8001"
echo 3. Or try accessing your frontend and check browser console for API calls
echo.
echo Your frontend URL: https://legal-guardian.preview.emergentagent.com/
echo Expected backend URL patterns:
echo   - https://legal-guardian.preview.emergentagent.com:8001/api
echo   - https://legal-guardian.preview.emergentagent.com/api  
echo   - https://legal-guardian.preview.emergentagent.com/api/8001
echo.
pause
exit /b 1

:START_CHAT
echo.
echo [CONNECTED] Backend URL: %BACKEND_URL%
echo.

:MAIN_MENU
cls
echo.
echo ================================================
echo    NexteraEstate AI Team - Chat Interface
echo ================================================
echo    Connected to: %BACKEND_URL%
echo ================================================
echo.
echo Select your AI agent:
echo   [1] 🧠 AutoLex Core      - Legal intelligence 
echo   [2] 👔 Senior AI Manager - System monitoring
echo   [3] 👥 Full AI Team      - All agents
echo   [4] 📊 System Status     - Health report
echo   [5] Exit
echo.
set /p CHOICE="Choose (1-5): "

if "%CHOICE%"=="1" (
    set RECIPIENT=autolex
    set AGENT_NAME=AutoLex Core
    goto GET_MESSAGE
)
if "%CHOICE%"=="2" (
    set RECIPIENT=senior_manager  
    set AGENT_NAME=Senior AI Manager
    goto GET_MESSAGE
)
if "%CHOICE%"=="3" (
    set RECIPIENT=team
    set AGENT_NAME=Full AI Team
    goto GET_MESSAGE
)
if "%CHOICE%"=="4" (
    set RECIPIENT=senior_manager
    set AGENT_NAME=Senior AI Manager
    set MESSAGE=Provide a comprehensive system status report for NexteraEstate including all components and their current operational status.
    goto SEND_TO_AI
)
if "%CHOICE%"=="5" goto EXIT

echo Invalid choice.
pause
goto MAIN_MENU

:GET_MESSAGE
echo.
echo Talking to: %AGENT_NAME%
echo.
echo Common questions:
echo [1] What's my system status?
echo [2] California will requirements  
echo [3] Competitive advantages analysis
echo [4] Production launch preparation
echo [5] Custom message
echo.
set /p MSG_CHOICE="Select (1-5): "

if "%MSG_CHOICE%"=="1" set MESSAGE=What is the current status of all NexteraEstate systems? Please provide detailed operational information.
if "%MSG_CHOICE%"=="2" set MESSAGE=What are the complete legal requirements for creating a valid will in California?
if "%MSG_CHOICE%"=="3" set MESSAGE=What are NexteraEstate's competitive advantages over LegalZoom and other estate planning platforms?
if "%MSG_CHOICE%"=="4" set MESSAGE=Help me prepare NexteraEstate for production launch. What are the critical steps and considerations?
if "%MSG_CHOICE%"=="5" (
    echo.
    set /p MESSAGE="Enter your message: "
)

:SEND_TO_AI
echo.
echo [SENDING] 🚀 Communicating with %AGENT_NAME%...
echo [MESSAGE] %MESSAGE%
echo.
echo ⏳ Processing your request...

REM Create JSON request
echo {"message":"%MESSAGE%","recipient":"%RECIPIENT%","priority":"high"} > ai_request.json

REM Send to AI team
curl -X POST "%BACKEND_URL%/ai-team/communicate" ^
  -H "Content-Type: application/json" ^
  -d @ai_request.json ^
  -w "\n\n✅ Response received in %%{time_total} seconds\n"

REM Clean up
del ai_request.json 2>nul

echo.
echo ================================================
pause
goto MAIN_MENU

:EXIT
echo.
echo 🚀 Thank you for using NexteraEstate AI Team!
echo Your agents are always ready to help build the future of estate planning.
echo.
pause
exit /b 0