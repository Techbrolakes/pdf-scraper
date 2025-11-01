import { ReactNode } from 'react'
import { DocumentIcon, SearchIcon, WifiOffIcon } from '@/components/icons'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="flex justify-center mb-4" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export function NoResumesEmpty({ onUploadClick }: { onUploadClick?: () => void }) {
  return (
    <EmptyState
      icon={<DocumentIcon className="h-16 w-16 text-gray-400" />}
      title="No resumes yet"
      description="Upload your first PDF resume to get started with AI-powered data extraction."
      action={
        onUploadClick
          ? {
              label: 'Upload Resume',
              onClick: onUploadClick,
            }
          : undefined
      }
    />
  )
}

export function NoSearchResultsEmpty({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <EmptyState
      icon={<SearchIcon className="h-16 w-16 text-gray-400" />}
      title="No results found"
      description="We couldn't find any resumes matching your search. Try adjusting your search terms."
      action={{
        label: 'Clear Search',
        onClick: onClearSearch,
      }}
    />
  )
}

export function NetworkErrorEmpty({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<WifiOffIcon className="h-16 w-16 text-red-400" />}
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      action={{
        label: 'Retry',
        onClick: onRetry,
      }}
    />
  )
}
