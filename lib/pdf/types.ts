export interface PDFExtractionResult {
  success: boolean;
  text?: string;
  images?: string[]; // Base64 encoded images
  pageCount: number;
  hasText: boolean;
  hasImages: boolean;
  error?: string;
}

export interface PDFMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  pageCount: number;
}

export enum PDFType {
  TEXT = 'text',
  IMAGE = 'image',
  HYBRID = 'hybrid',
  UNKNOWN = 'unknown'
}

export interface PDFAnalysis {
  type: PDFType;
  textContent: string;
  imageCount: number;
  pageCount: number;
  hasScannedPages: boolean;
}
