'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-background px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Something Went Wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error while processing your request. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-500 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Error Details (Development Only)
            </summary>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Message:</p>
              <pre className="text-xs text-gray-800 mb-3 overflow-auto">
                {error.message}
              </pre>
              {error.stack && (
                <>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Stack:</p>
                  <pre className="text-xs text-gray-800 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            aria-label="Try again"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="w-full px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium inline-block"
            aria-label="Go to dashboard"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
