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
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
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
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6">
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

function ProfileSection({
  profile,
  skills,
}: {
  profile: ResumeData["profile"];
  skills: string[];
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <InfoField
          label="Name"
          value={`${profile.name || ""} ${profile.surname || ""}`}
        />
        <InfoField label="Email" value={profile.email} />
        <InfoField label="Headline" value={profile.headline} />
        <InfoField
          label="Location"
          value={`${profile.city || ""}, ${profile.country || ""}`}
        />
        <InfoField label="LinkedIn" value={profile.linkedIn} link />
        <InfoField label="Website" value={profile.website} link />
        <InfoField label="Remote Work" value={profile.remote ? "Yes" : "No"} />
        <InfoField
          label="Open to Relocation"
          value={profile.relocation ? "Yes" : "No"}
        />
      </div>

      {profile.professionalSummary && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">
            Professional Summary
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {profile.professionalSummary}
          </p>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExperienceSection({
  workExperiences,
}: {
  workExperiences: ResumeData["workExperiences"];
}) {
  if (workExperiences.length === 0) {
    return <EmptyState message="No work experience found" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 ">
      {workExperiences.map((exp, index) => (
        <div
          key={index}
          className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {exp.jobTitle}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 font-medium">
                {exp.company}
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <p className="text-xs sm:text-sm text-gray-400">
                {exp.startMonth}/{exp.startYear} -{" "}
                {exp.current ? "Present" : `${exp.endMonth}/${exp.endYear}`}
              </p>
              <div className="flex gap-2 mt-1 sm:justify-end flex-wrap">
                <span className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-lg border border-white/10">
                  {exp.employmentType.replace("_", " ")}
                </span>
                <span className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-lg border border-white/10">
                  {exp.locationType}
                </span>
              </div>
            </div>
          </div>
          {exp.description && (
            <p className="mt-3 text-gray-400 leading-relaxed">
              {exp.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationSection({
  educations,
}: {
  educations: ResumeData["educations"];
}) {
  if (educations.length === 0) {
    return <EmptyState message="No education found" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {educations.map((edu, index) => (
        <div
          key={index}
          className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {edu.school}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 font-medium">
                {edu.degree.replace("_", " ")} {edu.major && `in ${edu.major}`}
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <p className="text-xs sm:text-sm text-gray-400">
                {edu.startYear} - {edu.current ? "Present" : edu.endYear}
              </p>
            </div>
          </div>
          {edu.description && (
            <p className="mt-3 text-gray-400 leading-relaxed">
              {edu.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function OtherSection({
  licenses,
  languages,
  achievements,
  publications,
  honors,
}: {
  licenses: ResumeData["licenses"];
  languages: ResumeData["languages"];
  achievements: ResumeData["achievements"];
  publications: ResumeData["publications"];
  honors: ResumeData["honors"];
}) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Licenses */}
      {licenses.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Licenses & Certifications
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {licenses.map((license, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <h4 className="font-medium text-white">{license.name}</h4>
                <p className="text-sm text-gray-400">
                  {license.issuer} • {license.issueYear}
                </p>
                {license.description && (
                  <p className="mt-2 text-sm text-gray-300">
                    {license.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Languages
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-3 rounded-xl"
              >
                <p className="font-medium text-white">{lang.language}</p>
                <p className="text-sm text-gray-400">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Achievements
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <h4 className="font-medium text-white">{achievement.title}</h4>
                <p className="text-sm text-gray-400">
                  {achievement.organization} • {achievement.achieveDate}
                </p>
                {achievement.description && (
                  <p className="mt-2 text-sm text-gray-300">
                    {achievement.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Publications
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <h4 className="font-medium text-white">{pub.title}</h4>
                <p className="text-sm text-gray-400">
                  {pub.publisher} •{" "}
                  {new Date(pub.publicationDate).toLocaleDateString()}
                </p>
                {pub.publicationUrl && (
                  <a
                    href={pub.publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline mt-1 inline-block transition-colors"
                  >
                    View Publication →
                  </a>
                )}
                {pub.description && (
                  <p className="mt-2 text-sm text-gray-300">
                    {pub.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Honors */}
      {honors.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Honors & Awards
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {honors.map((honor, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <h4 className="font-medium text-white">{honor.title}</h4>
                <p className="text-sm text-gray-400">
                  {honor.issuer} • {honor.issueMonth}/{honor.issueYear}
                </p>
                {honor.description && (
                  <p className="mt-2 text-sm text-gray-300">
                    {honor.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({
  label,
  value,
  link,
}: {
  label: string;
  value: string | null;
  link?: boolean;
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-sm font-medium text-gray-400">{label}</p>
      {link && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 hover:underline mt-1 block transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-white mt-1">{value}</p>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
