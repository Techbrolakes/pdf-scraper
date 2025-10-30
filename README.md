# PDF Scraper - Resume Data Extraction Tool

An AI-powered Next.js application for extracting and managing resume data from PDF files.

## Features

### Core Features
- 🔐 **Authentication**: Secure email/password authentication with NextAuth.js
- 📤 **PDF Upload**: Drag-and-drop PDF upload with file validation
- 🤖 **AI-Powered Extraction**: OpenAI GPT-4 and Vision for intelligent data extraction
- 📄 **Text & Image PDFs**: Support for both text-based and image-based resumes
- 📊 **Structured Data**: Extracts profile, experience, education, skills, and more
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🎨 **Modern UI**: Built with TailwindCSS
- ✅ **Type Safety**: Full TypeScript with strict ENUM validation

### Phase 6 Enhancements ✨
- 🚨 **Error Handling**: Comprehensive error boundaries and user-friendly error pages
- 🚦 **Rate Limiting**: Database-based rate limiting (10 uploads/hour per user)
- 🔔 **Enhanced Toasts**: Rich notifications with icons and descriptions
- ⏳ **Loading States**: Skeleton loaders and progress indicators
- 📭 **Empty States**: Helpful empty state components with actions
- ♿ **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- ⚡ **Performance**: Code splitting, lazy loading, and performance utilities
- 📚 **Documentation**: Comprehensive guides and usage examples

### Phase 7 - Stripe Integration (NEW! 💳)
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
- **PDF Processing**: pdf-parse, pdf-to-img
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
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pdf_scraper?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# Stripe (Optional - for subscription features)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key-here"
STRIPE_PUBLIC_KEY="pk_test_your-stripe-public-key-here"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret-here"
STRIPE_PRICE_BASIC="price_basic_plan_id"
STRIPE_PRICE_PRO="price_pro_plan_id"
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

## Phase 4 Completed ✅

- ✅ Complete dashboard with stats and quick actions
- ✅ Resume history list with search and filtering
- ✅ Sort by date (newest/oldest)
- ✅ Pagination (10 items per page)
- ✅ Detailed resume view modal with tabs
- ✅ Display all extracted data (profile, experience, education, etc.)
- ✅ Download as JSON functionality
- ✅ Copy data to clipboard
- ✅ Delete functionality with confirmation dialog
- ✅ Loading skeletons for better UX
- ✅ Empty states
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions

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

## Phase 5 Completed ✅

- ✅ Complete settings page with sections
- ✅ Profile information update
- ✅ Change password functionality
- ✅ Account deletion with cascade
- ✅ Usage statistics display
- ✅ Form validation with Zod
- ✅ Password strength requirements
- ✅ Confirmation dialogs
- ✅ Toast notifications
- ✅ Server actions for all operations

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

## Phase 6 Documentation

Phase 6 has been completed with comprehensive error handling, loading states, and UI polish. See detailed documentation:

- 📖 [**Phase 6 Summary**](./PHASE6_SUMMARY.md) - Complete overview of all improvements
- 📋 [**Phase 6 Improvements**](./PHASE6_IMPROVEMENTS.md) - Detailed feature documentation
- 💡 [**Quick Reference**](./QUICK_REFERENCE.md) - Developer quick reference card
- 📚 [**Usage Examples**](./docs/USAGE_EXAMPLES.md) - Code examples and patterns
- 🔄 [**Migration Guide**](./docs/MIGRATION_GUIDE.md) - How to update existing code
- 🧪 [**Testing Guide**](./docs/TESTING_GUIDE.md) - Comprehensive testing procedures

### Quick Start with Phase 6 Features

```typescript
// Enhanced toast notifications
import { toast } from '@/lib/toast'
toast.success('Upload complete!')
toast.error('Upload failed', { description: 'Please try again' })

// Button with loading state
import { Button } from '@/components/ui/button'
<Button isLoading={uploading} loadingText="Uploading...">Upload</Button>

// Error boundary
import { ErrorBoundary } from '@/components/error-boundary'
<ErrorBoundary><YourComponent /></ErrorBoundary>

// Check rate limit
const res = await fetch('/api/rate-limit')
const { data } = await res.json()
console.log(`${data.remaining} uploads remaining`)
```

## Phase 7: Stripe Integration Setup

### Overview

Phase 7 adds a complete subscription and credit system using Stripe. Users can subscribe to plans that provide credits for resume processing.

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

### Security Notes

- Never commit `.env` file with real API keys
- Use test mode for development
- Webhook signatures are verified automatically
- All payment processing happens on Stripe's secure servers
- No credit card data is stored in your database

## Future Enhancements

- Advanced analytics dashboard
- Resume comparison features
- Bulk upload support
- Export to PDF/CSV formats
- Email notifications
- API access for integrations
- Redis-based rate limiting
- Error tracking service integration (Sentry)
- Progressive Web App features
- Internationalization support
- One-time credit purchases
- Team/organization plans
- Usage analytics and reporting

## License

MIT
