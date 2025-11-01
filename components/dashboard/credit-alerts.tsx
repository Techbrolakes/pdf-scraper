import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@/components/icons';

interface CreditAlertsProps {
  credits: number;
}

export function CreditAlerts({ credits }: CreditAlertsProps) {
  return (
    <>
      {/* Low Credits Warning */}
      {credits < 500 && credits > 0 && (
        <div className="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-300">
                Low Credits Warning
              </h3>
              <p className="mt-1 text-sm text-orange-200/80">
                You have {credits.toLocaleString()} credits remaining. Consider
                upgrading your plan in{" "}
                <a
                  href="/billing"
                  className="font-semibold underline hover:text-orange-100 transition-colors"
                >
                  Billing
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Credits Warning */}
      {credits === 0 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-300">
                No Credits Remaining
              </h3>
              <p className="mt-1 text-sm text-red-200/80">
                You have no credits left. Subscribe to a plan in{" "}
                <a
                  href="/billing"
                  className="font-semibold underline hover:text-red-100 transition-colors"
                >
                  Billing
                </a>{" "}
                to continue processing resumes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
