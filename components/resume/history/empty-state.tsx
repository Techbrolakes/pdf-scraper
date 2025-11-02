"use client";

import { DocumentIcon } from "@/components/icons";

export function EmptyHistoryState() {
  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
          <DocumentIcon className="h-10 w-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No resumes yet</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Upload your first PDF resume to get started with AI-powered data
          extraction and analysis.
        </p>
      </div>
    </div>
  );
}

export function NoResultsState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-xl bg-gray-500/10 border border-gray-500/20 flex items-center justify-center mb-4">
        <DocumentIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        No resumes found
      </h3>
      <p className="text-sm text-gray-400">
        Try adjusting your search or filters to find what you&apos;re looking for.
      </p>
    </div>
  );
}
