'use client'

import { useState } from 'react'
import { processDocument } from '@/utils/documentProcessor'

export type AnalysisType = 'risk-analysis' | 'z-score' | 'company-health'
export type Message = {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  documents?: string[]
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [analysisType, setAnalysisType] = useState<AnalysisType>('risk-analysis')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [documents, setDocuments] = useState<string[]>([])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date(),
      documents: documents.length ? [...documents] : undefined
    }
    setMessages(prev => [...prev, userMessage])
    setCurrentInput('')
    setIsLoading(true)
    setDocuments([]) // Clear documents after sending

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          analysisType,
          documents: userMessage.documents
        })
      })

      if (!response.ok) throw new Error('Failed to get response')
      
      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request.',
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeDocument = async (content: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Please analyze this document and provide key insights: ${content}`,
          analysisType,
          documents: [content]
        })
      })

      if (!response.ok) throw new Error('Failed to get analysis')
      
      const data = await response.json()
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        content: data.content,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, analysisMessage])
    } catch (error) {
      console.error('Failed to analyze document:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error analyzing the document.',
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleUpload = async (file: File) => {
    try {
      setIsProcessingFile(true)

      // File preview (user input) appears on the right
      const uploadMessage: Message = {
        id: Date.now().toString(),
        content: 'DOCUMENT_PREVIEW',
        type: 'user',  // This ensures document preview appears on the right
        timestamp: new Date(),
        documents: [{
          name: file.name,
          type: file.type,
          content: ''
        }]
      }
      setMessages(prev => [...prev, uploadMessage])

      // Process document
      const processedContent = await processDocument(file)
      setDocuments(prev => [...prev, processedContent])

      // Update the preview with processed content
      setMessages(prev => prev.map(msg => 
        msg.id === uploadMessage.id 
          ? {
              ...msg,
              documents: [{
                ...msg.documents![0],
                content: processedContent
              }]
            }
          : msg
      ))

      // Send for analysis
      await analyzeDocument(processedContent)

    } catch (error) {
      console.error('Failed to upload file:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Failed to process document: ${file.name}. Please try again.`,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessingFile(false)
    }
  }

  // Test message flow
  const testMessages = async () => {
    // User input (should be RIGHT)
    const userMessage: Message = {
      id: '1',
      content: 'Test message from user',
      type: 'user',
      timestamp: new Date()
    }
    setMessages([userMessage])

    // Assistant response (should be LEFT)
    const assistantMessage: Message = {
      id: '2',
      content: 'Test response from assistant',
      type: 'assistant',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])

    // Document upload (should be RIGHT)
    const documentPreview: Message = {
      id: '3',
      content: 'DOCUMENT_PREVIEW',
      type: 'user',
      timestamp: new Date(),
      documents: [{
        name: 'test.pdf',
        type: 'application/pdf',
        content: ''
      }]
    }
    setMessages(prev => [...prev, documentPreview])

    // Processing message (should be LEFT)
    const processingMessage: Message = {
      id: '4',
      content: 'Processing document: test.pdf...',
      type: 'assistant',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, processingMessage])

    // Analysis result (should be LEFT)
    const analysisMessage: Message = {
      id: '5',
      content: 'Analysis result from the document',
      type: 'assistant',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, analysisMessage])
  }

  return {
    messages,
    currentInput,
    setCurrentInput,
    analysisType,
    setAnalysisType,
    isLoading,
    isProcessingFile,
    sendMessage,
    handleUpload,
    hasDocuments: documents.length > 0
  }
} 