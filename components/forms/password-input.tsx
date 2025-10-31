import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";
import Link from "next/link";

interface PasswordInputProps {
  error?: string;
  register: UseFormRegisterReturn;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  showForgotPassword?: boolean;
  id?: string;
}

export function PasswordInput({
  error,
  register,
  label = "Password",
  placeholder = "••••••••",
  autoComplete = "current-password",
  showForgotPassword = false,
  id = "password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-white text-sm font-medium">
          {label}
        </Label>
        {showForgotPassword && (
          <Link
            href="/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </Link>
        )}
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...register}
          className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
          <span className="text-xs">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
