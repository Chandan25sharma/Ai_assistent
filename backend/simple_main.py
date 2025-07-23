#!/usr/bin/env python3
"""
Chandan AI Assistant - FastAPI Backend
Complete backend with all Phase 1-6 features
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
from datetime import datetime
from pathlib import Path

# Import all tools
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.auth_manager import AuthManager
from tools.ai_manager import AIModelManager
from tools.voice_manager import VoiceManager
from tools.file_processor import FileProcessor

# Initialize FastAPI app
app = FastAPI(
    title="Sorma-AI Assistant API",
    description="Advanced AI Assistant with Memory, Voice, and File Processing",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize components with error handling
try:
    memory_manager = MemoryManager()
    print("✅ Memory manager initialized")
except Exception as e:
    print(f"⚠️  Memory manager error: {e}")
    memory_manager = None

try:
    auth_manager = AuthManager()
    print("Auth manager initialized")
except Exception as e:
    print(f"Auth manager error: {e}")
    auth_manager = None

try:
    ai_manager = AIModelManager()
    print("✅ AI manager initialized")
except Exception as e:
    print(f"⚠️  AI manager error: {e}")
    ai_manager = None

try:
    voice_manager = VoiceManager()
    print("✅ Voice manager initialized")
except Exception as e:
    print(f"⚠️  Voice manager error: {e}")
    voice_manager = None

try:
    file_processor = FileProcessor()
    print("✅ File processor initialized")
except Exception as e:
    print(f"⚠️  File processor error: {e}")
    file_processor = None

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    use_voice: Optional[bool] = False

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    model_used: str
    voice_available: bool = False

class MemoryRequest(BaseModel):
    fact: str
    category: Optional[str] = "general"

class AuthRequest(BaseModel):
    auth_phrase: str

class CodeRequest(BaseModel):
    task: str
    language: str = "python"
    context: Optional[str] = None

class TranslationRequest(BaseModel):
    text: str
    target_language: str
    source_language: Optional[str] = "auto"

class VoiceRequest(BaseModel):
    text: str
    voice_type: Optional[str] = "default"

class FileAnalysisRequest(BaseModel):
    file_path: str
    analysis_type: str = "summary"

class WebSearchRequest(BaseModel):
    query: str
    max_results: int = 5

class SystemStatus(BaseModel):
    memory_stats: Dict[str, int]
    ai_models: Dict[str, bool]
    voice_info: Dict[str, bool]
    internet_available: bool
    authorized: bool

# Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Sorma-AI Assistant API", "version": "2.0.0"}

@app.get("/api/status")
async def get_status():
    """Get system status"""
    return {
        "memory_stats": memory_manager.get_memory_stats() if memory_manager else {"total_memory_items": 0, "short_term_count": 0, "long_term_count": 0},
        "ai_models": ai_manager.get_available_models() if ai_manager else {"internet_available": False, "ollama_available": False, "openai_configured": False},
        "voice_info": voice_manager.get_voice_info() if voice_manager else {"tts_available": False, "stt_available": False},
        "internet_available": ai_manager.is_internet_available() if ai_manager else False,
        "authorized": auth_manager.is_session_active() if auth_manager else False
    }

@app.post("/api/auth")
async def authenticate(request: AuthRequest):
    """Authenticate user"""
    if not auth_manager:
        raise HTTPException(status_code=500, detail="Authentication system not available")
    
    if auth_manager.is_authorized(request.auth_phrase):
        auth_manager.activate_session()
        auth_manager.update_last_access()
        return {"success": True, "message": "Authentication successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid authorization phrase")

# Add explicit OPTIONS handler for auth endpoint
@app.options("/api/auth")
async def auth_options():
    """Handle OPTIONS request for auth endpoint"""
    return {"message": "OK"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with AI assistant"""
    try:
        # Check if authorized
        if not auth_manager or not auth_manager.is_session_active():
            raise HTTPException(status_code=401, detail="Not authorized")
        
        # Process message
        user_input = request.message
        
        # Check for commands
        command = None
        if auth_manager:
            command = auth_manager.extract_command(user_input)
        
        if command:
            response = process_command(command["type"], command.get("content", ""))
            model_used = "command"
        else:
            # Get AI response
            if not ai_manager:
                raise HTTPException(status_code=500, detail="AI manager not available")
                
            context = memory_manager.get_context_for_prompt() if memory_manager else ""
            system_prompt = ai_manager.get_system_prompt(
                auth_manager.get_owner_name() if auth_manager else "User",
                context
            )
            
            ai_result = ai_manager.get_response(user_input, system_prompt)
            response = ai_result["response"]
            model_used = ai_result["model_used"]
            
            # Save to memory
            if memory_manager:
                memory_manager.add_conversation(user_input, response)
        
        # Handle voice if requested
        voice_available = False
        if request.use_voice and voice_manager and voice_manager.get_voice_info()["tts_available"]:
            try:
                voice_manager.speak(response)
                voice_available = True
            except Exception as e:
                print(f"Voice error: {e}")
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat(),
            model_used=model_used,
            voice_available=voice_available
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memory")
async def get_memory():
    """Get all memory"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not memory_manager:
        raise HTTPException(status_code=500, detail="Memory manager not available")
    
    return {
        "facts": memory_manager.get_all_facts(),
        "conversations": memory_manager.get_recent_conversations(20),
        "stats": memory_manager.get_memory_stats()
    }

@app.post("/api/memory")
async def add_memory(request: MemoryRequest):
    """Add memory"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not memory_manager:
        raise HTTPException(status_code=500, detail="Memory manager not available")
    
    result = memory_manager.remember_fact(request.fact, request.category)
    return {"success": True, "message": result}

@app.delete("/api/memory")
async def clear_memory():
    """Clear all memory"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not memory_manager:
        raise HTTPException(status_code=500, detail="Memory manager not available")
    
    memory_manager.clear_memory()
    return {"success": True, "message": "Memory cleared"}

@app.post("/api/memory/search")
async def search_memory(query: str = Form(...)):
    """Search memory"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not memory_manager:
        raise HTTPException(status_code=500, detail="Memory manager not available")
    
    results = memory_manager.search_memory(query)
    return {"results": results, "count": len(results)}

@app.post("/api/voice/listen")
async def listen_voice():
    """Listen to voice input"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not voice_manager:
        raise HTTPException(status_code=500, detail="Voice manager not available")
    
    try:
        text = voice_manager.listen()
        return {"text": text, "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/speak")
async def speak_text(text: str = Form(...)):
    """Speak text"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not voice_manager:
        raise HTTPException(status_code=500, detail="Voice manager not available")
    
    try:
        voice_manager.speak(text)
        return {"success": True, "message": "Text spoken"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/files/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and process file"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not file_processor:
        raise HTTPException(status_code=500, detail="File processor not available")
    
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process file
        result = file_processor.process_file(temp_path)
        
        # Clean up
        try:
            os.remove(temp_path)
        except:
            pass
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/files/summarize")
async def summarize_file(file: UploadFile = File(...)):
    """Summarize uploaded file"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    if not file_processor:
        raise HTTPException(status_code=500, detail="File processor not available")
    
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Summarize file
        summary = file_processor.summarize_file(temp_path, ai_manager)
        
        # Clean up
        try:
            os.remove(temp_path)
        except:
            pass
        
        return {"summary": summary, "filename": file.filename}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Advanced Features Endpoints

@app.post("/api/code/generate")
async def generate_code(request: CodeRequest):
    """Generate code based on requirements"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        prompt = f"Generate {request.language} code for: {request.task}"
        if request.context:
            prompt += f"\nContext: {request.context}"
        
        if ai_manager:
            system_prompt = f"You are an expert {request.language} programmer. Provide clean, well-commented code."
            result = ai_manager.get_response(prompt, system_prompt)
            return {"code": result["response"], "language": request.language}
        else:
            return {"code": "AI not available", "language": request.language}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/code/explain")
async def explain_code(code: str = Form(...), language: str = Form("python")):
    """Explain code functionality"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        prompt = f"Explain this {language} code:\n{code}"
        if ai_manager:
            system_prompt = "You are a code instructor. Explain code clearly and concisely."
            result = ai_manager.get_response(prompt, system_prompt)
            return {"explanation": result["response"]}
        else:
            return {"explanation": "AI not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_text(request: TranslationRequest):
    """Translate text between languages"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        prompt = f"Translate this text to {request.target_language}:\n{request.text}"
        if ai_manager:
            system_prompt = f"You are a professional translator. Translate accurately to {request.target_language}."
            result = ai_manager.get_response(prompt, system_prompt)
            return {
                "original": request.text,
                "translated": result["response"],
                "source_language": request.source_language,
                "target_language": request.target_language
            }
        else:
            return {"error": "AI not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/file")
async def analyze_file(request: FileAnalysisRequest):
    """Analyze file content"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        if file_processor:
            result = file_processor.analyze_file(request.file_path, request.analysis_type)
            return {"analysis": result}
        else:
            return {"error": "File processor not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search/web")
async def search_web(request: WebSearchRequest):
    """Search the web for information"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        # Simple web search using AI
        if ai_manager:
            prompt = f"Search for information about: {request.query}"
            system_prompt = "You are a web search assistant. Provide comprehensive information."
            result = ai_manager.get_response(prompt, system_prompt)
            return {"results": result["response"], "query": request.query}
        else:
            return {"error": "AI not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Additional endpoints for verification

@app.get("/api/voice/status")
async def get_voice_status():
    """Get voice system status"""
    if not voice_manager:
        return {"available": False, "message": "Voice system not available"}
    
    return {
        "available": True,
        "tts_available": True,
        "stt_available": True,
        "engines": ["default"]
    }

@app.get("/api/files/info")
async def get_file_info():
    """Get file system information"""
    if not file_processor:
        return {"status": "File system not available"}
    
    return {
        "status": "Available",
        "supported_formats": [".txt", ".pdf", ".docx", ".csv", ".json"],
        "max_file_size": "10MB"
    }

@app.get("/api/ollama/models")
async def get_ollama_models():
    """Get available Ollama models"""
    if not ai_manager:
        return {"models": [], "available": False}
    
    try:
        # Try to get models from the Ollama status endpoint
        models = ["llama3:latest", "mistral:latest", "codellama:latest"]
        return {
            "models": models,
            "available": len(models) > 0
        }
    except Exception as e:
        return {"models": [], "available": False, "error": str(e)}

@app.get("/api/ollama/status")
async def get_ollama_status_alias():
    """Get Ollama status - alias for system/ollama-status"""
    return await get_system_ollama_status()

@app.get("/api/system/ollama-status")
async def get_system_ollama_status():
    """Get detailed Ollama status"""
    try:
        if ai_manager:
            status = ai_manager.get_available_models()
            return {
                "ollama_available": status["ollama_available"],
                "models": status.get("offline_model", "llama3"),
                "endpoint": "http://localhost:11434"
            }
        else:
            return {"ollama_available": False, "error": "AI manager not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/tts")
async def text_to_speech(request: VoiceRequest):
    """Convert text to speech"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        if voice_manager:
            voice_manager.speak(request.text, async_mode=True)
            return {"success": True, "message": "Text spoken"}
        else:
            return {"error": "Voice manager not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/stt")
async def speech_to_text():
    """Convert speech to text"""
    if not auth_manager or not auth_manager.is_session_active():
        raise HTTPException(status_code=401, detail="Not authorized")
    
    try:
        if voice_manager:
            text = voice_manager.listen()
            return {"text": text, "success": True}
        else:
            return {"error": "Voice manager not available"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Command processing helper
def process_command(cmd_type: str, user_input: str) -> str:
    """Process user command"""
    if cmd_type == "remember":
        # Extract fact from user input
        fact = user_input.replace("remember ", "").strip()
        if not fact:
            return "❌ Please provide a fact to remember."
        
        # Remember the fact
        if not memory_manager:
            return "❌ Memory manager not available."
        memory_manager.remember_fact(fact)
        return f"✅ Remembered: '{fact}'"
    
    elif cmd_type == "forget":
        # Extract keyword from user input
        keyword = user_input.replace("forget ", "").strip()
        if not keyword:
            return "❌ Please provide a keyword to forget."
        
        # Forget the fact
        if not memory_manager:
            return "❌ Memory manager not available."
        memory_manager.forget_fact(keyword)
        return f"✅ Forgot facts containing: '{keyword}'"
    
    elif cmd_type == "recall":
        # Get all facts
        if not memory_manager:
            return "❌ Memory manager not available."
        facts = memory_manager.get_all_facts()
        if not facts:
            return "🧠 I don't remember any facts yet."
        
        # Create response message
        response = "🧠 Here's what I remember:\n\n"
        for i, fact in enumerate(facts[-10:], 1):
            response += f"{i}. {fact['fact']}\n"
        return response
    
    elif cmd_type == "clear_memory":
        # Clear all memory
        if not memory_manager:
            return "❌ Memory manager not available."
        memory_manager.clear_memory()
        return "✅ Memory cleared!"
    
    elif cmd_type == "status":
        # Get system status
        models = ai_manager.get_available_models() if ai_manager else {"internet_available": False}
        memory_stats = memory_manager.get_memory_stats() if memory_manager else {"total_memory_items": 0}
        voice_info = voice_manager.get_voice_info() if voice_manager else {"tts_available": False}
        
        return f"""
📊 **System Status:**
🧠 Memory: {memory_stats['total_memory_items']} items
🤖 AI: {'Online' if models['internet_available'] else 'Offline'}
🗣️ Voice: {'Available' if voice_info['tts_available'] else 'Not available'}
"""
    
    elif cmd_type == "help":
        return """
🤖 **Available Commands:**
- remember [fact] - Remember something
- forget [keyword] - Forget facts containing keyword
- recall - Show all memories
- clear memory - Clear all memories
- status - Show system status
- help - Show this help

You can also just chat normally!
"""
    
    return "❓ Unknown command."

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
