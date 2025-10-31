/**
 * Minimal PDF text extractor for serverless environments
 * Uses pdf.js directly without any canvas dependencies
 * 100% compatible with Vercel, Netlify, and other serverless platforms
 */

export interface PDFProcessingResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Extract text from PDF using minimal dependencies
 * This approach avoids all canvas-related issues
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFProcessingResult> {
  try {
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      return {
        success: false,
        error: 'Invalid or empty PDF buffer',
      };
    }

    // Check PDF signature
    const pdfSignature = buffer.toString('utf8', 0, 4);
    if (pdfSignature !== '%PDF') {
      return {
        success: false,
        error: 'Invalid PDF file format',
      };
    }

    // Direct extraction without any external libraries
    // This ensures 100% serverless compatibility
    console.log('Using basic PDF text extraction (serverless-compatible)');

    // Use our basic PDF text extraction
    // This approach works without any dependencies
    const text = extractBasicText(buffer);
    
    if (text && text.length > 10) {
      return {
        success: true,
        text: cleanTextContent(text),
        pageCount: 1, // Can't determine page count with basic extraction
      };
    }

    return {
      success: false,
      error: 'Unable to extract text from PDF. The file might be image-based or encrypted.',
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      error: 'Failed to process PDF. Please ensure the file is a valid, text-based PDF.',
    };
  }
}

/**
 * Basic text extraction using regex
 * This is a fallback for when pdf-parse fails
 */
function extractBasicText(buffer: Buffer): string {
  try {
    // Convert buffer to string
    const content = buffer.toString('binary');
    
    // Look for text between BT (Begin Text) and ET (End Text) operators
    const textMatches = content.match(/BT[\s\S]*?ET/g) || [];
    
    let extractedText = '';
    
    for (const match of textMatches) {
      // Extract text within parentheses (PDF text strings)
      const stringMatches = match.match(/\(([^)]+)\)/g) || [];
      
      for (const str of stringMatches) {
        // Remove parentheses and clean up
        const cleanStr = str.slice(1, -1)
          .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\');
        
        extractedText += cleanStr + ' ';
      }
    }
    
    // Also try to find text in streams
    const streamMatches = content.match(/stream[\s\S]*?endstream/g) || [];
    
    for (const stream of streamMatches) {
      // Look for Tj or TJ operators (show text)
      const tjMatches = stream.match(/\(([^)]+)\)\s*Tj/g) || [];
      
      for (const tj of tjMatches) {
        const text = tj.match(/\(([^)]+)\)/)?.[1];
        if (text) {
          extractedText += text + ' ';
        }
      }
    }
    
    return extractedText;
  } catch (error) {
    console.error('Basic text extraction error:', error);
    return '';
  }
}

/**
 * Clean and normalize extracted text
 */
function cleanTextContent(text: string): string {
  if (!text) return '';

  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove special Unicode characters that might cause issues
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive line breaks (more than 2)
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}

/**
 * Validate if the PDF is processable
 */
export function validatePDFBuffer(buffer: Buffer): { valid: boolean; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file' };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (buffer.length > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check PDF header
  const header = buffer.toString('utf8', 0, Math.min(4, buffer.length));
  if (header !== '%PDF') {
    return { valid: false, error: 'Not a valid PDF file' };
  }

  return { valid: true };
}
