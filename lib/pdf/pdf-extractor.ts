/**
 * PDF text extractor for serverless environments
 * Uses pdf2json - pure JavaScript PDF parser
 * 100% compatible with Vercel, Netlify, and other serverless platforms
 */

import PDFParser from 'pdf2json';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface PDFProcessingResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Extract text from PDF using pdf2json library
 * Pure JavaScript implementation, serverless-compatible
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFProcessingResult> {
  let tempFilePath: string | null = null;

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

    console.log('Using pdf2json for PDF text extraction (serverless-compatible)');

    // Create temporary file for pdf2json
    const fileName = uuidv4();
    tempFilePath = `/tmp/${fileName}.pdf`;
    await fs.writeFile(tempFilePath, buffer);

    // Initialize PDF parser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParser = new (PDFParser as any)(null, 1);
    
    // Extract text using pdf2json with promise wrapper
    const extractedText = await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('PDF extraction timeout'));
      }, 30000); // 30 second timeout

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        clearTimeout(timeout);
        console.error('PDF parser error:', errData.parserError);
        reject(new Error(errData.parserError || 'PDF parsing failed'));
      });

      pdfParser.on('pdfParser_dataReady', () => {
        clearTimeout(timeout);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawText = (pdfParser as any).getRawTextContent();
          resolve(rawText);
        } catch (error) {
          reject(error);
        }
      });

      pdfParser.loadPDF(tempFilePath);
    });

    console.log(`Extracted ${extractedText.length} characters from PDF`);
    
    if (extractedText && extractedText.length > 10) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageCount = (pdfParser as any).data?.Pages?.length || 1;
      
      return {
        success: true,
        text: cleanTextContent(extractedText),
        pageCount,
        metadata: {
          pages: pageCount,
        },
      };
    }

    return {
      success: false,
      error: 'Unable to extract text from PDF. The file might be image-based or encrypted.',
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return {
          success: false,
          error: 'PDF processing timed out. The file may be too complex or corrupted.',
        };
      }
      
      if (error.message.includes('password') || error.message.includes('encrypted')) {
        return {
          success: false,
          error: 'PDF is password-protected or encrypted. Please provide an unencrypted version.',
        };
      }
    }
    
    return {
      success: false,
      error: 'Failed to process PDF. Please ensure the file is a valid, text-based PDF.',
    };
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (error) {
        console.error('Failed to delete temporary file:', error);
      }
    }
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
