import React from 'react';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CpuChipIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';

const Navbar = ({ onToggleSidebar, onLogout, systemStatus }) => {
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-400';
    const { internet_available, ai_models, voice_info } = status;
    
    if (internet_available && (ai_models?.ollama_available || ai_models?.openai_configured)) {
      return 'bg-green-500';
    } else if (ai_models?.ollama_available) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Loading...';
    const { internet_available, ai_models } = status;
    
    if (internet_available && (ai_models?.ollama_available || ai_models?.openai_configured)) {
      return 'Online & Ready';
    } else if (ai_models?.ollama_available) {
      return 'Offline Mode';
    } else {
      return 'No AI Models';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="hidden lg:flex items-center ml-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Sorma-AI
              </h1>
            </div>
          </div>

          {/* Center - Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
              <div className={`h-2 w-2 rounded-full ${getStatusColor(systemStatus)} mr-2`} />
              <span className="text-sm font-medium text-gray-700">
                {getStatusText(systemStatus)}
              </span>
            </div>
            
            {systemStatus?.internet_available && (
              <div className="flex items-center text-green-600">
                <SignalIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">Online</span>
              </div>
            )}
            
            {systemStatus?.ai_models?.ollama_available && (
              <div className="flex items-center text-blue-600">
                <CpuChipIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">AI Ready</span>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Sorma AI</p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
              
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
