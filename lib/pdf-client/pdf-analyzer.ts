/**
 * Client-side PDF analyzer
 * Analyzes PDF type and content in the browser
 */

export type PDFType = 'text' | 'image' | 'hybrid';

export interface PDFAnalysisResult {
  type: PDFType;
  pageCount: number;
  hasText: boolean;
  hasImages: boolean;
  textContent: string;
  confidence: number;
}

/**
 * Analyze PDF content in the browser
 */
export async function analyzePDF(file: File): Promise<PDFAnalysisResult> {
  // Dynamically import pdfjs to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker to use local file to avoid CORS issues
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let totalText = '';
  let hasImages = false;
  const pageCount = pdf.numPages;
  
  // Analyze each page
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    
    // Extract text content
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.str)
      .join(' ')
      .trim();
    
    totalText += pageText + ' ';
    
    // Check for images
    const operators = await page.getOperatorList();
    const hasPageImages = operators.fnArray.some((fn: number) => 
      fn === 82 || fn === 83 || fn === 84 || fn === 85 // Image operators
    );
    
    if (hasPageImages) {
      hasImages = true;
    }
  }
  
  totalText = totalText.trim();
  const textDensity = totalText.length / pageCount;
  const hasText = textDensity > 50;
  
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
    // Hybrid - determine based on text density
    if (textDensity > 200) {
      type = 'text';
      confidence = 0.7;
    } else {
      type = 'hybrid';
      confidence = 0.8;
    }
  } else {
    // Default to image if unclear
    type = 'image';
    confidence = 0.5;
  }
  
  return {
    type,
    pageCount,
    hasText,
    hasImages,
    textContent: totalText,
    confidence,
  };
}
