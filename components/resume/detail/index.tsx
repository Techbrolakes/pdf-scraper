"use client";

import { useState, useEffect, useRef } from "react";
import type { ResumeData } from "@/types/resume";
import { downloadResumeData, type ExportFormat } from "@/lib/resume-export";
import {
  DownloadIcon,
  ChevronDownIcon,
  DocumentIcon,
  CloseIcon,
} from "@/components/icons";
import { ProfileSection } from "./profile-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { OtherSection } from "./other-section";

interface ResumeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  uploadedAt: Date;
  resumeData: ResumeData;
}

export function ResumeDetailModal({
  isOpen,
  onClose,
  fileName,
  uploadedAt,
  resumeData,
}: ResumeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "experience" | "education" | "other"
  >("profile");
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowFormatMenu(false);
      }
    }

    if (showFormatMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showFormatMenu]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        // Restore scroll position and styles
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = (format: ExportFormat) => {
    downloadResumeData(resumeData, fileName, format);
    setShowFormatMenu(false);
  };

  const handleCopyData = async () => {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2);
      await navigator.clipboard.writeText(dataStr);
      // Using a simple alert for now - could be replaced with toast in the future
      alert("Data copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy data to clipboard");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-main-background/80 backdrop-blur-sm transition-opacity" />

        {/* Modal */}
        <div
          className="relative w-full h-[80vh] flex flex-col bg-main-background border border-white/10 rounded-2xl shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {fileName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Uploaded on{" "}
                  {new Date(uploadedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                {/* Download Dropdown */}
                <div ref={dropdownRef} className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => setShowFormatMenu(!showFormatMenu)}
                    className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                    <ChevronDownIcon
                      className={`w-3 h-3 transition-transform ${showFormatMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showFormatMenu && (
                    <div className="absolute top-full mt-2 right-0 z-10 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <button
                        onClick={() => handleDownload("json")}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <DocumentIcon className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="font-medium">JSON</div>
                          <div className="text-xs text-gray-400">
                            Structured data
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDownload("csv")}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <DocumentIcon className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="font-medium">CSV</div>
                          <div className="text-xs text-gray-400">
                            Spreadsheet format
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDownload("txt")}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <DocumentIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">TXT</div>
                          <div className="text-xs text-gray-400">
                            Plain text
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDownload("pdf")}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <DocumentIcon className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="font-medium">PDF</div>
                          <div className="text-xs text-gray-400">
                            Print to PDF
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCopyData}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-white/20 cursor-pointer"
                >
                  Copy
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl cursor-pointer"
                >
                  <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="shrink-0 border-b border-white/10 px-4 sm:px-6 pb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "experience"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "education"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "other"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Other
              </button>
            </div>
          </div>

          {/* Content */}
          <div 
            data-lenis-prevent
            className="flex-1 overflow-y-scroll overscroll-contain px-4 sm:px-6 py-4 sm:py-6" 
            style={{ 
              WebkitOverflowScrolling: 'touch',
              minHeight: 0,
              maxHeight: '100%'
            }}
          >
            {activeTab === "profile" && (
              <ProfileSection
                profile={resumeData.profile}
                skills={resumeData.skills}
              />
            )}
            {activeTab === "experience" && (
              <ExperienceSection workExperiences={resumeData.workExperiences} />
            )}
            {activeTab === "education" && (
              <EducationSection educations={resumeData.educations} />
            )}
            {activeTab === "other" && (
              <OtherSection
                licenses={resumeData.licenses}
                languages={resumeData.languages}
                achievements={resumeData.achievements}
                publications={resumeData.publications}
                honors={resumeData.honors}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
