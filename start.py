#!/usr/bin/env python3
import subprocess
import sys
import time
import os

print("Starting Chandan AI Assistant...")

# Start backend
print("Starting backend...")
backend_process = subprocess.Popen([sys.executable, "backend/simple_main.py"])

# Wait a bit
time.sleep(3)

# Start frontend
print("Starting frontend...")
try:
    os.chdir("frontend")
    frontend_process = subprocess.Popen(["npm", "start"])
    os.chdir("..")
except:
    print("Failed to start frontend. Run manually: cd frontend && npm start")

print("Services started!")
print("Backend: http://localhost:8000")
print("Frontend: http://localhost:3000")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Stopping...")
    backend_process.terminate()
    try:
        frontend_process.terminate()
    except:
        pass
