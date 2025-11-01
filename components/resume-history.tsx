"use client";

import { useState } from "react";
import { ResumeDetailModal } from "./resume-detail-modal";
import type { ResumeData } from "@/types/resume";
import { toast } from "@/lib/toast";
import {
  DocumentIcon,
  SearchIcon,
  CloseIcon,
  SortIcon,
  ChevronDownIcon,
  CalendarIcon,
  FileIcon,
  TrashIcon,
  AlertIcon,
} from "@/components/icons";

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
            Upload your first PDF resume to get started with AI-powered data extraction and analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Header with search and sort */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                  <DocumentIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Resume History
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} uploaded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {(dateRange !== "all" || pageCount !== "all" || fileSize !== "all") && (
                  <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <span className="text-xs font-semibold text-purple-300">
                      🔍 Filtered
                    </span>
                  </div>
                )}
                <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
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
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-2.5 p-0.5 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <CloseIcon className="h-4 w-4 text-gray-400 hover:text-white" />
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
                <SortIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <ChevronDownIcon className="absolute right-3 top-3.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
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
                <CalendarIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <ChevronDownIcon className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
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
                <FileIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <ChevronDownIcon className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
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
                <DocumentIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <ChevronDownIcon className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
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
            <div className="divide-y divide-white/5">
              {paginatedResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="p-4 sm:p-6 hover:bg-white/5 transition-all duration-200 group relative"
                >
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
                              {new Date(resume.uploadedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                }
                              )}
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
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  <AlertIcon className="w-6 h-6 text-red-400" />
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
