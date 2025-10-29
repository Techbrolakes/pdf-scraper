import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserStats } from '@/app/actions/settings-actions'
import { ProfileSection } from '@/components/settings/profile-section'
import { PasswordSection } from '@/components/settings/password-section'
import { AccountSection } from '@/components/settings/account-section'
import { StatsSection } from '@/components/settings/stats-section'
import { SubscriptionSection } from '@/components/settings/subscription-section'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const statsResult = await getUserStats()

  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load user statistics</p>
        </div>
      </div>
    )
  }

  const { name, email, createdAt, totalResumes, credits, planType, hasStripeCustomer } = statsResult.data

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        {/* Usage Statistics */}
        <StatsSection totalResumes={totalResumes} createdAt={createdAt} />

        {/* Subscription & Credits */}
        <SubscriptionSection 
          credits={credits} 
          planType={planType} 
          hasStripeCustomer={hasStripeCustomer}
        />

        {/* Profile Information */}
        <ProfileSection initialName={name} email={email} />

        {/* Change Password */}
        <PasswordSection />

        {/* Account Management */}
        <AccountSection />
      </div>
    </div>
  )
}
