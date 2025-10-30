import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import type { PDFDocumentProxy, TextItem } from 'pdfjs-dist/types/src/display/api'

// Disable worker for server-side usage (Node.js doesn't support web workers)
if (typeof window === 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = ''
}

export interface PDFExtractionResult {
  success: boolean
  text?: string
  metadata?: {
    pages: number
    info?: Record<string, unknown>
  }
  pdfType: 'text-based' | 'image-based' | 'hybrid' | 'unknown'
  error?: string
}

/**
 * Extract text from a PDF buffer using pdfjs-dist
 * Handles text-based PDFs with direct text extraction
 * For image-based PDFs, returns metadata for further processing
 */
export async function extractTextFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    // Convert Buffer to Uint8Array for pdfjs-dist
    const uint8Array = new Uint8Array(buffer)

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
    })
    
    const pdfDocument: PDFDocumentProxy = await loadingTask.promise
    const pageCount = pdfDocument.numPages

    // Extract metadata
    const metadata = await pdfDocument.getMetadata()
    
    // Extract text from all pages
    const textPromises: Promise<string>[] = []
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      textPromises.push(extractPageText(pdfDocument, pageNum))
    }
    
    const pageTexts = await Promise.all(textPromises)
    const fullText = pageTexts.join('\n\n')

    // Check if PDF has extractable text
    const hasText = fullText && fullText.trim().length > 0

    // Determine PDF type based on text content
    let pdfType: PDFExtractionResult['pdfType'] = 'unknown'
    
    if (hasText) {
      // Calculate text density (characters per page)
      const textDensity = fullText.length / pageCount
      
      if (textDensity > 100) {
        // Likely text-based PDF
        pdfType = 'text-based'
      } else if (textDensity > 10) {
        // Some text but low density - might be hybrid
        pdfType = 'hybrid'
      } else {
        // Very little text - likely image-based
        pdfType = 'image-based'
      }
    } else {
      // No text extracted - image-based PDF
      pdfType = 'image-based'
    }

    // Clean up
    await pdfDocument.destroy()

    return {
      success: true,
      text: fullText,
      metadata: {
        pages: pageCount,
        info: metadata.info as Record<string, unknown>,
      },
      pdfType,
    }
  } catch (error) {
    console.error('PDF extraction error:', error)
    
    return {
      success: false,
      pdfType: 'unknown',
      error: error instanceof Error ? error.message : 'Failed to extract text from PDF',
    }
  }
}

/**
 * Extract text from a single PDF page
 * @param pdfDocument - The loaded PDF document
 * @param pageNum - Page number (1-indexed)
 * @returns Extracted text from the page
 */
async function extractPageText(
  pdfDocument: PDFDocumentProxy,
  pageNum: number
): Promise<string> {
  try {
    const page = await pdfDocument.getPage(pageNum)
    const textContent = await page.getTextContent()
    
    // Extract text items and join them
    const textItems = textContent.items
      .filter((item): item is TextItem => 'str' in item)
      .map((item) => item.str)
    
    return textItems.join(' ')
  } catch (error) {
    console.error(`Error extracting text from page ${pageNum}:`, error)
    return ''
  }
}

/**
 * Validate PDF buffer
 * Checks if the buffer is a valid PDF file
 */
export function validatePDFBuffer(buffer: Buffer): boolean {
  // PDF files start with %PDF-
  const pdfSignature = Buffer.from('%PDF-')
  
  if (buffer.length < 5) {
    return false
  }

  return buffer.subarray(0, 5).equals(pdfSignature)
}

/**
 * Get PDF file info without full text extraction
 * Useful for quick validation
 */
export async function getPDFInfo(buffer: Buffer): Promise<{
  valid: boolean
  pages?: number
  error?: string
}> {
  try {
    if (!validatePDFBuffer(buffer)) {
      return {
        valid: false,
        error: 'Invalid PDF file format',
      }
    }

    const uint8Array = new Uint8Array(buffer)
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdfDocument = await loadingTask.promise
    const pageCount = pdfDocument.numPages
    
    await pdfDocument.destroy()
    
    return {
      valid: true,
      pages: pageCount,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to read PDF',
    }
  }
}

/**
 * Clean extracted text
 * Removes excessive whitespace and normalizes line breaks
 */
export function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/[ \t]{2,}/g, ' ') // Remove excessive spaces
    .trim()
}
