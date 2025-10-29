import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PDFUpload } from '@/components/pdf-upload'
import { ResumeHistory } from '@/components/resume-history'
import { DashboardSkeleton } from '@/components/loading-skeleton'
import { deleteResume } from '@/app/actions/resume-actions'
import { revalidatePath } from 'next/cache'

async function refreshDashboard() {
  'use server'
  revalidatePath('/dashboard')
}

export default async function DashboardPage() {
  const session = await auth()
  
  const [resumeCount, allResumes, recentResume] = await Promise.all([
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
  ])

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

      {/* Stats and Upload Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
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
          <ResumeHistory resumes={allResumes} onDelete={handleDelete} />
        </Suspense>
      </div>
    </div>
  )
}
