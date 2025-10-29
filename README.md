# PDF Scraper - Resume Data Extraction Tool

An AI-powered Next.js application for extracting and managing resume data from PDF files.

## Features

- 🔐 **Authentication**: Secure email/password authentication with NextAuth.js
- 📤 **PDF Upload**: Drag-and-drop PDF upload with file validation
- 📄 **Text Extraction**: Automatic text extraction from text-based PDFs
- 📊 **Dashboard**: View and manage uploaded resumes
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🎨 **Modern UI**: Built with TailwindCSS
- 🔔 **Notifications**: Toast notifications with Sonner

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **PDF Processing**: pdf-parse
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
│   └── validations/        # Zod schemas
├── prisma/
│   └── schema.prisma       # Database schema
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

## Next Steps (Phase 3)

- AI-powered resume parsing with OpenAI
- OCR support for image-based PDFs
- Structured data extraction (name, email, skills, experience)
- Resume history management with search/filter
- Export functionality (JSON, CSV)

## License

MIT
