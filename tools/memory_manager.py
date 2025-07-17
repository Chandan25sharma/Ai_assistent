# Memory Management System for Agent Chandan
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

class MemoryManager:
    def __init__(self, memory_dir: str = "memory"):
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(exist_ok=True)
        
        self.short_term_file = self.memory_dir / "short_term.json"
        self.long_term_file = self.memory_dir / "long_term.json"
        self.owner_file = self.memory_dir / "owner.json"
        
        # Initialize files if they don't exist
        self._initialize_files()
    
    def _initialize_files(self):
        """Initialize memory files if they don't exist"""
        if not self.short_term_file.exists():
            self._save_json(self.short_term_file, [])
        
        if not self.long_term_file.exists():
            self._save_json(self.long_term_file, [])
    
    def _load_json(self, file_path: Path) -> Any:
        """Load JSON data from file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return [] if file_path.name != "owner.json" else {}
    
    def _save_json(self, file_path: Path, data: Any):
        """Save JSON data to file"""
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def add_conversation(self, user_msg: str, agent_response: str):
        """Add conversation to short-term memory"""
        conversations = self._load_json(self.short_term_file)
        
        conversation = {
            "timestamp": datetime.now().isoformat(),
            "user": user_msg,
            "agent": agent_response,
            "session_id": self._get_session_id()
        }
        
        conversations.append(conversation)
        
        # Keep only last 50 conversations
        if len(conversations) > 50:
            conversations = conversations[-50:]
        
        self._save_json(self.short_term_file, conversations)
    
    def remember_fact(self, fact: str, category: Optional[str] = "general") -> str:
        """Add fact to long-term memory"""
        facts = self._load_json(self.long_term_file)
        
        # Handle None category
        if category is None:
            category = "general"
        
        fact_entry = {
            "timestamp": datetime.now().isoformat(),
            "fact": fact,
            "category": category,
            "importance": "high"
        }
        
        facts.append(fact_entry)
        self._save_json(self.long_term_file, facts)
        
        return f"✅ Remembered: {fact}"
    
    def forget_fact(self, keyword: str):
        """Remove facts containing keyword"""
        facts = self._load_json(self.long_term_file)
        original_count = len(facts)
        
        facts = [f for f in facts if keyword.lower() not in f.get("fact", "").lower()]
        
        self._save_json(self.long_term_file, facts)
        removed_count = original_count - len(facts)
        
        if removed_count > 0:
            return f"✅ Forgot {removed_count} fact(s) containing '{keyword}'"
        else:
            return f"❌ No facts found containing '{keyword}'"
    
    def get_all_facts(self) -> List[Dict]:
        """Get all long-term facts"""
        return self._load_json(self.long_term_file)
    
    def get_recent_conversations(self, limit: int = 10) -> List[Dict]:
        """Get recent conversations"""
        conversations = self._load_json(self.short_term_file)
        return conversations[-limit:]
    
    def search_memory(self, query: str) -> List[Dict]:
        """Search both short-term and long-term memory"""
        results = []
        
        # Search facts
        facts = self._load_json(self.long_term_file)
        for fact in facts:
            if query.lower() in fact.get("fact", "").lower():
                results.append({"type": "fact", "content": fact})
        
        # Search conversations
        conversations = self._load_json(self.short_term_file)
        for conv in conversations:
            if (query.lower() in conv.get("user", "").lower() or 
                query.lower() in conv.get("agent", "").lower()):
                results.append({"type": "conversation", "content": conv})
        
        return results
    
    def clear_memory(self, memory_type: str = "all"):
        """Clear memory (short, long, or all)"""
        if memory_type in ["short", "all"]:
            self._save_json(self.short_term_file, [])
        
        if memory_type in ["long", "all"]:
            self._save_json(self.long_term_file, [])
        
        return f"✅ Cleared {memory_type} memory"
    
    def get_memory_stats(self) -> Dict:
        """Get memory statistics"""
        short_term = self._load_json(self.short_term_file)
        long_term = self._load_json(self.long_term_file)
        
        return {
            "short_term_count": len(short_term),
            "long_term_count": len(long_term),
            "total_memory_items": len(short_term) + len(long_term)
        }
    
    def _get_session_id(self) -> str:
        """Generate session ID based on current date"""
        return datetime.now().strftime("%Y%m%d_%H")
    
    def get_context_for_prompt(self, limit: int = 5) -> str:
        """Get relevant context to include in AI prompt"""
        context = []
        
        # Add recent conversations
        recent_convs = self.get_recent_conversations(limit)
        if recent_convs:
            context.append("Recent conversations:")
            for conv in recent_convs[-3:]:  # Last 3 conversations
                context.append(f"User: {conv['user']}")
                context.append(f"You: {conv['agent']}")
        
        # Add relevant facts
        facts = self.get_all_facts()
        if facts:
            context.append("\nImportant facts you should remember:")
            for fact in facts[-5:]:  # Last 5 facts
                context.append(f"- {fact['fact']}")
        
        return "\n".join(context) if context else ""
