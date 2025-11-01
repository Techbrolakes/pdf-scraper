import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Section,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to ResuméAI - Your AI-Powered Resume Assistant</Preview>
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
          <Heading style={h1}>Welcome Aboard! 🎉</Heading>

          <Text style={greeting}>Hello {name},</Text>

          <Text style={text}>
            I&apos;m thrilled to welcome you to <strong>ResuméAI</strong>!
            We&apos;re excited to have you on board and can&apos;t wait to help
            you transform your resume analysis experience.
          </Text>

          <Section style={freeCreditsBox}>
            <Text style={freeCreditsText}>
              🎁 <strong>Welcome Gift:</strong> You&apos;ve been credited with{" "}
              <strong style={creditsHighlight}>300 credits (3 free uploads)</strong>{" "}
              to get you started!
            </Text>
          </Section>

          <Section style={featuresBox}>
            <Text style={featuresTitle}>What you can do with ResuméAI:</Text>
            <Text style={featureItem}>
              ✨ Extract resume data with AI precision
            </Text>
            <Text style={featureItem}>
              📊 Analyze candidate profiles instantly
            </Text>
            <Text style={featureItem}>
              ⚡ Process multiple resumes in seconds
            </Text>
            <Text style={featureItem}>
              🎯 Get structured, actionable insights
            </Text>
          </Section>

          <Text style={text}>
            Ready to get started? Log in to your dashboard and upload your first
            resume to experience the power of AI-driven analysis.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer/Signature */}
        <Section style={footer}>
          <Text style={signature}>
            Best regards,
            <br />
            <strong style={signatureName}>Olamilekan Daramola</strong>
            <br />
            <span style={signatureTitle}>CEO, ResuméAI</span>
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

export default WelcomeEmail;

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
  backgroundColor: "#1447E6",
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

const freeCreditsBox = {
  margin: "24px 0",
  padding: "20px",
  backgroundColor: "#EBF5FF",
  borderRadius: "8px",
  border: "2px solid #1447E6",
  textAlign: "center" as const,
};

const freeCreditsText = {
  margin: "0",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1a1a1a",
};

const creditsHighlight = {
  color: "#1447E6",
  fontWeight: "700" as const,
};

const featuresBox = {
  margin: "24px 0",
  padding: "24px",
  backgroundColor: "#f7fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const featuresTitle = {
  margin: "0 0 16px",
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#1a1a1a",
};

const featureItem = {
  margin: "0 0 8px",
  fontSize: "15px",
  lineHeight: "22px",
  color: "#4a5568",
};

const divider = {
  margin: "0",
  borderColor: "#e2e8f0",
};

const footer = {
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

const signatureTitle = {
  color: "#718096",
  fontSize: "14px",
};

const footerText = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#a0aec0",
};

const footerLink = {
  color: "#1447E6",
  textDecoration: "none",
};
