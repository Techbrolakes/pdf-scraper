/**
 * Client-side PDF to Image Converter
 * Converts PDF pages to base64 images in the browser
 * Uses native Canvas API - no compatibility issues!
 */

export interface ClientPDFConversionResult {
  success: boolean;
  images?: string[]; // base64 encoded images
  text?: string;
  pageCount?: number;
  pdfType?: "text" | "image" | "hybrid";
  error?: string;
}

const MAX_PAGES = 10; // Limit pages for Vision API
const SCALE = 2; // 2x scale for better quality
const JPEG_QUALITY = 0.85; // JPEG quality

/**
 * Convert PDF to images in the browser
 */
export async function convertPDFToImagesClient(
  file: File
): Promise<ClientPDFConversionResult> {
  try {
    // Dynamically import pdfjs to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist");

    // Set worker to use local file to avoid CORS issues
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
    }

    console.log("[Client] Converting PDF to images...");

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const totalPages = pdf.numPages;
    const pagesToProcess = Math.min(totalPages, MAX_PAGES);
    const images: string[] = [];
    let allText = "";

    console.log(`[Client] Processing ${pagesToProcess} of ${totalPages} pages`);

    // Process each page
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);

        // Extract text content
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str)
          .join(" ")
          .trim();

        allText += pageText + " ";

        // Render page to canvas
        const viewport = page.getViewport({ scale: SCALE });

        // Create canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Failed to get canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any).promise;

        // Convert canvas to base64 JPEG
        const base64Image = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        // Remove data URL prefix
        const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
        images.push(base64Data);

        console.log(`[Client] Processed page ${pageNum}/${pagesToProcess}`);

        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
      } catch (pageError) {
        console.error(`[Client] Error processing page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }

    // Determine PDF type based on content
    const hasText = allText.trim().length > 100;
    const hasImages = images.length > 0;
    let pdfType: "text" | "image" | "hybrid" = "image";

    if (hasText && !hasImages) {
      pdfType = "text";
    } else if (hasText && hasImages) {
      pdfType = "hybrid";
    } else if (hasImages) {
      pdfType = "image";
    }

    // If we have good text content, prefer text extraction
    if (allText.trim().length > 500) {
      return {
        success: true,
        text: allText.trim(),
        pageCount: totalPages,
        pdfType: "text",
      };
    }

    // Otherwise use images
    if (images.length === 0) {
      return {
        success: false,
        error: "Failed to convert any PDF pages to images",
      };
    }

    console.log(
      `[Client] Successfully converted ${images.length} pages to images`
    );

    return {
      success: true,
      images,
      pageCount: totalPages,
      pdfType,
    };
  } catch (error) {
    console.error("[Client] PDF conversion error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to convert PDF",
    };
  }
}

/**
 * Compress image data to reduce upload size
 */
export async function compressImage(
  base64Image: string,
  maxWidth: number = 1600
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Create canvas for compression
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      resolve(compressed.replace(/^data:image\/jpeg;base64,/, ""));
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = `data:image/jpeg;base64,${base64Image}`;
  });
}
