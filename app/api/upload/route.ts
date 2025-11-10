import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF, validatePDFBuffer } from "@/lib/pdf/pdf-extractor";
import {
  extractResumeFromText,
  extractResumeFromImages,
  validateResumeData,
} from "@/lib/openai-service";
import { checkRateLimit, RateLimitError } from "@/lib/rate-limit";
import {
  hasEnoughCredits,
  deductCredits,
  CREDIT_COST_PER_RESUME,
} from "@/lib/stripe-service";
import type { ResumeData } from "@/types/resume";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // Check credits before processing
    const hasCredits = await hasEnoughCredits(
      userId,
      CREDIT_COST_PER_RESUME
    );
    if (!hasCredits) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Insufficient credits. Please subscribe to a plan to continue processing resumes.",
          insufficientCredits: true,
        },
        { status: 402 } // Payment Required
      );
    }

    // Check rate limit
    try {
      await checkRateLimit(userId);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            retryAfter: error.retryAfter,
          },
          {
            status: 429,
            headers: {
              "Retry-After": error.retryAfter.toString(),
              "X-RateLimit-Limit": "10",
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
      throw error;
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    // Get pre-processed data from client-side
    const processedImages = formData.get("processedImages") as string | null;
    const extractedText = formData.get("extractedText") as string | null;
    const pdfType = formData.get("pdfType") as string | null;
    const pageCount = formData.get("pageCount") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only PDF files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: "File is empty." },
        { status: 400 }
      );
    }

    interface ExtractionResult {
      success: boolean;
      text?: string;
      images?: string[];
      pageCount: number;
      pdfType?: string;
      processingMethod: 'text' | 'image';
      metadata?: unknown;
      error?: string;
    }
    
    let extractionResult: ExtractionResult | null = null;
    
    // Check if we have pre-processed data from client-side
    if (processedImages || extractedText) {
      console.log(`[Upload] Using client-side processed data (type: ${pdfType})`);
      
      // Use client-side processed data
      if (processedImages) {
        const images = JSON.parse(processedImages) as string[];
        extractionResult = {
          success: true,
          images,
          pageCount: parseInt(pageCount || "1"),
          pdfType: pdfType || "image",
          processingMethod: "image" as const,
        };
        console.log(`[Upload] Received ${images.length} pre-processed images from client`);
      } else if (extractedText) {
        extractionResult = {
          success: true,
          text: extractedText,
          pageCount: parseInt(pageCount || "1"),
          pdfType: "text",
          processingMethod: "text" as const,
        };
        console.log(`[Upload] Received ${extractedText.length} chars of pre-extracted text from client`);
      }
    } else {
      // Fallback to server-side processing (for backwards compatibility)
      console.log("[Upload] No client-side data, falling back to server-side extraction");
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Validate PDF buffer
      const validation = validatePDFBuffer(buffer);
      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: validation.error || "Invalid PDF file",
          },
          { status: 400 }
        );
      }

      // Extract text from PDF using serverless-compatible processor
      const extractionStartTime = Date.now();
      const serverResult = await extractTextFromPDF(buffer);
      const extractionDuration = Date.now() - extractionStartTime;
      console.log(`[Upload] Server-side PDF extraction completed in ${extractionDuration}ms`);

      if (!serverResult.success) {
        console.error(`[Upload] PDF extraction failed: ${serverResult.error}`);
        return NextResponse.json(
          {
            success: false,
            error: serverResult.error || "Failed to extract text from PDF.",
          },
          { status: 500 }
        );
      }
      
      // Convert server result to ExtractionResult format
      extractionResult = {
        success: serverResult.success,
        text: serverResult.text,
        pageCount: serverResult.pageCount || 1,
        pdfType: "text",
        processingMethod: "text" as const,
        metadata: serverResult.metadata,
      }
    }

    // Ensure we have extraction result
    if (!extractionResult) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process PDF. No extraction result available.",
        },
        { status: 500 }
      );
    }

    // Parse resume with OpenAI (text or image-based)
    let resumeData: ResumeData;
    const processingMethod = extractionResult.processingMethod || "text";

    try {
      if (extractionResult.processingMethod === "image" && extractionResult.images) {
        // Image-based PDF - use Vision API
        console.log(`[Upload] Processing ${extractionResult.images.length} images with GPT-4 Vision`);
        
        // Convert base64 images to data URLs
        const imageUrls = extractionResult.images.map(
          (base64: string) => `data:image/jpeg;base64,${base64}`
        );
        
        resumeData = await extractResumeFromImages(imageUrls);
      } else if (extractionResult.text) {
        // Text-based PDF - use standard GPT-4
        console.log(`[Upload] Processing text (${extractionResult.text.length} chars) with GPT-4`);
        
        if (extractionResult.text.length < 10) {
          throw new Error(
            "No meaningful text content found in PDF. Please ensure your PDF is text-searchable."
          );
        }
        
        resumeData = await extractResumeFromText(extractionResult.text);
      } else {
        throw new Error(
          "PDF processing failed. No text or images were extracted."
        );
      }
    } catch (error) {
      console.error("Resume parsing error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to parse resume data. Please ensure the PDF contains valid resume information.",
        },
        { status: 500 }
      );
    }

    // Validate extracted data
    if (!validateResumeData(resumeData)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to extract valid resume data. Please check the PDF format.",
        },
        { status: 500 }
      );
    }

    // Prepare data for storage
    const processedData = {
      pdfType: extractionResult.pdfType || "text",
      pages: extractionResult.pageCount || 0,
      processingMethod,
      status: "processed",
      resumeData,
      metadata: extractionResult.metadata,
    };

    // Store metadata in database
    const resumeHistory = await prisma.resumeHistory.create({
      data: {
        userId,
        fileName: file.name,
        resumeData: JSON.parse(JSON.stringify(processedData)),
      },
    });

    // Deduct credits after successful processing
    const creditsDeducted = await deductCredits(
      userId,
      CREDIT_COST_PER_RESUME
    );
    if (!creditsDeducted) {
      console.warn(`[Upload] Failed to deduct credits for user ${userId}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resumeHistory.id,
        fileName: file.name,
        pdfType: processedData.pdfType,
        pages: extractionResult.pageCount || 0,
        processingMethod,
        status: "processed",
        resumeData,
        creditsUsed: CREDIT_COST_PER_RESUME,
      },
      message: processingMethod === "image" 
        ? "Resume extracted from image-based PDF using Vision API" 
        : "Resume extracted from text-based PDF",
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("payload")) {
        return NextResponse.json(
          {
            success: false,
            error: "File too large for processing. Please try a smaller file.",
          },
          { status: 413 }
        );
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            success: false,
            error: "OpenAI rate limit exceeded. Please try again in a moment.",
          },
          { status: 429 }
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Processing timed out. Please try again with a smaller file.",
          },
          { status: 504 }
        );
      }

      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            success: false,
            error: "Server configuration error. Please contact support.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Configure route to handle larger payloads
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max execution time
