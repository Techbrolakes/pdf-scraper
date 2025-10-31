import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import NextTopLoader from "nextjs-toploader";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";
import { satoshi } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: "ResuméAI - AI-Powered Resume Data Extraction",
    template: "%s | ResuméAI",
  },
  description: "Extract resume data with AI-powered precision. Lightning fast, secure, and intelligent resume parsing for modern recruiters.",
  keywords: [
    "resume parser",
    "AI resume extraction",
    "resume data extraction",
    "CV parser",
    "recruitment AI",
    "resume scraper",
    "OpenAI",
    "GPT-4",
  ],
  authors: [{ name: "ResuméAI Team" }],
  creator: "ResuméAI",
  publisher: "ResuméAI",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1447E6",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resumeai.app",
    title: "ResuméAI - AI-Powered Resume Data Extraction",
    description: "Extract resume data with AI-powered precision. Lightning fast, secure, and intelligent resume parsing.",
    siteName: "ResuméAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResuméAI - AI-Powered Resume Data Extraction",
    description: "Extract resume data with AI-powered precision. Lightning fast, secure, and intelligent resume parsing.",
    creator: "@resumeai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} antialiased bg-background min-h-screen font-sans`}
      >
        <NextTopLoader
          color="#1447E6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1447E6,0 0 5px #1447E6"
        />
        
        <LenisProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </LenisProvider>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              padding: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
