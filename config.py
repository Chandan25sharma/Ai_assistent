# Configuration for Agent Chandan AI
import os
from pathlib import Path

# Base Configuration
BASE_DIR = Path(__file__).parent
MEMORY_DIR = BASE_DIR / "memory"
TOOLS_DIR = BASE_DIR / "tools"

# Owner Configuration
OWNER_NAME = "Chandan Sharma"
OWNER_AUTH_PHRASE = "unlock agent chandan"
VOICE_WAKE_WORD = "hey chandan"

# Model Configuration
OFFLINE_MODEL = "llama3"  # Ollama model
ONLINE_MODEL = "gpt-3.5-turbo"  # OpenAI model

# API Keys (set in .env file)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Memory Limits
SHORT_TERM_LIMIT = 50  # Keep last 50 conversations
LONG_TERM_LIMIT = 1000  # Keep up to 1000 facts

# Voice Settings
TTS_ENABLED = True
STT_ENABLED = True
VOICE_RATE = 180  # Words per minute

# Web UI Settings
WEB_HOST = "127.0.0.1"
WEB_PORT = 8000
DEBUG_MODE = True
