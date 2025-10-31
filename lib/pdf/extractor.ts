import { analyzePDF, validatePDF } from './pdf-utils';
import { extractTextFromPDF, cleanExtractedText } from './text-extractor';
import { PDFExtractionResult, PDFType } from './types';

/**
 * Extract content from PDF - Serverless compatible (text-only)
 * Note: Image extraction disabled for Vercel deployment (requires native canvas module)
 */
export async function extractFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  // Validate PDF
  if (!validatePDF(buffer)) {
    return {
      success: false,
      pageCount: 0,
      hasText: false,
      hasImages: false,
      error: 'Invalid PDF file',
    };
  }

  try {
    // Analyze PDF to determine type
    const analysis = await analyzePDF(buffer);

    console.log(`PDF Analysis: Type=${analysis.type}, Pages=${analysis.pageCount}, Images=${analysis.imageCount}`);

    // For serverless compatibility, only support text extraction
    // Image-based PDFs will return an error with helpful message
    if (analysis.type === PDFType.IMAGE) {
      return {
        success: false,
        pageCount: analysis.pageCount,
        hasText: false,
        hasImages: true,
        error: 'Image-based PDFs are not supported. Please upload a text-based PDF or convert your resume to a text-searchable format.',
      };
    }

    // Extract text from PDF
    const result = await extractTextFromPDF(buffer);
    
    if (result.success && result.text) {
      result.text = cleanExtractedText(result.text);
    }
    
    return result;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      pageCount: 0,
      hasText: false,
      hasImages: false,
      error: error instanceof Error ? error.message : 'Extraction failed',
    };
  }
}
