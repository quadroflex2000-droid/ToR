'use client';

import { useState, useRef } from 'react';
import { 
  DocumentArrowUpIcon,
  CpuChipIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error';
  analysisResult?: {
    confidence: number;
    extractedItems: number;
    manualReviewRequired: boolean;
    processingNotes: string[];
  };
}

interface ProjectFilesManagerProps {
  projectId: string;
}

export default function ProjectFilesManager({ projectId }: ProjectFilesManagerProps) {
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'office_specifications.pdf',
      type: 'pdf',
      size: 2456789,
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'analyzed',
      analysisResult: {
        confidence: 0.92,
        extractedItems: 24,
        manualReviewRequired: false,
        processingNotes: ['High quality document with clear specifications', 'All quantities successfully extracted']
      }
    },
    {
      id: '2',
      name: 'furniture_catalog.xlsx',
      type: 'xlsx',
      size: 1234567,
      uploadedAt: '2024-01-20T14:15:00Z',
      status: 'analyzed',
      analysisResult: {
        confidence: 0.87,
        extractedItems: 18,
        manualReviewRequired: true,
        processingNotes: ['Some brand information missing', 'Recommended manual review for completeness']
      }
    },
    {
      id: '3',
      name: 'client_requirements.docx',
      type: 'docx',
      size: 987654,
      uploadedAt: '2024-01-25T09:45:00Z',
      status: 'uploaded'
    }
  ]);
  
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'uploaded' | 'analyzed' | 'analyzing' | 'error'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || file.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    uploadedFiles.forEach(file => {
      const newFile: ProjectFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded'
      };
      
      setFiles(prev => [...prev, newFile]);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeFile = async (fileId: string) => {
    setAnalyzing(prev => [...prev, fileId]);
    
    // Update file status to analyzing
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, status: 'analyzing' as const } : file
    ));

    // Simulate AI analysis
    setTimeout(() => {
      const mockResult = {
        confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
        extractedItems: Math.floor(Math.random() * 30) + 5,
        manualReviewRequired: Math.random() > 0.6,
        processingNotes: [
          'Document processed successfully',
          'Specifications extracted with high confidence',
          'Ready for project integration'
        ]
      };

      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, status: 'analyzed' as const, analysisResult: mockResult }
          : file
      ));
      
      setAnalyzing(prev => prev.filter(id => id !== fileId));
    }, 3000);
  };

  const analyzeBatch = () => {
    const filesToAnalyze = files.filter(file => 
      selectedFiles.includes(file.id) && file.status === 'uploaded'
    );
    
    filesToAnalyze.forEach(file => analyzeFile(file.id));
    setSelectedFiles([]);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const getStatusIcon = (file: ProjectFile) => {
    switch (file.status) {
      case 'uploaded':
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
      case 'analyzing':
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'analyzed':
        return file.analysisResult?.manualReviewRequired
          ? <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
          : <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Files & AI Analysis</h3>
          <p className="text-gray-600">Upload and analyze project documents with AI-powered extraction</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedFiles.length > 0 && (
            <button
              onClick={analyzeBatch}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <CpuChipIcon className="w-4 h-4" />
              <span>Analyze Selected ({selectedFiles.length})</span>
            </button>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <DocumentArrowUpIcon className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="uploaded">Uploaded</option>
          <option value="analyzing">Analyzing</option>
          <option value="analyzed">Analyzed</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={filteredFiles.length > 0 && filteredFiles.every(file => selectedFiles.includes(file.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(filteredFiles.map(file => file.id));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Analysis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(file)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {file.type.toUpperCase()} • {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      file.status === 'uploaded' ? 'bg-gray-100 text-gray-800' :
                      file.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                      file.status === 'analyzed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {file.analysisResult ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getConfidenceColor(file.analysisResult.confidence)}`}>
                            {Math.round(file.analysisResult.confidence * 100)}% confidence
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {file.analysisResult.extractedItems} items extracted
                        </div>
                      </div>
                    ) : file.status === 'analyzing' ? (
                      <div className="text-sm text-blue-600">Processing...</div>
                    ) : (
                      <button
                        onClick={() => analyzeFile(file.id)}
                        disabled={analyzing.includes(file.id)}
                        className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                      >
                        Analyze
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(file.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {file.analysisResult && (
                        <button className="text-blue-600 hover:text-blue-700">
                          <ChartBarIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-700">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload project documents to get started with AI analysis.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto transition-colors"
              >
                <DocumentArrowUpIcon className="w-4 h-4" />
                <span>Upload Your First File</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.xlsx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}