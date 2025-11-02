"use client";

import type { ResumeData } from "@/types/resume";

interface EducationSectionProps {
  educations: ResumeData["educations"];
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function EducationSection({ educations }: EducationSectionProps) {
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
                {edu.startYear} - {edu.current ? "Present" : edu.endYear || ""}
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
