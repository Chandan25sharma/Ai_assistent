import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import MemoryPage from './pages/MemoryPage';
import FilesPage from './pages/FilesPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ApiService } from './services/api';

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
    setSystemStatus(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Sorma-AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AuthPage onLogin={handleLogin} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          systemStatus={systemStatus}
        />
        
        <div className="flex">
          <Sidebar 
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
