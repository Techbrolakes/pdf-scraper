import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({ name, resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset Your ResuméAI Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>
          Hello {name},
        </Text>
        <Text style={text}>
          We received a request to reset the password for your ResuméAI account. If this was you, click the button below to set a new password:
        </Text>
        <Button style={button} href={resetLink}>
          Reset Password
        </Button>
        <Text style={text}>
          If you didn&apos;t request this password reset, you can safely ignore this email. Your password will remain unchanged.
        </Text>
        <Text style={text}>
          For security reasons, this link will expire in 1 hour.
        </Text>
        <Text style={footer}>
          Best regards,<br />
          The ResuméAI Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#6a3fdc",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
  margin: "24px 0",
};

const footer = {
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid #333",
  color: "#888",
};
