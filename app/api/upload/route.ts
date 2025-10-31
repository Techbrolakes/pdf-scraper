import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { extractFromPDF } from '@/lib/pdf/extractor'
import { extractResumeFromText, validateResumeData } from '@/lib/openai-service'
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

    // Extract content from PDF (automatically detects type)
    console.log('Extracting PDF content...')
    const extractionResult = await extractFromPDF(buffer)

    if (!extractionResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: extractionResult.error || 'Failed to extract content from PDF.' 
        },
        { status: 500 }
      )
    }

    // Parse resume with OpenAI (text-based only for serverless compatibility)
    console.log('Parsing resume with OpenAI...')
    let resumeData: ResumeData
    let processingMethod: string

    try {
      // Only text extraction is supported on Vercel
      if (extractionResult.hasText && extractionResult.text) {
        console.log('Using text-based extraction with GPT-4o')
        resumeData = await extractResumeFromText(extractionResult.text)
        processingMethod = 'text'
      }
      else {
        throw new Error('No text content found in PDF. Please ensure your PDF is text-searchable.')
      }
    } catch (error) {
      console.error('Resume parsing error:', error)
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse resume data. Please ensure the PDF contains valid resume information.'
        },
        { status: 500 }
      )
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
      pdfType: extractionResult.hasText ? (extractionResult.hasImages ? 'hybrid' : 'text') : 'image',
      pages: extractionResult.pageCount || 0,
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
        pdfType: processedData.pdfType,
        pages: extractionResult.pageCount,
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
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max execution time
