/**
 * PDF text extractor with multi-strategy approach
 * Strategy 1: pdf2json for text-based PDFs (serverless-compatible)
 * Strategy 2: pdfjs-dist + canvas for image-based PDFs (converts to images for Vision API)
 * Automatically detects PDF type and uses appropriate strategy
 */

import PDFParser from 'pdf2json';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { analyzePDFType, type PDFType } from './pdf-type-detector';
import { convertPDFToImages } from './pdf-to-image';

export interface PDFProcessingResult {
  success: boolean;
  text?: string;
  images?: string[]; // base64 encoded images for Vision API
  pageCount?: number;
  pdfType?: PDFType;
  processingMethod?: 'text' | 'image';
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Extract text from PDF using pdf2json library
 * Pure JavaScript implementation, serverless-compatible
 * This is the fast path for text-based PDFs
 */
async function extractTextWithPdf2json(buffer: Buffer): Promise<PDFProcessingResult> {
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

    console.log('[pdf2json] Extracting text from PDF...');

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

    // Return with minimal text - caller will decide if fallback is needed
    return {
      success: false,
      error: 'Insufficient text content extracted',
      metadata: {
        textLength: extractedText?.length || 0,
      },
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
    
    // Return error - caller will decide if fallback is needed
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF extraction failed',
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
 * Main PDF extraction function with automatic strategy selection
 * Analyzes PDF type and uses appropriate extraction method
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFProcessingResult> {
  try {
    // Validate buffer
    const validation = validatePDFBuffer(buffer);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'Invalid PDF',
      };
    }

    console.log('[PDF Extractor] Analyzing PDF type...');
    
    // Analyze PDF to determine type
    const analysis = await analyzePDFType(buffer);
    console.log(`[PDF Extractor] PDF Type: ${analysis.type}, Pages: ${analysis.pageCount}, Text Density: ${analysis.textDensity.toFixed(1)}, Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);

    // Strategy 1: Try text extraction first for text-based and hybrid PDFs
    if (analysis.type === 'text' || analysis.type === 'hybrid') {
      console.log('[PDF Extractor] Attempting text extraction...');
      const textResult = await extractTextWithPdf2json(buffer);
      
      // If text extraction succeeded with meaningful content, return it
      if (textResult.success && textResult.text && textResult.text.length > 100) {
        console.log(`[PDF Extractor] ✓ Text extraction successful (${textResult.text.length} chars)`);
        return {
          ...textResult,
          pdfType: analysis.type,
          processingMethod: 'text',
        };
      }
      
      console.log('[PDF Extractor] Text extraction insufficient, falling back to image processing...');
    }

    // Strategy 2: Convert to images for Vision API
    console.log('[PDF Extractor] Converting PDF to images for Vision API...');
    const imageResult = await convertPDFToImages(buffer);
    
    if (!imageResult.success || !imageResult.images || imageResult.images.length === 0) {
      return {
        success: false,
        error: imageResult.error || 'Failed to process PDF. Unable to extract text or convert to images.',
        pdfType: analysis.type,
      };
    }

    console.log(`[PDF Extractor] ✓ Converted ${imageResult.images.length} pages to images`);
    
    return {
      success: true,
      images: imageResult.images,
      pageCount: imageResult.pageCount,
      pdfType: analysis.type,
      processingMethod: 'image',
      metadata: {
        analysis,
        imageCount: imageResult.images.length,
      },
    };
  } catch (error) {
    console.error('[PDF Extractor] Fatal error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing the PDF',
    };
  }
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
