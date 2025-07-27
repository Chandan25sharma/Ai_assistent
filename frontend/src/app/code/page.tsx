'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Code, Copy, Download } from 'lucide-react'
import { apiService } from '@/lib/api'

export default function CodePage() {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('python')
  const [generatedCode, setGeneratedCode] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const response = await apiService.generateCode(prompt, language)
      setGeneratedCode(response.code || '')
    } catch (error) {
      console.error('Error generating code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExplainCode = async () => {
    if (!generatedCode.trim()) return

    setIsLoading(true)
    try {
      const response = await apiService.explainCode(generatedCode, language)
      setExplanation(response.explanation || '')
    } catch (error) {
      console.error('Error explaining code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Code Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate and explain code in multiple programming languages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Code Generation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Describe what you want to code..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
              
              <Button 
                onClick={handleGenerateCode} 
                disabled={isLoading || !prompt.trim()}
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Code'}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Code</span>
                {generatedCode && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExplainCode}
                      disabled={isLoading}
                    >
                      Explain
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generatedCode || 'Generated code will appear here...'}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Code Explanation */}
        {explanation && (
          <Card>
            <CardHeader>
              <CardTitle>Code Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p>{explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
