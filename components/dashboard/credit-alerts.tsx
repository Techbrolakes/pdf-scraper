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
              <svg
                className="h-5 w-5 text-orange-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
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
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
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
