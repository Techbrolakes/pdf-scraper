import { PDFExtractionResult } from './types';

/**
 * Placeholder for image extraction functionality.
 * Image-based PDF processing is not supported in Vercel's serverless environment
 * due to native dependencies (canvas, sharp) that are incompatible.
 * 
 * For production use with image PDFs, consider:
 * 1. Using a dedicated PDF processing service (e.g., AWS Lambda with container support)
 * 2. Pre-processing PDFs client-side
 * 3. Using OCR services like Google Cloud Vision API or AWS Textract
 */
export async function extractImagesFromPDF(
  // eslint-disable-next-line no-unused-vars
  _buffer: Buffer,
  // eslint-disable-next-line no-unused-vars
  _maxPages?: number // Limit for cost control - kept for API compatibility
): Promise<PDFExtractionResult> {
  // This function is intentionally not implemented for Vercel deployment
  // Image extraction requires canvas and sharp which have native dependencies
  // that don't work in Vercel's serverless environment
  
  return {
    success: false,
    pageCount: 0,
    hasText: false,
    hasImages: false,
    error: 'Image extraction is not supported in the current deployment environment. Please use text-based PDFs or contact support for alternatives.',
  };
}
