"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/settings";
import { updateProfile } from "@/app/actions/settings-actions";
import { toast } from "sonner";
import { NameInput } from "@/components/forms/name-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface ProfileSectionProps {
  initialName: string | null;
  email: string | null;
}

export function ProfileSection({ initialName, email }: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialName || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success(result.message);
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
    <div className=" p-6">
      <h2 className="text-lg font-semibold text-white mb-6">
        Profile Information
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <NameInput
          label="Display Name"
          placeholder="Enter your name"
          register={register("name")}
          error={errors.name?.message}
        />

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email || ""}
              disabled
              className="pl-11 bg-white/5 border-white/10 text-gray-400 placeholder:text-gray-500 h-12 cursor-not-allowed opacity-60"
            />
          </div>
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 hover:scale-105"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
