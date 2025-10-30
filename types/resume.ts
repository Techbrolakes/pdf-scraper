// Resume data types based on the exact JSON schema

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  INTERNSHIP = 'INTERNSHIP',
  CONTRACT = 'CONTRACT',
}

export enum LocationType {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export enum DegreeType {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  ASSOCIATE = 'ASSOCIATE',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORATE = 'DOCTORATE',
}

export enum LanguageLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  NATIVE = 'NATIVE',
}

export interface Profile {
  name: string | null
  surname: string | null
  email: string | null
  headline: string | null
  professionalSummary: string | null
  linkedIn: string | null
  website: string | null
  country: string | null
  city: string | null
  relocation: boolean
  remote: boolean
}

export interface WorkExperience {
  jobTitle: string
  employmentType: EmploymentType
  locationType: LocationType
  company: string
  startMonth: number
  startYear: number
  endMonth: number | null
  endYear: number | null
  current: boolean
  description: string | null
}

export interface Education {
  school: string
  degree: DegreeType
  major: string | null
  startYear: number
  endYear: number | null
  current: boolean
  description: string | null
}

export interface License {
  name: string
  issuer: string
  issueYear: number
  description: string | null
}

export interface Language {
  language: string
  level: LanguageLevel
}

export interface Achievement {
  title: string
  organization: string
  achieveDate: string // Format: YYYY-MM
  description: string | null
}

export interface Publication {
  title: string
  publisher: string
  publicationDate: string // ISO 8601 format
  publicationUrl: string | null
  description: string | null
}

export interface Honor {
  title: string
  issuer: string
  issueMonth: number
  issueYear: number
  description: string | null
}

export interface ResumeData {
  profile: Profile
  workExperiences: WorkExperience[]
  educations: Education[]
  skills: string[]
  licenses: License[]
  languages: Language[]
  achievements: Achievement[]
  publications: Publication[]
  honors: Honor[]
}
