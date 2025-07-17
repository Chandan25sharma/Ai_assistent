#!/usr/bin/env python3
"""
Quick Start Script for Chandan AI Assistant
Simplified startup without complex dependency checking
"""

import os
import subprocess
import sys
import time
from pathlib import Path

def print_banner():
    print("🤖 " + "="*50)
    print("   CHANDAN AI ASSISTANT - QUICK START")
    print("="*52)
    print()

def start_backend():
    """Start the backend server"""
    print("🚀 Starting backend server...")
    
    # Check if we have the simple backend
    if os.path.exists("backend/simple_main.py"):
        backend_file = "backend/simple_main.py"
    elif os.path.exists("backend/main.py"):
        backend_file = "backend/main.py"
    else:
        print("❌ No backend file found!")
        return False
    
    try:
        # Start backend in background
        process = subprocess.Popen([
            sys.executable, backend_file
        ], cwd=os.getcwd())
        
        print(f"✅ Backend started with PID: {process.pid}")
        print("📡 Backend running at: http://localhost:8000")
        return process
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False

def start_frontend():
    """Start the frontend development server"""
    print("🎨 Starting frontend server...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    # Check if node_modules exists
    if not (frontend_dir / "node_modules").exists():
        print("📦 Installing frontend dependencies...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
            print("✅ Frontend dependencies installed")
        except Exception as e:
            print(f"❌ Failed to install frontend dependencies: {e}")
            print("💡 Please run: cd frontend && npm install")
            return False
    
    try:
        # Start frontend in background
        process = subprocess.Popen([
            "npm", "start"
        ], cwd=frontend_dir)
        
        print(f"✅ Frontend started with PID: {process.pid}")
        print("🌐 Frontend will be available at: http://localhost:3000")
        return process
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        print("💡 Please run: cd frontend && npm start")
        return False

def main():
    print_banner()
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("❌ Cannot start without backend")
        sys.exit(1)
    
    print("⏳ Waiting 3 seconds for backend to initialize...")
    time.sleep(3)
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("⚠️  Backend is running, but frontend failed to start")
        print("💡 You can start frontend manually: cd frontend && npm start")
    
    print("\n" + "="*52)
    print("🎉 CHANDAN AI ASSISTANT IS STARTING!")
    print("📡 Backend API: http://localhost:8000")
    print("🌐 Frontend UI: http://localhost:3000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("="*52)
    print("\n💡 Press Ctrl+C to stop all services")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping all services...")
        if backend_process:
            backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
        print("✅ All services stopped")

if __name__ == "__main__":
    main()
