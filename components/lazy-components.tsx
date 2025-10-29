import dynamic from 'next/dynamic'
import { Skeleton, SkeletonCard } from './ui/skeleton'

/**
 * Lazy-loaded components for better performance
 */

// Lazy load the resume detail modal (only when needed)
export const LazyResumeDetailModal = dynamic(
  () => import('./resume-detail-modal').then((mod) => ({ default: mod.ResumeDetailModal })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4">
          <SkeletonCard />
        </div>
      </div>
    ),
    ssr: false,
  }
)

// Lazy load settings components (only when on settings page)
export const LazyProfileSection = dynamic(
  () => import('./settings/profile-section').then((mod) => ({ default: mod.ProfileSection })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

export const LazyPasswordSection = dynamic(
  () => import('./settings/password-section').then((mod) => ({ default: mod.PasswordSection })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)

export const LazyAccountSection = dynamic(
  () => import('./settings/account-section').then((mod) => ({ default: mod.AccountSection })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
  }
)
