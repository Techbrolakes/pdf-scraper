import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PDFUpload } from '@/components/pdf-upload'
import { revalidatePath } from 'next/cache'

type ResumeHistory = {
  id: string
  userId: string
  fileName: string
  uploadedAt: Date
  resumeData: unknown
}

async function refreshDashboard() {
  'use server'
  revalidatePath('/dashboard')
}

export default async function DashboardPage() {
  const session = await auth()
  
  const resumeCount = await prisma.resumeHistory.count({
    where: {
      userId: session?.user?.id,
    },
  })

  const recentResumes = await prisma.resumeHistory.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      uploadedAt: 'desc',
    },
    take: 5,
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.user?.name || 'User'}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
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

        <div className="lg:col-span-2">
          <PDFUpload onUploadSuccess={refreshDashboard} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Uploads
        </h2>
        {recentResumes.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No resumes uploaded yet. Start by uploading your first PDF!
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {recentResumes.map((resume: ResumeHistory) => (
                <li key={resume.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {resume.fileName}
                      </p>
                      <div className="ml-2 shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Processed
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Uploaded on{' '}
                          {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
