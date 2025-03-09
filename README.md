
# ANALYST AI - Technical Documentation Version B01
#### Pillar Delta PC © 2025

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [API Routes](#api-routes)
7. [AI Capabilities](#ai-capabilities)
8. [Document Processing](#document-processing)
9. [Data Flow](#data-flow)
10. [User Interface](#user-interface)
11. [Deployment](#deployment)
12. [Deployment Guide](#deployment-guide)
13. [Code Documentation](#code-documentation)
14. [Future Enhancements](#future-enhancements)

## Introduction

ANALYST AI is a sophisticated financial analysis system developed by Pillar Delta. It leverages advanced AI models to provide comprehensive financial analysis, document processing, and interactive chat capabilities. The system is designed to assist users in analyzing financial documents, performing risk assessments, evaluating company health, and calculating financial metrics such as Z-scores.

### Core Capabilities

- AI-powered financial document analysis
- Multi-format document processing (PDF, Excel, Word, Text, Images)
- Interactive chat interface with a financial analyst AI
- Specialized analysis types (Risk Analysis, Z-Score, Company Health)
- Data visualization for financial metrics
- Document management and history tracking

## System Architecture

ANALYST AI follows a modern web application architecture with a clear separation of concerns:

1. **Frontend Layer**: Next.js-based React application with client-side components
2. **API Layer**: Server-side API routes for handling chat, document processing, and analysis
3. **AI Integration Layer**: Integration with OpenAI's GPT-4o model for financial analysis
4. **Document Processing Layer**: Utilities for processing various document formats
5. **State Management**: Custom React hooks and context providers for application state

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                        Next.js Frontend                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Pages    │  │  Components │  │     React Hooks     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                       Next.js API Routes                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Chat API   │  │ Document API│  │    Knowledge API    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                     External Services                       │
│  ┌─────────────────────────┐  ┌───────────────────────────┐ │
│  │      OpenAI API         │  │      Document Storage     │ │
│  │  (GPT-4o Integration)   │  │                           │ │
│  └─────────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15.1.7
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Charts**: Chart.js 4.4.8, ECharts 5.6.0

### Backend
- **Server**: Next.js API Routes
- **AI Integration**: OpenAI API (GPT-4o)
- **Document Processing**:
  - PDF.js (PDF processing)
  - XLSX (Excel processing)
  - Mammoth (Word document processing)

### Development Tools
- **Language**: TypeScript 5
- **Linting**: ESLint 9
- **Package Manager**: npm

## Project Structure

The project follows a modular structure organized by feature and responsibility:

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   ├── chat/           # Chat API
│   │   ├── knowledge-base/ # Knowledge Base API
│   │   ├── debug/          # Debug API
│   │   └── image/          # Image API
│   ├── components/         # App-specific components
│   ├── dashboard/          # Dashboard page
│   ├── v2/                 # Version 2 UI
│   ├── your-documents/     # Documents page
│   ├── chat-history/       # Chat history page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page (chat interface)
├── components/             # Shared components
│   ├── features/           # Feature-specific components
│   ├── layout/             # Layout components
│   └── shared/             # Shared UI components
├── contexts/               # React context providers
├── hooks/                  # Custom React hooks
│   └── useChat.ts          # Chat functionality hook
├── prompts/                # AI system prompts
│   ├── analysis-types/     # Analysis-specific prompts
│   └── financial-analyst.txt # Main system prompt
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
    ├── documentProcessor.ts # Document processing utilities
    ├── formatOutput.ts     # Output formatting utilities
    ├── promptLoader.ts     # Prompt loading utilities
    └── logger.ts           # Logging utilities
```

## Core Components

### Chat Interface (`src/app/page.tsx`)

The main chat interface allows users to interact with the AI financial analyst. It includes:

- Message history display
- Input field for user messages
- Document upload functionality
- Analysis type selection
- Processing indicators

```typescript
// Key components of the chat interface
export default function Home() {
  const {
    messages,
    currentInput,
    setCurrentInput,
    sendMessage,
    handleUpload,
    isLoading,
    isProcessingFile,
    analysisType,
    setAnalysisType
  } = useChat()
  
  // Component implementation...
}
```

### Document Preview (`src/components/shared/DocumentPreview.tsx`)

Displays previews of uploaded documents with appropriate rendering based on document type:

- PDF preview
- Image preview
- Text content preview
- Excel data preview

```typescript
// Document preview component
export function DocumentPreview({ document }: DocumentPreviewProps) {
  // Renders different preview types based on document.type
  // Supports PDF, images, text, and structured data
}
```

### Processing Indicator (`src/components/shared/ProcessIndicator.tsx`)

Provides visual feedback during document processing and AI response generation:

```typescript
// Processing indicator component
export function ProcessIndicator({ isLoading, isProcessingFile, fileName }: ProcessIndicatorProps) {
  // Shows loading animation and appropriate message based on current state
}
```

## API Routes

### Chat API (`src/app/api/chat/route.ts`)

Handles communication with the OpenAI API for generating AI responses:

```typescript
// Chat API route
export async function POST(req: Request) {
  try {
    const { content, analysisType, documents } = await req.json()
    
    // Load appropriate prompts based on analysis type
    let systemPrompt = await loadPrompt('financial-analyst')
    if (analysisType) {
      const analysisPrompt = await loadAnalysisTypePrompt(analysisType)
      systemPrompt += '\n\n' + analysisPrompt
    }
    
    // Prepare messages for OpenAI API
    const messages = [
      { role: 'system', content: systemPrompt },
      // Add user message with content and/or documents
    ]
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
    
    // Return formatted response
    return NextResponse.json({ content: formatOutput(response.choices[0].message.content) })
  } catch (error) {
    // Error handling
  }
}
```

### Knowledge Base API (`src/app/api/knowledge-base/upload/route.ts`)

Handles document uploads to the knowledge base:

```typescript
// Knowledge Base Upload API
export async function POST(req: Request) {
  // Process uploaded documents and store in knowledge base
}
```

## AI Capabilities

### System Prompt (`src/prompts/financial-analyst.txt`)

The system prompt defines the AI's capabilities and behavior:

```
ANALYST AI - Financial Analysis System
Version: 2024.1
Developed by Pillar Delta® PC

CORE CAPABILITIES:
1. Data Analysis Processing
2. Financial Mathematics
3. Statistical Analysis
4. Market Trend Analysis
5. Financial Forecasting
6. Strategic Advisory
7. Performance Optimization

SYSTEM PARAMETERS:
Language Support: English, Greek only
Expertise Level: Professor of Economy
Operating Mode: GPT4o and Claude Sonnet 3.5 parallel processing
```

### Analysis Types

The system supports specialized analysis types, each with its own prompt:

1. **Risk Analysis** (`src/prompts/analysis-types/risk-analysis.txt`)
   - Comprehensive risk assessment framework
   - Quantitative risk metrics
   - Risk mitigation strategies

2. **Z-Score Analysis** (`src/prompts/analysis-types/z-score.txt`)
   - Altman Z-Score calculation
   - Bankruptcy prediction
   - Financial distress indicators

3. **Company Health Analysis** (`src/prompts/analysis-types/company-health.txt`)
   - Overall financial health assessment
   - Key performance indicators
   - Comparative industry analysis

## Document Processing

### Document Processor (`src/utils/documentProcessor.ts`)

Handles processing of various document formats:

```typescript
// Document processor utility
export async function processDocument(file: File): Promise<{
  content: string;
  type: SupportedFileType;
  imageUrl?: string;
}> {
  try {
    const fileType = getFileType(file)
    
    switch (fileType) {
      case 'pdf':
        return await processPdf(file)
      case 'docx':
        return await processDocx(file)
      case 'xlsx':
        return await processExcel(file)
      case 'txt':
      case 'csv':
        return await processText(file)
      case 'image':
        return await processImage(file)
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    // Error handling
  }
}
```

### Supported File Types

- **PDF**: Processed using PDF.js
- **Word Documents**: Processed using Mammoth
- **Excel Spreadsheets**: Processed using XLSX
- **Text Files**: Processed using FileReader
- **Images**: Processed as base64-encoded data URLs

## Data Flow

### Chat Flow

1. User enters a message or uploads a document
2. Message is added to the chat history
3. If a document is uploaded, it's processed by the document processor
4. Request is sent to the Chat API
5. API loads appropriate prompts based on analysis type
6. API calls OpenAI with the system prompt, user message, and document content
7. Response is received from OpenAI
8. Response is formatted and added to the chat history
9. UI updates to display the new message

### Document Processing Flow

1. User uploads a document
2. Document is processed by the document processor
3. Document content is extracted based on file type
4. Document preview is generated
5. Document is added to the chat history
6. Document content is sent to the AI for analysis

## User Interface

### Main Chat Interface

The main chat interface includes:

- Chat history display
- Input field for user messages
- Document upload button
- Analysis type selector
- Processing indicators

### Dashboard

The dashboard provides an overview of:

- Recent analyses
- Uploaded documents
- Key financial metrics
- System status

### Document Management

The document management interface allows users to:

- View uploaded documents
- Organize documents by category
- Search for specific documents
- Share documents with others

## Deployment

### Production Build

To create a production build:

```bash
npm run build
```

This generates an optimized build in the `.next` directory.

### Deployment Requirements

For deployment, you need:

1. Node.js environment
2. OpenAI API key (set as OPENAI_API_KEY environment variable)
3. Sufficient storage for document processing

### Deployment Files

The following files are required for deployment:

- `.next` directory (compiled application)
- `public` directory (static assets)
- `package.json` and `package-lock.json`
- `.env.local` (environment variables)
- `next.config.js`

## Deployment Guide

This section provides detailed instructions for deploying the ANALYST AI application to different environments.

### Prerequisites

Before deploying, ensure you have:

1. Node.js 18.x or later installed
2. An OpenAI API key with access to GPT-4o
3. Git (for version control)
4. Access to your deployment environment (server, cloud platform, etc.)

### Environment Variables

Create a `.env.local` file with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Local Deployment

For local development and testing:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/analyst-ai.git
   cd analyst-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env.local` file with your OpenAI API key.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`.

### Production Deployment

#### Option 1: Traditional Server Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in the `.next` directory.

3. Transfer the following files to your server:
   - `.next` directory
   - `public` directory
   - `package.json` and `package-lock.json`
   - `.env.local` (with your OpenAI API key)
   - `next.config.js`

4. On the server, install production dependencies:
   ```bash
   npm install --production
   ```

5. Start the production server:
   ```bash
   npm start
   ```

6. Configure your web server (Nginx, Apache, etc.) to proxy requests to the Next.js server.

#### Option 2: Vercel Deployment (Recommended)

Vercel is optimized for Next.js applications and provides the easiest deployment experience:

1. Create an account on [Vercel](https://vercel.com) if you don't have one.

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy the application:
   ```bash
   vercel
   ```

5. Follow the prompts to configure your deployment.

6. Add your OpenAI API key as an environment variable in the Vercel dashboard.

#### Option 3: Docker Deployment

1. Create a `Dockerfile` in the project root:
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   # Next.js collects completely anonymous telemetry data about general usage.
   # Learn more here: https://nextjs.org/telemetry
   # Uncomment the following line to disable telemetry during the build.
   # ENV NEXT_TELEMETRY_DISABLED 1
   
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   # Uncomment the following line to disable telemetry during runtime.
   # ENV NEXT_TELEMETRY_DISABLED 1
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   
   # Automatically leverage output traces to reduce image size
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. Update `next.config.js` to enable standalone output:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'picsum.photos',
           pathname: '/**',
         },
       ],
     },
     eslint: {
       ignoreDuringBuilds: true,
     },
     output: 'standalone',
   }
   
   module.exports = nextConfig
   ```

3. Build the Docker image:
   ```bash
   docker build -t analyst-ai .
   ```

4. Run the Docker container:
   ```bash
   docker run -p 3000:3000 -e OPENAI_API_KEY=your_openai_api_key_here analyst-ai
   ```

### Scaling Considerations

For high-traffic deployments, consider:

1. **Horizontal Scaling**: Deploy multiple instances behind a load balancer.
2. **Caching**: Implement caching for API responses and static assets.
3. **Rate Limiting**: Add rate limiting to protect the OpenAI API from excessive requests.
4. **Monitoring**: Set up monitoring and alerting for application performance and errors.

### Security Considerations

1. **API Key Protection**: Never expose your OpenAI API key in client-side code.
2. **Input Validation**: Validate all user inputs to prevent injection attacks.
3. **Content Security Policy**: Implement a strict CSP to prevent XSS attacks.
4. **HTTPS**: Always use HTTPS in production to encrypt data in transit.
5. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities.

## Code Documentation

### useChat Hook (`src/hooks/useChat.ts`)

The `useChat` hook is the central state management component for the chat functionality. It manages:

- Chat message history
- Document uploads and processing
- Communication with the Chat API
- Loading states and error handling

```typescript
// Message type definition
export type Message = {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  documents?: {
    name: string
    type: string
    imageUrl?: string
    content?: string
  }[]
}

// Analysis type definition
export type AnalysisType = 'risk-analysis' | 'z-score' | 'company-health'

// useChat hook implementation
export function useChat() {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [analysisType, setAnalysisType] = useState<AnalysisType>('risk-analysis')
  const [documents, setDocuments] = useState<{
    name: string
    type: string
    imageUrl?: string
    content?: string
  }[]>([])

  // Generate unique ID for messages
  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Send message to the AI
  const sendMessage = async (content: string) => {
    // Implementation details...
  }

  // Analyze document with the AI
  const analyzeDocument = async (content: string, imageUrl?: string) => {
    // Implementation details...
  }

  // Handle document upload
  const handleUpload = async (file: File) => {
    // Implementation details...
  }

  // Return hook interface
  return {
    messages,
    currentInput,
    setCurrentInput,
    sendMessage,
    handleUpload,
    isLoading,
    isProcessingFile,
    analysisType,
    setAnalysisType
  }
}
```

### Document Processor (`src/utils/documentProcessor.ts`)

The document processor utility handles the extraction of content from various file types:

```typescript
// Supported file types
export type SupportedFileType = 'pdf' | 'docx' | 'txt' | 'csv' | 'xlsx' | 'image'

// Main document processing function
export async function processDocument(file: File): Promise<{
  content: string;
  type: SupportedFileType;
  imageUrl?: string;
}> {
  try {
    const fileType = getFileType(file)
    
    switch (fileType) {
      case 'pdf':
        return await processPdf(file)
      case 'docx':
        return await processDocx(file)
      case 'xlsx':
        return await processExcel(file)
      case 'txt':
      case 'csv':
        return await processText(file)
      case 'image':
        return await processImage(file)
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.error('Document processing error:', error)
    throw new Error(`Failed to process ${file.name}`)
  }
}

// File type detection
function getFileType(file: File): SupportedFileType {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (!extension) {
    throw new Error('File has no extension')
  }
  
  switch (extension) {
    case 'pdf':
      return 'pdf'
    case 'docx':
    case 'doc':
      return 'docx'
    case 'xlsx':
    case 'xls':
      return 'xlsx'
    case 'txt':
      return 'txt'
    case 'csv':
      return 'csv'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'image'
    default:
      throw new Error(`Unsupported file type: ${extension}`)
  }
}

// PDF processing
async function processPdf(file: File) {
  // Implementation using PDF.js
  // Extracts text content from PDF files
}

// Excel processing
async function processExcel(file: File) {
  // Implementation using XLSX
  // Converts Excel data to structured text
}

// Word document processing
async function processDocx(file: File) {
  // Implementation using Mammoth
  // Extracts text content from Word documents
}

// Text file processing
async function processText(file: File) {
  // Implementation using FileReader
  // Reads plain text files
}

// Image processing
async function processImage(file: File) {
  // Implementation using FileReader
  // Converts image to base64 data URL
}
```

### Prompt Loader (`src/utils/promptLoader.ts`)

The prompt loader utility loads system prompts from files:

```typescript
// Load main system prompt
export async function loadPrompt(promptName: string): Promise<string> {
  try {
    const response = await fetch(`/prompts/${promptName}.txt`)
    return await response.text()
  } catch (error) {
    console.error(`Failed to load prompt: ${promptName}`, error)
    return 'You are a helpful AI assistant.'
  }
}

// Load analysis type prompt
export async function loadAnalysisTypePrompt(analysisType: string): Promise<string> {
  try {
    const response = await fetch(`/prompts/analysis-types/${analysisType}.txt`)
    return await response.text()
  } catch (error) {
    console.error(`Failed to load analysis type prompt: ${analysisType}`, error)
    return ''
  }
}
```

### Chat API Implementation (`src/app/api/chat/route.ts`)

The Chat API route handles communication with the OpenAI API:

```typescript
// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Chat API route handler
export async function POST(req: Request) {
  try {
    const { content, analysisType, documents } = await req.json()
    
    // Load system prompt
    let systemPrompt = await loadPrompt('financial-analyst')
    
    // Add analysis type prompt if specified
    if (analysisType) {
      const analysisPrompt = await loadAnalysisTypePrompt(analysisType)
      systemPrompt += '\n\n' + analysisPrompt
    }
    
    // Prepare messages for OpenAI API
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ]
    
    // Handle document analysis
    if (documents?.[0]?.imageUrl) {
      // Image analysis
      messages.push({
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: 'Analyze this financial document using the DIFS framework. Extract and analyze any visible financial data, charts, or metrics.' 
          },
          { 
            type: 'image_url',
            image_url: {
              url: documents[0].imageUrl,
              detail: 'high'
            }
          }
        ]
      } as ChatCompletionMessageParam)
    } else if (documents?.[0]?.content) {
      // Text document analysis
      messages.push({
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Please analyze this financial document using the DIFS framework. Here is the extracted content: ${documents[0].content}` 
          }
        ]
      } as ChatCompletionMessageParam)
    } else {
      // Regular chat message
      messages.push({
        role: 'user',
        content: content
      })
    }
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
    
    // Format and return response
    const cleanContent = formatOutput(response.choices[0].message.content ?? '')
    return NextResponse.json({ content: cleanContent })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
```

### Main Page Component (`src/app/page.tsx`)

The main page component implements the chat interface:

```typescript
// Main page component
export default function Home() {
  // Get chat functionality from useChat hook
  const {
    messages,
    currentInput,
    setCurrentInput,
    sendMessage,
    handleUpload,
    isLoading,
    isProcessingFile,
    analysisType,
    setAnalysisType
  } = useChat()
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Message end reference for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }
  
  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim()) {
      sendMessage(currentInput)
    }
  }
  
  // Render component
  return (
    <div className="flex flex-col h-screen bg-[var(--background-dark)]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        {/* Logo and title */}
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold text-[var(--text-primary)]">ANALYST AI</div>
        </div>
        
        {/* Analysis type selector */}
        <div className="flex items-center gap-2">
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
            className="p-2 bg-[var(--input-bg)] rounded border border-[var(--border-color)] text-[var(--text-primary)]"
          >
            <option value="risk-analysis">Risk Analysis</option>
            <option value="z-score">Z-Score Analysis</option>
            <option value="company-health">Company Health</option>
          </select>
        </div>
      </header>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.type === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Message content */}
              <div
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[var(--blue-accent)] text-white'
                    : 'bg-[var(--message-bg)] text-[var(--text-primary)]'
                }`}
              >
                {message.content === 'DOCUMENT_PREVIEW' && message.documents?.[0] ? (
                  <DocumentPreview document={message.documents[0]} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input form */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Ask a question about financial analysis..."
              disabled={isLoading || isProcessingFile}
              className="flex-1 p-3 bg-[var(--input-bg)] rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
            />
            
            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isProcessingFile}
              className="p-3 bg-[var(--input-bg)] rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-color)]"
            >
              <Upload size={20} />
            </button>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.docx,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
              className="hidden"
            />
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!currentInput.trim() || isLoading || isProcessingFile}
              className="p-3 bg-[var(--blue-accent)] rounded-lg text-white hover:bg-[var(--blue-accent-hover)] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      
      {/* Processing indicator */}
      {(isLoading || isProcessingFile) && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <ProcessIndicator 
            isLoading={isLoading} 
            isProcessingFile={isProcessingFile} 
            fileName={(messages[messages.length - 1] as ExtendedMessage)?.documents?.[0]?.name}
          />
        </div>
      )}
    </div>
  )
}
```

## Future Enhancements

Planned enhancements for future versions:

1. **Advanced Document Analysis**
   - Table extraction from images
   - Chart recognition and data extraction
   - Multi-document comparative analysis

2. **Enhanced Visualization**
   - Interactive financial charts
   - Trend analysis visualizations
   - Scenario modeling

3. **Expanded Analysis Types**
   - Valuation analysis
   - Cash flow analysis
   - Ratio analysis
   - Industry benchmarking

4. **Collaboration Features**
   - Multi-user access
   - Shared analysis workspaces
   - Export and reporting capabilities

5. **Integration Capabilities**
   - Financial data API integration
   - CRM system integration
   - Accounting software integration 







This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
