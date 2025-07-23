import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

const AuthPage = ({ onLogin }) => {
  const [authPhrase, setAuthPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authPhrase.trim()) return;

    setIsLoading(true);
    try {
      await ApiService.authenticate(authPhrase);
      toast.success(' Authentication successful!');
      onLogin();
    } catch (error) {
      toast.error(' Invalid authorization phrase');
    } finally {
      setIsLoading(false);
    }
  };

  const quickAuth = (phrase) => {
    setAuthPhrase(phrase);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6"
          >
            <SparklesIcon className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Sorma-AI
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Your Personal AI Assistant - Online and Offline will be soon
          </motion.p>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="auth-phrase" className="block text-sm font-medium text-gray-700 mb-2">
                <LockClosedIcon className="h-4 w-4 inline mr-1" />
                Authorization Phrase
              </label>
              <input
                id="auth-phrase"
                type="password"
                value={authPhrase}
                onChange={(e) => setAuthPhrase(e.target.value)}
                className="input-field"
                placeholder="Enter your authorization phrase"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary text-base py-3 relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  <UserIcon className="h-5 w-5 mr-2" />
                  Authenticate
                </>
              )}
            </button>
          </form>

          {/* Quick Auth Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick access:</p>
            <div className="space-y-2">
              <button
                onClick={() => quickAuth('sorma')}
                className="w-full btn btn-secondary text-sm py-2"
              >
                Use "sorma"
              </button>
             
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Features:</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                Memory System
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                Voice Control
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                File Processing
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                Online/Offline
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500"
        >
          <p>Sorma-AI - Advanced AI Assistant</p>
          <p className="mt-1">All Features Active | v1.0</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
