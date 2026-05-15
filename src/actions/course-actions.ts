"use server"; // 👈 ABSOLUTELY CRITICAL: Yeh Line 1 par hi honi chahiye!

import { db } from "@/src/lib/db";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

// Ab humein sirf is ek Server Action ki zaroorat hai
export async function saveGeneratedCourseAction(courseData: any) {
  let newCourseId = "";
  
  try {
    // 1. Get User ID securely on the server
    const { userId } = await auth();
    const generatedCourseId = uuidv4().substring(0, 8);

    // 2. Save stream output to Database
    const newCourse = await db.course.create({
      data: {
        courseId: generatedCourseId,
        userId: userId,
        name: courseData.name || "AI Generated Course",
        category: courseData.category || "General",
        level: courseData.level || "Beginner",
        
        chapters: {
          create: courseData.chapters ? courseData.chapters.map((chapter: any) => ({
            name: chapter.name || "Generating...",
            content: chapter.content || "Generating...",
          })) : []
        },
        
        quizzes: {
          create: courseData.quizzes ? courseData.quizzes.map((quiz: any) => ({
            questionText: quiz.questionText || "",
            options: quiz.options || [],
            correctAnswer: quiz.correctAnswer || "",
            explanation: quiz.explanation || "",
          })) : []
        }
      }
    });
    
    newCourseId = newCourse.courseId;
  } catch (dbError) {
    console.error("Database Error:", dbError);
    return { success: false, error: "Failed to save course." };
  }

  // 3. Redirect to the fresh Course Page!
  if (newCourseId) {
    redirect(`/course/${newCourseId}`);
  }
}