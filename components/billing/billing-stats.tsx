"use client";

import { CreditCard, TrendingUp, Calendar } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";

interface BillingStatsProps {
  planType: string;
  credits: number;
  totalResumes: number;
}

export function BillingStats({
  planType,
  credits,
  totalResumes,
}: BillingStatsProps) {
  // Create stat card components
  const planCard = (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CreditCard className="w-7 h-7 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-200">Current Plan</p>
          <p className="text-2xl font-bold text-white capitalize mt-1">
            {planType}
          </p>
        </div>
      </div>
    </div>
  );

  const creditsCard = (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <TrendingUp className="w-7 h-7 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-green-200">
            Available Credits
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {credits.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  const resumesCard = (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Calendar className="w-7 h-7 text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-purple-200">
            Resumes Processed
          </p>
          <p className="text-2xl font-bold text-white mt-1">{totalResumes}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
        {planCard}
        {creditsCard}
        {resumesCard}
      </div>

      {/* Mobile: Horizontal Carousel */}
      <div className="md:hidden">
        <Carousel
          autoScroll={true}
          autoScrollInterval={7000}
          pauseDuration={5000}
          cardWidth={280}
          gap={16}
          showArrows={true}
        >
          {[planCard, creditsCard, resumesCard]}
        </Carousel>
      </div>
    </div>
  );
}
