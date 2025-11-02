"use client";

import {
  SearchIcon,
  CloseIcon,
  SortIcon,
  ChevronDownIcon,
  CalendarIcon,
  FileIcon,
  DocumentIcon,
} from "@/components/icons";

interface ResumeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "newest" | "oldest";
  onSortChange: (order: "newest" | "oldest") => void;
  dateRange: "all" | "7days" | "30days" | "90days";
  onDateRangeChange: (range: "all" | "7days" | "30days" | "90days") => void;
  pageCount: "all" | "1" | "2-3" | "4-5" | "6+";
  onPageCountChange: (count: "all" | "1" | "2-3" | "4-5" | "6+") => void;
  fileSize: "all" | "small" | "medium" | "large";
  onFileSizeChange: (size: "all" | "small" | "medium" | "large") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function ResumeFilters({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  dateRange,
  onDateRangeChange,
  pageCount,
  onPageCountChange,
  fileSize,
  onFileSizeChange,
  showFilters,
  onToggleFilters,
  hasActiveFilters,
  onClearFilters,
}: ResumeFiltersProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 hover:bg-white/10 w-full transition-all"
            aria-label="Search resumes by filename"
          />
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-2.5 p-0.5 hover:bg-white/10 rounded-md transition-colors"
              aria-label="Clear search"
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
              onSortChange(e.target.value as "newest" | "oldest")
            }
            className="pl-9 pr-8 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
            aria-label="Sort order"
          >
            <option value="newest" className="bg-[#0a0a0a]">
              Newest First
            </option>
            <option value="oldest" className="bg-[#0a0a0a]">
              Oldest First
            </option>
          </select>
          <SortIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <ChevronDownIcon className="absolute right-2 top-3 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleFilters}
          className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all border ${
            showFilters
              ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
        >
          Filters {hasActiveFilters && "•"}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
          {/* Date Range Filter */}
          <div className="relative group">
            <select
              value={dateRange}
              onChange={(e) =>
                onDateRangeChange(
                  e.target.value as "all" | "7days" | "30days" | "90days"
                )
              }
              className="pl-9 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
              aria-label="Filter by date range"
            >
              <option value="all" className="bg-[#0a0a0a]">
                All Time
              </option>
              <option value="7days" className="bg-[#0a0a0a]">
                Last 7 Days
              </option>
              <option value="30days" className="bg-[#0a0a0a]">
                Last 30 Days
              </option>
              <option value="90days" className="bg-[#0a0a0a]">
                Last 90 Days
              </option>
            </select>
            <CalendarIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <ChevronDownIcon className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Page Count Filter */}
          <div className="relative group">
            <select
              value={pageCount}
              onChange={(e) =>
                onPageCountChange(
                  e.target.value as "all" | "1" | "2-3" | "4-5" | "6+"
                )
              }
              className="pl-9 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
              aria-label="Filter by page count"
            >
              <option value="all" className="bg-[#0a0a0a]">
                All Pages
              </option>
              <option value="1" className="bg-[#0a0a0a]">
                1 Page
              </option>
              <option value="2-3" className="bg-[#0a0a0a]">
                2-3 Pages
              </option>
              <option value="4-5" className="bg-[#0a0a0a]">
                4-5 Pages
              </option>
              <option value="6+" className="bg-[#0a0a0a]">
                6+ Pages
              </option>
            </select>
            <FileIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <ChevronDownIcon className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
          </div>

          {/* File Size Filter */}
          <div className="relative group">
            <select
              value={fileSize}
              onChange={(e) =>
                onFileSizeChange(
                  e.target.value as "all" | "small" | "medium" | "large"
                )
              }
              className="pl-9 pr-8 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 hover:bg-white/10 cursor-pointer transition-all appearance-none"
              aria-label="Filter by file size"
            >
              <option value="all" className="bg-[#0a0a0a]">
                All Sizes
              </option>
              <option value="small" className="bg-[#0a0a0a]">
                Small (&lt;1MB)
              </option>
              <option value="medium" className="bg-[#0a0a0a]">
                Medium (1-5MB)
              </option>
              <option value="large" className="bg-[#0a0a0a]">
                Large (5-10MB)
              </option>
            </select>
            <DocumentIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <ChevronDownIcon className="absolute right-2 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20 hover:border-red-500/40"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
