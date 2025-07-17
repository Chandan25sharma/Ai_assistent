import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  MicrophoneIcon,
  SignalIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';

const Dashboard = ({ systemStatus }) => {
  const [memoryData, setMemoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const memory = await ApiService.getMemory();
      setMemoryData(memory);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const getAIModelStatus = () => {
    if (!systemStatus?.ai_models) return 'Loading...';
    
    const { internet_available, ollama_available, openai_configured } = systemStatus.ai_models;
    
    if (internet_available && openai_configured) {
      return 'Online (OpenAI)';
    } else if (ollama_available) {
      return 'Offline (Ollama)';
    } else {
      return 'Not Available';
    }
  };

  const getRecentMemories = () => {
    if (!memoryData?.facts) return [];
    return memoryData.facts.slice(-5).reverse();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Sorma-AI!</h1>
        <p className="text-blue-100">Your AI Assistant is ready to help you.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Memories"
          value={memoryData?.stats?.total_memory_items || 0}
          icon={CpuChipIcon}
          color="bg-purple-500"
          description="Facts stored"
        />
        
        <StatCard
          title="Conversations"
          value={memoryData?.conversations?.length || 0}
          icon={ChatBubbleLeftRightIcon}
          color="bg-blue-500"
          description="Recent chats"
        />
        
        <StatCard
          title="AI Status"
          value={getAIModelStatus()}
          icon={CpuChipIcon}
          color="bg-green-500"
          description="Model ready"
        />
        
        <StatCard
          title="Voice Status"
          value={systemStatus?.voice_info?.tts_available ? 'Ready' : 'Not Ready'}
          icon={MicrophoneIcon}
          color="bg-orange-500"
          description="TTS/STT available"
        />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            System Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SignalIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Internet Connection</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                systemStatus?.internet_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {systemStatus?.internet_available ? 'Online' : 'Offline'}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CpuChipIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Ollama Model</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                systemStatus?.ai_models?.ollama_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {systemStatus?.ai_models?.ollama_available ? 'Available' : 'Not Available'}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MicrophoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">Voice Features</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                systemStatus?.voice_info?.tts_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {systemStatus?.voice_info?.tts_available ? 'Ready' : 'Limited'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            Recent Memories
          </h3>
          
          <div className="space-y-3">
            {getRecentMemories().length > 0 ? (
              getRecentMemories().map((memory, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{memory.fact}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{memory.category}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(memory.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No memories stored yet.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Start Chat</h4>
            <p className="text-sm text-gray-600">Begin conversation with AI</p>
          </button>
          
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <CpuChipIcon className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Memory</h4>
            <p className="text-sm text-gray-600">Store important information</p>
          </button>
          
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <DocumentIcon className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Process File</h4>
            <p className="text-sm text-gray-600">Upload and analyze documents</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
