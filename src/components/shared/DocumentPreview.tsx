'use client'

import { FileText, FileSpreadsheet, Image } from 'lucide-react'
import { SmoothProgress } from './SmoothProgress'

interface DocumentPreviewProps {
  fileName: string
  fileType: string
  isProcessing?: boolean
}

export function DocumentPreview({ fileName, fileType, isProcessing }: DocumentPreviewProps) {
  const getIcon = () => {
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
    if (fileType.includes('sheet') || fileType.includes('csv') || fileType.includes('excel')) {
      return <FileSpreadsheet className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
    }
    if (fileType.includes('image')) return <Image className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
    return <FileText className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
  }

  return (
    <div className="border border-[rgba(255,255,255,0.1)] rounded p-4 bg-transparent">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{getIcon()}</div>
        <div className="flex-1">
          <div className="text-[var(--text-secondary)] mb-2">{fileName}</div>
          {isProcessing && <SmoothProgress />}
        </div>
      </div>
    </div>
  )
} 