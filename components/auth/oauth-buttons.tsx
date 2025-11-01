"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GoogleIcon, GithubIcon } from "@/components/icons";

export function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setIsGithubLoading(true);
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in with GitHub");
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="secondary"
        className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
        onClick={signInWithGoogle}
        disabled={isGoogleLoading || isGithubLoading}
      >
        {isGoogleLoading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5" />
        )}
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
        onClick={signInWithGithub}
        disabled={isGoogleLoading || isGithubLoading}
      >
        {isGithubLoading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <GithubIcon className="w-5 h-5" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
}
