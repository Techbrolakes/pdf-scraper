'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SubscriptionSectionProps {
  credits: number;
  planType: 'FREE' | 'BASIC' | 'PRO';
  hasStripeCustomer: boolean;
}

export function SubscriptionSection({
  credits,
  planType,
  hasStripeCustomer,
}: SubscriptionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (plan: 'BASIC' | 'PRO') => {
    setIsLoading(true);
    try {
      const priceId =
        plan === 'BASIC'
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO;

      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planType: plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to start subscription'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create billing portal session');
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to open billing portal'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanBadgeColor = () => {
    switch (planType) {
      case 'PRO':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'BASIC':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCreditColor = () => {
    if (credits === 0) return 'text-red-400';
    if (credits < 500) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">
        Subscription & Credits
      </h3>
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-400">Current Plan</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${getPlanBadgeColor()}`}
              >
                {planType}
              </span>
            </div>
          </div>
        </div>

        {/* Credit Balance */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-sm font-medium text-gray-400">Credit Balance</p>
          <p className={`mt-2 text-3xl font-bold ${getCreditColor()}`}>
            {credits.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            100 credits per resume extraction
          </p>
        </div>

        {/* Low Credits Warning */}
        {credits < 500 && credits > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
            <p className="text-sm text-orange-300 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              Your credits are running low. Consider upgrading your plan to continue processing resumes.
            </p>
          </div>
        )}

        {/* No Credits Warning */}
        {credits === 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-sm text-red-300 flex items-center gap-2">
              <span className="text-lg">❌</span>
              You have no credits remaining. Subscribe to a plan to continue processing resumes.
            </p>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-sm font-semibold text-white mb-6">
            Available Plans
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <h5 className="text-xl font-bold text-white">Basic</h5>
              <div className="mt-4">
                <p className="text-4xl font-bold text-white">$10</p>
                <p className="text-sm text-gray-400 mt-1">per month</p>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    10,000 credits/month
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    ~100 resume extractions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    Priority support
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe('BASIC')}
                disabled={isLoading || planType === 'BASIC' || planType === 'PRO'}
                className="w-full mt-6 h-11 cursor-pointer"
                variant={planType === 'BASIC' ? 'outline' : 'default'}
              >
                {planType === 'BASIC'
                  ? 'Current Plan'
                  : planType === 'PRO'
                  ? 'Downgrade'
                  : 'Subscribe'}
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="group relative bg-linear-to-br from-purple-500/10 to-purple-600/5 border-2 border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute -top-3 right-6 bg-linear-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                BEST VALUE
              </div>
              <h5 className="text-xl font-bold text-white">Pro</h5>
              <div className="mt-4">
                <p className="text-4xl font-bold bg-linear-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">$20</p>
                <p className="text-sm text-gray-400 mt-1">per month</p>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    20,000 credits/month
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    ~200 resume extractions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    Premium support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-lg shrink-0">✓</span>
                  <span className="text-sm text-gray-300">
                    Advanced features
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe('PRO')}
                disabled={isLoading || planType === 'PRO'}
                className="w-full mt-6 h-11 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                variant={planType === 'PRO' ? 'outline' : 'default'}
              >
                {planType === 'PRO' ? 'Current Plan' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>

        {/* Manage Billing */}
        {hasStripeCustomer && planType !== 'FREE' && (
          <div className="border-t border-white/10 pt-6">
            <Button
              onClick={handleManageBilling}
              disabled={isLoading}
              variant="outline"
              className="w-full h-11 cursor-pointer border-white/20 hover:bg-white/10"
            >
              Manage Billing & Subscription
            </Button>
            <p className="mt-3 text-xs text-gray-500 text-center">
              Update payment method, view invoices, or cancel subscription
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
