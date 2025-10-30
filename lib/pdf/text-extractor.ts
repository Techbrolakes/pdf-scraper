import { pdfjsLib } from './config';
import { PDFExtractionResult } from './types';
import type { PDFDocumentProxy, TextItem } from 'pdfjs-dist/types/src/display/api';

export async function extractTextFromPDF(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdfDoc = await loadingTask.promise;

    const pageCount = pdfDoc.numPages;
    const textPromises: Promise<string>[] = [];

    // Extract text from all pages
    for (let i = 1; i <= pageCount; i++) {
      textPromises.push(extractPageText(pdfDoc, i));
    }

    const pageTexts = await Promise.all(textPromises);
    const fullText = pageTexts.join('\n\n');

    await pdfDoc.destroy();

    return {
      success: true,
      text: fullText,
      pageCount,
      hasText: fullText.trim().length > 0,
      hasImages: false,
    };
  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      success: false,
      pageCount: 0,
      hasText: false,
      hasImages: false,
      error: error instanceof Error ? error.message : 'Text extraction failed',
    };
  }
}

async function extractPageText(pdfDoc: PDFDocumentProxy, pageNum: number): Promise<string> {
  try {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    const textItems = textContent.items
      .filter((item): item is TextItem => 'str' in item)
      .map((item) => item.str);
    
    return textItems.join(' ');
  } catch (error) {
    console.error(`Error extracting text from page ${pageNum}:`, error);
    return '';
  }
}

export function cleanExtractedText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();
}
