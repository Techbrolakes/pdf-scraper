/**
 * PDF Type Detector
 * Determines if a PDF is text-based, image-based, or hybrid
 */

import { PDFDocument } from 'pdf-lib';

export type PDFType = 'text' | 'image' | 'hybrid';

export interface PDFAnalysis {
  type: PDFType;
  pageCount: number;
  hasText: boolean;
  hasImages: boolean;
  textDensity: number; // characters per page
  confidence: number; // 0-1
}

/**
 * Analyze PDF to determine its type
 */
export async function analyzePDFType(buffer: Buffer): Promise<PDFAnalysis> {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();
    const pageCount = pages.length;

    // Try to extract text content from the PDF
    const pdfBytes = await pdfDoc.save();
    const pdfString = Buffer.from(pdfBytes).toString('latin1');
    
    // Count text content indicators
    const textMatches = pdfString.match(/\(([^)]+)\)/g) || [];
    const totalTextLength = textMatches.reduce((sum, match) => sum + match.length, 0);
    const textDensity = totalTextLength / pageCount;

    // Check for image indicators
    const hasImages = /\/Image|\/XObject|\/DCTDecode|\/FlateDecode/.test(pdfString);
    const hasText = textDensity > 50; // More than 50 chars per page indicates text content

    // Determine PDF type
    let type: PDFType;
    let confidence = 0;

    if (hasText && !hasImages) {
      type = 'text';
      confidence = 0.9;
    } else if (!hasText && hasImages) {
      type = 'image';
      confidence = 0.9;
    } else if (hasText && hasImages) {
      // Hybrid - determine primary type based on text density
      if (textDensity > 200) {
        type = 'text';
        confidence = 0.7;
      } else {
        type = 'hybrid';
        confidence = 0.8;
      }
    } else {
      // Fallback - assume image-based if no clear text
      type = 'image';
      confidence = 0.5;
    }

    return {
      type,
      pageCount,
      hasText,
      hasImages,
      textDensity,
      confidence,
    };
  } catch (error) {
    console.error('PDF analysis error:', error);
    // Default to image-based on error
    return {
      type: 'image',
      pageCount: 1,
      hasText: false,
      hasImages: true,
      textDensity: 0,
      confidence: 0.3,
    };
  }
}
