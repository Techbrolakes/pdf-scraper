'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12">
      <div className="max-w-md w-full">
        {/* 404 Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-[#1447E6] to-[#0A2E8C] mb-6 shadow-lg shadow-[#1447E6]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
            <svg
              className="w-10 h-10 text-white relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-8xl font-bold mb-4 bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-gradient">
            404
          </h1>

          <h2 className="text-3xl font-bold text-white mb-3">
            Page Not Found
          </h2>

          <p className="text-gray-400 text-base">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl space-y-4">
          <Link
            href="/dashboard"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            aria-label="Go to dashboard"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            aria-label="Go back to previous page"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <Link href="/dashboard" className="group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">Dashboard</p>
          </Link>
          <Link href="/upload" className="group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">Upload</p>
          </Link>
          <Link href="/history" className="group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">History</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
