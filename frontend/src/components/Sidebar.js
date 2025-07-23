import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  DocumentIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  SignalIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ systemStatus }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true); // Always show sidebar on desktop by default
      } else {
        setIsOpen(false); // Hide sidebar on mobile by default
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Chat', path: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Memory', path: '/memory', icon: CpuChipIcon },
    { name: 'Files', path: '/files', icon: DocumentIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  const StatusIndicator = ({ label, status, icon: Icon }) => (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="flex items-center">
        <Icon className={`h-4 w-4 mr-2 ${status ? 'text-green-500' : 'text-red-500'}`} />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <div className={`h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );

  return (
    <>
      {/* Mobile toggle button (always visible on mobile, hidden on desktop) */}
      <button
        onClick={toggleSidebar}
        className="fixed lg:hidden z-30 top-4 left-4 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Desktop toggle button (hidden on mobile) */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:block fixed z-0 top-4 left-4 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={isMobile ? { x: -300 } : { x: 0 }}
        animate={isMobile ? { x: isOpen ? 0 : -300 } : { x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-0 flex flex-col ${
          !isMobile && !isOpen ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`${!isOpen && !isMobile ? 'mx-auto' : ''}`}>
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <CpuChipIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              {(!isMobile || isOpen) && (
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Sorma-AI</h3>
                  <p className="text-xs text-gray-500 font-mono">v1.0.0</p>
                </div>
              )}
            </div>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={isMobile ? toggleSidebar : undefined}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mx-2
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${!isOpen && !isMobile ? 'justify-around' : ''}
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'} ${!isOpen && !isMobile ? 'mr-0' : 'mr-3'}`} />
                {(!isMobile || isOpen) && (
                  <>
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status - Only shown when expanded */}
        {(!isMobile || isOpen) && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">System Status</h4>
              <div className="space-y-2">
                {systemStatus && (
                  <>
                    <StatusIndicator
                      label="Internet Connection"
                      status={systemStatus.internet_available}
                      icon={SignalIcon}
                    />
                    <StatusIndicator
                      label="AI Models"
                      status={systemStatus.ai_models?.ollama_available || systemStatus.ai_models?.openai_configured}
                      icon={CpuChipIcon}
                    />
                    <StatusIndicator
                      label="Voice System"
                      status={systemStatus.voice_info?.tts_available}
                      icon={MicrophoneIcon}
                    />
                  </>
                )}
              </div>
            </div>
            
            {systemStatus?.memory_stats && (
              <div className="p-3 bg-white rounded-lg shadow-xs border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-xs font-medium text-gray-700">Memory Usage</h5>
                  <span className="text-xs font-mono text-gray-500">
                    {((systemStatus.memory_stats.short_term_count || 0) + (systemStatus.memory_stats.long_term_count || 0))} items
                  </span>
                </div>
                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Short-term</span>
                      <span className="font-medium text-gray-700">{systemStatus.memory_stats.short_term_count || 0}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min(100, (systemStatus.memory_stats.short_term_count || 0) * 10)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Long-term</span>
                      <span className="font-medium text-gray-700">{systemStatus.memory_stats.long_term_count || 0}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${Math.min(100, (systemStatus.memory_stats.long_term_count || 0) * 5)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;