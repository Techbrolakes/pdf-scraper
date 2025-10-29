// @ts-expect-error - pdf-parse has type issues with ESM imports
import pdf from 'pdf-parse'

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
 * Extract text from a PDF buffer
 * Handles text-based PDFs with direct text extraction
 * For image-based PDFs, returns metadata for further processing
 */
export async function extractTextFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    // Parse the PDF
    const data = await pdf(buffer)

    // Check if PDF has extractable text
    const hasText = data.text && data.text.trim().length > 0
    const pageCount = data.numpages

    // Determine PDF type based on text content
    let pdfType: PDFExtractionResult['pdfType'] = 'unknown'
    
    if (hasText) {
      // Calculate text density (characters per page)
      const textDensity = data.text.length / pageCount
      
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

    return {
      success: true,
      text: data.text,
      metadata: {
        pages: pageCount,
        info: data.info as Record<string, unknown>,
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

    const data = await pdf(buffer)
    
    return {
      valid: true,
      pages: data.numpages,
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
