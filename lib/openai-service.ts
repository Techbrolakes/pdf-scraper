import OpenAI from "openai";
import type { ResumeData } from "@/types/resume";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

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

/**
 * Extract resume data from text using GPT-4
 */
export async function extractResumeFromText(text: string): Promise<ResumeData> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
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

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const resumeData = JSON.parse(content) as ResumeData;
    return resumeData;
  } catch (error) {
    console.error("OpenAI text extraction error:", error);

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

    throw new Error("Failed to extract resume data from text.");
  }
}

/**
 * Extract resume data from images using GPT-4 Vision
 */
export async function extractResumeFromImages(
  imageUrls: string[]
): Promise<ResumeData> {
  try {
    // Create content array with text and images
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [
      {
        type: "text",
        text: "Extract all information from this resume image(s) and return it in the specified JSON format. Be thorough and extract ALL visible information.",
      },
    ];

    // Add all images
    for (const url of imageUrls) {
      content.push({
        type: "image_url",
        image_url: { url },
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
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

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI Vision");
    }

    const resumeData = JSON.parse(responseContent) as ResumeData;
    return resumeData;
  } catch (error) {
    console.error("OpenAI vision extraction error:", error);

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

    throw new Error("Failed to extract resume data from images.");
  }
}

/**
 * Validate that the extracted data matches the schema
 */
export function validateResumeData(data: unknown): data is ResumeData {
  if (!data || typeof data !== "object") {
    console.error("Validation failed: data is not an object", data);
    return false;
  }

  const resume = data as Partial<ResumeData>;

  // Check required top-level fields
  if (
    !resume.profile ||
    !Array.isArray(resume.workExperiences) ||
    !Array.isArray(resume.educations)
  ) {
    console.error("Validation failed: missing required fields", {
      hasProfile: !!resume.profile,
      hasWorkExperiences: Array.isArray(resume.workExperiences),
      hasEducations: Array.isArray(resume.educations),
      actualData: resume,
    });
    return false;
  }

  // Basic profile validation
  if (typeof resume.profile !== "object") {
    console.error("Validation failed: profile is not an object");
    return false;
  }

  return true;
}
