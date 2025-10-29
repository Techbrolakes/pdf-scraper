import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { extractTextFromPDF, validatePDFBuffer, cleanExtractedText } from '@/lib/pdf-utils'

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

    // Handle different PDF types
    let processedData: Record<string, unknown> = {
      pdfType: extractionResult.pdfType,
      pages: extractionResult.metadata?.pages || 0,
    }

    if (extractionResult.pdfType === 'text-based' || extractionResult.pdfType === 'hybrid') {
      // Text-based or hybrid PDF - we have extracted text
      const cleanedText = cleanExtractedText(extractionResult.text || '')
      
      processedData = {
        ...processedData,
        extractedText: cleanedText,
        textLength: cleanedText.length,
        status: 'text_extracted',
      }
    } else if (extractionResult.pdfType === 'image-based') {
      // Image-based PDF - needs OCR processing (Phase 3)
      processedData = {
        ...processedData,
        status: 'needs_ocr',
        message: 'This PDF contains images and requires OCR processing.',
      }
    } else {
      // Unknown type
      processedData = {
        ...processedData,
        status: 'unknown',
        message: 'Unable to determine PDF type.',
      }
    }

    // Store metadata in database
    const resumeHistory = await prisma.resumeHistory.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        resumeData: processedData,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: resumeHistory.id,
        fileName: file.name,
        pdfType: extractionResult.pdfType,
        pages: extractionResult.metadata?.pages,
        status: processedData.status,
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
export const config = {
  api: {
    bodyParser: false,
  },
}
