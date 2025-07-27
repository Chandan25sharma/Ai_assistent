@echo off
echo Starting Chandan AI Assistant...
echo.
echo Starting Backend...
start "Backend" cmd /k "python backend/main.py"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"
echo.
echo Both servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
