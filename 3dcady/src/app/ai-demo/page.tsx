'use client';

import { useState } from 'react';
import { useSession } from '@/components/auth-provider';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
  DocumentArrowUpIcon,
  CpuChipIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AnalysisResult {
  extractedItems: any[];
  confidence: number;
  processingNotes: string[];
  manualReviewRequired: boolean;
}

export default function AIAnalysisDemo() {
  const { session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysis(null);
    }
  };

  const analyzeDocument = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Mock API call for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setUploadProgress(100);
      
      // Mock analysis result
      const mockAnalysis: AnalysisResult = {
        extractedItems: [
          {
            name: "Office Desk - Executive Series",
            quantity: 15,
            unit: "pcs",
            category: "FURNITURE",
            specifications: {
              dimensions: "160cm x 80cm x 75cm",
              material: "Oak wood with steel legs",
              color: "Natural oak",
              finish: "Matte lacquer",
              brand: "OfficePro",
              model: "EX-160"
            },
            confidence: 0.92,
            source_location: "Page 1, Table 1"
          },
          {
            name: "LED Ceiling Light - Panel Series", 
            quantity: 24,
            unit: "pcs",
            category: "LIGHTING",
            specifications: {
              dimensions: "60cm x 60cm x 8cm",
              power: "48W",
              color_temperature: "4000K",
              brightness: "4800 lumens",
              brand: "LightTech",
              model: "LP-6060"
            },
            confidence: 0.88,
            source_location: "Page 2, Item 3"
          },
          {
            name: "Carpet Flooring - Premium Collection",
            quantity: 250,
            unit: "sqm",
            category: "FINISHING_MATERIALS",
            specifications: {
              material: "Wool blend",
              thickness: "12mm",
              color: "Charcoal grey",
              pattern: "Textured weave",
              brand: "FloorMaster",
              fire_rating: "Class 1"
            },
            confidence: 0.85,
            source_location: "Page 3, Section B"
          },
          {
            name: "Ergonomic Office Chair",
            quantity: 15,
            unit: "pcs", 
            category: "FURNITURE",
            specifications: {
              material: "Mesh back, fabric seat",
              color: "Black",
              adjustable_height: "Yes",
              lumbar_support: "Yes",
              armrests: "Adjustable",
              brand: "ErgoComfort"
            },
            confidence: 0.90,
            source_location: "Page 1, Table 1"
          }
        ],
        confidence: 0.89,
        processingNotes: [
          "Document contains well-structured tables with clear specifications",
          "All quantities and units were clearly identified",
          "Some brand information inferred from context",
          "Recommended for automatic import with minor manual review"
        ],
        manualReviewRequired: false
      };

      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    if (confidence >= 0.7) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
  };

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <CpuChipIcon className="w-8 h-8 text-primary-600" />
              <span>AI Document Analysis</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Upload project documents to automatically extract specifications, quantities, and technical details using AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your document here, or click to browse
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.xlsx,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports PDF, DOCX, XLSX, TXT (max 100MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={analyzeDocument}
                  disabled={!selectedFile || analyzing}
                  className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  {analyzing ? (
                    <>
                      <ClockIcon className="w-5 h-5 animate-spin" />
                      <span>Analyzing Document...</span>
                    </>
                  ) : (
                    <>
                      <CpuChipIcon className="w-5 h-5" />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Features */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Capabilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Extract quantities and units automatically</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Identify materials, brands, and specifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Categorize items by type (furniture, lighting, etc.)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Parse complex tables and structured data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Confidence scoring and quality assessment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analysis && (
                <>
                  {/* Analysis Summary */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Items Extracted</p>
                        <p className="text-2xl font-bold text-gray-900">{analysis.extractedItems.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Overall Confidence</p>
                        <p className={`text-2xl font-bold ${getConfidenceColor(analysis.confidence)}`}>
                          {(analysis.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {analysis.manualReviewRequired ? (
                          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-sm text-gray-700">
                          {analysis.manualReviewRequired ? 'Manual review recommended' : 'Ready for automatic import'}
                        </span>
                      </div>
                    </div>

                    {analysis.processingNotes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Processing Notes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {analysis.processingNotes.map((note, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-gray-400">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Extracted Items */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Items</h3>
                    
                    <div className="space-y-4">
                      {analysis.extractedItems.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center space-x-1">
                              {getConfidenceIcon(item.confidence)}
                              <span className={`text-sm ${getConfidenceColor(item.confidence)}`}>
                                {(item.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Quantity:</span>
                              <span className="ml-1 font-medium">{item.quantity} {item.unit}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Category:</span>
                              <span className="ml-1 font-medium">{item.category}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Source:</span>
                              <span className="ml-1 font-medium">{item.source_location}</span>
                            </div>
                          </div>

                          {item.specifications && Object.keys(item.specifications).length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Specifications:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {Object.entries(item.specifications).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                                    <span className="ml-1">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors">
                        Import to Project
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
                        Download Report
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!analysis && !analyzing && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <CpuChipIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Upload a document to see AI analysis results here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}