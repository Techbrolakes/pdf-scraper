"use client";

import { useState } from "react";
import { ResumeDetailModal } from "./resume-detail-modal";
import type { ResumeData } from "@/types/resume";
import { toast } from "@/lib/toast";

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

interface ResumeHistoryProps {
  resumes: ResumeHistoryItem[];
  onDelete: (id: string) => Promise<void>;
}

export function ResumeHistory({ resumes, onDelete }: ResumeHistoryProps) {
  const [selectedResume, setSelectedResume] =
    useState<ResumeHistoryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [dateRange, setDateRange] = useState<"all" | "7days" | "30days" | "90days">("all");
  const [pageCount, setPageCount] = useState<"all" | "1" | "2-3" | "4-5" | "6+">("all");
  const [fileSize, setFileSize] = useState<"all" | "small" | "medium" | "large">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort resumes
  const filteredResumes = resumes
    .filter((resume) => {
      // Search filter
      if (!resume.fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (dateRange !== "all") {
        const now = new Date();
        const uploadDate = new Date(resume.uploadedAt);
        const daysDiff = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateRange === "7days" && daysDiff > 7) return false;
        if (dateRange === "30days" && daysDiff > 30) return false;
        if (dateRange === "90days" && daysDiff > 90) return false;
      }

      // Page count filter
      if (pageCount !== "all") {
        const pages = resume.resumeData.pages;
        if (pageCount === "1" && pages !== 1) return false;
        if (pageCount === "2-3" && (pages < 2 || pages > 3)) return false;
        if (pageCount === "4-5" && (pages < 4 || pages > 5)) return false;
        if (pageCount === "6+" && pages < 6) return false;
      }

      // File size filter
      // Note: File size filtering is disabled until fileSize property is added to ResumeHistoryItem
      // Uncomment and adjust when fileSize data is available
      /*
      if (fileSize !== "all" && resume.fileSize) {
        const size = resume.fileSize;
        if (fileSize === "small" && size > 1024 * 1024) return false; // > 1MB
        if (fileSize === "medium" && (size <= 1024 * 1024 || size > 5 * 1024 * 1024)) return false; // 1-5MB
        if (fileSize === "large" && size <= 5 * 1024 * 1024) return false; // > 5MB
      }
      */

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Pagination
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResumes = filteredResumes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Resume deleted successfully");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-blue-400"
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
        <h3 className="text-lg font-semibold text-white">No resumes yet</h3>
        <p className="mt-2 text-gray-400">
          Upload your first PDF resume to get started with AI-powered data
          extraction.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Header with search and sort */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-linear-to-br from-white/5 to-transparent">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Resume History
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} uploaded
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(dateRange !== "all" || pageCount !== "all" || fileSize !== "all") && (
                  <div className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <span className="text-xs font-semibold text-purple-300">
                      Filtered
                    </span>
                  </div>
                )}
                <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <span className="text-xs font-semibold text-blue-300">
                    {filteredResumes.length} shown
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Search by filename..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 hover:bg-white/10 w-full transition-all"
                  aria-label="Search resumes by filename"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-2.5 p-0.5 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative group">
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "newest" | "oldest")
                  }
                  className="pl-10 pr-8 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 hover:bg-white/10 cursor-pointer transition-all appearance-none min-w-[140px]"
                  aria-label="Sort resumes"
                >
                  <option value="newest" className="bg-[#0a0a0a]">
                    Newest First
                  </option>
                  <option value="oldest" className="bg-[#0a0a0a]">
                    Oldest First
                  </option>
                </select>
                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <svg className="absolute right-3 top-3.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Date Range Filter */}
              <div className="relative group">
                <select
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value as typeof dateRange);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
                  aria-label="Filter by date range"
                >
                  <option value="all" className="bg-[#0a0a0a]">All Time</option>
                  <option value="7days" className="bg-[#0a0a0a]">Last 7 Days</option>
                  <option value="30days" className="bg-[#0a0a0a]">Last 30 Days</option>
                  <option value="90days" className="bg-[#0a0a0a]">Last 90 Days</option>
                </select>
                <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Page Count Filter */}
              <div className="relative group">
                <select
                  value={pageCount}
                  onChange={(e) => {
                    setPageCount(e.target.value as typeof pageCount);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
                  aria-label="Filter by page count"
                >
                  <option value="all" className="bg-[#0a0a0a]">All Pages</option>
                  <option value="1" className="bg-[#0a0a0a]">1 Page</option>
                  <option value="2-3" className="bg-[#0a0a0a]">2-3 Pages</option>
                  <option value="4-5" className="bg-[#0a0a0a]">4-5 Pages</option>
                  <option value="6+" className="bg-[#0a0a0a]">6+ Pages</option>
                </select>
                <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* File Size Filter */}
              <div className="relative group">
                <select
                  value={fileSize}
                  onChange={(e) => {
                    setFileSize(e.target.value as typeof fileSize);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
                  aria-label="Filter by file size"
                >
                  <option value="all" className="bg-[#0a0a0a]">All Sizes</option>
                  <option value="small" className="bg-[#0a0a0a]">Small (&lt;1MB)</option>
                  <option value="medium" className="bg-[#0a0a0a]">Medium (1-5MB)</option>
                  <option value="large" className="bg-[#0a0a0a]">Large (5-10MB)</option>
                </select>
                <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Clear Filters Button */}
              {(dateRange !== "all" || pageCount !== "all" || fileSize !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setDateRange("all");
                    setPageCount("all");
                    setFileSize("all");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20 hover:border-red-500/40"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resume list */}
        {filteredResumes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">No resumes match your search.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/10">
              {paginatedResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="p-4 sm:p-6 hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg
                            className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400"
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-white truncate">
                            {resume.fileName}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 flex-wrap">
                            <p className="text-xs text-gray-400">
                              {new Date(resume.uploadedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <span className="hidden sm:inline text-gray-600">
                              •
                            </span>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                              {resume.resumeData.status}
                            </span>
                            <span className="hidden sm:inline text-gray-600">
                              •
                            </span>
                            <span className="text-xs text-gray-400">
                              {resume.resumeData.pages}p
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedResume(resume)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all cursor-pointer border border-blue-500/20 hover:border-blue-500/40"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(resume.id)}
                        className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer border border-red-500/20 hover:border-red-500/40"
                        title="Delete resume"
                      >
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
                  {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredResumes.length)}{" "}
                  of {filteredResumes.length}
                </p>
                <div className="flex gap-1 sm:gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl cursor-pointer transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white border border-blue-500"
                            : "text-white bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedResume && (
        <ResumeDetailModal
          isOpen={!!selectedResume}
          onClose={() => setSelectedResume(null)}
          fileName={selectedResume.fileName}
          uploadedAt={selectedResume.uploadedAt}
          resumeData={selectedResume.resumeData.resumeData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setDeleteConfirm(null)}
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
            <div
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Delete Resume
                  </h3>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this resume? All associated data
                will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
