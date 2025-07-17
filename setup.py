#!/usr/bin/env python3
"""
Chandan AI Assistant - Setup Script
Automated setup for your personal AI assistant
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def print_header():
    print("🤖 " + "="*50)
    print("   CHANDAN AI ASSISTANT - SETUP")
    print("   Phase 1-6 Complete Installation")
    print("="*52)
    print()

def check_python_version():
    """Check Python version"""
    print("📋 Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required. Current version:", f"{version.major}.{version.minor}")
        sys.exit(1)
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")

def check_node_version():
    """Check Node.js version"""
    print("📋 Checking Node.js version...")
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js {version} - OK")
            return True
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        return False

def install_python_deps():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True)
        print("✅ Python dependencies installed")
    except subprocess.CalledProcessError as e:
        print("❌ Failed to install Python dependencies")
        print(f"Error: {e}")
        return False
    return True

def install_node_deps():
    """Install Node.js dependencies"""
    print("📦 Installing Node.js dependencies...")
    
    # Store current directory
    original_dir = os.getcwd()
    
    try:
        # Check if npm is available
        try:
            subprocess.run(["npm", "--version"], check=True, capture_output=True)
        except FileNotFoundError:
            print("❌ npm command not found. Please install Node.js first.")
            print("📥 Download from: https://nodejs.org/")
            return False
        
        # Change to frontend directory
        if not os.path.exists("frontend"):
            print("❌ Frontend directory not found")
            return False
        
        os.chdir("frontend")
        
        # Install dependencies
        print("   Running npm install...")
        result = subprocess.run(["npm", "install"], check=True, capture_output=False)
        print("✅ Node.js dependencies installed")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Node.js dependencies: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error during npm install: {e}")
        return False
    finally:
        # Always return to original directory
        os.chdir(original_dir)

def check_ollama():
    """Check if Ollama is installed"""
    print("🧠 Checking Ollama installation...")
    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Ollama is installed")
            models = result.stdout
            if "llama3" in models or "llama2" in models or "mistral" in models:
                print("✅ AI models available")
            else:
                print("⚠️  No AI models found. Run: ollama pull llama3")
        else:
            print("❌ Ollama not found")
            print("📥 Install from: https://ollama.ai/")
            return False
    except FileNotFoundError:
        print("❌ Ollama not found")
        print("📥 Install from: https://ollama.ai/")
        return False
    return True

def create_memory_dirs():
    """Create memory directories"""
    print("📁 Creating memory directories...")
    memory_dir = Path("memory")
    memory_dir.mkdir(exist_ok=True)
    
    # Create initial memory files
    short_term_file = memory_dir / "short_term.json"
    long_term_file = memory_dir / "long_term.json"
    owner_file = memory_dir / "owner.json"
    
    if not short_term_file.exists():
        with open(short_term_file, 'w') as f:
            json.dump([], f)
    
    if not long_term_file.exists():
        with open(long_term_file, 'w') as f:
            json.dump([], f)
    
    if not owner_file.exists():
        owner_data = {
            "name": "Chandan Sharma",
            "auth_phrase": "chandan sharma",
            "preferences": {
                "voice_enabled": True,
                "auto_save": True
            },
            "created": "2024-01-01T00:00:00Z"
        }
        with open(owner_file, 'w') as f:
            json.dump(owner_data, f, indent=2)
    
    print("✅ Memory directories created")

def create_startup_scripts():
    """Create startup scripts"""
    print("📝 Creating startup scripts...")
    
    # Windows batch script
    with open("start_assistant.bat", "w") as f:
        f.write("""@echo off
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
""")
    
    # Linux/Mac shell script
    with open("start_assistant.sh", "w") as f:
        f.write("""#!/bin/bash
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
""")
    
    # Make shell script executable
    try:
        os.chmod("start_assistant.sh", 0o755)
    except:
        pass
    
    print("✅ Startup scripts created")

def main():
    """Main setup function"""
    print_header()
    
    # Check requirements
    check_python_version()
    node_available = check_node_version()
    
    if not node_available:
        print("⚠️  Node.js is required for the React frontend")
        print("📥 Install from: https://nodejs.org/")
        response = input("Continue with backend-only setup? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Install dependencies
    if not install_python_deps():
        print("❌ Python setup failed")
        sys.exit(1)
    
    if node_available:
        if not install_node_deps():
            print("⚠️  Frontend setup failed, but backend should work")
            print("💡 You can run the backend with: python backend/main.py")
            node_available = False
    
    # Check Ollama
    check_ollama()
    
    # Create directories and files
    create_memory_dirs()
    create_startup_scripts()
    
    print("\n🎉 Setup Complete!")
    print("="*52)
    print("✅ Backend ready (FastAPI)")
    if node_available:
        print("✅ Frontend ready (React)")
    print("✅ Memory system initialized")
    print("✅ Startup scripts created")
    print("\n🚀 Starting your AI assistant:")
    print("Windows: double-click start_assistant.bat")
    print("Linux/Mac: ./start_assistant.sh")
    print("Manual: python backend/main.py")
    print("\n📱 Access your assistant:")
    print("Frontend: http://localhost:3000")
    print("Backend: http://localhost:8000")
    print("API Docs: http://localhost:8000/docs")
    print("\n🔑 Authentication phrases:")
    print("- chandan sharma")
    print("- unlock agent chandan")
    print("- chandan")
    print("\n🎯 Ready to use your personal AI assistant!")

if __name__ == "__main__":
    main()
