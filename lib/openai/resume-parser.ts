import { openai, MODELS } from "./client";
import { ResumeData } from "@/types/resume";
import type { PDFProcessingResult } from "../pdf/pdf-extractor";

const SYSTEM_PROMPT = `You are an expert resume parser. Extract ALL information from the resume and return it in the exact JSON format specified.

IMPORTANT INSTRUCTIONS:
1. Extract ALL available information from the resume
2. Use the exact ENUM values provided (e.g., FULL_TIME, REMOTE, BACHELOR, ADVANCED)
3. For missing fields, use null for single values or empty arrays [] for lists
4. For dates:
   - Use numeric months (1-12)
   - Use 4-digit years
   - For publications: use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
   - For achievements: use YYYY-MM format
5. Set "current" to true if the person is still in that position/education
6. Set "remote" and "relocation" based on resume content or preferences
7. Extract skills as an array of strings
8. Be thorough - extract licenses, languages, achievements, publications, and honors if present

ENUM VALUES:
- employmentType: FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
- locationType: ONSITE, REMOTE, HYBRID
- degree: HIGH_SCHOOL, ASSOCIATE, BACHELOR, MASTER, DOCTORATE
- languageLevel: BEGINNER, INTERMEDIATE, ADVANCED, NATIVE

Return ONLY valid JSON matching the ResumeData schema. Do not include any explanations or markdown.`;

const RESUME_SCHEMA = {
  type: "object",
  properties: {
    profile: {
      type: "object",
      properties: {
        name: { type: ["string", "null"] },
        surname: { type: ["string", "null"] },
        email: { type: ["string", "null"] },
        headline: { type: ["string", "null"] },
        professionalSummary: { type: ["string", "null"] },
        linkedIn: { type: ["string", "null"] },
        website: { type: ["string", "null"] },
        country: { type: ["string", "null"] },
        city: { type: ["string", "null"] },
        relocation: { type: "boolean" },
        remote: { type: "boolean" },
      },
      required: [
        "name",
        "surname",
        "email",
        "headline",
        "professionalSummary",
        "linkedIn",
        "website",
        "country",
        "city",
        "relocation",
        "remote",
      ],
      additionalProperties: false,
    },
    workExperiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          jobTitle: { type: "string" },
          employmentType: {
            type: "string",
            enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
          },
          locationType: {
            type: "string",
            enum: ["ONSITE", "REMOTE", "HYBRID"],
          },
          company: { type: "string" },
          startMonth: { type: "number" },
          startYear: { type: "number" },
          endMonth: { type: ["number", "null"] },
          endYear: { type: ["number", "null"] },
          current: { type: "boolean" },
          description: { type: ["string", "null"] },
        },
        required: [
          "jobTitle",
          "employmentType",
          "locationType",
          "company",
          "startMonth",
          "startYear",
          "endMonth",
          "endYear",
          "current",
          "description",
        ],
        additionalProperties: false,
      },
    },
    educations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          school: { type: "string" },
          degree: {
            type: "string",
            enum: [
              "HIGH_SCHOOL",
              "ASSOCIATE",
              "BACHELOR",
              "MASTER",
              "DOCTORATE",
            ],
          },
          major: { type: ["string", "null"] },
          startYear: { type: "number" },
          endYear: { type: ["number", "null"] },
          current: { type: "boolean" },
          description: { type: ["string", "null"] },
        },
        required: [
          "school",
          "degree",
          "major",
          "startYear",
          "endYear",
          "current",
          "description",
        ],
        additionalProperties: false,
      },
    },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    licenses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          issuer: { type: "string" },
          issueYear: { type: "number" },
          description: { type: ["string", "null"] },
        },
        required: ["name", "issuer", "issueYear", "description"],
        additionalProperties: false,
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          language: { type: "string" },
          level: {
            type: "string",
            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "NATIVE"],
          },
        },
        required: ["language", "level"],
        additionalProperties: false,
      },
    },
    achievements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          organization: { type: "string" },
          achieveDate: { type: "string" },
          description: { type: ["string", "null"] },
        },
        required: ["title", "organization", "achieveDate", "description"],
        additionalProperties: false,
      },
    },
    publications: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          publisher: { type: "string" },
          publicationDate: { type: "string" },
          publicationUrl: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        },
        required: [
          "title",
          "publisher",
          "publicationDate",
          "publicationUrl",
          "description",
        ],
        additionalProperties: false,
      },
    },
    honors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          issuer: { type: "string" },
          issueMonth: { type: "number" },
          issueYear: { type: "number" },
          description: { type: ["string", "null"] },
        },
        required: ["title", "issuer", "issueMonth", "issueYear", "description"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "profile",
    "workExperiences",
    "educations",
    "skills",
    "licenses",
    "languages",
    "achievements",
    "publications",
    "honors",
  ],
  additionalProperties: false,
};

export async function parseResumeFromText(text: string): Promise<ResumeData> {
  try {
    const response = await openai.chat.completions.create({
      model: MODELS.GPT4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract all information from this resume:\n\n${text}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_extraction",
          strict: true,
          schema: RESUME_SCHEMA,
        },
      },
      temperature: 0.1,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content) as ResumeData;
  } catch (error) {
    console.error("OpenAI parsing error:", error);

    if (error instanceof Error) {
      if (error.message.includes("rate_limit")) {
        throw new Error(
          "OpenAI rate limit exceeded. Please try again in a moment."
        );
      }
      if (error.message.includes("timeout")) {
        throw new Error("Request timed out. Please try again.");
      }
      if (error.message.includes("invalid_api_key")) {
        throw new Error("OpenAI API key is invalid.");
      }
    }

    throw new Error("Failed to parse resume with OpenAI");
  }
}

export async function parseResumeFromImages(
  images: string[]
): Promise<ResumeData> {
  try {
    // Prepare image messages for Vision API
    const imageMessages = images.slice(0, 10).map((base64Image) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:image/jpeg;base64,${base64Image}`,
        detail: "high" as const,
      },
    }));

    const response = await openai.chat.completions.create({
      model: MODELS.GPT4_VISION,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all information from this resume image(s) and return it in the specified JSON format. Be thorough and extract ALL visible information.",
            },
            ...imageMessages,
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_extraction",
          strict: true,
          schema: RESUME_SCHEMA,
        },
      },
      temperature: 0.1,
      max_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI Vision");
    }

    return JSON.parse(content) as ResumeData;
  } catch (error) {
    console.error("OpenAI Vision parsing error:", error);

    if (error instanceof Error) {
      if (error.message.includes("rate_limit")) {
        throw new Error(
          "OpenAI rate limit exceeded. Please try again in a moment."
        );
      }
      if (error.message.includes("timeout")) {
        throw new Error("Request timed out. Please try again.");
      }
      if (error.message.includes("invalid_api_key")) {
        throw new Error("OpenAI API key is invalid.");
      }
    }

    throw new Error("Failed to parse resume from images");
  }
}

export async function parseResume(
  extractionResult: PDFProcessingResult
): Promise<ResumeData> {
  if (!extractionResult.success) {
    throw new Error(extractionResult.error || "PDF extraction failed");
  }

  if (extractionResult.text) {
    return parseResumeFromText(extractionResult.text);
  } else {
    throw new Error("No text content found in PDF");
  }
}
