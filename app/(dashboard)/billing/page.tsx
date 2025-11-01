import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserStats } from "@/app/actions/settings-actions";
import { SubscriptionSection } from "@/components/settings/subscription-section";
import { CreditCard, TrendingUp, Calendar } from "lucide-react";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const statsResult = await getUserStats();

  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load billing information</p>
        </div>
      </div>
    );
  }

  const { credits, planType, hasStripeCustomer, totalResumes } =
    statsResult.data;

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="mt-2 text-gray-400">
          Manage your subscription, credits, and billing information
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Plan */}
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

        {/* Available Credits */}
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-200">Available Credits</p>
              <p className="text-2xl font-bold text-white mt-1">{credits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Resumes Processed */}
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Resumes Processed</p>
              <p className="text-2xl font-bold text-white mt-1">{totalResumes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="space-y-6">
        <SubscriptionSection
          credits={credits}
          planType={planType}
          hasStripeCustomer={hasStripeCustomer}
        />
      </div>
    </div>
  );
}
