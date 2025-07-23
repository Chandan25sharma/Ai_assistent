import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-assistent-five.vercel.app/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const ApiService = {
  // Authentication
  async authenticate(authPhrase) {
    const response = await api.post('/api/auth', { auth_phrase: authPhrase });
    return response.data;
  },

  // System Status
  async getSystemStatus() {
    const response = await api.get('/api/status');
    return response.data;
  },

  // Chat
  async sendMessage(message, useVoice = false) {
    const response = await api.post('/api/chat', { 
      message, 
      use_voice: useVoice 
    });
    return response.data;
  },

  // Memory
  async getMemory() {
    const response = await api.get('/api/memory');
    return response.data;
  },

  async addMemory(fact, category = 'general') {
    const response = await api.post('/api/memory', { fact, category });
    return response.data;
  },

  async searchMemory(query) {
    const formData = new FormData();
    formData.append('query', query);
    const response = await api.post('/api/memory/search', formData);
    return response.data;
  },

  async clearMemory() {
    const response = await api.delete('/api/memory');
    return response.data;
  },

  // Voice
  async listenToVoice() {
    const response = await api.post('/api/voice/listen');
    return response.data;
  },

  async speakText(text) {
    const formData = new FormData();
    formData.append('text', text);
    const response = await api.post('/api/voice/speak', formData);
    return response.data;
  },

  // Files
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async summarizeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/files/summarize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
