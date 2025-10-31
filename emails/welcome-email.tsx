import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
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
        <Heading style={h1}>Welcome to ResuméAI</Heading>
        <Text style={text}>
          Hello {name},
        </Text>
        <Text style={text}>
          I&apos;m thrilled to welcome you to ResuméAI! We&apos;re excited to have you on board and can&apos;t wait to help you transform your resume analysis experience.
        </Text>
        <Text style={text}>
          With ResuméAI, you can now leverage cutting-edge AI technology to extract, analyze, and understand resume data with unprecedented accuracy and speed.
        </Text>
        <Text style={text}>
          If you have any questions or need assistance getting started, don&apos;t hesitate to reach out. We&apos;re here to help you succeed.
        </Text>
        <Text style={signature}>
          Best regards,<br />
          <strong>Olamilekan Daramola</strong><br />
          CEO, ResuméAI
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const signature = {
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid #333",
};
