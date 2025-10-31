"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/forms";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to reset password");
        return;
      }

      setResetSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Password reset successful!
          </h1>

          <p className="text-gray-400 mb-8">
            Your password has been reset. Redirecting you to sign in...
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Go to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#1447E6] to-[#0A2E8C] mb-6 shadow-lg shadow-[#1447E6]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent animate-pulse" />
            <svg
              className="w-8 h-8 text-white relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-gradient">
            Set new password
          </h1>

          <p className="text-gray-400 text-base">
            Choose a strong password for your account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput
              register={register("password")}
              error={errors.password?.message}
              label="New Password"
              autoComplete="new-password"
            />

            <PasswordInput
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              label="Confirm Password"
              autoComplete="new-password"
              id="confirmPassword"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
