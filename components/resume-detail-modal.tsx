'use client'

import { useState } from 'react'
import type { ResumeData } from '@/types/resume'

interface ResumeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  uploadedAt: Date
  resumeData: ResumeData
}

export function ResumeDetailModal({
  isOpen,
  onClose,
  fileName,
  uploadedAt,
  resumeData,
}: ResumeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'education' | 'other'>('profile')

  if (!isOpen) return null

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName.replace('.pdf', '')}_data.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyData = async () => {
    try {
      const dataStr = JSON.stringify(resumeData, null, 2)
      await navigator.clipboard.writeText(dataStr)
      // Using a simple alert for now - could be replaced with toast in the future
      alert('Data copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy data to clipboard')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Modal */}
        <div
          className="relative w-full max-w-5xl bg-white rounded-lg shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{fileName}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded on {new Date(uploadedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Download JSON
                </button>
                <button
                  onClick={handleCopyData}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Copy Data
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mt-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'experience'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'education'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'other'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Other
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {activeTab === 'profile' && (
              <ProfileSection profile={resumeData.profile} skills={resumeData.skills} />
            )}
            {activeTab === 'experience' && (
              <ExperienceSection workExperiences={resumeData.workExperiences} />
            )}
            {activeTab === 'education' && (
              <EducationSection educations={resumeData.educations} />
            )}
            {activeTab === 'other' && (
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
  )
}

function ProfileSection({ profile, skills }: { profile: ResumeData['profile']; skills: string[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Name" value={`${profile.name || ''} ${profile.surname || ''}`} />
        <InfoField label="Email" value={profile.email} />
        <InfoField label="Headline" value={profile.headline} />
        <InfoField label="Location" value={`${profile.city || ''}, ${profile.country || ''}`} />
        <InfoField label="LinkedIn" value={profile.linkedIn} link />
        <InfoField label="Website" value={profile.website} link />
        <InfoField label="Remote Work" value={profile.remote ? 'Yes' : 'No'} />
        <InfoField label="Open to Relocation" value={profile.relocation ? 'Yes' : 'No'} />
      </div>

      {profile.professionalSummary && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Professional Summary</h3>
          <p className="text-gray-900 leading-relaxed">{profile.professionalSummary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ExperienceSection({ workExperiences }: { workExperiences: ResumeData['workExperiences'] }) {
  if (workExperiences.length === 0) {
    return <EmptyState message="No work experience found" />
  }

  return (
    <div className="space-y-6">
      {workExperiences.map((exp, index) => (
        <div key={index} className="border-l-4 border-blue-500 pl-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
              <p className="text-gray-700 font-medium">{exp.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {exp.startMonth}/{exp.startYear} -{' '}
                {exp.current ? 'Present' : `${exp.endMonth}/${exp.endYear}`}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {exp.employmentType.replace('_', ' ')}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {exp.locationType}
                </span>
              </div>
            </div>
          </div>
          {exp.description && (
            <p className="mt-3 text-gray-600 leading-relaxed">{exp.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function EducationSection({ educations }: { educations: ResumeData['educations'] }) {
  if (educations.length === 0) {
    return <EmptyState message="No education found" />
  }

  return (
    <div className="space-y-6">
      {educations.map((edu, index) => (
        <div key={index} className="border-l-4 border-green-500 pl-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
              <p className="text-gray-700 font-medium">
                {edu.degree.replace('_', ' ')} {edu.major && `in ${edu.major}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
              </p>
            </div>
          </div>
          {edu.description && (
            <p className="mt-3 text-gray-600 leading-relaxed">{edu.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function OtherSection({
  licenses,
  languages,
  achievements,
  publications,
  honors,
}: {
  licenses: ResumeData['licenses']
  languages: ResumeData['languages']
  achievements: ResumeData['achievements']
  publications: ResumeData['publications']
  honors: ResumeData['honors']
}) {
  return (
    <div className="space-y-8">
      {/* Licenses */}
      {licenses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Licenses & Certifications</h3>
          <div className="space-y-4">
            {licenses.map((license, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{license.name}</h4>
                <p className="text-sm text-gray-600">
                  {license.issuer} • {license.issueYear}
                </p>
                {license.description && (
                  <p className="mt-2 text-sm text-gray-700">{license.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languages.map((lang, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">{lang.language}</p>
                <p className="text-sm text-gray-600">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-600">
                  {achievement.organization} • {achievement.achieveDate}
                </p>
                {achievement.description && (
                  <p className="mt-2 text-sm text-gray-700">{achievement.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Publications</h3>
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{pub.title}</h4>
                <p className="text-sm text-gray-600">
                  {pub.publisher} • {new Date(pub.publicationDate).toLocaleDateString()}
                </p>
                {pub.publicationUrl && (
                  <a
                    href={pub.publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    View Publication →
                  </a>
                )}
                {pub.description && (
                  <p className="mt-2 text-sm text-gray-700">{pub.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Honors */}
      {honors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Honors & Awards</h3>
          <div className="space-y-4">
            {honors.map((honor, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{honor.title}</h4>
                <p className="text-sm text-gray-600">
                  {honor.issuer} • {honor.issueMonth}/{honor.issueYear}
                </p>
                {honor.description && (
                  <p className="mt-2 text-sm text-gray-700">{honor.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoField({ label, value, link }: { label: string; value: string | null; link?: boolean }) {
  if (!value) return null

  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {link && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-1 block"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-900 mt-1">{value}</p>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
