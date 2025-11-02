"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deleteAccountSchema,
  type DeleteAccountInput,
} from "@/lib/validations/settings";
import { deleteAccount } from "@/app/actions/settings-actions";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AccountSection() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const onDeleteSubmit = async (data: DeleteAccountInput) => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount(data);
      if (result.success) {
        toast.success("Account deleted successfully");
        // Sign out and redirect
        await signOut({ redirect: false });
        router.push("/login");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4 sm:mb-6">
          Account Management
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {/* Sign Out */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex-1">
              <h3 className="font-medium text-white">Sign Out</h3>
              <p className="text-sm text-gray-400 mt-1">
                Sign out of your account on this device
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 border border-red-500/20 bg-red-500/10 rounded-xl hover:border-red-500/30 transition-all">
            <div className="flex-1">
              <h3 className="font-medium text-red-400">Delete Account</h3>
              <p className="text-sm text-red-300/80 mt-1">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />
            <div
              className="relative bg-[#0a0a0a] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start sm:items-center gap-3 mb-4">
                <div className="shrink-0 w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Delete Account
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-red-400 font-medium mb-2">
                  Warning: This will permanently:
                </p>
                <ul className="text-sm text-red-300/80 space-y-1 ml-4 list-disc">
                  <li>Delete your account</li>
                  <li>Delete all your uploaded resumes</li>
                  <li>Delete all extracted resume data</li>
                  <li>Remove all your personal information</li>
                </ul>
              </div>

              <form
                onSubmit={handleSubmit(onDeleteSubmit)}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmation"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Type{" "}
                    <span className="font-mono font-bold text-red-400">
                      DELETE
                    </span>{" "}
                    to confirm
                  </label>
                  <input
                    {...register("confirmation")}
                    type="text"
                    id="confirmation"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="DELETE"
                  />
                  {errors.confirmation && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.confirmation.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteDialog(false);
                      reset();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
