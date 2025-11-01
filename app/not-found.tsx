'use client'

import Link from 'next/link'
import {
  ConfusedFaceIcon,
  HomeIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  UploadIcon,
  ClockIcon,
} from '@/components/icons'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12">
      <div className="max-w-md w-full">
        {/* 404 Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-[#1447E6] to-[#0A2E8C] mb-6 shadow-lg shadow-[#1447E6]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
            <ConfusedFaceIcon
              className="w-10 h-10 text-white relative z-10"
              aria-hidden="true"
            />
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
            <HomeIcon
              className="w-5 h-5"
              aria-hidden="true"
            />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            />
            Go Back
          </button>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
            >
              <HomeIcon className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <Link href="/dashboard" className="group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors mb-2">
              <ChartBarIcon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Dashboard</p>
          </Link>
          <Link href="/upload" className="group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors mb-2">
              <UploadIcon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Upload</p>
          </Link>
          <Link href="/history" className="group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors mb-2">
              <ClockIcon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">History</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
