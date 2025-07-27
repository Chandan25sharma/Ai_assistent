'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Search, Download, Eye, Trash2 } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  content?: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Project Specification.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2025-01-27',
      content: 'Sample project specification document content...'
    },
    {
      id: '2',
      name: 'Meeting Notes.docx',
      type: 'DOCX',
      size: '156 KB',
      uploadDate: '2025-01-26',
      content: 'Meeting notes from the project kickoff...'
    },
    {
      id: '3',
      name: 'Data Analysis.xlsx',
      type: 'XLSX',
      size: '3.1 MB',
      uploadDate: '2025-01-25',
      content: 'Spreadsheet with data analysis results...'
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          content: 'Document content will be processed...'
        }
        setDocuments(prev => [newDoc, ...prev])
      })
    }
  }

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      if (selectedDocument?.id === id) {
        setSelectedDocument(null)
      }
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (type: string) => {
    return <FileText className="w-8 h-8 text-blue-500" />
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'PDF': 'bg-red-100 text-red-800',
      'DOCX': 'bg-blue-100 text-blue-800',
      'XLSX': 'bg-green-100 text-green-800',
      'TXT': 'bg-gray-100 text-gray-800',
      'PPTX': 'bg-orange-100 text-orange-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload, manage, and process your documents
          </p>
        </div>

        {/* Upload and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="file-upload">
              <Button asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx,.ppt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Documents ({filteredDocuments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No documents found matching your search.' : 'No documents uploaded yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDocument?.id === doc.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-center space-x-4">
                          {getFileIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {doc.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getTypeColor(doc.type)}>
                                {doc.type}
                              </Badge>
                              <span className="text-sm text-gray-500">{doc.size}</span>
                              <span className="text-sm text-gray-500">{doc.uploadDate}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteDocument(doc.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDocument ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedDocument.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getTypeColor(selectedDocument.type)}>
                          {selectedDocument.type}
                        </Badge>
                        <span className="text-sm text-gray-500">{selectedDocument.size}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Content Preview:</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                        {selectedDocument.content}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Full Preview
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Select a document to preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supported Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-medium">Documents</h4>
                <p className="text-gray-600">PDF, DOC, DOCX, TXT</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Spreadsheets</h4>
                <p className="text-gray-600">XLS, XLSX, CSV</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Presentations</h4>
                <p className="text-gray-600">PPT, PPTX</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Max Size</h4>
                <p className="text-gray-600">50 MB per file</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
