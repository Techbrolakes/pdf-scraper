# PDF Scraper - Resume Data Extraction Tool

An AI-powered Next.js application for extracting and managing resume data from PDF files.

## Features

- 🔐 **Authentication**: Secure email/password authentication with NextAuth.js
- 📤 **PDF Upload**: Drag-and-drop PDF upload with file validation
- 🤖 **AI-Powered Extraction**: OpenAI GPT-4 and Vision for intelligent data extraction
- 📄 **Text & Image PDFs**: Support for both text-based and image-based resumes
- 📊 **Structured Data**: Extracts profile, experience, education, skills, and more
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🎨 **Modern UI**: Built with TailwindCSS
- 🔔 **Notifications**: Toast notifications with Sonner
- ✅ **Type Safety**: Full TypeScript with strict ENUM validation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **AI**: OpenAI GPT-4o (text & vision)
- **PDF Processing**: pdf-parse, pdf-to-img
- **Styling**: TailwindCSS
- **Form Validation**: Zod + React Hook Form
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pdf_scraper?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key-here"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pdf-scraper/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── (dashboard)/
│   │   ├── dashboard/      # Main dashboard with PDF upload
│   │   ├── settings/       # User settings
│   │   └── layout.tsx      # Dashboard layout with nav
│   ├── api/
│   │   ├── auth/           # Auth API routes
│   │   └── upload/         # PDF upload API route
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects)
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── pdf-upload.tsx      # PDF upload component
│   └── sign-out-button.tsx
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── pdf-utils.ts        # PDF text extraction utilities
│   ├── openai-service.ts   # OpenAI integration (GPT-4 & Vision)
│   ├── pdf-to-image.ts     # PDF to image conversion
│   └── validations/        # Zod schemas
├── prisma/
│   └── schema.prisma       # Database schema
├── types/
│   └── resume.ts           # Resume data types & ENUMs
└── middleware.ts           # Protected routes middleware
```

## Database Schema

### User Model
- Authentication and profile information
- Managed by NextAuth.js

### ResumeHistory Model
- Stores uploaded resume metadata
- Links to User model
- Contains extracted resume data in JSON format

## Authentication

The application uses NextAuth.js v5 with:
- Credentials provider (email/password)
- JWT session strategy
- Prisma adapter for database sessions
- Protected routes via middleware

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply migrations

## Phase 1 Completed ✅

- ✅ Next.js 14+ with TypeScript and App Router
- ✅ NextAuth.js authentication
- ✅ Prisma ORM with PostgreSQL
- ✅ TailwindCSS styling
- ✅ Toast notifications (Sonner)
- ✅ Database schema (User, ResumeHistory)
- ✅ Authentication pages (Login, Register)
- ✅ Protected dashboard layout
- ✅ Basic dashboard with navigation
- ✅ Settings page
- ✅ Protected routes middleware

## Phase 2 Completed ✅

- ✅ PDF upload component with drag-and-drop
- ✅ File validation (type, size, structure)
- ✅ Loading states with progress indicators
- ✅ Toast notifications for all upload states
- ✅ API route for file uploads (`/api/upload`)
- ✅ PDF text extraction using pdf-parse
- ✅ Support for different PDF types:
  - Text-based PDFs: Direct text extraction
  - Image-based PDFs: Detection (OCR in Phase 3)
  - Hybrid PDFs: Combined approach
- ✅ Server-side validation and error handling
- ✅ File metadata storage in database
- ✅ Automatic dashboard refresh after upload

## PDF Upload Implementation Details

### File Size Handling

The application handles files of different sizes efficiently:

- **Files ≤4MB**: Processed directly through the API route
- **Files >4MB**: Use XMLHttpRequest with progress tracking for better user experience
- **Maximum file size**: 10MB (configurable)

### Upload Flow

1. **Client-side validation**:
   - File type check (must be `.pdf`)
   - File size check (max 10MB)
   - Empty file check

2. **Server-side processing**:
   - Authentication verification
   - File validation (type, size, PDF structure)
   - PDF text extraction
   - PDF type detection (text-based, image-based, hybrid)
   - Metadata storage in database

3. **User feedback**:
   - Real-time progress indicators
   - Toast notifications for success/error states
   - Automatic dashboard refresh on success

### PDF Type Detection

The system automatically detects PDF types based on text density:

- **Text-based**: >100 characters per page - Direct text extraction
- **Hybrid**: 10-100 characters per page - Partial text extraction
- **Image-based**: <10 characters per page - Requires OCR (Phase 3)

### Error Handling

Comprehensive error handling for:
- Invalid file types
- Oversized files (>10MB)
- Empty files
- Corrupted PDFs
- Network errors
- Server processing errors

All errors display user-friendly messages via toast notifications.

## Phase 3 Completed ✅

- ✅ OpenAI GPT-4 integration for text-based PDFs
- ✅ OpenAI GPT-4 Vision for image-based PDFs
- ✅ Structured data extraction with exact JSON schema
- ✅ Support for all resume sections:
  - Profile (name, email, headline, summary, etc.)
  - Work experiences with ENUMs (employment type, location type)
  - Education with degree ENUMs
  - Skills array
  - Licenses and certifications
  - Languages with proficiency levels
  - Achievements
  - Publications
  - Honors and awards
- ✅ Robust error handling (rate limits, timeouts, API errors)
- ✅ Processing status indicators
- ✅ Data validation and storage

## OpenAI Integration Details

### Resume Data Extraction

The application uses OpenAI's latest models with structured outputs to extract comprehensive resume data:

**For Text-based PDFs**:
- Uses GPT-4o with structured output
- Extracts text using pdf-parse
- Sends cleaned text to OpenAI
- Returns validated JSON matching exact schema

**For Image-based PDFs**:
- Converts PDF pages to images (max 10 pages)
- Uses GPT-4o Vision API
- Processes images with OCR capabilities
- Returns structured JSON data

**For Hybrid PDFs**:
- Attempts text extraction first
- Falls back to vision processing if needed
- Combines best of both approaches

### Extracted Data Structure

The system extracts the following information:

```typescript
{
  profile: {
    name, surname, email, headline,
    professionalSummary, linkedIn, website,
    country, city, relocation, remote
  },
  workExperiences: [{
    jobTitle, employmentType, locationType,
    company, startMonth, startYear,
    endMonth, endYear, current, description
  }],
  educations: [{
    school, degree, major,
    startYear, endYear, current, description
  }],
  skills: ["JavaScript", "React", ...],
  licenses: [{ name, issuer, issueYear, description }],
  languages: [{ language, level }],
  achievements: [{ title, organization, achieveDate, description }],
  publications: [{ title, publisher, publicationDate, publicationUrl, description }],
  honors: [{ title, issuer, issueMonth, issueYear, description }]
}
```

### ENUM Values

The system enforces strict ENUM values:

- **Employment Type**: FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
- **Location Type**: ONSITE, REMOTE, HYBRID
- **Degree**: HIGH_SCHOOL, ASSOCIATE, BACHELOR, MASTER, DOCTORATE
- **Language Level**: BEGINNER, INTERMEDIATE, ADVANCED, NATIVE

### Error Handling

Comprehensive error handling for:
- ✅ OpenAI API errors
- ✅ Rate limiting (429 errors)
- ✅ Request timeouts
- ✅ Invalid API keys
- ✅ Invalid JSON responses
- ✅ Missing required fields
- ✅ Network failures

All errors return user-friendly messages via toast notifications.

### Processing Flow

1. **Upload PDF** → File validation
2. **Extract Content** → Text or image extraction
3. **Send to OpenAI** → GPT-4 or GPT-4 Vision
4. **Receive Structured JSON** → Validated against schema
5. **Save to Database** → Linked to authenticated user
6. **Success Notification** → User can view results

## Next Steps (Phase 4)

- Resume history management with search/filter
- Detailed resume view page
- Export functionality (JSON, CSV, PDF)
- Bulk upload support
- Resume comparison features

## License

MIT
