@echo off
title NexteraEstate AI Team Communication
color 0A

echo.
echo ===============================================
echo    NexteraEstate AI Team Communication
echo ===============================================
echo.
echo Connecting to your AI team...
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running or not accessible
    echo Please start Docker Desktop first
    pause
    exit /b 1
)

REM Connect to Docker container and run the AI chat script
docker exec -it app_backend_1 python3 /app/talk_to_ai.py

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Could not connect to AI team
    echo Trying alternative connection...
    echo.
    
    REM Alternative: Try different container name
    docker exec -it nexteraestate-backend-1 python3 /app/talk_to_ai.py
    
    if %errorlevel% neq 0 (
        echo ERROR: Still cannot connect. Please check:
        echo 1. Docker Desktop is running
        echo 2. Your NexteraEstate containers are running
        echo 3. Run: docker ps to see container names
        echo.
        pause
    )
)

pause