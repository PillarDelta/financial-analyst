import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

// Initialize PDF.js only on client side
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
}

export async function processDocument(file: File): Promise<{ content: string, imageUrl?: string }> {
  const fileType = file.type
  const buffer = await file.arrayBuffer()

  try {
    if (fileType === 'application/pdf') {
      return { content: await processPDF(buffer) }
    } else if (fileType === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      return { content: await processSpreadsheet(buffer, fileType) }
    } else if (fileType.startsWith('image/')) {
      return processImage(file)
    }
    throw new Error('Unsupported file type')
  } catch (error) {
    console.error('Document processing error:', error)
    throw error
  }
}

async function processPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF processing is only available in browser')
    }

    const pdf = await pdfjsLib.getDocument(buffer).promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return fullText
  } catch (error) {
    console.error('PDF processing error:', error)
    throw error
  }
}

async function processSpreadsheet(buffer: ArrayBuffer, fileType: string): Promise<string> {
  if (fileType === 'text/csv') {
    const text = new TextDecoder().decode(buffer)
    return text
  } else {
    const workbook = XLSX.read(buffer)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_csv(firstSheet)
  }
}

async function processImage(file: File): Promise<{ content: string, imageUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve({
          content: `Image analysis of: ${file.name}`,
          imageUrl: reader.result // This will be the base64 data URL
        })
      } else {
        reject(new Error('Failed to read image'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
} 