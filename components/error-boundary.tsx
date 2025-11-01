'use client'

import { Component, ReactNode } from 'react'
import Link from 'next/link'
import { AlertIcon, InfoIcon, RefreshIcon, ArrowLeftIcon } from '@/components/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12">
          <div className="max-w-md w-full">
            {/* Error Icon */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-red-500 to-red-700 mb-6 shadow-lg shadow-red-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
                <AlertIcon
                  className="w-8 h-8 text-white relative z-10"
                  aria-hidden="true"
                />
              </div>

              <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent animate-gradient">
                Something went wrong
              </h1>

              <p className="text-gray-400 text-base">
                We encountered an unexpected error. Don&apos;t worry, we&apos;re on it!
              </p>
            </div>

            {/* Error Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
              {this.state.error && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <InfoIcon className="w-4 h-4" />
                    View error details
                  </summary>
                  <pre className="mt-4 text-xs bg-black/30 border border-white/10 text-red-300 p-4 rounded-lg overflow-auto max-h-40 font-mono">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                aria-label="Reload page"
              >
                <RefreshIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Reload Page
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Go back home
                </Link>
              </div>
            </div>

            {/* Footer Badge */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Error logged and team notified
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
