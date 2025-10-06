import { v4 as uuidv4 } from 'uuid';

export class DocumentProcessor {
  static async processFile(file, buffer) {
    const fileExtension = file.name.split('.').pop().toLowerCase();

    switch (fileExtension) {
      case 'txt':
        return await this.processTXT(buffer, file.name);
      case 'md':
        return await this.processMarkdown(buffer, file.name);
      default:
        throw new Error(`Unsupported file type: ${fileExtension}. Only .txt and .md files are supported.`);
    }
  }

  static async processTXT(buffer, fileName) {
    try {
      const content = buffer.toString('utf-8');
      return {
        id: uuidv4(),
        content,
        metadata: {
          fileName,
          fileType: 'txt',
          size: buffer.length,
          processedAt: new Date()
        }
      };
    } catch (error) {
      throw new Error(`Error processing TXT: ${error.message}`);
    }
  }

  static async processMarkdown(buffer, fileName) {
    try {
      const content = buffer.toString('utf-8');
      return {
        id: uuidv4(),
        content,
        metadata: {
          fileName,
          fileType: 'md',
          size: buffer.length,
          processedAt: new Date()
        }
      };
    } catch (error) {
      throw new Error(`Error processing Markdown: ${error.message}`);
    }
  }

  // Extract text from web sources (keeping this simple feature)
  static processWebContent(url, content) {
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    return {
      id: uuidv4(),
      content: textContent,
      metadata: {
        source: 'web',
        url,
        extractedAt: new Date(),
        size: textContent.length
      }
    };
  }

  // Chunk large documents for better retrieval
  static chunkDocument(document, maxChunkSize = 1000, overlap = 200) {
    const { content, metadata } = document;
    const words = content.split(/\s+/);

    if (words.length <= maxChunkSize) {
      return [document];
    }

    const chunks = [];
    let startIndex = 0;

    while (startIndex < words.length) {
      const endIndex = Math.min(startIndex + maxChunkSize, words.length);
      const chunkContent = words.slice(startIndex, endIndex).join(' ');

      chunks.push({
        id: `${document.id}_chunk_${chunks.length}`,
        content: chunkContent,
        metadata: {
          ...metadata,
          isChunk: true,
          parentId: document.id,
          chunkIndex: chunks.length,
          startIndex,
          endIndex
        }
      });

      startIndex = endIndex - overlap;
      if (startIndex >= endIndex) break;
    }

    return chunks;
  }

  // Validate file before processing
  static validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB limit for text files
    const supportedTypes = ['txt', 'md'];

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (!supportedTypes.includes(extension)) {
      throw new Error(`Unsupported file type. Only .txt and .md files are supported.`);
    }

    return true;
  }
}
