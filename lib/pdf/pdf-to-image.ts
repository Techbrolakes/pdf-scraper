/**
 * PDF to Image Converter
 * Converts PDF pages to base64-encoded images for GPT-4 Vision
 * Uses pdfjs-dist and canvas for serverless compatibility
 */

// Use dynamic import to avoid worker issues
import { createCanvas } from 'canvas';
import sharp from 'sharp';

export interface PDFImageResult {
  success: boolean;
  images?: string[]; // base64 encoded images
  pageCount?: number;
  error?: string;
}

const MAX_PAGES = 10; // Limit to 10 pages for Vision API
const SCALE = 2; // 2x scale for better quality
const MAX_IMAGE_WIDTH = 1600; // Max width for compression
const JPEG_QUALITY = 85; // JPEG quality

/**
 * Convert PDF pages to base64-encoded images
 */
export async function convertPDFToImages(
  buffer: Buffer
): Promise<PDFImageResult> {
  try {
    console.log("Converting PDF to images for Vision API...");

    // Dynamically import pdfjs-dist to avoid worker setup issues
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Set worker source to the worker file
    // In Node.js, we need to provide the path to the worker file
    const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: false,
      isEvalSupported: false,
    });

    const pdfDocument = await loadingTask.promise;
    const totalPages = pdfDocument.numPages;
    const pagesToProcess = Math.min(totalPages, MAX_PAGES);

    console.log(`Processing ${pagesToProcess} of ${totalPages} pages`);

    const images: string[] = [];

    // Process each page
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: SCALE });

        // Create canvas
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext("2d");

        // Patch context to handle inline images
        // pdfjs-dist expects createImageBitmap which node-canvas doesn't have
        const originalContext = context;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patchedContext: any = Object.create(originalContext);
        
        // Copy all properties from original context
        Object.setPrototypeOf(patchedContext, originalContext);
        
        // Add createImageBitmap support for inline images
        patchedContext.createImageBitmap = async (imageData: ImageData) => {
          // Create a temporary canvas for the image data
          const tempCanvas = createCanvas(imageData.width, imageData.height);
          const tempContext = tempCanvas.getContext('2d');
          tempContext.putImageData(imageData, 0, 0);
          return tempCanvas;
        };

        // Render PDF page to canvas
        // Type assertion needed for node-canvas compatibility with pdfjs-dist
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const renderTask = page.render({
          canvasContext: patchedContext,
          viewport: viewport,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        await renderTask.promise;

        // Convert canvas to buffer
        const imageBuffer = canvas.toBuffer("image/png");

        // Compress with sharp
        const compressedBuffer = await sharp(imageBuffer)
          .resize(MAX_IMAGE_WIDTH, null, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: JPEG_QUALITY })
          .toBuffer();

        // Convert to base64
        const base64Image = compressedBuffer.toString("base64");
        images.push(base64Image);

        console.log(
          `Processed page ${pageNum}/${pagesToProcess} (${(compressedBuffer.length / 1024).toFixed(1)}KB)`
        );
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }

    if (images.length === 0) {
      return {
        success: false,
        error: "Failed to convert any PDF pages to images",
      };
    }

    console.log(`Successfully converted ${images.length} pages to images`);

    return {
      success: true,
      images,
      pageCount: totalPages,
    };
  } catch (error) {
    console.error("PDF to image conversion error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("password") ||
        error.message.includes("encrypted")
      ) {
        return {
          success: false,
          error: "PDF is password-protected or encrypted",
        };
      }

      if (error.message.includes("Invalid PDF")) {
        return {
          success: false,
          error: "Invalid PDF file format",
        };
      }
    }

    return {
      success: false,
      error: "Failed to convert PDF to images",
    };
  }
}
