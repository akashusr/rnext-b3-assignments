"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { RAGInstructionsModal } from '@/components/RAGInstructionsModal';
import {
  Upload,
  FileText,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  BookOpen,
  BarChart3,
  ArrowLeft,
  Sparkles,
  Brain,
  HelpCircle
} from 'lucide-react';

export default function RAGPage() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const fileInputRef = useRef(null);
  const dragRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadDocuments();
    loadStats();
  }, [isAuthenticated, router]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
      // Refresh the document list and stats
      await loadDocuments();
      await loadStats();
    }

    setUploading(false);

    // Clear the file input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const handleUseContext = (content) => {
    const contextPreview = content.length > 500
      ? content.substring(0, 500) + "..."
      : content;

    const smartPrompt = `Based on this document content:

---
${contextPreview}
---

Please help me with: `;

    // Store in localStorage to pass to main chat
    localStorage.setItem('ragContext', smartPrompt);
    router.push('/?context=rag');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 min-h-screen backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
                  <p className="text-purple-200">Manage your AI&apos;s knowledge repository</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInstructions(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 group"
                title="How to use RAG"
              >
                <HelpCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-white text-sm font-medium">Help</span>
              </button>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                <span className="text-white/80 text-sm">RAG Powered</span>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-6 p-4 rounded-xl backdrop-blur-md border border-white/20 flex items-center space-x-3 ${
              notification.type === 'success' ? 'bg-green-500/20 text-green-100' :
              notification.type === 'error' ? 'bg-red-500/20 text-red-100' :
              'bg-blue-500/20 text-blue-100'
            }`}>
              {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
               notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
               <AlertCircle className="w-5 h-5" />}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Upload & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Section */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Documents
                </h2>
                <div
                  ref={dragRef}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    dragActive 
                      ? 'border-purple-400 bg-purple-500/20 scale-105' 
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  <div className="text-center">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-white/70" />
                    <p className="text-white/80 mb-4">
                      Drop .txt or .md files here
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
              </div>

              {/* Stats */}
              {stats && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Documents:</span>
                      <span className="text-2xl font-bold text-white">{stats.totalDocuments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Words:</span>
                      <span className="text-lg font-semibold text-white">{stats.totalWords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Avg Words/Doc:</span>
                      <span className="text-lg font-semibold text-white">{stats.averageWordsPerDocument}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <button
                  onClick={handleClearAll}
                  disabled={!documents.length}
                  className="w-full px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all duration-300"
                >
                  Clear All Documents
                </button>
              </div>
            </div>

            {/* Right Panel - Search & Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search Knowledge Base
                </h2>
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search your knowledge base..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Results/Documents */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Search Results ({searchResults.length})
                    </h3>
                    <div className="space-y-4">
                      {searchResults.map((result) => (
                        <div key={result.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-white text-sm">{result.metadata.fileName}</h4>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full">
                                {Math.round(result.similarity * 100)}% match
                              </span>
                              <button
                                onClick={() => handleUseContext(result.content)}
                                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                              >
                                Use Context
                              </button>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm">{result.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documents ({documents.length})
                    </h3>
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-2 border-white/20 border-t-white rounded-full mx-auto"></div>
                        <p className="text-white/70 mt-4">Loading documents...</p>
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-white/30" />
                        <p className="text-white/70 text-lg">No documents yet</p>
                        <p className="text-white/50 text-sm mt-2">Upload some documents to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {documents.map((doc) => (
                          <div key={doc.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-white text-sm">{doc.metadata.fileName}</h4>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                              <span>{doc.metadata.fileType?.toUpperCase()}</span>
                              <span>{doc.metadata.wordCount} words</span>
                            </div>
                            <p className="text-white/70 text-sm">{doc.preview}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions Modal */}
          <RAGInstructionsModal
            isOpen={showInstructions}
            onClose={() => setShowInstructions(false)}
          />
        </div>
      </div>
    </div>
  );
}
