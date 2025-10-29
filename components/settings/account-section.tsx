'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteAccountSchema, type DeleteAccountInput } from '@/lib/validations/settings'
import { deleteAccount } from '@/app/actions/settings-actions'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function AccountSection() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
  })

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const onDeleteSubmit = async (data: DeleteAccountInput) => {
    setIsDeleting(true)
    try {
      const result = await deleteAccount(data)
      if (result.success) {
        toast.success('Account deleted successfully')
        // Sign out and redirect
        await signOut({ redirect: false })
        router.push('/login')
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h2>
        
        <div className="space-y-4">
          {/* Sign Out */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Sign Out</h3>
              <p className="text-sm text-gray-500 mt-1">
                Sign out of your account on this device
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900">Delete Account</h3>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowDeleteDialog(false)}>
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
            <div
              className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">Warning: This will permanently:</p>
                <ul className="text-sm text-red-700 space-y-1 ml-4 list-disc">
                  <li>Delete your account</li>
                  <li>Delete all your uploaded resumes</li>
                  <li>Delete all extracted resume data</li>
                  <li>Remove all your personal information</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit(onDeleteSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="font-mono font-bold">DELETE</span> to confirm
                  </label>
                  <input
                    {...register('confirmation')}
                    type="text"
                    id="confirmation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="DELETE"
                  />
                  {errors.confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmation.message}</p>
                  )}
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteDialog(false)
                      reset()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
