import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PDFUpload } from '@/components/pdf-upload'
import { ResumeHistory } from '@/components/resume-history'
import { DashboardSkeleton } from '@/components/loading-skeleton'
import { deleteResume } from '@/app/actions/resume-actions'
import { revalidatePath } from 'next/cache'
import type { ResumeData } from '@/types/resume'

async function refreshDashboard() {
  'use server'
  revalidatePath('/dashboard')
}

export default async function DashboardPage() {
  const session = await auth()
  
  const [resumeCount, allResumes, recentResume, user] = await Promise.all([
    prisma.resumeHistory.count({
      where: {
        userId: session?.user?.id,
      },
    }),
    prisma.resumeHistory.findMany({
      where: {
        userId: session?.user?.id,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    }),
    prisma.resumeHistory.findFirst({
      where: {
        userId: session?.user?.id,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    }),
    prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        credits: true,
        planType: true,
      },
    }),
  ])

  const credits = user?.credits || 0
  const planType = user?.planType || 'FREE'

  // Transform resumes data to match expected type
  const typedResumes = allResumes.map((resume) => ({
    ...resume,
    resumeData: resume.resumeData as unknown as {
      pdfType: string
      pages: number
      processingMethod: string
      status: string
      resumeData: ResumeData
    },
  }))

  const handleDelete = async (id: string) => {
    'use server'
    await deleteResume(id)
    revalidatePath('/dashboard')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.user?.name || 'User'}!
        </p>
      </div>

      {/* Low Credits Warning */}
      {credits < 500 && credits > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Low Credits Warning</h3>
              <p className="mt-1 text-sm text-orange-700">
                You have {credits.toLocaleString()} credits remaining. Consider upgrading your plan in{' '}
                <a href="/settings" className="font-medium underline">Settings</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Credits Warning */}
      {credits === 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">No Credits Remaining</h3>
              <p className="mt-1 text-sm text-red-700">
                You have no credits left. Subscribe to a plan in{' '}
                <a href="/settings" className="font-medium underline">Settings</a> to continue processing resumes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats and Upload Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-8">
        {/* Credits Stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className={`h-6 w-6 ${credits === 0 ? 'text-red-600' : credits < 500 ? 'text-orange-600' : 'text-purple-600'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Credits ({planType})
                  </dt>
                  <dd className={`text-3xl font-semibold ${credits === 0 ? 'text-red-600' : credits < 500 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {credits.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Resumes Stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Resumes
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {resumeCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Most Recent Upload Stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Most Recent
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900 truncate">
                    {recentResume
                      ? new Date(recentResume.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'No uploads yet'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="lg:col-span-1">
          <PDFUpload onUploadSuccess={refreshDashboard} />
        </div>
      </div>

      {/* Resume History */}
      <div className="mt-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <ResumeHistory resumes={typedResumes} onDelete={handleDelete} />
        </Suspense>
      </div>
    </div>
  )
}
