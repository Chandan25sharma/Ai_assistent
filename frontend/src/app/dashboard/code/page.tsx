'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Code, Play, Copy, FileText } from 'lucide-react'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'

export default function CodePage() {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('python')
  const [generatedCode, setGeneratedCode] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'php', label: 'PHP' },
  ]

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a code generation prompt')
      return
    }

    setIsGenerating(true)
    try {
      const response = await apiService.generateCode(prompt, language)
      setGeneratedCode(response.code || 'No code generated')
      toast.success('Code generated successfully')
    } catch (error) {
      console.error('Failed to generate code:', error)
      toast.error('Failed to generate code. Make sure the backend is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  const explainCode = async () => {
    if (!generatedCode.trim()) {
      toast.error('No code to explain')
      return
    }

    setIsExplaining(true)
    try {
      const response = await apiService.explainCode(generatedCode, language)
      setExplanation(response.explanation || 'No explanation available')
      toast.success('Code explanation generated')
    } catch (error) {
      console.error('Failed to explain code:', error)
      toast.error('Failed to explain code')
    } finally {
      setIsExplaining(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    toast.success('Code copied to clipboard')
  }

  const examples = [
    {
      title: 'Data Analysis Script',
      prompt: 'Create a Python script to read a CSV file, calculate basic statistics, and create a simple plot',
      language: 'python'
    },
    {
      title: 'REST API Endpoint',
      prompt: 'Create a JavaScript Express.js endpoint that handles user authentication with JWT',
      language: 'javascript'
    },
    {
      title: 'Algorithm Implementation',
      prompt: 'Implement a binary search algorithm with error handling',
      language: 'python'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Code className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Code Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and explain code in multiple programming languages
          </p>
        </div>
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Quick Examples</span>
          </CardTitle>
          <CardDescription>
            Click on an example to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => {
                  setPrompt(example.prompt)
                  setLanguage(example.language)
                }}
              >
                <div>
                  <p className="font-medium mb-1">{example.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {example.prompt.substring(0, 60)}...
                  </p>
                  <Badge variant="secondary">{example.language}</Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Code</CardTitle>
            <CardDescription>
              Describe what you want to build and select a programming language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                What do you want to build?
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a function that sorts an array using quicksort algorithm"
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Programming Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateCode}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Generate Code</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Code</CardTitle>
              {generatedCode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedCode ? (
              <div className="space-y-4">
                <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>
                
                <Button
                  onClick={explainCode}
                  disabled={isExplaining}
                  variant="outline"
                  className="w-full"
                >
                  {isExplaining ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      <span>Explaining...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Explain Code</span>
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Generated code will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Explanation */}
      {explanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Code Explanation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <pre className="text-blue-900 dark:text-blue-100 whitespace-pre-wrap font-sans">
                {explanation}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
