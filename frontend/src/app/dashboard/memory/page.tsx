'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Brain, Plus, Trash2, Search, Calendar } from 'lucide-react'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'

interface Memory {
  fact: string
  category: string
  timestamp: string
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [newMemory, setNewMemory] = useState('')
  const [newCategory, setNewCategory] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const data = await apiService.getMemories()
      setMemories(data.memories || [])
    } catch (error) {
      console.error('Failed to fetch memories:', error)
      toast.error('Failed to load memories')
    }
  }

  const addMemory = async () => {
    if (!newMemory.trim()) return

    setIsLoading(true)
    try {
      await apiService.addMemory(newMemory, newCategory)
      await fetchMemories()
      setNewMemory('')
      setNewCategory('general')
      toast.success('Memory added successfully')
    } catch (error) {
      console.error('Failed to add memory:', error)
      toast.error('Failed to add memory')
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllMemories = async () => {
    if (!confirm('Are you sure you want to clear all memories?')) return

    try {
      await apiService.clearMemory()
      await fetchMemories()
      toast.success('All memories cleared')
    } catch (error) {
      console.error('Failed to clear memories:', error)
      toast.error('Failed to clear memories')
    }
  }

  const filteredMemories = memories.filter(memory =>
    memory.fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [...new Set(memories.map(m => m.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Memory Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage AI knowledge and long-term memory
            </p>
          </div>
        </div>
        
        <Button
          onClick={clearAllMemories}
          variant="destructive"
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Memories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {memories.length}
                </p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.length}
                </p>
              </div>
              <Search className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Latest Added
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {memories.length > 0 ? 'Today' : 'None'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Memory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Memory</span>
          </CardTitle>
          <CardDescription>
            Add new information to the AI's long-term memory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Memory Content
            </label>
            <Textarea
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              placeholder="Enter the fact or information to remember..."
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Category
            </label>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., personal, work, learning"
            />
          </div>

          <Button
            onClick={addMemory}
            disabled={isLoading || !newMemory.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? 'Adding...' : 'Add Memory'}
          </Button>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Memories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memories..."
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Memories List */}
      <Card>
        <CardHeader>
          <CardTitle>Stored Memories ({filteredMemories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {filteredMemories.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {memories.length === 0 ? 'No memories stored yet' : 'No memories match your search'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMemories.map((memory, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white mb-2">
                          {memory.fact}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{memory.category}</Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {memory.timestamp ? new Date(memory.timestamp).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
