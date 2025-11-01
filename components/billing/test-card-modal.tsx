"use client";

import { useState } from "react";

export function TestCardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-amber-300 hover:text-amber-200 font-medium text-sm transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        🧪 View Test Cards
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
            <div
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      🧪 Stripe Test Cards
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Demo mode - Use these cards to test payments
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Test Cards */}
              <div className="space-y-4">
                {/* Successful Payment Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-semibold text-white">
                      Successful Payment
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Card Number */}
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">
                        Card Number
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-green-300 font-mono text-sm">
                          4242 4242 4242 4242
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard("4242424242424242", "success-card")
                          }
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                          title="Copy card number"
                        >
                          {copiedField === "success-card" ? (
                            <svg
                              className="w-5 h-5 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Other Details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          Expiry
                        </label>
                        <code className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-green-300 font-mono text-sm">
                          12/34
                        </code>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          CVC
                        </label>
                        <code className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-green-300 font-mono text-sm">
                          123
                        </code>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          ZIP
                        </label>
                        <code className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-green-300 font-mono text-sm">
                          12345
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declined Payment Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-semibold text-white">
                      Test Declined Payment
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Card Number */}
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">
                        Card Number
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-red-300 font-mono text-sm">
                          4000 0000 0000 0002
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard("4000000000000002", "declined-card")
                          }
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                          title="Copy card number"
                        >
                          {copiedField === "declined-card" ? (
                            <svg
                              className="w-5 h-5 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Other Details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          Expiry
                        </label>
                        <code className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-red-300 font-mono text-sm">
                          12/34
                        </code>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          CVC
                        </label>
                        <code className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-red-300 font-mono text-sm">
                          123
                        </code>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">
                          ZIP
                        </label>
                        <code className="block px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-red-300 font-mono text-sm">
                          12345
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-start gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-lg p-3">
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  More test cards available at{" "}
                  <a
                    href="https://stripe.com/docs/testing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    stripe.com/docs/testing
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
