# PDF Scraper - Resume Data Extraction Tool

An AI-powered Next.js application for extracting and managing resume data from PDF files.

## Features

- 🔐 **Authentication**: Secure email/password authentication with NextAuth.js
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
│   │   ├── dashboard/      # Main dashboard
│   │   ├── settings/       # User settings
│   │   └── layout.tsx      # Dashboard layout with nav
│   ├── api/
│   │   └── auth/           # Auth API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects)
├── components/
│   ├── ui/                 # Reusable UI components
│   └── sign-out-button.tsx
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
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

## Next Steps (Phase 2)

- PDF upload functionality
- Resume parsing with AI
- Data extraction and storage
- Resume history management
- Export functionality

## License

MIT
