// src/app/api/generate-course/route.ts
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { topic, level } = await req.json();

  const result = await streamObject({
    model: google('gemini-2.5-flash'),
    system: `You are an expert educator. Generate a comprehensive course on the given topic for a ${level} audience.`,
    prompt: `Topic: ${topic}\nLevel: ${level}\nPlease generate the course modules and quizzes.`,
    // 👇 ZOD SCHEMA: AI strictly is format mein data stream karega
    schema: z.object({
      name: z.string().describe("Catchy title of the course"),
      category: z.string().describe("Main domain (e.g., Computer Science, Cooking)"),
      level: z.string(),
      chapters: z.array(
        z.object({
          name: z.string().describe("Chapter Title"),
          content: z.string().describe("Detailed, highly informative content for this chapter. 3-4 paragraphs."),
        })
      ).describe("Exactly 3 to 5 chapters"),
      quizzes: z.array(
        z.object({
          questionText: z.string().describe("A challenging multiple choice question"),
          options: z.array(z.string()).describe("Exactly 4 options"),
          correctAnswer: z.string().describe("Must exactly match one of the options"),
          explanation: z.string().describe("Brief explanation of the correct answer"),
        })
      ).describe("Exactly 3 challenging MCQ questions"),
    }),
  });

  return result.toTextStreamResponse();
}