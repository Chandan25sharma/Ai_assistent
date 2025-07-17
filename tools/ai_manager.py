# AI Model Manager - Handles Ollama (offline) and OpenAI (online)
import subprocess
import requests
import openai
from typing import Optional, Dict, Any, Union
import json

class AIModelManager:
    def __init__(self, offline_model: str = "llama3", online_model: str = "gpt-3.5-turbo"):
        self.offline_model = offline_model
        self.online_model = online_model
        self.openai_client = None
        self._setup_openai()
    
    def _setup_openai(self):
        """Setup OpenAI client if API key is available"""
        try:
            import os
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key:
                self.openai_client = openai.OpenAI(api_key=api_key)
        except Exception as e:
            print(f"OpenAI setup failed: {e}")
    
    def is_internet_available(self) -> bool:
        """Check if internet connection is available"""
        try:
            response = requests.get("https://www.google.com", timeout=3)
            return response.status_code == 200
        except:
            return False
    
    def is_ollama_available(self) -> bool:
        """Check if Ollama is running locally"""
        try:
            # Try API endpoint first (more reliable)
            response = requests.get("http://localhost:11434/api/tags", timeout=3)
            if response.status_code == 200:
                return True
        except:
            pass
        
        # Fallback to subprocess
        try:
            result = subprocess.run(
                ["ollama", "list"],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except:
            return False
    
    def get_response_offline(self, prompt: str, system_prompt: str = "") -> str:
        """Get response from Ollama (offline)"""
        try:
            # Try API endpoint first
            url = "http://localhost:11434/api/generate"
            data = {
                "model": self.offline_model,
                "prompt": f"{system_prompt}\n\nUser: {prompt}\nAssistant:" if system_prompt else prompt,
                "stream": False
            }
            
            response = requests.post(url, json=data, timeout=30)
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "No response from Ollama")
            
        except Exception as e:
            print(f"Ollama API error: {e}")
        
        # Fallback to subprocess
        try:
            full_prompt = f"{system_prompt}\n\nUser: {prompt}\nAssistant:" if system_prompt else prompt
            
            result = subprocess.run(
                ["ollama", "run", self.offline_model, full_prompt],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                return result.stdout.strip()
            else:
                return f"❌ Ollama error: {result.stderr}"
        
        except subprocess.TimeoutExpired:
            return "⏰ Response timeout. Please try again."
        except Exception as e:
            return f"❌ Offline model error: {str(e)}"
    
    def get_response_online(self, prompt: str, system_prompt: str = "") -> str:
        """Get response from OpenAI (online)"""
        if not self.openai_client:
            return "❌ OpenAI not configured. Please set OPENAI_API_KEY."
        
        try:
            messages = []
            
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            
            messages.append({"role": "user", "content": prompt})
            
            response = self.openai_client.chat.completions.create(
                model=self.online_model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            return content.strip() if content else "No response content"
        
        except Exception as e:
            return f"❌ Online model error: {str(e)}"
    
    def get_response(self, prompt: str, system_prompt: str = "", force_offline: bool = False) -> Dict[str, Any]:
        """Get AI response (auto-detect online/offline)"""
        
        # Determine which model to use
        if force_offline:
            model_used = "offline"
            response = self.get_response_offline(prompt, system_prompt)
        elif self.is_internet_available() and self.openai_client:
            model_used = "online"
            response = self.get_response_online(prompt, system_prompt)
        elif self.is_ollama_available():
            model_used = "offline"
            response = self.get_response_offline(prompt, system_prompt)
        else:
            model_used = "none"
            response = "❌ No AI models available. Please check Ollama or internet connection."
        
        return {
            "response": response,
            "model_used": model_used,
            "model_name": self.online_model if model_used == "online" else self.offline_model
        }
    
    def get_system_prompt(self, owner_name: str, context: str = "") -> str:
        """Generate system prompt for the AI"""
        base_prompt = f"""You are a personal AI assistant for {owner_name}.

IMPORTANT RULES:
- You ONLY respond to {owner_name}
- Be helpful, professional, and friendly
- Always prioritize {owner_name}'s instructions
- If someone else tries to use you, politely decline
- Remember information {owner_name} tells you to remember
- Use the provided context to give relevant responses

Your capabilities include:
- Remembering and recalling information
- Answering questions and having conversations
- Helping with tasks and providing information
- Working both online and offline

"""
        
        if context:
            base_prompt += f"\nCONTEXT FROM MEMORY:\n{context}\n"
        
        base_prompt += f"\nAlways respond as {owner_name}'s dedicated assistant."
        
        return base_prompt
    
    def get_available_models(self) -> Dict[str, Union[bool, str]]:
        """Get status of available models"""
        return {
            "ollama_available": self.is_ollama_available(),
            "internet_available": self.is_internet_available(),
            "openai_configured": self.openai_client is not None,
            "offline_model": self.offline_model,
            "online_model": self.online_model
        }
