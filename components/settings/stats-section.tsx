interface StatsSectionProps {
  totalResumes: number
  createdAt: Date
}

export function StatsSection({ totalResumes, createdAt }: StatsSectionProps) {
  const daysSinceCreation = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Usage Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Resumes */}
        <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-5 hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-200">Total Resumes</p>
              <p className="text-3xl font-bold text-white mt-1">{totalResumes}</p>
            </div>
          </div>
        </div>

        {/* Account Created */}
        <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-5 hover:border-green-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-200">Member Since</p>
              <p className="text-lg font-semibold text-white mt-1">
                {new Date(createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-white">Account Information</p>
            <p className="text-sm text-gray-400 mt-1">
              Active for {daysSinceCreation} days. All data is securely encrypted and stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
