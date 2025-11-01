"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/settings";
import { changePassword } from "@/app/actions/settings-actions";
import { toast } from "sonner";
import { PasswordInput } from "@/components/forms/password-input";

export function PasswordSection() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true);
    try {
      const result = await changePassword(data);
      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">
        Change Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <PasswordInput
          id="currentPassword"
          label="Current Password"
          placeholder="Enter current password"
          register={register("currentPassword")}
          error={errors.currentPassword?.message}
          autoComplete="current-password"
        />

        <div>
          <PasswordInput
            id="newPassword"
            label="New Password"
            placeholder="Enter new password"
            register={register("newPassword")}
            error={errors.newPassword?.message}
            autoComplete="new-password"
          />
          <p className="mt-2 text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm new password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 hover:scale-105"
        >
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
