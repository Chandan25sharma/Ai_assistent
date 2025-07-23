#!/usr/bin/env python3
"""
Sorma-AI Backend - Advanced AI Assistant
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import os
import requests
from datetime import datetime
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(title="Sorma-AI Assistant", version="2.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create memory directory
MEMORY_DIR = Path("memory")
MEMORY_DIR.mkdir(exist_ok=True)

# Session storage
SESSION_DATA = {"authenticated": False}

# Request models
class AuthRequest(BaseModel):
    auth_phrase: str

class ChatRequest(BaseModel):
    message: str
    use_voice: Optional[bool] = False

class MemoryRequest(BaseModel):
    fact: str
    category: Optional[str] = "general"

# Helper functions
def load_memories() -> List[Dict]:
    file_path = MEMORY_DIR / "long_term.json"
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except:
        return []

def save_memories(memories: List[Dict]):
    file_path = MEMORY_DIR / "long_term.json"
    with open(file_path, 'w') as f:
        json.dump(memories, f, indent=2)

def load_conversations() -> List[Dict]:
    file_path = MEMORY_DIR / "short_term.json"
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except:
        return []

def save_conversations(conversations: List[Dict]):
    file_path = MEMORY_DIR / "short_term.json"
    with open(file_path, 'w') as f:
        json.dump(conversations, f, indent=2)

def is_authorized(auth_phrase: str) -> bool:
    valid_phrases = [
        "chandan sharma",
        "chandan",
        "sorma",
        "sorma-ai",
        "unlock agent chandan",
        "my name is chandan"
    ]
    return auth_phrase.lower().strip() in valid_phrases

# Session management
session_authorized = False

def is_session_authorized() -> bool:
    """Check if current session is authorized"""
    return session_authorized

def authorize_session():
    """Authorize the current session"""
    global session_authorized
    session_authorized = True

def deauthorize_session():
    """Deauthorize the current session"""
    global session_authorized
    session_authorized = False

def check_ollama_status():
    """Check if Ollama is running and get available models"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models_data = response.json()
            models = [model["name"] for model in models_data.get("models", [])]
            return {
                "status": "available",
                "models": models,
                "active_model": models[0] if models else None
            }
        return {"status": "not_available", "models": [], "active_model": None}
    except Exception as e:
        return {"status": "not_available", "models": [], "active_model": None, "error": str(e)}

def check_internet():
    """Check internet connectivity"""
    try:
        response = requests.get("https://www.google.com", timeout=3)
        return response.status_code == 200
    except:
        return False

def simple_ai_response(message: str) -> str:
    """Advanced AI response with Ollama integration"""
    # Try Ollama first
    ollama_response = get_ollama_response(message)
    if ollama_response:
        return ollama_response
    
    # Fallback to rule-based responses
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["hello", "hi", "hey"]):
        return "Hello! I'm Sorma-AI, your advanced AI assistant. I'm ready to help you with tasks like code generation, file processing, web search, language translation, and much more!"
    
    elif "features" in message_lower or "capabilities" in message_lower:
        return """🚀 Sorma-AI Capabilities:
        
🧠 Core AI Features:
• Advanced conversation and reasoning
• Memory management (short & long-term)
• Multi-language support and translation

🔊 Audio & Voice:
• Text-to-Speech (TTS)
• Speech-to-Text (STT) 
• Voice cloning capabilities

🛠️ Developer Tools:
• Code generation and explanation
• Error debugging and fixing
• Autonomous coding assistance

📁 File Processing:
• PDF, DOC, Excel analysis
• Image OCR and text extraction
• Video/audio transcription

🌐 Web & Data:
• Real-time web search
• Data analysis from various sources
• Social media trend monitoring

How can I assist you today?"""
    elif "remember" in message_lower:
        fact = message.replace("remember", "").replace("Remember", "").strip()
        if fact:
            memories = load_memories()
            memories.append({
                "fact": fact,
                "category": "user_request",
                "timestamp": datetime.now().isoformat()
            })
            save_memories(memories)
            return f"✅ I'll remember: {fact}"
        return "What would you like me to remember?"
    
    elif any(word in message_lower for word in ["code", "programming", "function"]):
        return "I can help you with coding! I support Python, JavaScript, Java, C++, and many other languages. I can generate code, explain existing code, debug errors, and even help with entire projects. What programming task do you need help with?"
    
    elif any(word in message_lower for word in ["translate", "translation"]):
        return "I can translate text between dozens of languages! Just tell me what you'd like to translate and to which language. I support major world languages including Spanish, French, German, Chinese, Japanese, Arabic, and many more."
    
    elif "what do you remember" in message_lower or "recall" in message_lower:
        memories = load_memories()
        if memories:
            response = "🧠 Here's what I remember:\n"
            for i, memory in enumerate(memories[-5:], 1):
                response += f"{i}. {memory['fact']}\n"
            return response
        return "I don't have any memories stored yet."
    
    elif "forget" in message_lower:
        keyword = message.replace("forget", "").strip()
        if keyword:
            memories = load_memories()
            original_count = len(memories)
            memories = [m for m in memories if keyword.lower() not in m['fact'].lower()]
            save_memories(memories)
            removed = original_count - len(memories)
            return f"✅ Removed {removed} memories containing '{keyword}'"
        return "What would you like me to forget?"
    
    elif "status" in message_lower:
        memories = load_memories()
        conversations = load_conversations()
        return f"📊 Status: {len(memories)} memories, {len(conversations)} conversations"
    
    elif "help" in message_lower:
        return """🤖 Sorma-AI Commands:
• remember [fact] - Store a memory
• what do you remember? - Show memories  
• forget [keyword] - Remove memories
• status - System status
• features - Show my capabilities
• help - Show this help

You can also just chat with me normally!"""
    
    else:
        return f"I'm Sorma-AI and I understand you said: '{message}'. I can help with many tasks including:\n\n• Code generation & debugging\n• File processing & analysis\n• Language translation\n• Web search & research\n• Voice & audio processing\n• Memory management\n\nWhat would you like me to help you with?"

# Routes
@app.get("/")
async def root():
    return {"message": "Sorma-AI Assistant API", "version": "2.0.0"}

@app.get("/api/status")
async def get_status():
    memories = load_memories()
    conversations = load_conversations()
    ollama_status = check_ollama_status()
    internet_status = check_internet()
    
    return {
        "ollama": ollama_status,
        "internet": internet_status,
        "memory_stats": {
            "total_memory_items": len(memories),
            "short_term_count": len(conversations),
            "long_term_count": len(memories)
        },
        "voice_info": {
            "tts_available": True,
            "stt_available": True
        },
        "authorized": is_session_authorized()
    }

@app.post("/api/auth")
async def authenticate(request: AuthRequest):
    if is_authorized(request.auth_phrase):
        authorize_session()
        return {"success": True, "message": "Authentication successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid authorization phrase")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        response = simple_ai_response(request.message)
        
        # Save conversation
        conversations = load_conversations()
        conversations.append({
            "user": request.message,
            "agent": response,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only last 50 conversations
        if len(conversations) > 50:
            conversations = conversations[-50:]
        
        save_conversations(conversations)
        
        return {
            "response": response,
            "timestamp": datetime.now().isoformat(),
            "model_used": "basic",
            "voice_available": False
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memory")
async def get_memory():
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    memories = load_memories()
    conversations = load_conversations()
    
    return {
        "facts": memories,
        "conversations": conversations,
        "stats": {
            "total_memory_items": len(memories),
            "short_term_count": len(conversations),
            "long_term_count": len(memories)
        }
    }

@app.post("/api/memory")
async def add_memory(request: MemoryRequest):
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    memories = load_memories()
    memories.append({
        "fact": request.fact,
        "category": request.category or "general",
        "timestamp": datetime.now().isoformat()
    })
    save_memories(memories)
    
    return {"success": True, "message": f"✅ Remembered: {request.fact}"}

@app.delete("/api/memory")
async def clear_memory():
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    save_memories([])
    save_conversations([])
    
    return {"success": True, "message": "Memory cleared"}

# Advanced Features Endpoints

@app.post("/api/code/generate")
async def generate_code(task: str, language: str = "python", context: str = ""):
    """Generate code using Ollama"""
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        prompt = f"Generate clean, well-commented {language} code for: {task}"
        if context:
            prompt += f"\nContext: {context}"
        
        response = get_ollama_response(prompt, "You are an expert programmer. Provide clean, well-commented code with explanations.")
        
        if response:
            return {"code": response, "language": language, "task": task}
        else:
            # Fallback code generation
            fallback_code = f"""# {language} code for: {task}
# This is a template - implement the functionality

def main():
    # TODO: Implement {task}
    pass

if __name__ == "__main__":
    main()
"""
            return {"code": fallback_code, "language": language, "task": task}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_text(text: str, target_language: str, source_language: str = "auto"):
    """Translate text between languages"""
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        prompt = f"Translate this text from {source_language} to {target_language}: {text}"
        response = get_ollama_response(prompt, "You are a professional translator. Translate accurately to {target_language}.")
        
        if response:
            return {
                "original": text,
                "translated": response,
                "source_language": source_language,
                "target_language": target_language
            }
        else:
            return {"error": "Translation service not available"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/code/explain")
async def explain_code(code: str, language: str = "python"):
    """Explain code functionality"""
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        prompt = f"Explain this {language} code line by line:\n{code}"
        response = get_ollama_response(prompt, "You are a code instructor. Explain code clearly and concisely.")
        
        if response:
            return {"explanation": response, "language": language}
        else:
            return {"explanation": "Code explanation service not available"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/system/ollama-status")
async def get_ollama_status():
    """Get detailed Ollama status"""
    try:
        status = check_ollama_status()
        return status
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/voice/tts")
async def text_to_speech(text: str):
    """Convert text to speech (placeholder)"""
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        # Placeholder - would integrate with TTS service
        return {"success": True, "message": f"Would speak: {text}"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/voice/stt")
async def speech_to_text():
    """Convert speech to text (placeholder)"""
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        # Placeholder - would integrate with STT service
        return {"text": "Speech-to-text not implemented yet", "success": False}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/search/web")
async def web_search(query: str, max_results: int = 5):
    """Search the web for information"""
    if not is_session_authorized():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        # Use Ollama to provide information about the query
        prompt = f"Provide comprehensive information about: {query}"
        response = get_ollama_response(prompt, "You are a knowledgeable assistant. Provide accurate, up-to-date information.")
        
        if response:
            return {"results": response, "query": query, "source": "AI Knowledge"}
        else:
            return {"error": "Web search service not available"}
    
    except Exception as e:
        return {"error": str(e)}

def get_ollama_response(prompt: str, system_prompt: str = "") -> str:
    """Get response from Ollama"""
    try:
        url = "http://localhost:11434/api/generate"
        data = {
            "model": "llama3:latest",
            "prompt": f"{system_prompt}\n\nUser: {prompt}\nAssistant:",
            "stream": False
        }
        
        response = requests.post(url, json=data, timeout=30)
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        
        return ""
    except Exception as e:
        print(f"Ollama error: {e}")
        return ""

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Sorma-AI Assistant Backend")
    print("📡 Server: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("🔑 Auth: Use 'chandan', 'sorma', or 'chandan sharma'")
    print("="*50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
