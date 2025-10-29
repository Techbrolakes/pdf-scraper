import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Scraper - Extract Resume Data",
  description: "AI-powered PDF resume scraper and data extraction tool",
  keywords: ["PDF", "resume", "scraper", "AI", "data extraction", "OpenAI"],
  authors: [{ name: "PDF Scraper Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              padding: '16px',
            },
          }}
        />
      </body>
    </html>
  );
}
