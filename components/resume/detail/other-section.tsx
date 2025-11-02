"use client";

import type { ResumeData } from "@/types/resume";
import { ensureProtocol } from "@/lib/utils";

interface OtherSectionProps {
  licenses: ResumeData["licenses"];
  languages: ResumeData["languages"];
  achievements: ResumeData["achievements"];
  publications: ResumeData["publications"];
  honors: ResumeData["honors"];
}

export function OtherSection({
  licenses,
  languages,
  achievements,
  publications,
  honors,
}: OtherSectionProps) {
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
                    href={ensureProtocol(pub.publicationUrl)}
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
