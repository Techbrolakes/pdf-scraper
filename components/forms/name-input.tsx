import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";

interface NameInputProps {
  error?: string;
  register: UseFormRegisterReturn;
  label?: string;
  placeholder?: string;
}

export function NameInput({
  error,
  register,
  label = "Full Name",
  placeholder = "John Doe",
}: NameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className="text-white text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder={placeholder}
          {...register}
          className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-12"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
          <span className="text-xs">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
