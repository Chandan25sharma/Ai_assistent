'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Brain, Plus, Trash2, Search } from 'lucide-react'
import { apiService } from '@/lib/api'

interface Memory {
  fact: string
  category: string
  timestamp: string
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [newFact, setNewFact] = useState('')
  const [newCategory, setNewCategory] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadMemories()
  }, [])

  const loadMemories = async () => {
    try {
      const response = await apiService.getMemories()
      setMemories(response.memories || [])
    } catch (error) {
      console.error('Error loading memories:', error)
    }
  }

  const addMemory = async () => {
    if (!newFact.trim()) return

    setIsLoading(true)
    try {
      await apiService.addMemory(newFact, newCategory)
      setNewFact('')
      setNewCategory('general')
      await loadMemories()
    } catch (error) {
      console.error('Error adding memory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearMemories = async () => {
    if (confirm('Are you sure you want to clear all memories?')) {
      try {
        await apiService.clearMemory()
        await loadMemories()
      } catch (error) {
        console.error('Error clearing memories:', error)
      }
    }
  }

  const filteredMemories = memories.filter(memory =>
    memory.fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [...new Set(memories.map(m => m.category))]

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Memory Bank</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Store and manage long-term memories for the AI assistant
          </p>
        </div>

        {/* Add Memory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Memory</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Textarea
                  placeholder="Enter a fact or information to remember..."
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button 
                  onClick={addMemory} 
                  disabled={isLoading || !newFact.trim()}
                  className="w-full"
                >
                  Add Memory
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Actions */}
        <div className="flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="destructive" onClick={clearMemories}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge key={category} variant="secondary">
                {category} ({memories.filter(m => m.category === category).length})
              </Badge>
            ))}
          </div>
        )}

        {/* Memories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((memory, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{memory.category}</Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(memory.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {memory.fact}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No memories found matching your search.' : 'No memories stored yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
