"use client";

import { Carousel } from "@/components/ui/carousel";
import { CurrencyDollarIcon, DocumentIcon, ClockIcon } from "@/components/icons";

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
          <CurrencyDollarIcon
            className={`h-7 w-7 ${
              credits === 0
                ? "text-red-400"
                : credits < 500
                  ? "text-orange-400"
                  : "text-purple-400"
            }`}
          />
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
          <DocumentIcon className="h-7 w-7 text-blue-400" />
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
          <ClockIcon className="h-7 w-7 text-green-400" />
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
