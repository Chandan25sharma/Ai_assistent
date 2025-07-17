# Web Interface for Chandan AI Assistant
import streamlit as st
import os
from pathlib import Path
import json
from datetime import datetime

# Add tools directory to path
import sys
sys.path.append(str(Path(__file__).parent / "tools"))

from tools.memory_manager import MemoryManager
from tools.auth_manager import AuthManager
from tools.ai_manager import AIModelManager
from tools.voice_manager import VoiceManager
from tools.file_processor import FileProcessor

class WebInterface:
    def __init__(self):
        if 'agent_initialized' not in st.session_state:
            st.session_state.agent_initialized = False
        
        if not st.session_state.agent_initialized:
            self.initialize_agent()
            st.session_state.agent_initialized = True
    
    def initialize_agent(self):
        """Initialize agent components"""
        st.session_state.memory = MemoryManager()
        st.session_state.auth = AuthManager()
        st.session_state.ai = AIModelManager()
        st.session_state.voice = VoiceManager()
        st.session_state.file_processor = FileProcessor()
        st.session_state.is_authorized = False
        
        # Initialize chat history
        if 'chat_history' not in st.session_state:
            st.session_state.chat_history = []
    
    def run(self):
        """Main web interface"""
        st.set_page_config(
            page_title="Chandan AI Assistant",
            page_icon="🤖",
            layout="wide",
            initial_sidebar_state="expanded"
        )
        
        # Custom CSS
        st.markdown("""
        <style>
        .main-header {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            padding: 1rem;
            border-radius: 10px;
            color: white;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .status-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin: 1rem 0;
        }
        
        .chat-message {
            padding: 1rem;
            border-radius: 8px;
            margin: 0.5rem 0;
        }
        
        .user-message {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
        }
        
        .assistant-message {
            background: #f3e5f5;
            border-left: 4px solid #9c27b0;
        }
        </style>
        """, unsafe_allow_html=True)
        
        # Header
        st.markdown("""
        <div class="main-header">
            <h1>🤖 Chandan AI Assistant</h1>
            <p>Your Personal AI Assistant - Online/Offline Ready</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Sidebar
        self.render_sidebar()
        
        # Main content
        if not st.session_state.is_authorized:
            self.render_auth_page()
        else:
            self.render_main_interface()
    
    def render_sidebar(self):
        """Render sidebar with system info and controls"""
        st.sidebar.markdown("## 🛠️ System Status")
        
        # System status
        models = st.session_state.ai.get_available_models()
        voice_info = st.session_state.voice.get_voice_info()
        memory_stats = st.session_state.memory.get_memory_stats()
        
        status_html = f"""
        <div class="status-card">
            <h4>🧠 Memory</h4>
            <p>Short-term: {memory_stats['short_term_count']}</p>
            <p>Long-term: {memory_stats['long_term_count']}</p>
        </div>
        
        <div class="status-card">
            <h4>🤖 AI Models</h4>
            <p>Internet: {'✅' if models['internet_available'] else '❌'}</p>
            <p>Ollama: {'✅' if models['ollama_available'] else '❌'}</p>
            <p>OpenAI: {'✅' if models['openai_configured'] else '❌'}</p>
        </div>
        
        <div class="status-card">
            <h4>🎤 Voice</h4>
            <p>TTS: {'✅' if voice_info['tts_available'] else '❌'}</p>
            <p>STT: {'✅' if voice_info['stt_available'] else '❌'}</p>
        </div>
        """
        
        st.sidebar.markdown(status_html, unsafe_allow_html=True)
        
        # Controls
        st.sidebar.markdown("## 🎛️ Controls")
        
        if st.sidebar.button("🧠 Show Memory"):
            st.session_state.show_memory = True
        
        if st.sidebar.button("🗑️ Clear Memory"):
            st.session_state.memory.clear_memory()
            st.sidebar.success("Memory cleared!")
        
        if st.sidebar.button("📊 Reset Chat"):
            st.session_state.chat_history = []
            st.sidebar.success("Chat reset!")
        
        if st.sidebar.button("🔄 Refresh Status"):
            st.rerun()
    
    def render_auth_page(self):
        """Render authentication page"""
        st.markdown("## 🔐 Authentication Required")
        
        st.info("Please enter the authorization phrase to access the assistant.")
        
        auth_input = st.text_input("Authorization phrase:", type="password")
        
        if st.button("🔓 Authorize"):
            if st.session_state.auth.is_authorized(auth_input):
                st.session_state.is_authorized = True
                st.session_state.auth.update_last_access()
                st.success("✅ Authorization successful!")
                st.rerun()
            else:
                st.error("❌ Invalid authorization phrase.")
        
        st.markdown("---")
        st.markdown("**Hint:** Use your name or the phrase 'unlock agent chandan'")
    
    def render_main_interface(self):
        """Render main chat interface"""
        # Create tabs
        tab1, tab2, tab3 = st.tabs(["💬 Chat", "🧠 Memory", "📁 Files"])
        
        with tab1:
            self.render_chat_interface()
        
        with tab2:
            self.render_memory_interface()
        
        with tab3:
            self.render_file_interface()
    
    def render_chat_interface(self):
        """Render chat interface"""
        st.markdown("## 💬 Chat with Assistant")
        
        # Chat history
        chat_container = st.container()
        
        with chat_container:
            for message in st.session_state.chat_history:
                if message['role'] == 'user':
                    st.markdown(f"""
                    <div class="chat-message user-message">
                        <strong>👤 You:</strong> {message['content']}
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.markdown(f"""
                    <div class="chat-message assistant-message">
                        <strong>🤖 Assistant:</strong> {message['content']}
                    </div>
                    """, unsafe_allow_html=True)
        
        # Chat input
        with st.form("chat_form", clear_on_submit=True):
            user_input = st.text_input("Your message:", placeholder="Type your message here...")
            submitted = st.form_submit_button("Send")
            
            if submitted and user_input:
                self.process_chat_message(user_input)
                st.rerun()
    
    def render_memory_interface(self):
        """Render memory management interface"""
        st.markdown("## 🧠 Memory Management")
        
        # Memory stats
        memory_stats = st.session_state.memory.get_memory_stats()
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Short-term", memory_stats['short_term_count'])
        
        with col2:
            st.metric("Long-term", memory_stats['long_term_count'])
        
        with col3:
            st.metric("Total", memory_stats['total_memory_items'])
        
        # Add memory form
        st.markdown("### ➕ Add Memory")
        with st.form("memory_form"):
            fact = st.text_input("Fact to remember:")
            category = st.selectbox("Category:", ["general", "personal", "work", "important"])
            
            if st.form_submit_button("💾 Remember"):
                if fact:
                    result = st.session_state.memory.remember_fact(fact, category)
                    st.success(result)
                    st.rerun()
        
        # Show memories
        st.markdown("### 📝 Long-term Memory")
        facts = st.session_state.memory.get_all_facts()
        
        if facts:
            for i, fact in enumerate(reversed(facts[-20:]), 1):
                with st.expander(f"Memory {i}: {fact['fact'][:50]}..."):
                    st.write(f"**Fact:** {fact['fact']}")
                    st.write(f"**Category:** {fact['category']}")
                    st.write(f"**Stored:** {fact['timestamp'][:19]}")
        else:
            st.info("No memories stored yet.")
        
        # Search memory
        st.markdown("### 🔍 Search Memory")
        search_query = st.text_input("Search for:")
        
        if st.button("🔍 Search"):
            if search_query:
                results = st.session_state.memory.search_memory(search_query)
                if results:
                    st.write(f"Found {len(results)} results:")
                    for result in results:
                        st.write(f"- {result['content']}")
                else:
                    st.info("No results found.")
    
    def render_file_interface(self):
        """Render file processing interface"""
        st.markdown("## 📁 File Processing")
        
        # File upload
        uploaded_file = st.file_uploader(
            "Choose a file to process:",
            type=['pdf', 'docx', 'xlsx', 'csv', 'txt', 'json']
        )
        
        if uploaded_file is not None:
            # Save uploaded file temporarily
            temp_path = f"temp_{uploaded_file.name}"
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            
            # Process file
            with st.spinner("Processing file..."):
                result = st.session_state.file_processor.process_file(temp_path)
            
            if "error" in result:
                st.error(f"Error: {result['error']}")
            else:
                st.success("File processed successfully!")
                
                # Show file info
                st.write(f"**File Type:** {result.get('file_type', 'Unknown')}")
                st.write(f"**File Name:** {result.get('file_name', 'Unknown')}")
                
                # Show content based on file type
                if "text_content" in result:
                    st.markdown("### 📄 Content")
                    st.text_area("File content:", result['text_content'][:2000], height=300)
                
                elif "sheets" in result:
                    st.markdown("### 📊 Excel Data")
                    for sheet_name, sheet_data in result['sheets'].items():
                        st.write(f"**Sheet:** {sheet_name}")
                        st.write(f"Rows: {sheet_data['rows']}, Columns: {sheet_data['columns']}")
                
                # Generate summary
                if st.button("📝 Generate Summary"):
                    with st.spinner("Generating summary..."):
                        summary = st.session_state.file_processor.summarize_file(temp_path, st.session_state.ai)
                        st.markdown("### 📋 Summary")
                        st.write(summary)
            
            # Clean up temp file
            try:
                os.remove(temp_path)
            except:
                pass
        
        # Supported formats
        st.markdown("### 📋 Supported Formats")
        formats = st.session_state.file_processor.get_supported_formats()
        st.write(", ".join(formats))
    
    def process_chat_message(self, user_input: str):
        """Process chat message"""
        # Add user message to history
        st.session_state.chat_history.append({
            'role': 'user',
            'content': user_input,
            'timestamp': datetime.now().isoformat()
        })
        
        # Process with agent
        response = self.get_agent_response(user_input)
        
        # Add assistant response to history
        st.session_state.chat_history.append({
            'role': 'assistant',
            'content': response,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_agent_response(self, user_input: str) -> str:
        """Get response from agent"""
        try:
            # Check for commands
            command = st.session_state.auth.extract_command(user_input)
            if command:
                return self.handle_command(command)
            
            # Get AI response
            context = st.session_state.memory.get_context_for_prompt()
            system_prompt = st.session_state.ai.get_system_prompt(
                st.session_state.auth.get_owner_name(),
                context
            )
            
            ai_result = st.session_state.ai.get_response(user_input, system_prompt)
            response = ai_result["response"]
            
            # Save to memory
            st.session_state.memory.add_conversation(user_input, response)
            
            return response
        
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def handle_command(self, command: dict) -> str:
        """Handle built-in commands"""
        cmd_type = command["type"]
        content = command["content"]
        
        if cmd_type == "remember":
            return st.session_state.memory.remember_fact(content)
        
        elif cmd_type == "forget":
            return st.session_state.memory.forget_fact(content)
        
        elif cmd_type == "recall":
            facts = st.session_state.memory.get_all_facts()
            if not facts:
                return "🧠 I don't remember any facts yet."
            
            response = "🧠 Here's what I remember:\n\n"
            for i, fact in enumerate(facts[-10:], 1):
                response += f"{i}. {fact['fact']}\n"
            return response
        
        elif cmd_type == "clear_memory":
            st.session_state.memory.clear_memory()
            return "✅ Memory cleared!"
        
        elif cmd_type == "status":
            return "📊 Check the sidebar for system status."
        
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

def main():
    """Main function"""
    app = WebInterface()
    app.run()

if __name__ == "__main__":
    main()
