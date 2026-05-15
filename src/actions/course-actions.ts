// src/actions/course-actions.ts
"use server"

import { generateCoursePrompt } from "../lib/ai-prompt";
import { db } from "../lib/db";
import { courseModel } from "../lib/google_ai";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export interface AIChapterOutline {
  chapterName: string;
  briefSummary: string;
}
export async function createCourseAction(topic: string, level: string) {
  let newCourseId = "";
  const { userId } = await auth();
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

  try {
    const generatedCourseId = uuidv4().substring(0, 8);

    // 👇 The Bulletproof Wrapper Check
    // Agar Gemini data ko 'courseOutput' ke andar bhejta hai, toh wahan se lo, warna direct lo.
    const courseData = parsedCourseData.courseOutput || parsedCourseData;

    const newCourse = await db.course.create({
      data: {
        courseId: generatedCourseId,
        userId: userId ,
        // 👇 FIX 1: Using courseData.name (NOT parsedCourseData.courseName)
        name: courseData.name || "AI Generated Course",

        // 👇 FIX 2: Safely accessing category and level
        category: courseData.category || "General",
        level: level,

        chapters: {
          create: courseData.chapters.map((chapter: any) => ({
            name: chapter.name || "Untitled Chapter",
            content: chapter.content || "Content coming soon..."
          }))
        },

        quizzes: {
          create: courseData.quizzes ? courseData.quizzes.map((quiz: any) => ({
            questionText: quiz.questionText,
            options: quiz.options,
            correctAnswer: quiz.correctAnswer,
            explanation: quiz.explanation,
          })) : []
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