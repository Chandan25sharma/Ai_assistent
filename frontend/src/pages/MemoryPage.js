import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

const MemoryPage = () => {
  const [memories, setMemories] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [expandedMemory, setExpandedMemory] = useState(null);

  useEffect(() => {
    fetchMemoryData();
  }, []);

  const fetchMemoryData = async () => {
    try {
      const data = await ApiService.getMemory();
      setMemories(data.facts || []);
      setConversations(data.conversations || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Failed to fetch memory data:', error);
      toast.error('Failed to load memory data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMemory = async () => {
    if (!newFact.trim()) return;

    try {
      await ApiService.addMemory(newFact, newCategory);
      toast.success('Memory added successfully');
      setNewFact('');
      setNewCategory('general');
      setShowAddForm(false);
      fetchMemoryData();
    } catch (error) {
      console.error('Failed to add memory:', error);
      toast.error('Failed to add memory');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await ApiService.searchMemory(searchQuery);
      setSearchResults(response.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    }
  };

  const handleClearMemory = async () => {
    if (!window.confirm('Are you sure you want to clear all memories? This cannot be undone.')) {
      return;
    }

    try {
      await ApiService.clearMemory();
      toast.success('All memories cleared');
      fetchMemoryData();
    } catch (error) {
      console.error('Failed to clear memory:', error);
      toast.error('Failed to clear memory');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      important: 'bg-red-100 text-red-800',
      learning: 'bg-purple-100 text-purple-800',
    };
    return colors[category] || colors.general;
  };

  const MemoryCard = ({ memory, index }) => {
    const isExpanded = expandedMemory === index;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(memory.category)}`}>
                {memory.category}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(memory.timestamp)}
              </span>
            </div>
            
            <p className={`text-gray-900 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {memory.fact}
            </p>
            
            {memory.fact.length > 100 && (
              <button
                onClick={() => setExpandedMemory(isExpanded ? null : index)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                {isExpanded ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Memory Management</h1>
        <p className="text-purple-100">Store, search, and manage your AI assistant's memories</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CpuChipIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Memories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_memory_items || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Long-term Facts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.long_term_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Conversations</p>
              <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Memory
            </button>
            
            <button
              onClick={handleClearMemory}
              className="btn bg-red-600 hover:bg-red-700 text-white flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear All
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="input-field pl-10 pr-4 py-2 w-64"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={handleSearch}
              className="btn btn-secondary"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Add Memory Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Memory</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Memory/Fact
              </label>
              <textarea
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                rows="3"
                className="input-field"
                placeholder="Enter the fact or information to remember..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-field"
              >
                <option value="general">General</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="important">Important</option>
                <option value="learning">Learning</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMemory}
                disabled={!newFact.trim()}
                className="btn btn-primary"
              >
                Add Memory
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Search Results ({searchResults.length})
          </h3>
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-900">{result.content}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Type: {result.type} • {formatDate(result.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memories List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stored Memories</h3>
        
        {memories.length > 0 ? (
          <div className="space-y-4">
            {memories.slice().reverse().map((memory, index) => (
              <MemoryCard key={index} memory={memory} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CpuChipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
            <p className="text-gray-600">
              Start by adding your first memory or having a conversation with the AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPage;
