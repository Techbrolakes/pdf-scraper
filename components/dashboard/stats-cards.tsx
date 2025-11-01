"use client";

import { Carousel } from "@/components/ui/carousel";

interface StatsCardsProps {
  credits: number;
  planType: string;
  resumeCount: number;
  recentUploadDate: string | null;
}

export function StatsCards({
  credits,
  planType,
  resumeCount,
  recentUploadDate,
}: StatsCardsProps) {
  // Create stat card components
  const creditsCard = (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
            credits === 0
              ? "bg-red-500/20"
              : credits < 500
                ? "bg-orange-500/20"
                : "bg-purple-500/20"
          }`}
        >
          <svg
            className={`h-7 w-7 ${
              credits === 0
                ? "text-red-400"
                : credits < 500
                  ? "text-orange-400"
                  : "text-purple-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-purple-200 truncate">
            Credits ({planType})
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              credits === 0
                ? "text-red-400"
                : credits < 500
                  ? "text-orange-400"
                  : "text-white"
            }`}
          >
            {credits.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  const resumesCard = (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg
            className="h-7 w-7 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-200 truncate">
            Total Resumes
          </p>
          <p className="text-2xl font-bold text-white mt-1">{resumeCount}</p>
        </div>
      </div>
    </div>
  );

  const recentCard = (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg
            className="h-7 w-7 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-200 truncate">
            Most Recent
          </p>
          <p className="text-lg font-bold text-white mt-1 truncate">
            {recentUploadDate || "No uploads yet"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Desktop: Grid Layout */}
      <div className="hidden lg:grid grid-cols-1 gap-6 lg:grid-cols-3">
        {creditsCard}
        {resumesCard}
        {recentCard}
      </div>

      {/* Mobile: Horizontal Carousel */}
      <div className="lg:hidden">
        <Carousel
          autoScroll={true}
          autoScrollInterval={7000}
          pauseDuration={5000}
          cardWidth={280}
          gap={16}
          showArrows={true}
        >
          {[creditsCard, resumesCard, recentCard]}
        </Carousel>
      </div>
    </div>
  );
}
