# Sorma-AI - Advanced Personal AI Assistant

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blue" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/Python-3.8+-green" alt="Python 3.8+"/>
  <img src="https://img.shields.io/badge/React-18+-blue" alt="React 18+"/>
  <img src="https://img.shields.io/badge/FastAPI-Latest-orange" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Ollama-Supported-purple" alt="Ollama"/>
</p>

## 🚀 Overview

**Sorma-AI** is an advanced personal AI assistant that combines local AI models (Ollama) with cloud-based services to provide a comprehensive suite of AI-powered tools. Originally built as "Chandan AI Assistant," it has been completely transformed into a modern, feature-rich platform.

## ✨ Key Features

### 🤖 Core AI Capabilities
- **Multi-Model Support**: Ollama (local), OpenAI (cloud), and fallback responses
- **Intelligent Chat**: Context-aware conversations with memory retention
- **Command Processing**: Natural language command interpretation
- **Real-time Status**: Live monitoring of AI model availability

### 🧠 Memory Management
- **Persistent Memory**: Long-term fact storage and retrieval
- **Conversation History**: Short-term conversation tracking
- **Smart Search**: Semantic search through stored memories
- **Memory Analytics**: Statistics and insights about stored information

### 💻 Code Generation & Analysis
- **Multi-Language Support**: Python, JavaScript, Java, C++, and more
- **Code Generation**: Create complete programs from natural language descriptions
- **Code Explanation**: Detailed analysis and explanation of existing code
- **Error Debugging**: Intelligent debugging assistance

### 🌐 Translation & Communication
- **Multi-Language Translation**: Support for 100+ languages
- **Context-Aware Translation**: Maintains meaning and context
- **Bidirectional Translation**: Translate between any language pairs
- **Cultural Adaptation**: Localization beyond literal translation

### 🗣️ Voice Interface
- **Text-to-Speech (TTS)**: Natural voice synthesis
- **Speech-to-Text (STT)**: Accurate voice recognition
- **Voice Commands**: Voice-activated assistant interactions
- **Multiple Voice Options**: Choose from different voice profiles

### 📁 File Processing
- **Document Analysis**: PDF, DOCX, TXT, JSON processing
- **Data Extraction**: Extract structured information from documents
- **File Summarization**: Automatic document summarization
- **Content Search**: Search within file contents

### 🔍 Advanced Features
- **Web Search Integration**: Real-time information retrieval
- **System Monitoring**: Resource usage and performance tracking
- **API Documentation**: Built-in Swagger/OpenAPI documentation
- **Cross-Platform**: Windows, macOS, Linux support

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **Pydantic**: Data validation and settings management
- **SQLite**: Local database for memory storage
- **Requests**: HTTP library for external API calls
- **Uvicorn**: ASGI server implementation

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **Axios**: HTTP client for API calls

### AI & ML
- **Ollama**: Local AI model execution
- **OpenAI API**: Cloud-based AI models
- **Speech Recognition**: Voice input processing
- **Text-to-Speech**: Voice output generation

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Ollama (optional, for local AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sorma-ai.git
   cd sorma-ai
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables (optional)**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   ```

5. **Install Ollama (optional)**
   ```bash
   # On macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # On Windows
   # Download from https://ollama.ai/download
   ```

6. **Pull AI models (if using Ollama)**
   ```bash
   ollama pull llama3:latest
   ```

### Running the Application

#### Option 1: Using the startup script
```bash
# Windows
start_windows.bat

# macOS/Linux
./start.sh
```

#### Option 2: Manual startup
```bash
# Terminal 1: Start backend
python backend/simple_main.py

# Terminal 2: Start frontend
cd frontend
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 Usage Guide

### Authentication
First, authenticate with one of these phrases:
- "sorma"
- "chandan"
- "sorma-ai"
- "chandan sharma"

### Basic Chat
Simply type your message and press Enter. Sorma-AI will respond intelligently using the best available AI model.

### Commands
- **Remember**: "remember that I like pizza"
- **Recall**: "what do you remember about me?"
- **Status**: "status" or "how are you?"
- **Help**: "help" or "what can you do?"
- **Clear Memory**: "clear memory"

### Code Generation
- "generate Python code for a calculator"
- "create a JavaScript function to sort arrays"
- "explain this Python code: [paste code here]"

### Translation
- "translate 'hello' to Spanish"
- "how do you say 'thank you' in Japanese?"

### Voice Commands
- "speak this text: Hello world"
- "listen to me" (then speak)

## 🔧 Configuration

### Backend Configuration
Edit `config.json` to customize:
- AI model preferences
- Memory settings
- Voice configuration
- API endpoints

### Frontend Configuration
Edit `frontend/src/services/api.js` to modify:
- API base URL
- Request timeout
- Error handling

## 📊 API Endpoints

### Core Endpoints
- `GET /api/status` - System status
- `POST /api/auth` - Authentication
- `POST /api/chat` - Chat interface
- `GET /api/memory` - Memory retrieval
- `POST /api/memory` - Memory storage

### Advanced Endpoints
- `POST /api/code/generate` - Code generation
- `POST /api/code/explain` - Code explanation
- `POST /api/translate` - Text translation
- `POST /api/voice/tts` - Text-to-speech
- `POST /api/voice/stt` - Speech-to-text
- `GET /api/system/ollama-status` - Ollama status

## 🔒 Security

- **Authentication**: Phrase-based authentication system
- **Session Management**: Secure session handling
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Built-in request throttling
- **CORS**: Configurable cross-origin resource sharing

## 🌟 Advanced Features

### Memory System
- **Fact Storage**: Store and retrieve personal facts
- **Conversation History**: Maintain conversation context
- **Smart Categorization**: Automatic content categorization
- **Search Functionality**: Find information quickly

### AI Integration
- **Multi-Model Support**: Fallback between different AI providers
- **Context Awareness**: Maintain conversation context
- **Specialized Prompts**: Optimized prompts for different tasks
- **Performance Monitoring**: Track AI model performance

### Voice Interface
- **Natural Speech**: Human-like voice synthesis
- **Voice Recognition**: Accurate speech-to-text conversion
- **Wake Word Detection**: Voice activation
- **Multi-Language Support**: Voice in multiple languages

## 🧪 Development

### Project Structure
```
sorma-ai/
├── backend/
│   ├── main.py              # Full-featured backend
│   └── simple_main.py       # Simplified backend
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   └── public/              # Static assets
├── tools/
│   ├── ai_manager.py        # AI model management
│   ├── memory_manager.py    # Memory operations
│   ├── auth_manager.py      # Authentication
│   ├── voice_manager.py     # Voice processing
│   └── file_processor.py    # File handling
├── memory/                  # Memory storage
└── config/                  # Configuration files
```

### Adding New Features
1. **Backend**: Add new endpoints in `backend/simple_main.py`
2. **Frontend**: Create new components in `frontend/src/components/`
3. **Tools**: Add new utilities in `tools/`
4. **Memory**: Extend memory manager for new data types

### Testing
```bash
# Run backend tests
python -m pytest tests/

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** for local AI model support
- **OpenAI** for cloud-based AI services
- **React** and **FastAPI** communities
- **Tailwind CSS** for beautiful styling
- All contributors and users

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: Built-in API docs at `/docs`
- **Community**: Join our Discord server
- **Email**: support@sorma-ai.com

## 🚧 Roadmap

### Version 2.1
- [ ] Plugin system for custom extensions
- [ ] Advanced file processing (images, videos)
- [ ] Integration with external APIs
- [ ] Mobile app support

### Version 2.2
- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Advanced analytics dashboard
- [ ] Custom AI model training

### Version 3.0
- [ ] Enterprise features
- [ ] Advanced security
- [ ] Scalable deployment
- [ ] Professional support

---

<p align="center">
  <strong>Sorma-AI - Your Advanced Personal AI Assistant</strong><br>
  Built with ❤️ by the Sorma-AI Team
</p>
