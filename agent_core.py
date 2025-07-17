# Main Agent Core - Chandan AI Assistant
import sys
import os
from pathlib import Path
from typing import Dict, Any, Optional
import json
from datetime import datetime

# Add tools directory to path
sys.path.append(str(Path(__file__).parent / "tools"))

from tools.memory_manager import MemoryManager
from tools.auth_manager import AuthManager
from tools.ai_manager import AIModelManager
from tools.voice_manager import VoiceManager
from tools.file_processor import FileProcessor

class ChandanAI:
    def __init__(self):
        self.memory = MemoryManager()
        self.auth = AuthManager()
        self.ai = AIModelManager()
        self.voice = VoiceManager()
        self.file_processor = FileProcessor()
        
        self.session_id = self._generate_session_id()
        self.is_voice_mode = False
        self.is_authorized = False
        
        print("🤖 Chandan AI Assistant initialized!")
        print(f"📊 Session ID: {self.session_id}")
        self._show_status()
    
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        return datetime.now().strftime("%Y%m%d_%H%M%S")
    
    def _show_status(self):
        """Show system status"""
        models = self.ai.get_available_models()
        voice_info = self.voice.get_voice_info()
        memory_stats = self.memory.get_memory_stats()
        
        print("\n" + "="*50)
        print("🧠 SYSTEM STATUS")
        print("="*50)
        print(f"💾 Memory: {memory_stats['short_term_count']} short-term, {memory_stats['long_term_count']} long-term")
        print(f"🌐 Internet: {'✅' if models['internet_available'] else '❌'}")
        print(f"🤖 Ollama: {'✅' if models['ollama_available'] else '❌'}")
        print(f"🔑 OpenAI: {'✅' if models['openai_configured'] else '❌'}")
        print(f"🎤 Voice: {'✅' if voice_info['tts_available'] else '❌'}")
        print(f"👤 Owner: {self.auth.get_owner_name()}")
        print("="*50)
    
    def authorize(self, input_text: str) -> bool:
        """Check authorization"""
        if self.auth.is_authorized(input_text):
            self.is_authorized = True
            self.auth.update_last_access()
            return True
        return False
    
    def process_command(self, user_input: str) -> str:
        """Process user command"""
        # Check authorization first
        if not self.is_authorized:
            if not self.authorize(user_input):
                return self.auth.get_unauthorized_response()
        
        # Check for built-in commands
        command = self.auth.extract_command(user_input)
        if command:
            return self._handle_command(command)
        
        # Check for file processing
        if user_input.lower().startswith("process file:"):
            file_path = user_input[13:].strip()
            return self._process_file_command(file_path)
        
        # Regular AI conversation
        return self._get_ai_response(user_input)
    
    def _handle_command(self, command: Dict[str, str]) -> str:
        """Handle built-in commands"""
        cmd_type = command["type"]
        content = command["content"]
        
        if cmd_type == "remember":
            return self.memory.remember_fact(content)
        
        elif cmd_type == "forget":
            return self.memory.forget_fact(content)
        
        elif cmd_type == "recall":
            facts = self.memory.get_all_facts()
            if not facts:
                return "🧠 I don't remember any facts yet."
            
            response = "🧠 Here's what I remember:\n\n"
            for i, fact in enumerate(facts[-10:], 1):
                response += f"{i}. {fact['fact']} (stored: {fact['timestamp'][:10]})\n"
            return response
        
        elif cmd_type == "clear_memory":
            return self.memory.clear_memory()
        
        elif cmd_type == "status":
            self._show_status()
            return "📊 System status displayed above."
        
        elif cmd_type == "help":
            return self._get_help_text()
        
        return "❓ Unknown command."
    
    def _process_file_command(self, file_path: str) -> str:
        """Process file and return summary"""
        if not os.path.exists(file_path):
            return f"❌ File not found: {file_path}"
        
        try:
            # Process file
            result = self.file_processor.process_file(file_path)
            
            if "error" in result:
                return f"❌ {result['error']}"
            
            # Generate summary using AI
            summary = self.file_processor.summarize_file(file_path, self.ai)
            
            # Remember the file processing
            self.memory.remember_fact(f"Processed file: {file_path}")
            
            return f"📄 File processed successfully!\n\n{summary}"
        
        except Exception as e:
            return f"❌ Error processing file: {str(e)}"
    
    def _get_ai_response(self, user_input: str) -> str:
        """Get AI response with memory context"""
        try:
            # Get memory context
            context = self.memory.get_context_for_prompt()
            
            # Get system prompt
            system_prompt = self.ai.get_system_prompt(
                self.auth.get_owner_name(),
                context
            )
            
            # Get AI response
            ai_result = self.ai.get_response(user_input, system_prompt)
            response = ai_result["response"]
            
            # Save to memory
            self.memory.add_conversation(user_input, response)
            
            # Add model info
            model_info = f" [{ai_result['model_name']} - {ai_result['model_used']}]"
            
            return response + model_info
        
        except Exception as e:
            return f"❌ Error getting AI response: {str(e)}"
    
    def _get_help_text(self) -> str:
        """Get help information"""
        return """
🤖 CHANDAN AI ASSISTANT - HELP

COMMANDS:
• remember [fact]       - Remember something
• forget [keyword]      - Forget facts containing keyword
• recall / what do you remember - Show all memories
• clear memory         - Clear all memories
• status              - Show system status
• help                - Show this help

FILE PROCESSING:
• process file: [path] - Process and summarize a file

VOICE CONTROL:
• Say "Hey Chandan" to activate voice mode
• Voice commands work the same as text

SUPPORTED FILES:
• PDF, DOCX, XLSX, CSV, TXT, JSON

EXAMPLE USAGE:
• "remember my favorite color is blue"
• "process file: C:/documents/report.pdf"
• "what do you remember about my preferences?"

You can also just chat normally - I'll remember our conversation!
"""
    
    def chat_mode(self):
        """Interactive chat mode"""
        print("\n🤖 Chandan AI Assistant - Chat Mode")
        print("Type 'quit' to exit, 'voice' for voice mode, 'help' for commands")
        print("-" * 50)
        
        while True:
            try:
                user_input = input("\n👤 You: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Goodbye!")
                    break
                
                if user_input.lower() == 'voice':
                    self.voice_mode()
                    continue
                
                if not user_input:
                    continue
                
                response = self.process_command(user_input)
                print(f"\n🤖 Assistant: {response}")
                
                # Speak response if voice is enabled
                if self.voice.is_voice_available():
                    self.voice.speak(response, async_mode=True)
            
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {str(e)}")
    
    def voice_mode(self):
        """Voice interaction mode"""
        if not self.voice.is_voice_available():
            print("❌ Voice features not available.")
            return
        
        print("\n🎤 Voice Mode Activated")
        print("Say 'Hey Chandan' followed by your command")
        print("Say 'stop listening' to exit voice mode")
        
        self.is_voice_mode = True
        
        while self.is_voice_mode:
            try:
                # Listen for wake word
                if self.voice.listen_for_wake_word():
                    print("🎤 Wake word detected! Listening for command...")
                    
                    user_input = self.voice.listen(timeout=10)
                    
                    if user_input:
                        print(f"👤 You said: {user_input}")
                        
                        if "stop listening" in user_input.lower():
                            print("🔇 Exiting voice mode")
                            break
                        
                        response = self.process_command(user_input)
                        print(f"🤖 Assistant: {response}")
                        
                        # Speak response
                        self.voice.speak(response)
                    
                    else:
                        print("❌ No speech detected")
            
            except KeyboardInterrupt:
                print("\n🔇 Exiting voice mode")
                break
            except Exception as e:
                print(f"❌ Voice error: {str(e)}")
        
        self.is_voice_mode = False

def main():
    """Main entry point"""
    agent = ChandanAI()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--voice":
            agent.voice_mode()
        elif sys.argv[1] == "--status":
            agent._show_status()
        elif sys.argv[1] == "--help":
            print(agent._get_help_text())
        else:
            # Process single command
            command = " ".join(sys.argv[1:])
            response = agent.process_command(command)
            print(response)
    else:
        # Interactive mode
        agent.chat_mode()

if __name__ == "__main__":
    main()
