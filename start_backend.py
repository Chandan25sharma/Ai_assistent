#!/usr/bin/env python3
"""
Simple backend starter for Chandan AI Assistant
"""

import os
import sys
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

try:
    # Try to import and run the backend
    from backend.main import app
    import uvicorn
    
    print("🚀 Starting Chandan AI Assistant Backend...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Press Ctrl+C to stop")
    print("="*50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("💡 Make sure you've installed the requirements:")
    print("   pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error starting backend: {e}")
    sys.exit(1)
