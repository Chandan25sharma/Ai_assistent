import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { ApiService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    checkAuthStatus();
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

  const handleLogin = () => {
    setIsAuthenticated(true);
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
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard systemStatus={systemStatus} />} />
            <Route path="/chat" element={<div className="text-center p-8"><h2 className="text-2xl font-bold">Chat Page</h2><p>Chat functionality coming soon...</p></div>} />
            <Route path="/memory" element={<div className="text-center p-8"><h2 className="text-2xl font-bold">Memory Page</h2><p>Memory functionality coming soon...</p></div>} />
            <Route path="/files" element={<div className="text-center p-8"><h2 className="text-2xl font-bold">Files Page</h2><p>File functionality coming soon...</p></div>} />
            <Route path="/settings" element={<div className="text-center p-8"><h2 className="text-2xl font-bold">Settings Page</h2><p>Settings functionality coming soon...</p></div>} />
          </Routes>
        </main>
        
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
