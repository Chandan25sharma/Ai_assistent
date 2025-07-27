'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ExternalLink, Globe, Calendar } from 'lucide-react'
import { apiService } from '@/lib/api'

interface SearchResult {
  title: string
  url: string
  snippet: string
  domain?: string
  published_date?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxResults, setMaxResults] = useState(5)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await apiService.webSearch(query, maxResults)
      setResults(response.results || [])
    } catch (error) {
      console.error('Error searching:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const quickSearches = [
    'Latest AI news',
    'Programming tutorials',
    'Climate change updates',
    'Technology trends 2025',
    'Machine learning basics',
    'Web development best practices'
  ]

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Web Search</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Search the web for information and get instant results
          </p>
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Query</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={5}>5 results</option>
                <option value={10}>10 results</option>
                <option value={15}>15 results</option>
                <option value={20}>20 results</option>
              </select>
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Searches */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(search)
                    // Auto-search when clicking quick search
                    setTimeout(() => handleSearch(), 100)
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Search Results ({results.length})
            </h2>
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2"
                        >
                          <span>{result.title}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span>{new URL(result.url).hostname}</span>
                      </div>
                      {result.published_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{result.published_date}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.snippet}
                    </p>
                    
                    <div className="pt-2">
                      <Badge variant="secondary" className="text-xs">
                        {result.url}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && query && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No results found for "{query}". Try a different search term.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!query && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Enter a search query to find information on the web
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
