import { pdfjsLib } from './config';
import { createCanvas } from 'canvas';
import sharp from 'sharp';
import { PDFExtractionResult } from './types';

export async function extractImagesFromPDF(
  buffer: Buffer,
  maxPages: number = 10 // Limit for cost control
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
    const pagesToProcess = Math.min(pageCount, maxPages);
    const images: string[] = [];

    for (let i = 1; i <= pagesToProcess; i++) {
      const page = await pdfDoc.getPage(i);
      
      // Render page to canvas
      const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for quality
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

      await page.render({
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport: viewport,
        canvas: canvas as unknown as HTMLCanvasElement,
      }).promise;

      // Convert canvas to buffer
      const imageBuffer = canvas.toBuffer('image/png');
      
      // Compress image with sharp
      const compressedBuffer = await sharp(imageBuffer)
        .resize(1600, null, { // Max width 1600px
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Convert to base64
      const base64Image = compressedBuffer.toString('base64');
      images.push(base64Image);
    }

    await pdfDoc.destroy();

    return {
      success: true,
      images,
      pageCount,
      hasText: false,
      hasImages: true,
    };
  } catch (error) {
    console.error('Image extraction error:', error);
    return {
      success: false,
      pageCount: 0,
      hasText: false,
      hasImages: false,
      error: error instanceof Error ? error.message : 'Image extraction failed',
    };
  }
}
