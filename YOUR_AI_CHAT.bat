@echo off
color 0A
title NexteraEstate AI Team - Direct Access

echo.
echo ================================================
echo    NexteraEstate AI Team - WORKING VERSION
echo ================================================
echo    Your URL: estate-genius-1.preview.emergentagent.com
echo ================================================
echo.

REM Your exact backend URL based on your Emergent setup
set BACKEND_URL=https://estate-api-bridge.preview.emergentagent.com:8001/api

echo [INFO] Connecting to your AI team at:
echo [URL] %BACKEND_URL%
echo.

REM Test connection first
echo [TEST] Testing connection to your AI agents...
curl -s "%BACKEND_URL:~0,-4%/health" -o nul --connect-timeout 10
if errorlevel 1 (
    echo [ERROR] Cannot connect to AI team backend.
    echo [INFO] Trying alternative URL patterns...
    
    REM Try without port
    set BACKEND_URL=https://estate-api-bridge.preview.emergentagent.com/api/8001
    curl -s "https://estate-api-bridge.preview.emergentagent.com/api/health" -o nul --connect-timeout 10
    if errorlevel 1 (
        echo [ERROR] Still cannot connect.
        echo [DEBUG] Please check that your Emergent environment is running.
        pause
        exit /b 1
    )
)
echo [SUCCESS] Connected to your AI team!
echo.

:MAIN_MENU
cls
echo.
echo ================================================
echo    NexteraEstate AI Team - Select Agent
echo ================================================
echo.
echo Choose your AI agent:
echo   [1] 🧠 AutoLex Core      - Legal intelligence and development help
echo   [2] 👔 Senior AI Manager - System monitoring and optimization  
echo   [3] 👥 Full AI Team      - Coordinated response from all agents
echo   [4] 📊 Quick Status      - Get system health report
echo   [5] ❓ Help Menu        - Common questions
echo   [6] Exit
echo.
set /p CHOICE="Select option (1-6): "

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
    set MESSAGE=Provide a comprehensive system status report including all components, performance metrics, any issues, and recommendations for my NexteraEstate platform.
    goto SEND_MESSAGE
)
if "%CHOICE%"=="5" goto HELP_MENU
if "%CHOICE%"=="6" goto EXIT

echo Invalid choice. Please try again.
pause
goto MAIN_MENU

:HELP_MENU
cls
echo.
echo ================================================
echo    Common Questions for Your AI Team
echo ================================================
echo.
echo [1] What's my system status?
echo [2] Help me prepare for production launch
echo [3] What are my competitive advantages?
echo [4] California will requirements
echo [5] How to optimize my platform?
echo [6] Review my legal compliance
echo [7] Back to main menu
echo.
set /p HELP_CHOICE="Select question (1-7): "

if "%HELP_CHOICE%"=="1" (
    set RECIPIENT=senior_manager
    set MESSAGE=What is the current status of all NexteraEstate systems? Please include performance metrics, operational status, and any recommendations.
    goto SEND_MESSAGE
)
if "%HELP_CHOICE%"=="2" (
    set RECIPIENT=team
    set MESSAGE=Help me prepare my NexteraEstate platform for production launch. What are the critical steps, potential issues, and optimization recommendations?
    goto SEND_MESSAGE
)
if "%HELP_CHOICE%"=="3" (
    set RECIPIENT=autolex
    set MESSAGE=What are NexteraEstate's key competitive advantages over LegalZoom, Rocket Lawyer, and other estate planning platforms? How should I position these advantages?
    goto SEND_MESSAGE
)
if "%HELP_CHOICE%"=="4" (
    set RECIPIENT=autolex
    set MESSAGE=What are the complete legal requirements for creating a valid will in California? Please provide comprehensive guidance including witness requirements, notarization, and compliance standards.
    goto SEND_MESSAGE
)
if "%HELP_CHOICE%"=="5" (
    set RECIPIENT=team
    set MESSAGE=How can I optimize my NexteraEstate platform for better performance, user experience, and scalability? What are the priority areas to focus on?
    goto SEND_MESSAGE
)
if "%HELP_CHOICE%"=="6" (
    set RECIPIENT=autolex
    set MESSAGE=Review my NexteraEstate platform's legal compliance features. Are there any gaps or improvements needed for the 50-state compliance system?
    goto SEND_MESSAGE
)
if "%HELP_CHOICE%"=="7" goto MAIN_MENU

echo Invalid choice.
pause
goto HELP_MENU

:INPUT_MESSAGE
echo.
echo ================================================
echo    Talking to: %AGENT_NAME%
echo ================================================
echo.
echo Enter your message for %AGENT_NAME%:
echo (Type your question about estate planning, system status, development, etc.)
echo.
set /p MESSAGE="Your message: "

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
echo ⏳ Please wait while your AI agent processes your request...
echo.

REM Create JSON request
echo {"message":"%MESSAGE%","recipient":"%RECIPIENT%","priority":"high"} > temp_ai_request.json

REM Send request to AI team
curl -X POST "%BACKEND_URL%/ai-team/communicate" ^
  -H "Content-Type: application/json" ^
  -d @temp_ai_request.json ^
  -w "\n\n✅ HTTP Status: %%{http_code} | Response Time: %%{time_total}s\n" ^
  --connect-timeout 30 ^
  --max-time 60

if errorlevel 1 (
    echo.
    echo ❌ [ERROR] Failed to communicate with AI team.
    echo 🔧 [DEBUG] Backend URL: %BACKEND_URL%
    echo 💡 [TIP] Make sure your Emergent environment is fully running.
)

REM Clean up
del temp_ai_request.json 2>nul

echo.
echo ================================================
echo.
set /p CONTINUE="Press Enter to continue, or type 'menu' for main menu: "
if /i "%CONTINUE%"=="menu" goto MAIN_MENU
goto MAIN_MENU

:EXIT
echo.
echo ================================================
echo    Thank you for using NexteraEstate AI Team!
echo ================================================
echo.
echo 🤖 Your AI agents are always available to help with:
echo    • Estate planning legal guidance
echo    • System optimization and monitoring  
echo    • Platform development assistance
echo    • Production launch preparation
echo    • Competitive analysis and strategy
echo.
echo 🚀 Keep building your revolutionary estate planning platform!
echo.
pause
exit /b 0