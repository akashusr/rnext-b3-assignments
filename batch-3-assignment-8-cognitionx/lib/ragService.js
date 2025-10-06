import { getVectorStore } from './vectorStore';
import { DocumentProcessor } from './documentProcessor';
import crypto from 'crypto';

export class RAGService {
  constructor() {
    this.vectorStore = getVectorStore();
  }

  // Generate content hash for duplicate detection
  generateContentHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // Check if document already exists
  isDuplicateDocument(fileName, contentHash) {
    const existingDocs = this.vectorStore.getAllDocumentsWithContent();
    return existingDocs.some(doc => {
      const docFileName = doc.metadata.fileName;
      const docContentHash = doc.metadata.contentHash;

      // Check for exact filename match
      if (docFileName === fileName) {
        // If content hash matches too, it's an exact duplicate
        if (docContentHash === contentHash) {
          return true;
        }
        // If filename matches but content differs, we'll allow it with a warning
      }
      return false;
    });
  }

  // Add document to knowledge base
  async addDocument(file, buffer, options = {}) {
    try {
      // Validate file
      DocumentProcessor.validateFile(file);

      // Process the document first to get content
      const processedDoc = await DocumentProcessor.processFile(file, buffer);
      const contentHash = this.generateContentHash(processedDoc.content);

      // Check for duplicates
      if (this.isDuplicateDocument(file.name, contentHash)) {
        throw new Error(`Document "${file.name}" already exists in the knowledge base. Please remove the existing document first or rename this file.`);
      }

      // Add content hash to metadata
      processedDoc.metadata.contentHash = contentHash;

      // Chunk large documents if needed
      const chunks = DocumentProcessor.chunkDocument(
        processedDoc,
        options.chunkSize || 1000,
        options.overlap || 200
      );

      // Add chunks to vector store
      const addedDocuments = [];
      for (const chunk of chunks) {
        // Ensure chunk metadata includes content hash
        chunk.metadata.contentHash = contentHash;
        const doc = this.vectorStore.addDocument(
          chunk.id,
          chunk.content,
          chunk.metadata
        );
        addedDocuments.push(doc);
      }

      return {
        success: true,
        documentsAdded: addedDocuments.length,
        originalDocument: processedDoc,
        chunks: addedDocuments
      };
    } catch (error) {
      throw new Error(`Failed to add document: ${error.message}`);
    }
  }

  // Add web content to knowledge base
  addWebContent(url, content) {
    try {
      const processedDoc = DocumentProcessor.processWebContent(url, content);
      const chunks = DocumentProcessor.chunkDocument(processedDoc);

      const addedDocuments = [];
      for (const chunk of chunks) {
        const doc = this.vectorStore.addDocument(
          chunk.id,
          chunk.content,
          chunk.metadata
        );
        addedDocuments.push(doc);
      }

      return {
        success: true,
        documentsAdded: addedDocuments.length,
        chunks: addedDocuments
      };
    } catch (error) {
      throw new Error(`Failed to add web content: ${error.message}`);
    }
  }

  // Search knowledge base and get relevant context
  searchContext(query, options = {}) {
    const {
      topK = 5,
      threshold = 0.0, // Changed from 0.1 to 0.0
      includeMetadata = true
    } = options;

    const results = this.vectorStore.search(query, topK, threshold);

    return results.map(doc => ({
      id: doc.id,
      content: doc.originalContent,
      similarity: doc.similarity,
      metadata: includeMetadata ? doc.metadata : undefined,
      preview: doc.originalContent.substring(0, 200) + '...'
    }));
  }

  // Generate context-aware response
  generateContextualPrompt(userQuery, maxContextLength = 2000) {
    const relevantDocs = this.searchContext(userQuery, { topK: 3 });

    if (relevantDocs.length === 0) {
      return {
        prompt: userQuery,
        hasContext: false,
        sources: []
      };
    }

    // Build context from relevant documents
    let context = '';
    const sources = [];

    for (const doc of relevantDocs) {
      const docContext = doc.content.substring(0, 500);
      if (context.length + docContext.length < maxContextLength) {
        context += `\n\nSource: ${doc.metadata.fileName || 'Unknown'}\n${docContext}`;
        sources.push({
          id: doc.id,
          fileName: doc.metadata.fileName,
          similarity: doc.similarity
        });
      }
    }

    const contextualPrompt = `Based on the following context from your knowledge base, please answer the user's question:

CONTEXT:
${context}

USER QUESTION: ${userQuery}

Please provide a comprehensive answer based on the context above. If the context doesn't contain enough information to fully answer the question, please indicate what additional information might be needed.`;

    return {
      prompt: contextualPrompt,
      hasContext: true,
      sources,
      originalQuery: userQuery
    };
  }

  // Get all documents in knowledge base
  getDocuments() {
    return this.vectorStore.getAllDocuments();
  }

  // Remove document from knowledge base
  removeDocument(documentId) {
    return this.vectorStore.removeDocument(documentId);
  }

  // Get knowledge base statistics
  getStats() {
    return this.vectorStore.getStats();
  }

  // Search for similar documents to a given document
  findSimilarDocuments(documentId, topK = 5) {
    const doc = this.vectorStore.getDocument(documentId);
    if (!doc) {
      throw new Error('Document not found');
    }

    return this.searchContext(doc.originalContent, { topK: topK + 1 })
      .filter(result => result.id !== documentId)
      .slice(0, topK);
  }

  // Export knowledge base
  exportKnowledgeBase() {
    const documents = this.vectorStore.getAllDocuments();
    return {
      exportedAt: new Date(),
      stats: this.getStats(),
      documents: documents
    };
  }

  // Clear entire knowledge base
  clearKnowledgeBase() {
    this.vectorStore = getVectorStore();
    this.vectorStore.documents = [];
    this.vectorStore.rebuildIndex();
    return { success: true, message: 'Knowledge base cleared' };
  }
}

// Global RAG service instance
let globalRAGService = null;

export function getRAGService() {
  if (!globalRAGService) {
    globalRAGService = new RAGService();
  }
  return globalRAGService;
}
