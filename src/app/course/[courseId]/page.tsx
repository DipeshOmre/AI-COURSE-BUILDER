// src/app/course/[courseId]/page.tsx
import { db } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { Chapter } from "@prisma/client";

// 👈 FIX 1: Define params as a Promise
interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  
  // 👈 FIX 2: Await the params before using them!
  const resolvedParams = await params;
  
  // 3. Fetch directly from DB using Prisma
  const course = await db.course.findUnique({
    where: {
      // Use the resolvedParams here
      courseId: resolvedParams.courseId,
    },
    include: {
      chapters: true, 
    }
  });

  // Handle the case where the URL is wrong or course doesn't exist
  if (!course) {
    return notFound();
  }

  // Render the UI
  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
      <div className="flex gap-4 text-sm text-gray-500 mb-8">
        <span>Category: {course.category}</span>
        <span>Level: {course.level}</span>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Chapters</h2>
        
        {course.chapters.map((chapter: Chapter, index: number) => (
          <div key={chapter.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-medium">
              {index + 1}. {chapter.name}
            </h3>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{chapter.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}