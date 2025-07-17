@echo off
cd /d "%~dp0"
echo Starting Chandan AI Assistant...
echo.

echo Starting backend...
start "Chandan Backend" python backend/simple_main.py

echo Waiting for backend...
timeout /t 5 /nobreak > nul

echo Starting frontend...
cd frontend
start "Chandan Frontend" npm start

echo.
echo ============================================================
echo    CHANDAN AI ASSISTANT STARTED!
echo    Backend: http://localhost:8000
echo    Frontend: http://localhost:3000
echo    Docs: http://localhost:8000/docs
echo ============================================================
pause
