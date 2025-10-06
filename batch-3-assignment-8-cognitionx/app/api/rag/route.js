import { NextResponse } from 'next/server';

async function getRagService() {
  try {
    const { getRAGService } = await import('@/lib/ragService');
    return getRAGService();
  } catch (error) {
    console.error('Failed to import or initialize RAG service:', error);
    throw new Error(`RAG service initialization failed: ${error.message}`);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const ragService = await getRagService();

    switch (action) {
      case 'list':
        const documents = await ragService.getDocuments();
        return NextResponse.json({ documents });

      case 'stats':
        const stats = await ragService.getStats();
        return NextResponse.json({ stats });

      case 'search':
        const query = searchParams.get('query');
        const topK = parseInt(searchParams.get('topK') || '5');

        if (!query) {
          return NextResponse.json(
            { error: 'Query parameter is required for search' },
            { status: 400 }
          );
        }

        const results = await ragService.searchContext(query, { topK });
        return NextResponse.json({ results });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in RAG GET endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('document');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ragService = await getRagService();

    const result = await ragService.addDocument(
      {
        name: file.name,
        size: file.size,
        type: file.type
      },
      buffer
    );

    return NextResponse.json({
      success: true,
      message: 'Document added to knowledge base successfully',
      ...result
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process document' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    const action = searchParams.get('action');

    const ragService = await getRagService();

    if (action === 'clear') {
      const result = ragService.clearKnowledgeBase();
      return NextResponse.json(result);
    }

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const success = ragService.removeDocument(documentId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Document removed successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete document' },
      { status: 500 }
    );
  }
}
