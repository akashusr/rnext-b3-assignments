import React, { useEffect } from 'react';
import { X, Upload, Search, MessageSquare, Sparkles, ArrowRight, FileText, Brain, Zap } from 'lucide-react';

export function RAGInstructionsModal({ isOpen, onClose }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const steps = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Drag and drop or select .txt and .md files to add to your knowledge base",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      title: "Search Content",
      description: "Use the search box to find relevant information across all your documents",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Use Context",
      description: "Click 'Use Context' on search results to inject document content into your chat",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Chat",
      description: "Ask questions and get answers based on your specific documents and content",
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    "Smart text extraction from .txt and .md files",
    "TF-IDF similarity search for relevant content",
    "Document chunking for better context management",
    "Persistent storage across sessions",
    "Real-time search with similarity scores"
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-8"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 sticky top-0 bg-white/10 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">RAG Knowledge Base</h2>
              <p className="text-purple-200">How to use Retrieval-Augmented Generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* What is RAG */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-400/30 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Retrieval-Augmented Generation</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">What is RAG?</h3>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              RAG combines your personal documents with AI to provide contextual, accurate answers.
              Instead of relying only on general knowledge, the AI can reference your specific content
              to give personalized responses.
            </p>
          </div>

          {/* How it Works */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} flex-shrink-0`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white/60 text-sm font-medium">Step {index + 1}</span>
                        {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-white/40" />}
                      </div>
                      <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Example Use Cases */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Example Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-2xl p-6">
                <FileText className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="text-white font-semibold mb-2">Research Papers</h4>
                <p className="text-white/70 text-sm">Upload academic papers and ask specific questions about methodologies, findings, or concepts.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-2xl p-6">
                <Brain className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="text-white font-semibold mb-2">Documentation</h4>
                <p className="text-white/70 text-sm">Add project docs, manuals, or guides and get instant answers about procedures or specifications.</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-2xl p-6">
                <Zap className="w-8 h-8 text-green-400 mb-3" />
                <h4 className="text-white font-semibold mb-2">Notes & Ideas</h4>
                <p className="text-white/70 text-sm">Upload meeting notes, brainstorming sessions, or personal notes for AI-assisted insights.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Key Features</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Pro Tips</h3>
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• Use descriptive filenames for better organization</li>
              <li>• Break large documents into smaller, focused files</li>
              <li>• Search with specific keywords for better results</li>
              <li>• Use &quot;Use Context&quot; to get AI responses based on your documents</li>
              <li>• Regularly update your knowledge base with new content</li>
            </ul>
          </div>

          {/* Get Started Button */}
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              Get Started with RAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
