import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserStats } from "@/app/actions/settings-actions";
import { SubscriptionSection } from "@/components/settings/subscription-section";
import { BillingStats } from "@/components/billing/billing-stats";

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
        <h1 className="text-3xl font-bold text-white">
          Billing & Subscription
        </h1>
        <p className="mt-2 text-gray-400">
          Manage your subscription, credits, and billing information
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <BillingStats
          planType={planType}
          credits={credits}
          totalResumes={totalResumes}
        />
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
