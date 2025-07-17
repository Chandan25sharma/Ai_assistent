# Authentication and Authorization for Agent Chandan
import json
import re
from typing import Dict, Optional
from pathlib import Path

class AuthManager:
    def __init__(self, owner_file: str = "memory/owner.json"):
        self.owner_file = Path(owner_file)
        self.owner_data = self._load_owner_data()
        self.session_active = False  # Add session tracking
    
    def _load_owner_data(self) -> Dict:
        """Load owner data from file"""
        if self.owner_file.exists():
            with open(self.owner_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def is_authorized(self, input_text: str, user_name: Optional[str] = None) -> bool:
        """Check if user is authorized to use the agent"""
        if not self.owner_data:
            return False
        
        auth_phrase = self.owner_data.get("auth_phrase", "").lower()
        owner_name = self.owner_data.get("name", "").lower()
        
        input_lower = input_text.lower()
        
        # Check for auth phrase
        auth_phrases = self.owner_data.get("auth_phrases", [])
        if not auth_phrases:
            # Fallback to single auth phrase
            auth_phrase = self.owner_data.get("auth_phrase", "").lower()
            if auth_phrase:
                auth_phrases = [auth_phrase]
        
        # Check all auth phrases
        for phrase in auth_phrases:
            if phrase.lower() in input_lower:
                return True
        
        # Check for owner name
        if owner_name and any(part in input_lower for part in owner_name.split()):
            return True
        
        # Check for wake words
        wake_words = ["chandan", "agent", "assistant", "sorma", "sorma-ai"]
        if any(word in input_lower for word in wake_words):
            return True
        
        return False
    
    def get_unauthorized_response(self) -> str:
        """Get response for unauthorized users"""
        owner_name = self.owner_data.get("name", "my owner")
        return f"🚫 Sorry, I only respond to {owner_name}. Please use the correct authorization phrase."
    
    def get_owner_name(self) -> str:
        """Get owner's name"""
        return self.owner_data.get("name", "Owner")
    
    def get_owner_preferences(self) -> Dict:
        """Get owner's preferences"""
        return self.owner_data.get("preferences", {})
    
    def update_last_access(self):
        """Update last access time"""
        from datetime import datetime
        self.owner_data["last_access"] = datetime.now().isoformat()
        
        with open(self.owner_file, 'w', encoding='utf-8') as f:
            json.dump(self.owner_data, f, indent=2, ensure_ascii=False)
    
    def is_command(self, text: str) -> bool:
        """Check if text contains a command"""
        commands = [
            "remember", "forget", "recall", "what do you remember",
            "clear memory", "reset", "status", "help"
        ]
        
        text_lower = text.lower()
        return any(cmd in text_lower for cmd in commands)
    
    def extract_command(self, text: str) -> Optional[Dict]:
        """Extract command from text"""
        text_lower = text.lower().strip()
        
        # Remember command
        if text_lower.startswith("remember "):
            return {
                "type": "remember",
                "content": text[9:].strip()
            }
        
        # Forget command
        if text_lower.startswith("forget "):
            return {
                "type": "forget",
                "content": text[7:].strip()
            }
        
        # Recall/What do you remember
        if any(phrase in text_lower for phrase in ["what do you remember", "recall", "show memory"]):
            return {
                "type": "recall",
                "content": ""
            }
        
        # Clear memory
        if any(phrase in text_lower for phrase in ["clear memory", "reset memory", "forget everything"]):
            return {
                "type": "clear_memory",
                "content": ""
            }
        
        # Status
        if text_lower in ["status", "how are you", "what's your status"]:
            return {
                "type": "status",
                "content": ""
            }
        
        # Help
        if text_lower in ["help", "what can you do", "commands"]:
            return {
                "type": "help",
                "content": ""
            }
        
        return None
    
    def is_session_active(self) -> bool:
        """Check if session is active"""
        return self.session_active
    
    def activate_session(self):
        """Activate the session"""
        self.session_active = True
    
    def deactivate_session(self):
        """Deactivate the session"""
        self.session_active = False
