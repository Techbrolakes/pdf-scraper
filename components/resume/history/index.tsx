"use client";

import { useState } from "react";
import { DocumentIcon } from "@/components/icons";
import type { ResumeData } from "@/types/resume";
import { toast } from "@/lib/toast";
import { ResumeFilters } from "./resume-filters";
import { ResumeListItem } from "./resume-list-item";
import { ResumePagination } from "./resume-pagination";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { EmptyHistoryState, NoResultsState } from "./empty-state";
import { ResumeDetailModal } from "../detail";

export interface ResumeHistoryItem {
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
  const [dateRange, setDateRange] = useState<
    "all" | "7days" | "30days" | "90days"
  >("all");
  const [pageCount, setPageCount] = useState<
    "all" | "1" | "2-3" | "4-5" | "6+"
  >("all");
  const [fileSize, setFileSize] = useState<
    "all" | "small" | "medium" | "large"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  // Filter resumes
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
        const daysDiff = Math.floor(
          (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
        );

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

  const handleClearFilters = () => {
    setDateRange("all");
    setPageCount("all");
    setFileSize("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    dateRange !== "all" ||
    pageCount !== "all" ||
    fileSize !== "all" ||
    searchQuery !== "";

  const deleteResumeItem = resumes.find((r) => r.id === deleteConfirm);

  if (resumes.length === 0) {
    return <EmptyHistoryState />;
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex flex-col gap-4">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                  <DocumentIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-white">
                    Resume History
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {resumes.length}{" "}
                    {resumes.length === 1 ? "resume" : "resumes"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {hasActiveFilters && (
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <span className="text-xs font-semibold text-purple-300">
                      🔍
                    </span>
                  </div>
                )}
                <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <span className="text-xs font-semibold text-blue-300">
                    {filteredResumes.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <ResumeFilters
              searchQuery={searchQuery}
              onSearchChange={(query) => {
                setSearchQuery(query);
                setCurrentPage(1);
              }}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              dateRange={dateRange}
              onDateRangeChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
              pageCount={pageCount}
              onPageCountChange={(count) => {
                setPageCount(count);
                setCurrentPage(1);
              }}
              fileSize={fileSize}
              onFileSizeChange={(size) => {
                setFileSize(size);
                setCurrentPage(1);
              }}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Resume list */}
        {filteredResumes.length === 0 ? (
          <NoResultsState />
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {paginatedResumes.map((resume) => (
                <ResumeListItem
                  key={resume.id}
                  resume={resume}
                  onView={() => setSelectedResume(resume)}
                  onDelete={() => setDeleteConfirm(resume.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <ResumePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredResumes.length}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
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

      {/* Delete Confirmation Modal */}
      {deleteResumeItem && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirm}
          fileName={deleteResumeItem.fileName}
          onConfirm={() => handleDelete(deleteConfirm!)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
