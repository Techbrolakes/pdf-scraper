import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const result = await resend.emails.send({
      from: "ResuméAI <hello@dev.olamilekan.org>",
      to: email,
      subject: "Welcome to ResuméAI - Your AI-Powered Resume Assistant",
      react: WelcomeEmail({ name }),
    });

    return result;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: "ResuméAI Security <security@dev.olamilekan.org>",
      to: email,
      subject: "Reset Your ResuméAI Password",
      react: PasswordResetEmail({ name, resetLink }),
    });

    return result;
  } catch (error) {
    console.error("❌ Password reset email failed:", error);
    throw error;
  }
};
