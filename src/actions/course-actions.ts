// src/actions/course-actions.ts
"use server"

import { generateCoursePrompt } from "../lib/ai-prompt";
import { db } from "../lib/db";
import { courseModel } from "../lib/google_ai";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

export interface AIChapterOutline {
  chapterName: string;
  briefSummary: string;
}
export async function createCourseAction(topic: string, level: string) {
  let newCourseId = "";
  // 1. Validation (No need for try-catch here, just return early)
  if (!topic || topic.length > 100) {
    return { success: false, error: "Invalid topic length." };
  }

  let aiTextOutput = "";

  // 2. & 3. AI API Call Block
  try {
    const { systemPrompt, userPrompt } = generateCoursePrompt(topic, level);
    const result = await courseModel.generateContent(
      `${systemPrompt}\n\nUser Request: ${userPrompt}`
    );
    const response = await result.response;
    aiTextOutput = response.text();
  } catch (aiError) {
    console.error("Gemini API Error:", aiError);
    return { success: false, error: "AI service failed to respond. Please try again." };
  }

  // 4. Parsing Block (Isolated)
  let parsedCourseData;
  try {
    parsedCourseData = JSON.parse(aiTextOutput);
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError, "Raw Output:", aiTextOutput);
    // User friendly message, but specific enough for us to know it was a parsing issue
    return { success: false, error: "AI generated invalid format. Please try again." }; 
  }

  // 5. Database Transaction Block (Isolated)
  try {
    const generatedCourseId = uuidv4().substring(0, 8);
    const newCourse = await db.course.create({
      data: {
        courseId: generatedCourseId,
        name: parsedCourseData.courseName,
        category: parsedCourseData.category,
        level: level,
        courseOutput: parsedCourseData,
        chapters: {
          create: parsedCourseData.chapters.map((chapter: AIChapterOutline) => ({
            name: chapter.chapterName,
            content: chapter.briefSummary
          }))
        }
      }
    });
    newCourseId = newCourse.courseId;

  } catch (dbError) {
    console.error("Database Error:", dbError);
    return { success: false, error: "Course generated, but failed to save to the database." };
  }

  if (newCourseId) {
    redirect(`/course/${newCourseId}`); 
  }
}