import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { LayoutDashboard, Settings, CreditCard } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-main-background">
      {/* Modern Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-main-background backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                {/* Logo Icon */}
                <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-[#1447E6] to-[#0A2E8C] flex items-center justify-center shadow-lg shadow-[#1447E6]/30 transition-transform group-hover:scale-105">
                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent rounded-xl" />
                  <svg
                    className="w-5 h-5 text-white relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>

                {/* Brand Name */}
                <span className="text-xl font-bold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  ResuméAI
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Dashboard
                </Link>
                <Link
                  id="sidebar-billing"
                  href="/billing"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Billing
                </Link>
                <Link
                  id="sidebar-settings"
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Settings
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {(
                    session.user?.name?.[0] ||
                    session.user?.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {session.user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {session.user?.email}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-8 py-4 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
