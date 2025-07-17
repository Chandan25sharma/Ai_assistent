@echo off
echo ============================================================
echo    CHANDAN AI ASSISTANT - Windows Quick Start
echo ============================================================
echo.

echo Starting backend server...
cd /d "%~dp0"
start "Backend Server" python backend/simple_main.py

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend server...
cd frontend
start "Frontend Server" npm start

echo.
echo ============================================================
echo    CHANDAN AI ASSISTANT IS STARTING!
echo    Backend API: http://localhost:8000
echo    Frontend UI: http://localhost:3000
echo    API Docs: http://localhost:8000/docs
echo ============================================================
echo.
echo Press any key to exit...
pause > nul
