import { analyzePDF, validatePDF } from './pdf-utils';
import { extractTextFromPDF, cleanExtractedText } from './text-extractor';
import { extractImagesFromPDF } from './image-extractor';
import { PDFExtractionResult, PDFType } from './types';

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

    // Handle based on PDF type
    switch (analysis.type) {
      case PDFType.TEXT:
        return await handleTextPDF(buffer);

      case PDFType.IMAGE:
        return await handleImagePDF(buffer);

      case PDFType.HYBRID:
        return await handleHybridPDF(buffer, analysis);

      default:
        return {
          success: false,
          pageCount: analysis.pageCount,
          hasText: false,
          hasImages: false,
          error: 'Unable to determine PDF type',
        };
    }
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

async function handleTextPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  const result = await extractTextFromPDF(buffer);
  
  if (result.success && result.text) {
    result.text = cleanExtractedText(result.text);
  }
  
  return result;
}

async function handleImagePDF(buffer: Buffer): Promise<PDFExtractionResult> {
  return await extractImagesFromPDF(buffer);
}

async function handleHybridPDF(
  buffer: Buffer,
  analysis: { pageCount: number }
): Promise<PDFExtractionResult> {
  // Extract both text and images
  const textResult = await extractTextFromPDF(buffer);
  const imageResult = await extractImagesFromPDF(buffer, 5); // Limit to 5 pages for cost

  return {
    success: true,
    text: textResult.text ? cleanExtractedText(textResult.text) : undefined,
    images: imageResult.images,
    pageCount: analysis.pageCount,
    hasText: textResult.hasText,
    hasImages: imageResult.hasImages,
  };
}
