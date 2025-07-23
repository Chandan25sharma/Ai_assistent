import React, { useState, useEffect } from 'react';

import { 
 
  BellIcon, 
  ShieldCheckIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  CpuChipIcon,
  SignalIcon,
  UserCircleIcon,
  KeyIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    voiceEnabled: true,
    autoSpeakResponses: false,
    darkMode: false,
    saveConversations: true,
    maxMemoryItems: 1000,
    autoSummarize: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSystemStatus();
    loadSettings();
  },);

  const fetchSystemStatus = async () => {
    try {
      const status = await ApiService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('sormaAI-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sormaAI-settings', JSON.stringify(newSettings));
    toast.success('Settings saved successfully');
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const clearAllData = async () => {
    if (!window.confirm('Are you sure you want to clear all data? This will remove all memories and conversations permanently.')) {
      return;
    }

    try {
      await ApiService.clearMemory();
      localStorage.removeItem('sormaAI-settings');
      toast.success('All data cleared successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear data');
    }
  };

  const exportData = async () => {
    try {
      const memoryData = await ApiService.getMemory();
      const exportData = {
        memories: memoryData,
        settings: settings,
        exportDate: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sorma-ai-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data');
    }
  };

  const SettingCard = ({ title, description, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Icon className="h-6 w-6 text-gray-600 mr-3" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );

  const StatusIndicator = ({ label, status, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status ? 'Active' : 'Inactive'}
      </div>
    </div>
  );

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
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-200">Configure your AI assistant preferences and system settings</p>
      </div>

      {/* System Status */}
      <SettingCard
        title="System Status"
        description="Current status of your AI assistant components"
        icon={ShieldCheckIcon}
      >
        <div className="space-y-3">
          <StatusIndicator
            label="Internet Connection"
            status={systemStatus?.internet_available}
            description="Required for online AI models and web features"
          />
          <StatusIndicator
            label="Ollama (Local AI)"
            status={systemStatus?.ai_models?.ollama_available}
            description="Local AI model for offline operation"
          />
          <StatusIndicator
            label="OpenAI Integration"
            status={systemStatus?.ai_models?.openai_configured}
            description="Cloud-based AI for enhanced capabilities"
          />
          <StatusIndicator
            label="Voice Features"
            status={systemStatus?.voice_info?.tts_available}
            description="Text-to-speech and speech-to-text capabilities"
          />
        </div>
      </SettingCard>

      {/* Notifications */}
      <SettingCard
        title="Notifications"
        description="Configure notification preferences"
        icon={BellIcon}
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications}
            onChange={(value) => handleSettingChange('notifications', value)}
            label="Enable notifications"
          />
          <ToggleSwitch
            enabled={settings.saveConversations}
            onChange={(value) => handleSettingChange('saveConversations', value)}
            label="Save conversation history"
          />
        </div>
      </SettingCard>

      {/* Voice Settings */}
      <SettingCard
        title="Voice & Audio"
        description="Configure voice interaction settings"
        icon={MicrophoneIcon}
      >
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.voiceEnabled}
            onChange={(value) => handleSettingChange('voiceEnabled', value)}
            label="Enable voice input"
          />
          <ToggleSwitch
            enabled={settings.autoSpeakResponses}
            onChange={(value) => handleSettingChange('autoSpeakResponses', value)}
            label="Auto-speak AI responses"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Voice Status</span>
            <div className="flex items-center space-x-2">
              <MicrophoneIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {systemStatus?.voice_info?.stt_available ? 'STT Ready' : 'STT Not Available'}
              </span>
              <SpeakerWaveIcon className="h-4 w-4 text-gray-500 ml-2" />
              <span className="text-sm text-gray-600">
                {systemStatus?.voice_info?.tts_available ? 'TTS Ready' : 'TTS Not Available'}
              </span>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* AI Models */}
      <SettingCard
        title="AI Models"
        description="Configure AI model preferences"
        icon={CpuChipIcon}
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Model Priority</h4>
              <SignalIcon className="h-5 w-5 text-gray-500" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              When online: Uses OpenAI models for better performance
            </p>
            <p className="text-sm text-gray-600">
              When offline: Falls back to local Ollama models
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CpuChipIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Local Models</span>
              </div>
              <p className="text-sm text-blue-700">
                Status: {systemStatus?.ai_models?.ollama_available ? 'Available' : 'Not Available'}
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <SignalIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Cloud Models</span>
              </div>
              <p className="text-sm text-green-700">
                Status: {systemStatus?.ai_models?.openai_configured ? 'Configured' : 'Not Configured'}
              </p>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Memory Settings */}
      <SettingCard
        title="Memory Management"
        description="Configure how your AI assistant handles memory"
        icon={DocumentIcon}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Maximum memory items</span>
            <select
              value={settings.maxMemoryItems}
              onChange={(e) => handleSettingChange('maxMemoryItems', parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
            >
              <option value={500}>500 items</option>
              <option value={1000}>1000 items</option>
              <option value={2000}>2000 items</option>
              <option value={5000}>5000 items</option>
            </select>
          </div>
          
          <ToggleSwitch
            enabled={settings.autoSummarize}
            onChange={(value) => handleSettingChange('autoSummarize', value)}
            label="Auto-summarize uploaded files"
          />
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Current memory usage: {systemStatus?.memory_stats?.total_memory_items || 0} items
            </p>
          </div>
        </div>
      </SettingCard>

      {/* Account & Security */}
      <SettingCard
        title="Account & Security"
        description="Manage your account and security preferences"
        icon={UserCircleIcon}
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <KeyIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium text-gray-900">Authentication</span>
            </div>
            <p className="text-sm text-gray-600">
              Current user: Sorma AI (Owner)
            </p>
            <p className="text-sm text-gray-600">
              Access level: Full privileges
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportData}
              className="btn btn-secondary flex items-center justify-center"
            >
              <DocumentIcon className="h-4 w-4 mr-2" />
              Export Data
            </button>
            
            <button
              onClick={clearAllData}
              className="btn bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Clear All Data
            </button>
          </div>
        </div>
      </SettingCard>

      {/* Footer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Sorma-AI v1.0 - Advanced AI Assistant Platform
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Phase 1-6 Complete | All Features Operational
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
