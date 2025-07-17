# 🤖 Chandan AI Assistant - Complete System

**Your Personal AI Assistant - Phase 1-6 Complete**

A comprehensive AI assistant with React frontend, FastAPI backend, memory management, voice control, file processing, and both online/offline capabilities.

## 🌟 Features

### ✅ Phase 1-6 Complete
- **🧠 Memory System**: Short-term & long-term memory with search
- **🗣️ Voice Control**: Text-to-Speech (TTS) & Speech-to-Text (STT)
- **📁 File Processing**: PDF, DOCX, Excel, CSV, TXT, JSON support
- **🌐 Online/Offline**: Works with Ollama (offline) or OpenAI (online)
- **🔐 Authentication**: Personal authorization system
- **💬 Chat Interface**: Modern React UI with beautiful design
- **📊 Dashboard**: System status and analytics
- **⚙️ Settings**: Comprehensive configuration options

### 🛠️ Technical Stack
- **Frontend**: React 18 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + Python 3.10+
- **AI Models**: Ollama (local) + OpenAI (cloud)
- **Memory**: JSON-based persistent storage
- **Voice**: pyttsx3 (TTS) + SpeechRecognition (STT)
- **Files**: PyPDF2, python-docx, openpyxl, pandas

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Install Python 3.10+
# Install Node.js 18+
# Install Ollama (for offline AI)
ollama pull llama3
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
cd backend
python main.py
# Or: uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
# Install React dependencies
cd frontend
npm install

# Start React development server
npm start
```

### 4. Access the Application
- **React UI**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Authentication

Use any of these phrases to authenticate:
- `chandan sharma`
- `chandan`
- `unlock agent chandan`
- `my name is chandan`

## 📋 Usage Guide

### 💬 Chat Commands
```
# Memory commands
remember my favorite color is blue
forget my favorite color  
what do you remember?
clear memory

# System commands
status
help
```

### 🧠 Memory Management
- **Add Facts**: "remember [fact]" or use Memory page
- **Search**: Use search box in Memory page
- **Categories**: general, personal, work, important

### 📁 File Processing
1. Upload files via drag-and-drop or browse
2. Click "Process" to extract content
3. Click "Summarize" for AI summary
4. Supported: PDF, DOCX, XLSX, CSV, TXT, JSON

### 🎙️ Voice Features
- **Voice Input**: Click microphone in chat
- **Speak Responses**: Click speaker icon on messages
- **Auto-speak**: Enable in Settings

## 🏗️ Project Structure

```
chandan-ai-assistant/
├── backend/
│   ├── main.py              # FastAPI server
│   └── tools/
│       ├── memory_manager.py
│       ├── auth_manager.py
│       ├── ai_manager.py
│       ├── voice_manager.py
│       └── file_processor.py
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Main pages
│   │   ├── services/        # API services
│   │   └── App.js
│   ├── public/
│   └── package.json
├── memory/
│   ├── short_term.json      # Recent conversations
│   ├── long_term.json       # Persistent facts
│   └── owner.json           # Owner information
├── requirements.txt
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth` - Authenticate user
- `GET /api/status` - Get system status

### Chat
- `POST /api/chat` - Send message to AI

### Memory
- `GET /api/memory` - Get all memories
- `POST /api/memory` - Add new memory
- `DELETE /api/memory` - Clear all memory
- `POST /api/memory/search` - Search memories

### Voice
- `POST /api/voice/listen` - Voice input
- `POST /api/voice/speak` - Text-to-speech

### Files
- `POST /api/files/upload` - Upload and process file
- `POST /api/files/summarize` - Summarize file

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set OpenAI API key for online mode
export OPENAI_API_KEY="your-api-key-here"

# Optional: Set custom API base URL
export REACT_APP_API_URL="http://localhost:8000"
```

### Settings
- Configure via Settings page in React UI
- Settings stored in browser localStorage
- Memory limits, voice preferences, etc.

## 🎨 UI Features

### Modern Design
- **Gradient Headers**: Beautiful gradient backgrounds
- **Glass Effects**: Modern glassmorphism design
- **Animations**: Smooth Framer Motion animations
- **Responsive**: Works on desktop, tablet, mobile
- **Dark Mode Ready**: Tailwind CSS classes prepared

### Pages
1. **Dashboard**: System overview and quick actions
2. **Chat**: Real-time conversation with AI
3. **Memory**: Browse, search, and manage memories
4. **Files**: Upload, process, and summarize documents
5. **Settings**: Configure preferences and system

## 🧪 Testing

### Backend Testing
```bash
# Test API endpoints
curl -X POST http://localhost:8000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"auth_phrase": "chandan sharma"}'
```

### Frontend Testing
```bash
# Run React tests
cd frontend
npm test
```

## 🔄 Development

### Adding New Features
1. **Backend**: Add new endpoints in `backend/main.py`
2. **Frontend**: Add new pages in `frontend/src/pages/`
3. **Tools**: Add new tools in `backend/tools/`
4. **API**: Update `frontend/src/services/api.js`

### Customization
- **Colors**: Edit `frontend/tailwind.config.js`
- **Authentication**: Modify `tools/auth_manager.py`
- **Memory**: Customize `tools/memory_manager.py`
- **AI Models**: Update `tools/ai_manager.py`

## 📦 Deployment

### Production Build
```bash
# Build React app
cd frontend
npm run build

# Serve with FastAPI
# Add static files serving in main.py
```

### Docker (Optional)
```dockerfile
# Dockerfile example
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🎯 Future Enhancements

### Phase 7+ Ideas
- **3D Avatar**: Unity/WebGL integration
- **Mobile App**: React Native version
- **Robot Integration**: Hardware control
- **Multi-Agent**: Multiple AI personalities
- **API Marketplace**: Plugin system

## 🐛 Troubleshooting

### Common Issues
1. **Ollama not found**: Install Ollama and pull a model
2. **Voice not working**: Install pyaudio dependencies
3. **File upload fails**: Check file size and format
4. **Memory not saving**: Check file permissions

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
python backend/main.py
```

## 📞 Support

- **Issues**: Create GitHub issue
- **Features**: Submit feature request
- **Chat**: Use the AI assistant itself!

## 👨‍💻 Developer

**Chandan Sharma**
- Personal AI Assistant Project
- Phase 1-6 Complete
- All features operational

## 📄 License

This project is for personal use by Chandan Sharma.

---

## 🚀 Start Your AI Assistant Now!

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Start backend**: `python backend/main.py`
3. **Start frontend**: `cd frontend && npm start`
4. **Open**: http://localhost:3000
5. **Authenticate**: Use "chandan sharma"
6. **Enjoy**: Your personal AI assistant!

**🎉 Phase 1-6 Complete - Your AI Assistant is Ready!**
