"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { triggerConfetti } from "@/components/ui/confetti";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { EmailInput, PasswordInput, NameInput } from "@/components/forms";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      // Trigger confetti celebration
      triggerConfetti(3000);

      toast.success("🎉 Welcome to ResuméAI!", {
        description: "Your account has been created successfully",
        duration: 4000,
      });

      // Redirect after confetti animation
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

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Logo - AI Brain with Document */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#1447E6] to-[#0A2E8C] mb-6 shadow-lg shadow-[#1447E6]/30 relative overflow-hidden">
            {/* Animated gradient overlay */}
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

          {/* Title with gradient */}
          <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-gradient">
            Join ResuméAI
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-base mb-2">
            Start extracting resume data in seconds
          </p>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mt-4">
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Trusted by recruiters • Start in 30 seconds</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <NameInput
              register={register("name")}
              error={errors.name?.message}
            />

            <EmailInput
              register={register("email")}
              error={errors.email?.message}
            />

            <PasswordInput
              register={register("password")}
              error={errors.password?.message}
              label="Password"
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
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group mt-6 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-sm text-gray-400">Or continue with</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons />

          {/* Sign In Link */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-sm text-gray-400">
              Already have an account?
            </span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-blue-400 pt-4 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1 group"
            >
              Sign in to existing account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
