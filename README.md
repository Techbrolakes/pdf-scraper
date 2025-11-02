# PDF Scraper - AI-Powered Resume Data Extraction

An enterprise-grade Next.js application for extracting and managing structured resume data from PDF files using OpenAI GPT-4o.

## 🚀 Quick Overview

**PDF Upload Pipeline:**
1. **Upload** → User uploads PDF (max 10MB)
2. **Validate** → Authentication, credits, rate limits, PDF structure
3. **Extract** → pdf2json extracts text (serverless-compatible)
4. **Parse** → GPT-4o extracts structured data (JSON Schema mode)
5. **Store** → Save to PostgreSQL with Prisma
6. **Deduct** → Deduct 100 credits from user account

**Key Highlights:**
- ⚡ **Serverless-First**: 100% compatible with Vercel, Netlify, AWS Lambda
- 🤖 **AI-Powered**: OpenAI GPT-4o with Structured Outputs (guaranteed JSON format)
- 🔒 **Enterprise Security**: NextAuth v5, rate limiting, credit system
- 💳 **Stripe Integration**: Subscription plans with automated billing
- 📊 **Structured Data**: Strict ENUM validation for consistent data
- 🎨 **Modern UI**: 30+ custom components, dark mode, responsive design

## Features

### Core Features
- 🔐 **Authentication**: Email/password + GitHub/Google OAuth with NextAuth.js
- 📤 **PDF Upload**: Drag-and-drop PDF upload with file validation
- 🤖 **AI-Powered Extraction**: OpenAI GPT-4o with Structured Outputs for guaranteed data format
- 📄 **Text-based PDFs**: Serverless-compatible text extraction with pdf2json
- 📊 **Structured Data**: Extracts profile, experience, education, skills, and more
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🎨 **Modern UI**: Built with TailwindCSS
- ✅ **Type Safety**: Full TypeScript with strict ENUM validation

### Additional Features
- 🚨 **Error Handling**: Comprehensive error boundaries and user-friendly error pages
- 🚦 **Rate Limiting**: Database-based rate limiting (10 uploads/hour per user)
- 🔔 **Enhanced Toasts**: Rich notifications with icons and descriptions
- ⏳ **Loading States**: Skeleton loaders and progress indicators
- 📭 **Empty States**: Helpful empty state components with actions
- ♿ **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- ⚡ **Performance**: Code splitting, lazy loading, and performance utilities
- 💰 **Subscription Plans**: Basic ($10/month) and Pro ($20/month) plans
- 🎫 **Credit System**: 100 credits per resume extraction
- 💳 **Stripe Checkout**: Secure hosted checkout flow
- 🔄 **Webhook Handling**: Automated subscription and payment processing
- 📊 **Usage Tracking**: Real-time credit balance display
- ⚠️ **Credit Warnings**: Low credit and no credit alerts
- 🎛️ **Billing Portal**: Manage subscriptions and payment methods
- 🔒 **Payment Security**: PCI-compliant payment processing

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **AI**: OpenAI GPT-4o (text & vision)
- **PDF Processing**: pdf2json (serverless-compatible)
- **Payments**: Stripe (subscriptions & webhooks)
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
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pdf_scraper?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (see NEXTAUTH_SETUP.md for instructions)
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"

# Google OAuth (see NEXTAUTH_SETUP.md for instructions)
GOOGLE_ID="your-google-oauth-client-id"
GOOGLE_SECRET="your-google-oauth-client-secret"

# OpenAI
OPENAI_KEY="your-openai-api-key-here"

# Stripe (Optional - for subscription features)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key-here"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret-here"
STRIPE_PRICE_BASIC="price_basic_plan_id"
STRIPE_PRICE_PRO="price_pro_plan_id"
```

For detailed OAuth setup instructions, see [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md)

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
│   │   ├── login/              # Login page with OAuth
│   │   ├── register/           # Registration page
│   │   ├── forgot-password/    # Password reset flow
│   │   └── layout.tsx          # Auth layout
│   ├── (dashboard)/
│   │   ├── dashboard/          # Main dashboard with PDF upload
│   │   ├── settings/           # User settings & billing
│   │   ├── billing/            # Subscription management
│   │   └── layout.tsx          # Dashboard layout with sidebar
│   ├── api/
│   │   ├── auth/               # NextAuth API routes
│   │   ├── upload/             # PDF upload & processing (route.ts)
│   │   ├── checkout/           # Stripe checkout session
│   │   ├── billing/            # Stripe customer portal
│   │   └── webhooks/stripe/    # Stripe webhook handler
│   ├── actions/
│   │   ├── resume-actions.ts   # Server actions for resumes
│   │   ├── settings-actions.ts # Server actions for settings
│   │   └── tour-actions.ts     # Product tour actions
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # 30+ custom UI components
│   │   ├── button.tsx          # Button with variants
│   │   ├── input.tsx           # Form input
│   │   ├── card.tsx            # Card component
│   │   ├── dialog.tsx          # Modal dialog
│   │   ├── tabs.tsx            # Tabbed interface
│   │   ├── progress.tsx        # Progress bar
│   │   ├── skeleton.tsx        # Loading skeletons
│   │   └── ...                 # 20+ more components
│   ├── layout/
│   │   ├── sidebar.tsx         # Collapsible sidebar
│   │   └── header.tsx          # Dashboard header
│   ├── dashboard/
│   │   ├── stats-cards.tsx     # Dashboard statistics
│   │   └── credit-alerts.tsx   # Credit warnings
│   ├── auth/
│   │   ├── oauth-buttons.tsx   # GitHub/Google OAuth
│   │   └── feature-highlights.tsx
│   ├── billing/
│   │   ├── billing-stats.tsx   # Credit & plan display
│   │   └── test-card-modal.tsx # Test card info
│   └── product-tour.tsx        # Driver.js tour
├── lib/
│   ├── auth.ts                 # NextAuth v5 configuration
│   ├── prisma.ts               # Prisma client singleton
│   ├── rate-limit.ts           # Database-based rate limiting
│   ├── stripe-service.ts       # Stripe integration
│   ├── openai-service.ts       # OpenAI GPT-4o integration
│   ├── pdf/
│   │   └── pdf-extractor.ts    # pdf2json text extraction
│   ├── openai/
│   │   ├── client.ts           # OpenAI client config
│   │   └── resume-parser.ts    # Structured output parser
│   ├── validations/
│   │   ├── auth.ts             # Auth schemas (Zod)
│   │   └── settings.ts         # Settings schemas (Zod)
│   └── utils.ts                # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema with User, ResumeHistory
├── types/
│   ├── resume.ts               # Resume data types & ENUMs
│   └── next-auth.d.ts          # NextAuth type extensions
├── emails/
│   ├── welcome-email.tsx       # Welcome email template
│   └── password-reset-email.tsx # Password reset email
├── scripts/
│   ├── setup-db.sh             # Database setup script
│   └── grant-free-credits.ts   # Admin credit script
└── middleware.ts               # Protected routes & auth
```

### Key Implementation Files

**PDF Processing:**
- `app/api/upload/route.ts` - Main upload endpoint with validation, rate limiting, credit checks
- `lib/pdf/pdf-extractor.ts` - pdf2json integration with event-driven extraction
- `lib/openai-service.ts` - GPT-4o integration with structured outputs
- `lib/openai/resume-parser.ts` - Resume parsing with JSON Schema validation

**Authentication & Authorization:**
- `lib/auth.ts` - NextAuth v5 config (credentials + OAuth)
- `middleware.ts` - Route protection and session management
- `app/api/auth/[...nextauth]/route.ts` - Auth API routes

**Billing & Credits:**
- `lib/stripe-service.ts` - Credit management and Stripe integration
- `app/api/webhooks/stripe/route.ts` - Webhook event handling
- `app/api/checkout/session/route.ts` - Checkout session creation
- `lib/rate-limit.ts` - Upload rate limiting (10/hour)

**Database:**
- `prisma/schema.prisma` - User, ResumeHistory, Account, Session models
- `lib/prisma.ts` - Prisma client with connection pooling

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
- GitHub OAuth provider
- Google OAuth provider
- JWT session strategy
- Prisma adapter for database sessions
- Protected routes via middleware
- Password reset flow

For detailed setup instructions, see [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md)

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


## PDF Upload Implementation Details

### Architecture Overview

The PDF upload system is built with a **serverless-first architecture** using pure JavaScript libraries for maximum compatibility with platforms like Vercel, Netlify, and AWS Lambda.

### Technology Stack

**PDF Processing:**
- **Library**: `pdf2json` (v4.0.0) - Pure JavaScript PDF parser
- **Why pdf2json**: 100% serverless-compatible, no native dependencies (canvas/sharp)
- **Temporary Storage**: `/tmp` directory with UUID-based filenames
- **Cleanup**: Automatic file cleanup with try-finally blocks

**AI Processing:**
- **Model**: OpenAI GPT-4o (gpt-4o-2024-08-06)
- **Structured Outputs**: JSON Schema mode with strict validation
- **Token Limit**: 4096 max tokens per response
- **Temperature**: 0.1 (for consistent extraction)

### Upload Flow (Step-by-Step)

#### 1. **Client-Side Validation**
```typescript
// File type check
if (file.type !== "application/pdf") → Error

// File size check  
if (file.size > 10MB) → Error
if (file.size === 0) → Error
```

#### 2. **Authentication & Authorization**
```typescript
// Check user session
const session = await auth()
if (!session?.user?.id) → 401 Unauthorized
```

#### 3. **Credit Check** (Pre-Processing)
```typescript
// Verify user has enough credits
const hasCredits = await hasEnoughCredits(userId, 100)
if (!hasCredits) → 402 Payment Required
```

#### 4. **Rate Limiting**
```typescript
// Database-based rate limiting
// Default: 10 uploads per hour per user
await checkRateLimit(userId)
if (exceeded) → 429 Too Many Requests (with Retry-After header)
```

#### 5. **PDF Validation**
```typescript
// Validate PDF buffer
- Check PDF signature (%PDF header)
- Verify file size (max 10MB)
- Ensure buffer is not empty
if (invalid) → 400 Bad Request
```

#### 6. **PDF Text Extraction** (Serverless)
```typescript
// Using pdf2json library
1. Write buffer to /tmp/{uuid}.pdf
2. Initialize PDFParser with event listeners
3. Extract text with 30-second timeout
4. Clean and normalize text content
5. Delete temporary file (cleanup)

Result: { success, text, pageCount, metadata }
```

**Text Cleaning Process:**
- Remove excessive whitespace
- Strip special Unicode characters
- Normalize line breaks
- Remove excessive line breaks (>2)
- Trim whitespace

#### 7. **AI Resume Parsing**
```typescript
// Send to OpenAI GPT-4o
- System prompt: Expert resume parser instructions
- User prompt: Extracted text
- Response format: JSON Schema (strict mode)
- Validation: ENUM values enforced

Extracts:
- Profile (name, email, summary, location, etc.)
- Work experiences (with employment/location types)
- Education (with degree levels)
- Skills (array of strings)
- Licenses, languages, achievements, publications, honors
```

#### 8. **Data Validation**
```typescript
// Validate extracted data
- Check required fields (profile, workExperiences, educations)
- Verify data types
- Ensure ENUM values are valid
if (invalid) → 500 Internal Server Error
```

#### 9. **Database Storage**
```typescript
// Save to PostgreSQL via Prisma
await prisma.resumeHistory.create({
  userId: session.user.id,
  fileName: file.name,
  resumeData: {
    pdfType: "text",
    pages: pageCount,
    processingMethod: "text",
    status: "processed",
    resumeData: extractedData,
    metadata: { pages: pageCount }
  }
})
```

#### 10. **Credit Deduction** (Post-Processing)
```typescript
// Deduct credits after successful processing
await deductCredits(userId, 100)
// 100 credits per resume extraction
```

#### 11. **Response**
```typescript
// Return success response
{
  success: true,
  data: {
    id: resumeHistory.id,
    fileName: file.name,
    pdfType: "text",
    pages: pageCount,
    processingMethod: "text",
    status: "processed",
    resumeData: extractedData,
    creditsUsed: 100
  }
}
```

### File Size Handling

- **Maximum file size**: 10MB (enforced at multiple levels)
- **Serverless timeout**: 60 seconds max execution time
- **PDF extraction timeout**: 30 seconds
- **Payload limit**: Configured via Next.js route config

### Error Handling

**Comprehensive error handling at every stage:**

| Error Type | HTTP Status | User Message |
|------------|-------------|--------------|
| No authentication | 401 | "Unauthorized" |
| Insufficient credits | 402 | "Insufficient credits. Please subscribe..." |
| Rate limit exceeded | 429 | "Rate limit exceeded. Try again in X minutes" |
| Invalid file type | 400 | "Only PDF files are allowed" |
| File too large | 400 | "File size exceeds 10MB limit" |
| Empty file | 400 | "File is empty" |
| Invalid PDF structure | 400 | "Invalid PDF file" |
| No text extracted | 500 | "No meaningful text content found" |
| OpenAI rate limit | 429 | "OpenAI rate limit exceeded" |
| Processing timeout | 504 | "Processing timed out" |
| Invalid API key | 500 | "Server configuration error" |
| Generic error | 500 | "An unexpected error occurred" |

**Error Response Format:**
```json
{
  "success": false,
  "error": "User-friendly error message",
  "insufficientCredits": true, // Optional flag
  "retryAfter": 3600 // Optional (for rate limiting)
}
```

### Rate Limiting Details

**Configuration:**
- **Limit**: 10 uploads per hour per user
- **Window**: Rolling 1-hour window
- **Storage**: Database-based (ResumeHistory table)
- **Headers**: Includes `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`

**Implementation:**
```typescript
// Count uploads in last hour
const uploadCount = await prisma.resumeHistory.count({
  where: {
    userId,
    uploadedAt: { gte: windowStart }
  }
})

if (uploadCount >= 10) {
  // Calculate retry time from oldest upload
  const retryAfter = Math.ceil(
    (oldestUpload.uploadedAt + 1hour - now) / 1000
  )
  throw new RateLimitError(message, retryAfter)
}
```

### Serverless Compatibility

**Why Serverless-Compatible?**
- No native dependencies (canvas, sharp, pdfjs-dist)
- Pure JavaScript implementation
- Works on Vercel, Netlify, AWS Lambda, Cloudflare Workers
- No webpack configuration needed
- No build-time compilation required

**Previous Challenges (Solved):**
- ❌ `pdfjs-dist` → Required canvas (native dependency)
- ❌ `pdf-parse` → Limited text extraction
- ❌ `sharp` → Native image processing
- ✅ `pdf2json` → Pure JavaScript, event-driven, reliable

**Deployment Configuration:**
```typescript
// app/api/upload/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60 // 60 seconds
```

### Performance Metrics

**Typical Processing Times:**
- PDF validation: <100ms
- Text extraction: 500ms - 3s (depending on PDF size)
- OpenAI parsing: 2s - 8s (depending on content length)
- Database storage: <200ms
- **Total**: ~3-12 seconds per resume

**Resource Usage:**
- Memory: ~50-150MB per request
- Temporary storage: PDF file size (deleted after processing)
- Database: ~5-50KB per resume record


## OpenAI Integration Details

### Resume Data Extraction

The application uses OpenAI GPT-4o with **Structured Outputs** (JSON Schema mode) to extract comprehensive resume data with guaranteed format compliance.

**Model Configuration:**
- **Model**: `gpt-4o-2024-08-06` (latest GPT-4o with structured outputs)
- **Response Format**: JSON Schema with `strict: true`
- **Temperature**: 0.1 (for consistent, deterministic extraction)
- **Max Tokens**: 4096
- **Timeout**: Configurable (default: 60s)

**Processing Method:**
- Extracts text from PDF using pdf2json
- Sends cleaned text to OpenAI with expert system prompt
- Receives structured JSON matching exact schema
- Validates ENUM values and required fields
- Returns validated ResumeData object

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

### ENUM Values (Strictly Enforced)

The JSON Schema enforces these exact ENUM values:

| Field | Allowed Values |
|-------|----------------|
| **employmentType** | `FULL_TIME`, `PART_TIME`, `INTERNSHIP`, `CONTRACT` |
| **locationType** | `ONSITE`, `REMOTE`, `HYBRID` |
| **degree** | `HIGH_SCHOOL`, `ASSOCIATE`, `BACHELOR`, `MASTER`, `DOCTORATE` |
| **languageLevel** | `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `NATIVE` |

**Why Strict ENUMs?**
- Ensures data consistency across all resumes
- Enables reliable filtering and searching
- Prevents typos and variations
- Simplifies frontend rendering logic

### System Prompt Strategy

The system uses a carefully crafted prompt to guide GPT-4o:

**Key Instructions:**
1. Extract ALL available information from the resume
2. Use exact ENUM values (no variations)
3. Use `null` for missing single values, `[]` for missing arrays
4. Format dates correctly (numeric months 1-12, 4-digit years)
5. Set `current: true` for ongoing positions/education
6. Extract skills as array of strings
7. Be thorough with licenses, languages, achievements, publications, honors

**Prompt Engineering:**
```typescript
const SYSTEM_PROMPT = `You are an expert resume parser. Extract ALL information 
from the resume and return it in the exact JSON format specified.

IMPORTANT INSTRUCTIONS:
1. Extract ALL available information from the resume
2. Use the exact ENUM values provided (e.g., FULL_TIME, REMOTE, BACHELOR, ADVANCED)
3. For missing fields, use null for single values or empty arrays [] for lists
...
Return ONLY valid JSON matching the ResumeData schema.`
```

### Structured Outputs (JSON Schema Mode)

**Why JSON Schema Mode?**
- **Guaranteed Format**: OpenAI ensures response matches schema exactly
- **No Parsing Errors**: Valid JSON guaranteed (no markdown, no explanations)
- **Type Safety**: All fields match TypeScript types
- **ENUM Enforcement**: Only allowed values are returned
- **Required Fields**: All required fields are always present

**Schema Configuration:**
```typescript
response_format: {
  type: "json_schema",
  json_schema: {
    name: "resume_extraction",
    strict: true,  // Enforces exact schema compliance
    schema: RESUME_SCHEMA
  }
}
```

### Error Handling

**OpenAI-Specific Errors:**
- ✅ Rate limiting (429) → "OpenAI rate limit exceeded. Try again in a moment."
- ✅ Timeout errors → "Request timed out. Please try again."
- ✅ Invalid API key → "OpenAI API key is invalid."
- ✅ No response → "No response from OpenAI"
- ✅ Invalid JSON → Caught by structured outputs (shouldn't happen)

**Data Validation Errors:**
- ✅ Missing required fields (profile, workExperiences, educations)
- ✅ Invalid data types
- ✅ Invalid ENUM values
- ✅ Malformed resume data

All errors return user-friendly messages via toast notifications.

### Cost Optimization

**Pricing (as of 2024):**
- GPT-4o: ~$0.005 per 1K input tokens, ~$0.015 per 1K output tokens
- Average resume: ~2K input tokens, ~1K output tokens
- **Cost per resume**: ~$0.025 (2.5 cents)

**Optimization Strategies:**
1. Text extraction only (no expensive Vision API)
2. Low temperature (0.1) for faster responses
3. Token limit (4096) to prevent excessive costs
4. Efficient text cleaning to reduce input tokens
5. Structured outputs to eliminate retry costs


## Dashboard Features

### Quick Stats
- **Total Resumes**: Count of all processed resumes
- **Most Recent**: Date of latest upload
- **Upload Area**: Quick access to PDF upload

### Resume History
- **Search**: Filter resumes by filename
- **Sort**: Order by newest or oldest first
- **Pagination**: Navigate through large lists (10 per page)
- **View Details**: Click to see full extracted data
- **Delete**: Remove resumes with confirmation

### Resume Detail Modal
- **Tabbed Interface**: Profile, Experience, Education, Other
- **Profile Section**: Personal info, summary, skills
- **Experience Section**: Timeline view of work history
- **Education Section**: Academic background
- **Other Section**: Licenses, languages, achievements, publications, honors
- **Export Options**: Download JSON or copy to clipboard


## Settings Page Features

### Profile Management
- **Update Display Name**: Change your name with validation
- **Email Display**: View email (read-only)
- **Form Validation**: Real-time validation with error messages

### Password Management
- **Change Password**: Update password with current password verification
- **Password Strength**: Enforced requirements (8+ chars, uppercase, lowercase, number)
- **Show/Hide Toggle**: Toggle password visibility
- **Confirmation Matching**: Ensures new password matches confirmation

### Account Management
- **Sign Out**: Sign out from current device
- **Delete Account**: Permanently delete account with all data
- **Cascade Deletion**: Automatically removes all resume history
- **Password Confirmation**: Requires password to delete
- **Type Confirmation**: Must type "DELETE" to confirm
- **Warning Messages**: Clear warnings about data loss

### Usage Statistics
- **Total Resumes**: Count of processed resumes
- **Account Created**: Account creation date
- **Days Active**: Number of days since account creation
- **Visual Stats**: Color-coded stat cards

## Stripe Integration Setup

### Overview

The application includes a complete subscription and credit system using Stripe. Users can subscribe to plans that provide credits for resume processing.

### Subscription Plans

- **FREE**: 0 credits (default for new users)
- **BASIC**: $10/month - 10,000 credits (~100 resume extractions)
- **PRO**: $20/month - 20,000 credits (~200 resume extractions)

Each resume extraction costs **100 credits**.

### Stripe Setup Instructions

#### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Switch to **Test Mode** (toggle in top right)

#### 2. Get API Keys

1. Navigate to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to your `.env` file:

```env
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_PUBLIC_KEY="pk_test_your_key_here"
```

#### 3. Create Subscription Products

1. Go to **Products** → **Add Product**
2. Create two products:

**Basic Plan:**
- Name: "Basic Plan"
- Description: "10,000 credits per month"
- Pricing: $10.00 USD / month (recurring)
- Copy the **Price ID** (starts with `price_`)

**Pro Plan:**
- Name: "Pro Plan"
- Description: "20,000 credits per month"
- Pricing: $20.00 USD / month (recurring)
- Copy the **Price ID** (starts with `price_`)

3. Add the Price IDs to your `.env`:

```env
STRIPE_PRICE_BASIC="price_1234567890"
STRIPE_PRICE_PRO="price_0987654321"
```

#### 4. Set Up Webhooks

Webhooks are required for automated subscription management.

**For Local Development (using Stripe CLI):**

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases
```

2. Login to Stripe CLI:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET="whsec_your_secret_here"
```

**For Production:**

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen to:
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
4. Copy the **Signing secret** and add to production environment variables

#### 5. Test the Integration

**Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

**Testing Flow:**

1. Start your development server:
```bash
npm run dev
```

2. In another terminal, start Stripe webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Register/login to your app
4. Go to Settings page
5. Click "Subscribe to Basic Plan" or "Subscribe to Pro Plan"
6. Complete checkout with test card `4242 4242 4242 4242`
7. Verify:
   - Credits are added to your account
   - Plan type is updated
   - You can process resumes

**Test Webhook Events:**

```bash
# Test successful payment
stripe trigger invoice.paid

# Test subscription cancellation
stripe trigger customer.subscription.deleted
```

### Credit System Integration

The credit system is automatically integrated with resume processing:

1. **Before Processing**: Checks if user has ≥100 credits
2. **If Insufficient**: Returns 402 error with message to subscribe
3. **After Success**: Deducts 100 credits from user's balance
4. **Dashboard Display**: Shows credit balance with color-coded warnings

**Credit Warnings:**
- **Green** (≥500 credits): Normal operation
- **Orange** (<500 credits): Low credit warning
- **Red** (0 credits): No credits - processing blocked

### Database Schema Changes

The User model now includes:

```prisma
model User {
  // ... existing fields
  credits               Int       @default(0)
  planType              PlanType  @default(FREE)
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique
}

enum PlanType {
  FREE
  BASIC
  PRO
}
```

Run migration after pulling:
```bash
npx prisma generate
npx prisma db push
```

### API Routes

**Checkout Session:**
- `POST /api/checkout/session` - Create Stripe checkout session

**Billing Portal:**
- `POST /api/billing/portal` - Access Stripe customer portal

**Webhooks:**
- `POST /api/webhooks/stripe` - Handle Stripe webhook events

### Features

#### Settings Page
- View current plan and credit balance
- Subscribe to Basic or Pro plan
- Upgrade/downgrade plans
- Manage billing via Stripe Customer Portal
- Cancel subscription

#### Dashboard
- Credit balance display with plan type
- Color-coded credit warnings
- Low credit alerts (<500 credits)
- No credit alerts (0 credits)
- Links to settings for subscription

#### Resume Processing
- Pre-processing credit check
- Automatic credit deduction after success
- Insufficient credit error handling
- Credit usage tracking

### Webhook Events Handled

- `invoice.paid` - Add credits when subscription payment succeeds
- `invoice.payment_failed` - Log payment failures
- `customer.subscription.updated` - Update plan when subscription changes
- `customer.subscription.deleted` - Downgrade to FREE when cancelled
- `checkout.session.completed` - Log successful checkouts

### Troubleshooting

**Webhook not receiving events:**
- Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check webhook signing secret matches `.env`
- Verify endpoint URL is correct

**Credits not added after payment:**
- Check webhook logs in Stripe Dashboard
- Verify Price IDs match in `.env`
- Check server logs for errors

**Checkout session fails:**
- Verify API keys are correct
- Ensure Price IDs exist in Stripe
- Check NEXTAUTH_URL is set correctly

**Production deployment:**
- Add webhook endpoint in Stripe Dashboard
- Use production API keys (starts with `pk_live_` and `sk_live_`)
- Set all environment variables in production
- Test with real card in test mode first
## License

MIT
