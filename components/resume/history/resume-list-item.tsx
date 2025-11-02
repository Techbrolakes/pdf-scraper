"use client";

import { TrashIcon, DocumentIcon, CalendarIcon, FileIcon } from "@/components/icons";
import type { ResumeData } from "@/types/resume";

interface ResumeHistoryItem {
  id: string;
  fileName: string;
  uploadedAt: Date;
  resumeData: {
    pdfType: string;
    pages: number;
    processingMethod: string;
    status: string;
    resumeData: ResumeData;
  };
}

interface ResumeListItemProps {
  resume: ResumeHistoryItem;
  onView: () => void;
  onDelete: () => void;
}

export function ResumeListItem({
  resume,
  onView,
  onDelete,
}: ResumeListItemProps) {
  return (
    <div className="p-4 sm:p-6 hover:bg-white/5 transition-all duration-200 group relative">
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
              <DocumentIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                {resume.fileName}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {new Date(resume.uploadedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="px-2.5 py-1 bg-green-500/10 text-green-300 text-xs font-medium rounded-lg border border-green-500/20">
                  ✓ {resume.resumeData.status}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs font-medium rounded-lg border border-blue-500/20">
                  <FileIcon className="w-3 h-3" />
                  {resume.resumeData.pages}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onView}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all cursor-pointer border border-blue-500/20 hover:border-blue-500/40"
          >
            View
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer border border-red-500/20 hover:border-red-500/40"
            title="Delete resume"
          >
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
