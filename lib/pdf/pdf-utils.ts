import { pdfjsLib } from './config';
import { PDFType, PDFAnalysis } from './types';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

export async function analyzePDF(buffer: Buffer): Promise<PDFAnalysis> {
  try {
    // Load PDF without worker for Node.js
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdfDoc = await loadingTask.promise;

    const pageCount = pdfDoc.numPages;
    let totalTextLength = 0;
    let imageCount = 0;
    let fullText = '';

    // Analyze each page
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdfDoc.getPage(i);

      // Extract text
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map((item) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      totalTextLength += pageText.trim().length;

      // Count images by checking operators
      const operators = await page.getOperatorList();
      const imageOps = operators.fnArray.filter(
        (op: number) => op === pdfjsLib.OPS.paintImageXObject
      );
      imageCount += imageOps.length;
    }

    await pdfDoc.destroy();

    // Determine PDF type
    const avgTextPerPage = totalTextLength / pageCount;
    const hasSignificantText = avgTextPerPage > 50; // At least 50 chars per page
    const hasImages = imageCount > 0;

    let type: PDFType;
    if (hasSignificantText && !hasImages) {
      type = PDFType.TEXT;
    } else if (!hasSignificantText && hasImages) {
      type = PDFType.IMAGE;
    } else if (hasSignificantText && hasImages) {
      type = PDFType.HYBRID;
    } else {
      type = PDFType.UNKNOWN;
    }

    return {
      type,
      textContent: fullText.trim(),
      imageCount,
      pageCount,
      hasScannedPages: !hasSignificantText && hasImages
    };
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    throw new Error('Failed to analyze PDF structure');
  }
}

export function validatePDF(buffer: Buffer): boolean {
  // Check PDF magic number
  const magicNumber = buffer.toString('utf-8', 0, 4);
  return magicNumber === '%PDF';
}

export function getFileSizeInMB(buffer: Buffer): number {
  return buffer.length / (1024 * 1024);
}
