'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const LARGE_FILE_THRESHOLD = 4 * 1024 * 1024 // 4MB

interface UploadState {
  isUploading: boolean
  isProcessing: boolean
  progress: number
  message: string
}

export function PDFUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isProcessing: false,
    progress: 0,
    message: '',
  })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== 'application/pdf') {
      return 'Invalid file type. Please upload a PDF file.'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`
    }

    if (file.size === 0) {
      return 'File is empty. Please upload a valid PDF.'
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    const isLargeFile = file.size > LARGE_FILE_THRESHOLD

    try {
      setUploadState({
        isUploading: true,
        isProcessing: false,
        progress: 0,
        message: 'Uploading...',
      })

      if (isLargeFile) {
        // Use API route for large files
        await uploadLargeFile(file)
      } else {
        // Use Server Action for small files
        await uploadSmallFile(file)
      }

      setUploadState({
        isUploading: false,
        isProcessing: false,
        progress: 100,
        message: 'Upload complete!',
      })

      toast.success('PDF uploaded and processed successfully!')
      
      // Reset state after success
      setTimeout(() => {
        setUploadState({
          isUploading: false,
          isProcessing: false,
          progress: 0,
          message: '',
        })
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      }, 1500)
    } catch (error) {
      setUploadState({
        isUploading: false,
        isProcessing: false,
        progress: 0,
        message: '',
      })
      
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  const uploadSmallFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    setUploadState(prev => ({ ...prev, progress: 30 }))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    setUploadState(prev => ({ ...prev, progress: 60, message: 'Processing...' }))

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Processing failed')
    }

    setUploadState(prev => ({ ...prev, progress: 100 }))
  }

  const uploadLargeFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    setUploadState(prev => ({ ...prev, progress: 20 }))

    const xhr = new XMLHttpRequest()

    return new Promise<void>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 60)
          setUploadState(prev => ({ ...prev, progress: percentComplete }))
        }
      })

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          setUploadState(prev => ({ 
            ...prev, 
            progress: 70, 
            isProcessing: true,
            message: 'Processing...' 
          }))

          try {
            const result = JSON.parse(xhr.responseText)
            if (result.success) {
              setUploadState(prev => ({ ...prev, progress: 100 }))
              resolve()
            } else {
              reject(new Error(result.error || 'Processing failed'))
            }
          } catch {
            reject(new Error('Failed to parse response'))
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText)
            reject(new Error(error.error || 'Upload failed'))
          } catch {
            reject(new Error('Upload failed'))
          }
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'))
      })

      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      uploadFile(file)
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const isLoading = uploadState.isUploading || uploadState.isProcessing

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={!isLoading ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          disabled={isLoading}
          className="hidden"
        />

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">{uploadState.message}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">{uploadState.progress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragging ? 'Drop your PDF here' : 'Upload PDF Resume'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PDF files only, max 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadState.progress > 0 && !isLoading && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ Upload complete! Your resume has been processed.
          </p>
        </div>
      )}
    </div>
  )
}
