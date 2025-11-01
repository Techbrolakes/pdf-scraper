import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Hr,
  Section,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  name,
  resetLink,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset Your ResuméAI Password</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo/Brand */}
        <Section style={header}>
          <table style={logo}>
            <tr>
              <td>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={logoSvg}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="white"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </td>
              <td>
                <Heading style={brandName}>ResuméAI</Heading>
              </td>
            </tr>
          </table>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>Password Reset Request</Heading>
          
          <Text style={greeting}>Hello {name},</Text>
          
          <Text style={text}>
            We received a request to reset the password for your <strong>ResuméAI</strong> account.
            If this was you, click the button below to set a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Reset Password →
            </Button>
          </Section>

          <Section style={warningBox}>
            <Text style={warningTitle}>⚠️ Security Notice</Text>
            <Text style={warningText}>
              This password reset link will expire in <strong>1 hour</strong> for security reasons.
            </Text>
            <Text style={warningText}>
              If you didn&apos;t request this password reset, you can safely ignore this email. 
              Your password will remain unchanged.
            </Text>
          </Section>

          <Text style={helpText}>
            Having trouble? Contact us at{" "}
            <a href="mailto:support@dev.olamilekan.org" style={link}>
              support@dev.olamilekan.org
            </a>
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={signature}>
            Best regards,
            <br />
            <strong style={signatureName}>The ResuméAI Team</strong>
          </Text>
          
          <Text style={footerText}>
            © 2025 ResuméAI. All rights reserved.
            <br />
            <a href="https://dev.olamilekan.org" style={footerLink}>
              dev.olamilekan.org
            </a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  width: "580px",
  backgroundColor: "#ffffff",
};

const header = {
  padding: "32px 40px 24px",
  backgroundColor: "#dc2626",
  borderRadius: "8px 8px 0 0",
};

const logo = {
  margin: "0 auto",
  textAlign: "center" as const,
};

const logoSvg = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "12px",
};

const brandName = {
  margin: "0",
  fontSize: "28px",
  fontWeight: "bold",
  color: "#ffffff",
  textAlign: "center" as const,
};

const content = {
  padding: "40px 40px 32px",
};

const h1 = {
  margin: "0 0 24px",
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1a1a1a",
  textAlign: "center" as const,
};

const greeting = {
  margin: "0 0 16px",
  fontSize: "18px",
  color: "#1a1a1a",
  fontWeight: "500" as const,
};

const text = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#4a5568",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  display: "inline-block",
  padding: "14px 32px",
  backgroundColor: "#dc2626",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: "600" as const,
  fontSize: "16px",
};

const warningBox = {
  margin: "24px 0",
  padding: "20px",
  backgroundColor: "#fef2f2",
  borderRadius: "8px",
  border: "1px solid #fecaca",
};

const warningTitle = {
  margin: "0 0 12px",
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#991b1b",
};

const warningText = {
  margin: "0 0 8px",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#7f1d1d",
};

const helpText = {
  margin: "24px 0 0",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#718096",
  textAlign: "center" as const,
};

const link = {
  color: "#dc2626",
  textDecoration: "none",
};

const divider = {
  margin: "0",
  borderColor: "#e2e8f0",
};

const footerSection = {
  padding: "32px 40px",
  textAlign: "center" as const,
};

const signature = {
  margin: "0 0 24px",
  fontSize: "15px",
  lineHeight: "22px",
  color: "#4a5568",
};

const signatureName = {
  color: "#1a1a1a",
  fontWeight: "600" as const,
};

const footerText = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#a0aec0",
};

const footerLink = {
  color: "#dc2626",
  textDecoration: "none",
};
