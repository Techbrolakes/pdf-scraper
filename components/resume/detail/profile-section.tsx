"use client";

import type { ResumeData } from "@/types/resume";
import { ensureProtocol } from "@/lib/utils";

interface InfoFieldProps {
  label: string;
  value: string | null;
  link?: boolean;
}

function InfoField({ label, value, link }: InfoFieldProps) {
  if (!value) return null;

  return (
    <div>
      <p className="text-sm font-medium text-gray-400">{label}</p>
      {link && value ? (
        <a
          href={ensureProtocol(value)}
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

interface ProfileSectionProps {
  profile: ResumeData["profile"];
  skills: string[];
}

export function ProfileSection({ profile, skills }: ProfileSectionProps) {
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
        <InfoField label="LinkedIn" value={profile.linkedIn} />
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
