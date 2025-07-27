#!/bin/bash
echo "Starting Chandan AI Assistant..."
echo ""
echo "Starting Backend..."
python backend/main.py &
BACKEND_PID=$!
sleep 3
echo ""
echo "Starting Frontend..."
cd frontend && npm start &
FRONTEND_PID=$!
cd ..
echo ""
echo "Both servers starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
wait $BACKEND_PID $FRONTEND_PID
