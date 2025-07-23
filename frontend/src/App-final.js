import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import MemoryPage from './pages/MemoryPage';
import FilesPage from './pages/FilesPage';
import SettingsPage from './pages/SettingsPage';
import { ApiService } from './services/api';

// Enhanced Navbar component with proper error handling
const SormaNavbar = ({ onToggleSidebar, onLogout, systemStatus }) => {
  const getStatusInfo = (status) => {
    if (!status) return { color: 'bg-gray-400', text: 'Unknown' };
    
    const { internet_available, ai_models } = status;
    
    if (ai_models?.ollama_available) {
      return { color: 'bg-green-500', text: 'Ollama Online' };
    } else if (internet_available) {
      return { color: 'bg-yellow-500', text: 'Internet Only' };
    } else {
      return { color: 'bg-red-500', text: 'Offline' };
    }
  };

  const statusInfo = getStatusInfo(systemStatus);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
            aria-label="Toggle sidebar"
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span className="block w-full h-0.5 bg-gray-600 mb-1 transition-all"></span>
              <span className="block w-full h-0.5 bg-gray-600 mb-1 transition-all"></span>
              <span className="block w-full h-0.5 bg-gray-600 transition-all"></span>
            </div>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Sorma-AI</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`}></div>
            <span className="text-sm text-gray-600 font-medium">{statusInfo.text}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">U</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Sidebar component
const SormaSidebar = ({ isOpen, onClose, systemStatus }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '🏠', description: 'Overview & Status' },
    { name: 'Chat', path: '/chat', icon: '💬', description: 'AI Conversation' },
    { name: 'Memory', path: '/memory', icon: '🧠', description: 'Knowledge Base' },
    { name: 'Files', path: '/files', icon: '📁', description: 'File Processing' },
    { name: 'Settings', path: '/settings', icon: '⚙️', description: 'Configuration' },
  ];

  const currentPath = window.location.pathname;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity" 
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <span className="text-gray-500 text-xl">×</span>
          </button>
        </div>
        
        <nav className="mt-4 px-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
                currentPath === item.path
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={onClose}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </a>
          ))}
        </nav>
        
        {/* System Status in Sidebar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">System Status</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Ollama:</span>
                <span className={systemStatus?.ai_models?.ollama_available ? 'text-green-600' : 'text-red-600'}>
                  {systemStatus?.ai_models?.ollama_available ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Internet:</span>
                <span className={systemStatus?.internet_available ? 'text-green-600' : 'text-red-600'}>
                  {systemStatus?.internet_available ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Memory:</span>
                <span className="text-gray-600">
                  {systemStatus?.memory_stats?.total_memory_items || 0} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    // Set up periodic status updates
    const interval = setInterval(fetchSystemStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await ApiService.getSystemStatus();
      setIsAuthenticated(status.authorized);
      setSystemStatus(status);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const status = await ApiService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchSystemStatus();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSystemStatus(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-500 font-bold text-sm">S</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Sorma-AI</h2>
          <p className="text-gray-600">Initializing your AI assistant...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <SormaNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          systemStatus={systemStatus}
        />
        
        <div className="flex">
          <SormaSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            systemStatus={systemStatus}
          />
          
          <main className="flex-1 lg:ml-64">
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard systemStatus={systemStatus} />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/memory" element={<MemoryPage />} />
                <Route path="/files" element={<FilesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </main>
        </div>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
