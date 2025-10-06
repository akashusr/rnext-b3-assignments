import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Search,
  Trash2,
  Database,
  AlertCircle,
  CheckCircle,
  BookOpen,
  BarChart3,
  Download,
  Globe,
  X
} from 'lucide-react';

export function KnowledgeBase({ isOpen, onClose, onContextSearch }) {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const [webUrl, setWebUrl] = useState('');
  const [showWebInput, setShowWebInput] = useState(false);

  const fileInputRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
      loadStats();
    }
  }, [isOpen]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rag?action=list');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      showNotification('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/rag?action=stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('document', file);

        const response = await fetch('/api/rag', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          successCount++;
        } else {
          const error = await response.json();
          showNotification(`Failed to upload ${file.name}: ${error.error}`, 'error');
        }
      } catch (error) {
        showNotification(`Error uploading ${file.name}`, 'error');
      }
    }

    if (successCount > 0) {
      showNotification(`Successfully uploaded ${successCount} document(s)`, 'success');
      loadDocuments();
      loadStats();
    }

    setUploading(false);
  };

  const handleWebContent = async () => {
    if (!webUrl.trim()) return;

    try {
      setUploading(true);
      // For demo purposes, we'll simulate web scraping
      // In a real implementation, you'd need a backend service to scrape content
      showNotification('Web content extraction feature coming soon!', 'info');
      setWebUrl('');
      setShowWebInput(false);
    } catch (error) {
      showNotification('Failed to extract web content', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/rag?action=search&query=${encodeURIComponent(searchQuery)}&topK=5`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      showNotification('Search failed', 'error');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/rag?id=${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('Document deleted successfully', 'success');
        loadDocuments();
        loadStats();
        setSearchResults([]);
      } else {
        showNotification('Failed to delete document', 'error');
      }
    } catch (error) {
      showNotification('Error deleting document', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all documents from your knowledge base?')) {
      return;
    }

    try {
      const response = await fetch('/api/rag?action=clear', {
        method: 'DELETE',
      });

      if (response.ok) {
        showNotification('Knowledge base cleared successfully', 'success');
        setDocuments([]);
        setStats(null);
        setSearchResults([]);
      } else {
        showNotification('Failed to clear knowledge base', 'error');
      }
    } catch (error) {
      showNotification('Error clearing knowledge base', 'error');
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
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">Knowledge Base</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
             notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
             <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Upload & Stats */}
          <div className="w-1/3 border-r dark:border-gray-700 p-6 flex flex-col">
            {/* Upload Section */}
            <div
              ref={dragRef}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 mb-6 transition-colors ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drop files here or click to upload
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Select Files'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.md"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                  className="hidden"
                />
              </div>
            </div>

            {/* Web Content Section */}
            <div className="mb-6">
              <button
                onClick={() => setShowWebInput(!showWebInput)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-3"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">Add Web Content</span>
              </button>

              {showWebInput && (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="Enter website URL..."
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                  />
                  <button
                    onClick={handleWebContent}
                    disabled={!webUrl.trim() || uploading}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
                  >
                    Extract Content
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            {stats && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span className="font-medium">{stats.totalDocuments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Words:</span>
                    <span className="font-medium">{stats.totalWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Words/Doc:</span>
                    <span className="font-medium">{stats.averageWordsPerDocument}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleClearAll}
                disabled={!documents.length}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm transition-colors"
              >
                Clear All Documents
              </button>
            </div>
          </div>

          {/* Right Panel - Search & Documents */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Search */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your knowledge base..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Results/Documents */}
            <div className="flex-1 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="space-y-3">
                    {searchResults.map((result) => (
                      <div key={result.id} className="border rounded-lg p-4 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{result.metadata.fileName}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {Math.round(result.similarity * 100)}% match
                            </span>
                            <button
                              onClick={() => onContextSearch && onContextSearch(result.content)}
                              className="text-purple-600 hover:text-purple-700 text-xs"
                            >
                              Use Context
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{result.preview}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents ({documents.length})
                  </h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No documents in your knowledge base yet.</p>
                      <p className="text-sm mt-2">Upload some documents to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4 dark:border-gray-600">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{doc.metadata.fileName}</h4>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{doc.metadata.fileType?.toUpperCase()}</span>
                            <span>{doc.metadata.wordCount} words</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{doc.preview}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
