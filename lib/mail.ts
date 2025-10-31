import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("resend api", process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendWelcomeEmail = async (email: string, name: string) => {
  await resend.emails.send({
    from: "ResuméAI <onboarding@resend.dev>", // Update to your verified domain in production
    to: email,
    subject: "Welcome to ResuméAI - Your AI-Powered Resume Assistant",
    react: WelcomeEmail({ name }),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "ResuméAI Security <security@resend.dev>", // Update to your verified domain in production
    to: email,
    subject: "Reset Your ResuméAI Password",
    react: PasswordResetEmail({ name, resetLink }),
  });
};
