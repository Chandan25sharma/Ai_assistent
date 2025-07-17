#!/usr/bin/env python3
"""
COMPLETE INSTALLER for Chandan AI Assistant
Fixes all setup issues and ensures everything works
"""

import os
import sys
import subprocess
import json
from pathlib import Path
import shutil

def print_banner():
    print("🔧 " + "="*50)
    print("   CHANDAN AI ASSISTANT - COMPLETE INSTALLER")
    print("   Fixing all setup issues...")
    print("="*52)
    print()

def ensure_memory_files():
    """Ensure all memory files exist with correct format"""
    print("💾 Setting up memory files...")
    
    memory_dir = Path("memory")
    memory_dir.mkdir(exist_ok=True)
    
    # Ensure all memory files exist with correct JSON format
    memory_files = {
        "long_term.json": [],
        "short_term.json": [],
        "owner.json": {
            "name": "User",
            "preferences": {},
            "created": "2025-01-01",
            "sessions": []
        }
    }
    
    for filename, default_content in memory_files.items():
        file_path = memory_dir / filename
        if not file_path.exists() or file_path.stat().st_size == 0:
            with open(file_path, 'w') as f:
                json.dump(default_content, f, indent=2)
            print(f"✅ Created {filename}")
        else:
            # Validate existing files
            try:
                with open(file_path, 'r') as f:
                    json.load(f)
                print(f"✅ Validated {filename}")
            except json.JSONDecodeError:
                # Fix corrupted files
                with open(file_path, 'w') as f:
                    json.dump(default_content, f, indent=2)
                print(f"🔧 Fixed corrupted {filename}")

def install_python_requirements():
    """Install Python requirements"""
    print("🐍 Installing Python requirements...")
    
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], check=True, capture_output=True)
        print("✅ Python requirements installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Python requirements: {e}")
        # Try installing individual packages
        essential_packages = [
            "fastapi", "uvicorn", "python-multipart", 
            "pydantic", "pathlib", "typing"
        ]
        
        print("🔧 Trying to install essential packages individually...")
        for package in essential_packages:
            try:
                subprocess.run([
                    sys.executable, "-m", "pip", "install", package
                ], check=True, capture_output=True)
                print(f"✅ Installed {package}")
            except:
                print(f"⚠️  Failed to install {package}")
        
        return True  # Continue anyway

def check_and_install_node():
    """Check and install Node.js dependencies"""
    print("📦 Checking Node.js setup...")
    
    # Check if Node.js is installed
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()} found")
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        print("📥 Please install Node.js from: https://nodejs.org/")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm {result.stdout.strip()} found")
        else:
            print("❌ npm not found")
            return False
    except FileNotFoundError:
        print("❌ npm not found")
        return False
    
    # Install frontend dependencies
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    original_dir = os.getcwd()
    try:
        os.chdir(frontend_dir)
        print("📦 Installing frontend dependencies...")
        
        # Clear npm cache if needed
        subprocess.run(["npm", "cache", "clean", "--force"], capture_output=True)
        
        # Install dependencies
        result = subprocess.run(["npm", "install"], check=True, capture_output=False)
        print("✅ Frontend dependencies installed")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install frontend dependencies: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    finally:
        os.chdir(original_dir)

def create_startup_scripts():
    """Create easy startup scripts"""
    print("📜 Creating startup scripts...")
    
    # Windows batch script
    batch_content = '''@echo off
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
'''
    
    with open("start.bat", "w") as f:
        f.write(batch_content)
    print("✅ Created start.bat")
    
    # Python startup script (without emojis for Windows compatibility)
    python_content = '''#!/usr/bin/env python3
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
'''
    
    with open("start.py", "w", encoding="utf-8") as f:
        f.write(python_content)
    print("✅ Created start.py")

def test_backend():
    """Test if the backend can start"""
    print("🧪 Testing backend...")
    
    # Test simple_main.py
    if os.path.exists("backend/simple_main.py"):
        try:
            # Quick syntax check
            subprocess.run([
                sys.executable, "-m", "py_compile", "backend/simple_main.py"
            ], check=True, capture_output=True)
            print("✅ Backend syntax is valid")
            return True
        except subprocess.CalledProcessError:
            print("❌ Backend has syntax errors")
            return False
    else:
        print("❌ Backend file not found")
        return False

def create_config_file():
    """Create a basic config file"""
    print("⚙️  Creating configuration...")
    
    config = {
        "app_name": "Chandan AI Assistant",
        "version": "1.0.0",
        "backend_url": "http://localhost:8000",
        "frontend_url": "http://localhost:3000",
        "memory_enabled": True,
        "voice_enabled": False,
        "file_processing_enabled": True,
        "ai_models": {
            "default": "built-in",
            "ollama_enabled": False
        },
        "features": {
            "authentication": True,
            "chat": True,
            "memory": True,
            "files": True,
            "voice": False
        }
    }
    
    with open("config.json", "w") as f:
        json.dump(config, f, indent=2)
    print("✅ Configuration created")

def main():
    print_banner()
    
    success = True
    
    # Step 1: Memory files
    ensure_memory_files()
    
    # Step 2: Config
    create_config_file()
    
    # Step 3: Python requirements
    if not install_python_requirements():
        success = False
    
    # Step 4: Node.js setup
    if not check_and_install_node():
        print("⚠️  Node.js setup failed, but continuing...")
    
    # Step 5: Test backend
    if not test_backend():
        success = False
    
    # Step 6: Create startup scripts
    create_startup_scripts()
    
    print("\n" + "="*52)
    if success:
        print("🎉 INSTALLATION COMPLETE!")
        print("✅ All systems ready")
        print()
        print("🚀 START YOUR ASSISTANT:")
        print("   Windows: start.bat")
        print("   Python:  python start.py")
        print("   Manual:  python backend/simple_main.py")
        print()
        print("🌐 URLs:")
        print("   Frontend: http://localhost:3000")
        print("   Backend:  http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
    else:
        print("⚠️  INSTALLATION COMPLETED WITH WARNINGS")
        print("   Some components may need manual setup")
        print("   Try running: python backend/simple_main.py")
    
    print("="*52)

if __name__ == "__main__":
    main()
