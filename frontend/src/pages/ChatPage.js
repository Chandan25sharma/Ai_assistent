import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon, 
  SpeakerWaveIcon,
  StopIcon,
  UserIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    setIsLoading(true);
    
    try {
      const response = await ApiService.sendMessage(userMessage);
      
      // Add assistant response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        model: response.model_used
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message');
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) return;
    
    setIsListening(true);
    try {
      const response = await ApiService.listenToVoice();
      if (response.text && response.text !== "⚠️ Could not understand audio.") {
        setInputMessage(response.text);
      }
      toast.success('Voice input captured');
    } catch (error) {
      console.error('Voice input error:', error);
      toast.error('Voice input failed');
    } finally {
      setIsListening(false);
    }
  };

  const handleSpeak = async (text) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      await ApiService.speakText(text);
      toast.success('Speaking...');
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Text-to-speech failed');
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.error;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`
            px-4 py-2 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-blue-600 text-white rounded-br-sm' 
              : isError 
                ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-sm'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
            }
          `}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {/* Model info for assistant messages */}
            {!isUser && message.model && (
              <div className="mt-2 text-xs text-gray-500">
                Model: {message.model}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
          
          {/* Speak button for assistant messages */}
          {!isUser && !isError && (
            <button
              onClick={() => handleSpeak(message.content)}
              disabled={isSpeaking}
              className="mt-2 text-xs text-gray-500 hover:text-blue-600 transition-colors"
            >
              <SpeakerWaveIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 ${isUser ? 'order-1 mr-2' : 'order-2 ml-2'}
        `}>
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isUser 
              ? 'bg-blue-600' 
              : isError 
                ? 'bg-red-500'
                : 'bg-gray-300'
            }
          `}>
            {isUser ? (
              <UserIcon className="h-5 w-5 text-white" />
            ) : (
              <CpuChipIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Chat with Assistant</h1>
        <p className="text-sm text-gray-600">Ask questions, give commands, or just chat!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CpuChipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-600">
              I'm ready to help you with anything you need!
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setInputMessage("remember my favorite color is blue")}
                className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <p className="text-sm font-medium text-blue-900">Remember a fact</p>
                <p className="text-xs text-blue-700">Store important information</p>
              </button>
              
              <button
                onClick={() => setInputMessage("what do you remember about me?")}
                className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <p className="text-sm font-medium text-purple-900">Recall memories</p>
                <p className="text-xs text-purple-700">Show stored information</p>
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-center space-x-2 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`
              p-2 rounded-full transition-colors
              ${isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }
            `}
          >
            {isListening ? (
              <StopIcon className="h-5 w-5" />
            ) : (
              <MicrophoneIcon className="h-5 w-5" />
            )}
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-12"
              rows="1"
              style={{ minHeight: '42px', maxHeight: '120px' }}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
