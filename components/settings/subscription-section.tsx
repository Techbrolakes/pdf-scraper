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
        return 'bg-purple-100 text-purple-800';
      case 'BASIC':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCreditColor = () => {
    if (credits === 0) return 'text-red-600';
    if (credits < 500) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Subscription & Credits
        </h3>
        <div className="mt-5 space-y-6">
          {/* Current Plan */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Current Plan</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor()}`}
                >
                  {planType}
                </span>
              </div>
            </div>
          </div>

          {/* Credit Balance */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Credit Balance</p>
              <p className={`mt-1 text-2xl font-bold ${getCreditColor()}`}>
                {credits.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                100 credits per resume extraction
              </p>
            </div>
          </div>

          {/* Low Credits Warning */}
          {credits < 500 && credits > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                ⚠️ Your credits are running low. Consider upgrading your plan to continue processing resumes.
              </p>
            </div>
          )}

          {/* No Credits Warning */}
          {credits === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ❌ You have no credits remaining. Subscribe to a plan to continue processing resumes.
              </p>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Available Plans
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Plan */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-lg font-semibold text-gray-900">Basic</h5>
                <p className="mt-2 text-3xl font-bold text-gray-900">$10</p>
                <p className="text-sm text-gray-500">per month</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      10,000 credits/month
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      ~100 resume extractions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      Priority support
                    </span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('BASIC')}
                  disabled={isLoading || planType === 'BASIC' || planType === 'PRO'}
                  className="w-full mt-4"
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
              <div className="border-2 border-purple-500 rounded-lg p-4 relative">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  BEST VALUE
                </div>
                <h5 className="text-lg font-semibold text-gray-900">Pro</h5>
                <p className="mt-2 text-3xl font-bold text-gray-900">$20</p>
                <p className="text-sm text-gray-500">per month</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      20,000 credits/month
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      ~200 resume extractions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      Premium support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">
                      Advanced features
                    </span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('PRO')}
                  disabled={isLoading || planType === 'PRO'}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  variant={planType === 'PRO' ? 'outline' : 'default'}
                >
                  {planType === 'PRO' ? 'Current Plan' : 'Subscribe'}
                </Button>
              </div>
            </div>
          </div>

          {/* Manage Billing */}
          {hasStripeCustomer && planType !== 'FREE' && (
            <div className="border-t border-gray-200 pt-6">
              <Button
                onClick={handleManageBilling}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Manage Billing & Subscription
              </Button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Update payment method, view invoices, or cancel subscription
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
