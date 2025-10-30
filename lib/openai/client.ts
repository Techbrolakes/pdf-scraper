import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const MODELS = {
  GPT4: "gpt-4o-2024-08-06",
  GPT4_VISION: "gpt-4o-2024-08-06",
} as const;
