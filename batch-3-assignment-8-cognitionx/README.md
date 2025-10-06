# 🧠 Welcome To CognitionX - Advanced AI Conversation Platform

CognitionX is a comprehensive AI-powered conversation platform built with Next.js that goes far beyond simple chat functionality. It provides enterprise-level features for AI interaction, testing, analytics, and conversation management.

## 🚀 Core Features

### 💬 **Intelligent Chat System**
- **Real-time messaging** with Google Gemini AI integration
- **Dynamic conversation routing** with unique shareable URLs (`/conversation/<ID>`)
- **MongoDB Atlas integration** for persistent conversation storage
- **Server-side API handling** - All Gemini API calls are processed server-side for security
- **Auto-generated conversation titles** using AI
- **Conversation management** with edit, delete, and share capabilities

### 🎯 **Create Chat Workflow**
- **Initial prompt form** with suggestion chips for quick start
- **Conversation creation** only after first message is sent
- **Smart conversation listing** in sidebar with chronological organization
- **Seamless conversation switching** between multiple chat sessions

## ✨ Extra Features (14 Advanced Capabilities)

### 1. 🔐 **Authentication System**
- **Secure user registration and login** with JWT token management
- **Password hashing** using bcryptjs for security
- **Protected routes** and session management
- **User profile management** with persistent login state
- **Logout functionality** with token cleanup

### 2. 📊 **Analytics Dashboard**
- **Comprehensive usage analytics** with visual charts
- **Message count tracking** and response time metrics
- **Time-based filtering** (daily, weekly, monthly views)
- **User activity patterns** and conversation trends
- **Performance monitoring** with detailed statistics
- **Interactive data visualization** using modern chart components

### 3. 🛝 **API Playground**
- **Interactive testing environment** for AI models
- **Parameter controls** (temperature, max tokens, top-p, frequency penalty)
- **Advanced prompt editor** with syntax highlighting
- **Response viewer** with formatted output display
- **Performance metrics** tracking for each test
- **Code generation** capabilities for different programming languages
- **Test history** with save/load functionality
- **Preset management** for commonly used configurations
- **Export functionality** for test results and configurations

### 4. ⚖️ **Model Comparison Tool**
- **Side-by-side comparison** of multiple AI model responses
- **Voting system** with thumbs up/down for response quality
- **Performance metrics comparison** (response time, word count, quality)
- **Save comparison results** for future reference
- **Export comparison data** in multiple formats
- **Visual comparison interface** with clear model differentiation

### 5. 🧠 **RAG Knowledge Base (Retrieval-Augmented Generation)**
- **Document Upload System**:
  - Drag-and-drop interface for .txt and .md files
  - Bulk document upload with progress tracking
  - File validation and error handling
  - Document preview and metadata extraction
- **Smart Document Processing**:
  - Automatic text extraction and chunking
  - TF-IDF vectorization for semantic search
  - Word count and statistics tracking
  - Persistent document storage with MongoDB
- **Intelligent Search & Retrieval**:
  - Real-time semantic search across uploaded documents
  - Similarity scoring with percentage match indicators
  - Context-aware search results with document previews
  - Search history and query optimization
- **AI Context Integration**:
  - "Use Context" feature to inject document content into conversations
  - Smart prompt generation with document excerpts
  - Seamless integration with main chat interface
  - Context-aware AI responses based on your documents
- **Knowledge Base Management**:
  - Document library with organized file listings
  - Individual document deletion and bulk clear operations
  - Usage analytics and storage statistics
  - Document metadata tracking (file type, word count, upload date)
- **Interactive Instructions Modal**:
  - Comprehensive user guide with step-by-step workflow
  - Example use cases (research papers, documentation, notes)
  - Pro tips for optimal usage and best practices
  - Easy access via help button in RAG interface
- **Advanced Features**:
  - Background scroll lock for modal interactions
  - Responsive design with glassmorphism UI
  - Real-time search with debouncing
  - Error handling and user feedback notifications

### 6. 🎭 **Persona System**
- **Multiple AI personalities** with distinct conversation styles
- **Pre-built persona templates** (Professional, Creative, Technical, etc.)
- **Custom persona configuration** with personality traits
- **Persona-specific prompt templates** and response styles
- **Dynamic persona switching** within conversations
- **Persona behavior customization** for specialized use cases

### 7. 🎤 **Speech Integration**
- **Voice input functionality** with speech-to-text conversion
- **Voice controls** for hands-free interaction
- **Audio feedback** capabilities for responses
- **Multiple language support** for voice recognition
- **Voice command processing** with magic command integration
- **Microphone permission management** and error handling

### 8. ✨ **Magic Commands System**
- **Special command syntax** (e.g., `/help`, `/brainstorm`, `/analyze`)
- **Auto-completion** and command suggestions
- **Built-in command library** with extensible architecture
- **Custom command creation** and execution
- **Command help system** with documentation
- **Context-aware commands** that understand conversation state

### 9. 🖼️ **Image Upload & Processing**
- **Drag-and-drop image upload** with preview functionality
- **Multiple image format support** (PNG, JPG, GIF, WebP)
- **Image attachment to messages** with AI vision capabilities
- **Image compression** and optimization
- **Visual image gallery** within conversations
- **Image analysis** using Gemini's vision capabilities

### 10. 🎨 **Theme System**
- **Dark/Light mode toggle** with system preference detection
- **Custom theme configuration** with color scheme options
- **Responsive design** across all device types
- **Theme persistence** across browser sessions
- **Accessibility-focused** color contrast and typography
- **Modern gradient designs** with smooth animations

### 11. 🌊 **Streaming Responses**
- **Real-time message streaming** from AI models
- **Progressive response rendering** with typing indicators
- **Smooth user experience** with live updates
- **Stream interruption** and resumption capabilities
- **Error handling** for interrupted streams
- **Optimized performance** for long responses

### 12. 🤖 **Multiple Gemini Models Support**
- **Dynamic model fetching** from Google's API
- **Model selection interface** with detailed specifications
- **Support for latest Gemini versions** with automatic updates
- **Deprecated model filtering** for optimal performance
- **Model-specific optimizations** and timeout configurations
- **Seamless model switching** without conversation interruption

### 13. 🛠️ **Message Management Features**
- **Copy Functionality**:
  - Copy individual messages to clipboard
  - Copy code blocks with syntax preservation
  - Copy AI responses from comparison tools
  - Visual feedback for successful copy operations
- **Edit Capabilities**:
  - Edit conversation titles inline
  - Modify message content after sending
  - Real-time edit validation and saving
- **Regenerate Response**:
  - Regenerate AI responses for better results
  - Multiple regeneration attempts
  - Compare different response variations

### 14. 📤 **Export Functionality**
- **Individual conversation export** in multiple formats
- **Bulk conversation export** for data backup
- **Format options**: JSON, PDF, TXT, Markdown
- **Metadata inclusion** (timestamps, user info, model used)
- **Shareable export links** for collaboration
- **Export customization** with filtering options

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **AI Integration**: Google Gemini API
- **Authentication**: JWT tokens with bcryptjs
- **Styling**: Tailwind CSS with custom themes
- **Icons**: Lucide React icon library
- **Markdown**: React Markdown with syntax highlighting
- **Speech**: Web Speech API integration

## 📁 Project Structure

```
CognitionX/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for backend functionality
│   ├── conversation/      # Dynamic conversation pages
│   ├── analytics/         # Analytics dashboard
│   ├── playground/        # API testing playground
│   └── compare/           # Model comparison tool
├── components/            # Reusable React components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── models/                # MongoDB data models
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone repo_url
cd path-to-folder
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Set up database collections: `conversations`, `messages`, `users`
3. Configure network access and database user permissions

### Gemini API Setup
1. Get API key from Google AI Studio
2. Enable Gemini models in your Google Cloud project
3. Configure rate limits and usage quotas

## 📖 Usage Guide

### Basic Chat
1. **Register/Login** to your account
2. **Click "Create Chat"** to start a new conversation
3. **Type your message** or use voice input
4. **Press Enter** or click Send to get AI response
5. **Use suggestions** for quick prompts

### Advanced Features
- **Try the Playground** (`/playground`) for model testing
- **Compare Models** (`/compare`) for response analysis
- **View Analytics** (`/analytics`) for usage insights
- **Use Magic Commands** like `/help` for special functions
- **Upload Images** for vision-based AI interactions
- **Utilize RAG Knowledge Base** for enhanced document-based conversations

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check our documentation
- Contact the development team

---

**CognitionX** - Empowering conversations with advanced AI capabilities 🚀
