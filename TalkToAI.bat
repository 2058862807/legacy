@echo off
color 0A
title NexteraEstate - Talk to Senior AI Manager

echo.
echo ================================================
echo    NexteraEstate Senior AI Manager
echo ================================================
echo.

:CHAT
set /p MESSAGE="Your message: "
if "%MESSAGE%"=="" goto CHAT
if /i "%MESSAGE%"=="quit" exit /b 0

echo.
echo [AI Manager] Processing your request...
echo.

REM Create temp JSON file
echo {"message":"%MESSAGE%","recipient":"senior_manager","priority":"normal"} > temp_message.json

REM Send to AI team using curl
curl -X POST http://localhost:8001/api/ai-team/communicate ^
  -H "Content-Type: application/json" ^
  -d @temp_message.json ^
  --silent ^
  | findstr /C:"response" | findstr /V /C:"responses" | findstr /V /C:"timestamp"

REM Clean up
del temp_message.json 2>nul

echo.
echo ================================================
goto CHAT