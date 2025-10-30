import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { extractTextFromPDF, validatePDFBuffer, cleanExtractedText } from '@/lib/pdf-utils'
import { extractResumeFromText, extractResumeFromImages, validateResumeData } from '@/lib/openai-service'
import { convertPDFPagesToImages } from '@/lib/pdf-to-image'
import { checkRateLimit, RateLimitError } from '@/lib/rate-limit'
import { hasEnoughCredits, deductCredits, CREDIT_COST_PER_RESUME } from '@/lib/stripe-service'
import type { ResumeData } from '@/types/resume'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check credits before processing
    const hasCredits = await hasEnoughCredits(session.user.id, CREDIT_COST_PER_RESUME)
    if (!hasCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient credits. Please subscribe to a plan to continue processing resumes.',
          insufficientCredits: true
        },
        { status: 402 } // Payment Required
      )
    }

    // Check rate limit
    try {
      await checkRateLimit(session.user.id)
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message,
            retryAfter: error.retryAfter
          },
          { 
            status: 429,
            headers: {
              'Retry-After': error.retryAfter.toString(),
              'X-RateLimit-Limit': '10',
              'X-RateLimit-Remaining': '0',
            }
          }
        )
      }
      throw error
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.` 
        },
        { status: 400 }
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'File is empty.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate PDF structure
    if (!validatePDFBuffer(buffer)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or corrupted PDF file.' },
        { status: 400 }
      )
    }

    // Extract text from PDF
    const extractionResult = await extractTextFromPDF(buffer)

    if (!extractionResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: extractionResult.error || 'Failed to process PDF.' 
        },
        { status: 500 }
      )
    }

    // Process with OpenAI based on PDF type
    let resumeData: ResumeData
    let processingMethod: string

    if (extractionResult.pdfType === 'text-based' || extractionResult.pdfType === 'hybrid') {
      // Text-based or hybrid PDF - use GPT-4 for text extraction
      const cleanedText = cleanExtractedText(extractionResult.text || '')
      
      if (!cleanedText || cleanedText.length < 50) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient text content in PDF. The file may be corrupted or image-based.' 
          },
          { status: 400 }
        )
      }

      resumeData = await extractResumeFromText(cleanedText)
      processingMethod = 'text'
    } else if (extractionResult.pdfType === 'image-based') {
      // Image-based PDF - use GPT-4 Vision
      const images = await convertPDFPagesToImages(buffer, 10) // Max 10 pages for cost control
      
      if (images.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to convert PDF to images for processing.' 
          },
          { status: 500 }
        )
      }

      resumeData = await extractResumeFromImages(images)
      processingMethod = 'vision'
    } else {
      // Unknown type - try text first, fallback to vision
      const cleanedText = cleanExtractedText(extractionResult.text || '')
      
      if (cleanedText && cleanedText.length >= 50) {
        resumeData = await extractResumeFromText(cleanedText)
        processingMethod = 'text'
      } else {
        const images = await convertPDFPagesToImages(buffer, 10)
        resumeData = await extractResumeFromImages(images)
        processingMethod = 'vision'
      }
    }

    // Validate extracted data
    if (!validateResumeData(resumeData)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to extract valid resume data. Please check the PDF format.' 
        },
        { status: 500 }
      )
    }

    // Prepare data for storage
    const processedData = {
      pdfType: extractionResult.pdfType,
      pages: extractionResult.metadata?.pages || 0,
      processingMethod,
      status: 'processed',
      resumeData,
    }

    // Store metadata in database
    const resumeHistory = await prisma.resumeHistory.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        resumeData: JSON.parse(JSON.stringify(processedData)),
      },
    })

    // Deduct credits after successful processing
    const creditsDeducted = await deductCredits(session.user.id, CREDIT_COST_PER_RESUME)
    if (!creditsDeducted) {
      console.warn(`Failed to deduct credits for user ${session.user.id}`)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resumeHistory.id,
        fileName: file.name,
        pdfType: extractionResult.pdfType,
        pages: extractionResult.metadata?.pages,
        processingMethod,
        status: 'processed',
        resumeData,
        creditsUsed: CREDIT_COST_PER_RESUME,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('payload')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'File too large for processing. Please try a smaller file.' 
          },
          { status: 413 }
        )
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'OpenAI rate limit exceeded. Please try again in a moment.' 
          },
          { status: 429 }
        )
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Processing timed out. Please try again with a smaller file.' 
          },
          { status: 504 }
        )
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Server configuration error. Please contact support.' 
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 }
    )
  }
}

// Configure route to handle larger payloads
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds max execution time
