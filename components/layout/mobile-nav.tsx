"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, CreditCard } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-main-background shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-3 h-16 max-w-md mx-auto">
        {/* Dashboard Tab */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-1 transition-colors group ${
            pathname === "/dashboard"
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>

        {/* Billing Tab */}
        <Link
          href="/billing"
          className={`flex flex-col items-center justify-center gap-1 transition-colors group ${
            pathname === "/billing"
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Billing</span>
        </Link>

        {/* Settings Tab */}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center gap-1 transition-colors group ${
            pathname === "/settings"
              ? "text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </div>
    </nav>
  );
}
