'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { toast } from '@/lib/toast'

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

    // Simulate smooth progress animation
    const progressInterval = setInterval(() => {
      setUploadState(prev => {
        if (prev.progress < 90) {
          return { ...prev, progress: prev.progress + 2 }
        }
        return prev
      })
    }, 100)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      setUploadState(prev => ({ ...prev, message: 'Extracting data...' }))

      if (!response.ok) {
        clearInterval(progressInterval)
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      
      if (!result.success) {
        clearInterval(progressInterval)
        throw new Error(result.error || 'Processing failed')
      }

      clearInterval(progressInterval)
      setUploadState(prev => ({ ...prev, progress: 100 }))
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
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
            message: 'Analyzing resume...' 
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
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-white/20 bg-white/5 hover:border-blue-500/50 hover:bg-white/10'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={!isLoading ? handleButtonClick : undefined}
        role="button"
        tabIndex={isLoading ? -1 : 0}
        onKeyDown={(e) => {
          if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleButtonClick()
          }
        }}
        aria-label="Upload PDF file"
        aria-busy={isLoading}
        aria-disabled={isLoading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          disabled={isLoading}
          className="hidden"
          aria-label="PDF file input"
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg
                    className="animate-spin h-10 w-10 text-blue-400"
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
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{uploadState.message}</p>
              <div className="mt-4 w-full max-w-md mx-auto bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-blue-300">{uploadState.progress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-blue-500/30 scale-110' : 'bg-blue-500/10'
              }`}>
                <svg
                  className={`h-10 w-10 transition-colors ${
                    isDragging ? 'text-blue-300' : 'text-blue-400'
                  }`}
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
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {isDragging ? '📄 Drop your PDF here' : '📤 Upload PDF Resume'}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Drag and drop your resume or click to browse
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-300 font-medium">
                  PDF files only • Max 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadState.progress > 0 && !isLoading && (
        <div className="mt-6 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-green-300 font-semibold">
              Upload complete! Your resume has been processed.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
