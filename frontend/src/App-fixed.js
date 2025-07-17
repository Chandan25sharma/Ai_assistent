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

// Simple Navbar component to avoid complex imports
const SimpleNavbar = ({ onToggleSidebar, onLogout, systemStatus }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span className="block w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="block w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="block w-full h-0.5 bg-gray-600"></span>
            </div>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Sorma-AI</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${systemStatus?.ai_models?.ollama_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {systemStatus?.ai_models?.ollama_available ? 'Online' : 'Offline'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// Simple Sidebar component
const SimpleSidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Chat', path: '/chat' },
    { name: 'Memory', path: '/memory' },
    { name: 'Files', path: '/files' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            ×
          </button>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <span className="ml-3">{item.name}</span>
            </a>
          ))}
        </nav>
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
    fetchSystemStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const status = await ApiService.getSystemStatus();
      setIsAuthenticated(status.authorized);
      setSystemStatus(status);
    } catch (error) {
      console.error('Auth check failed:', error);
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Sorma-AI...</p>
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
        <SimpleNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          systemStatus={systemStatus}
        />
        
        <div className="flex">
          <SimpleSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
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
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
