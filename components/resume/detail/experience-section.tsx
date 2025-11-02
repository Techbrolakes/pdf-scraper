"use client";

import type { ResumeData } from "@/types/resume";

interface ExperienceSectionProps {
  workExperiences: ResumeData["workExperiences"];
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function ExperienceSection({ workExperiences }: ExperienceSectionProps) {
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
