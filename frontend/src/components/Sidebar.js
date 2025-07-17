import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  DocumentIcon,
  Cog6ToothIcon,
  XMarkIcon,
  SignalIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, systemStatus }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Chat', path: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Memory', path: '/memory', icon: CpuChipIcon },
    { name: 'Files', path: '/files', icon: DocumentIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  const StatusIndicator = ({ label, status, icon: Icon }) => (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <Icon className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <div className={`h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:translate-x-0 lg:static lg:z-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Sorma-AI</h3>
                  <p className="text-xs text-gray-500">v1.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Status</h4>
            <div className="space-y-2">
              {systemStatus && (
                <>
                  <StatusIndicator
                    label="Internet"
                    status={systemStatus.internet_available}
                    icon={SignalIcon}
                  />
                  <StatusIndicator
                    label="AI Models"
                    status={systemStatus.ai_models?.ollama_available || systemStatus.ai_models?.openai_configured}
                    icon={CpuChipIcon}
                  />
                  <StatusIndicator
                    label="Voice"
                    status={systemStatus.voice_info?.tts_available}
                    icon={MicrophoneIcon}
                  />
                </>
              )}
            </div>
            
            {systemStatus?.memory_stats && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-xs font-medium text-gray-700 mb-2">Memory Usage</h5>
                <div className="text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Short-term:</span>
                    <span>{systemStatus.memory_stats.short_term_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Long-term:</span>
                    <span>{systemStatus.memory_stats.long_term_count || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
