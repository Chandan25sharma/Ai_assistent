#!/usr/bin/env python3
"""
Chandan AI Assistant - Main Entry Point
Run this file to start your personal AI assistant
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from agent_core import ChandanAI

def main():
    """Main entry point for the AI assistant"""
    
    print("🚀 Starting Chandan AI Assistant...")
    print("=" * 50)
    
    # Check command line arguments
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
        
        if mode == "web":
            print("🌐 Starting Web Interface...")
            try:
                import streamlit as st
                os.system(f"streamlit run {Path(__file__).parent}/web_interface.py")
            except ImportError:
                print("❌ Streamlit not installed. Install with: pip install streamlit")
                print("💡 Starting CLI mode instead...")
                agent = ChandanAI()
                agent.chat_mode()
        
        elif mode == "voice":
            print("🎤 Starting Voice Mode...")
            agent = ChandanAI()
            agent.voice_mode()
        
        elif mode == "cli":
            print("💻 Starting CLI Mode...")
            agent = ChandanAI()
            agent.chat_mode()
        
        elif mode == "status":
            agent = ChandanAI()
            agent._show_status()
        
        elif mode == "help":
            print_help()
        
        else:
            print(f"❌ Unknown mode: {mode}")
            print_help()
    
    else:
        # Default: CLI mode
        print("💻 Starting CLI Mode (default)...")
        agent = ChandanAI()
        agent.chat_mode()

def print_help():
    """Print help information"""
    print("""
🤖 CHANDAN AI ASSISTANT

USAGE:
    python run.py [mode]

MODES:
    cli      - Command line interface (default)
    web      - Web interface (requires streamlit)
    voice    - Voice interaction mode
    status   - Show system status
    help     - Show this help

EXAMPLES:
    python run.py              # Start CLI mode
    python run.py web          # Start web interface
    python run.py voice        # Start voice mode
    python run.py status       # Show system status

FIRST TIME SETUP:
    1. Install Ollama: https://ollama.ai/
    2. Download a model: ollama pull llama3
    3. Install dependencies: pip install -r requirements.txt
    4. Run: python run.py

FEATURES:
    ✅ Memory (remembers facts and conversations)
    ✅ File processing (PDF, DOCX, Excel, etc.)
    ✅ Voice interaction (TTS/STT)
    ✅ Online/Offline AI models
    ✅ Web interface with modern UI
    ✅ Authorization (only responds to you)
    
COMMANDS:
    • remember [fact]       - Remember something
    • forget [keyword]      - Forget facts containing keyword
    • recall               - Show all memories
    • process file: [path] - Process and summarize file
    • clear memory         - Clear all memories
    • status              - Show system status
    • help                - Show help
    """)

if __name__ == "__main__":
    main()