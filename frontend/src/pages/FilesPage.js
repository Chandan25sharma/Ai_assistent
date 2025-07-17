import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentIcon, 
  CloudArrowUpIcon, 
  DocumentTextIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

const FilesPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [summary, setSummary] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'json'];

  const handleFileSelect = (file) => {
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!supportedFormats.includes(fileExtension)) {
      toast.error('Unsupported file format');
      return;
    }
    
    setUploadedFile(file);
    setFileData(null);
    setSummary('');
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    try {
      const result = await ApiService.uploadFile(uploadedFile);
      setFileData(result);
      toast.success('File uploaded and processed successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSummarize = async () => {
    if (!uploadedFile) return;
    
    setIsSummarizing(true);
    try {
      const result = await ApiService.summarizeFile(uploadedFile);
      setSummary(result.summary);
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Summarization failed:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <DocumentIcon className="h-8 w-8 text-red-500" />;
      case 'docx':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
      case 'xlsx':
      case 'csv':
        return <TableCellsIcon className="h-8 w-8 text-green-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">File Processing</h1>
        <p className="text-green-100">Upload, analyze, and summarize documents with AI</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h3>
        
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Drop your file here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                browse
              </button>
            </p>
            
            <p className="text-sm text-gray-600">
              Supported formats: {supportedFormats.join(', ').toUpperCase()}
            </p>
            
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.csv,.txt,.json"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
        
        {/* Selected File */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(uploadedFile.name)}
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="btn btn-primary flex items-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Process
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="btn btn-secondary flex items-center"
                >
                  {isSummarizing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      Summarize
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* File Data */}
      {fileData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">File Analysis</h3>
          
          {fileData.error ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-800 font-medium">Error processing file</p>
              </div>
              <p className="text-red-700 mt-2">{fileData.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">File Type</p>
                  <p className="text-gray-900">{fileData.file_type || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">File Name</p>
                  <p className="text-gray-900">{fileData.file_name || 'Unknown'}</p>
                </div>
              </div>
              
              {fileData.text_content && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Content Preview</p>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                      {fileData.text_content.substring(0, 1000)}
                      {fileData.text_content.length > 1000 && '...'}
                    </pre>
                  </div>
                </div>
              )}
              
              {fileData.sheets && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Excel Sheets</p>
                  <div className="space-y-2">
                    {Object.entries(fileData.sheets).map(([sheetName, sheetData]) => (
                      <div key={sheetName} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-900">{sheetName}</p>
                        <p className="text-sm text-gray-600">
                          {sheetData.rows} rows, {sheetData.columns} columns
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Summary
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{summary}</p>
          </div>
        </motion.div>
      )}

      {/* Supported Formats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Supported File Formats</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { format: 'PDF', icon: DocumentIcon, desc: 'Portable Document Format' },
            { format: 'DOCX', icon: DocumentTextIcon, desc: 'Microsoft Word Document' },
            { format: 'XLSX', icon: TableCellsIcon, desc: 'Microsoft Excel Spreadsheet' },
            { format: 'CSV', icon: TableCellsIcon, desc: 'Comma-Separated Values' },
            { format: 'TXT', icon: DocumentIcon, desc: 'Plain Text File' },
            { format: 'JSON', icon: DocumentIcon, desc: 'JavaScript Object Notation' },
          ].map((item) => (
            <div key={item.format} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <item.icon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">{item.format}</span>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
