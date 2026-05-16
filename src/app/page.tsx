// src/app/page.tsx
// 👈 Notice: Humne "use client" hata diya hai! Yeh ab ek Server Component hai.
import React from "react";
import { db } from "@/src/lib/db";
import { Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import CourseForm from "../components/CourseFormPage";
import { Course } from "@prisma/client";
export const dynamic = "force-dynamic";
export default async function Home() {
  // 1. Fetch the 6 most recent courses directly from the database!
  const recentCourses = await db.course.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <main className="min-h-screen flex flex-col items-center p-6 relative text-white pb-24">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-2xl w-full relative z-10 mt-16 md:mt-24 mb-16">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-blue-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Learning
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Master Any Skill with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            Generate a personalized, comprehensive course on any topic in seconds.
          </p>
        </div>

        {/* 2. Using our newly isolated Client Component */}
        <CourseForm />
      </div>

      {/* 3. The "Recent Courses" Gallery */}
      {recentCourses.length > 0 && (
        <div className="max-w-5xl w-full relative z-10 mt-16 pt-16 border-t border-slate-800/50">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-200">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Explore Community Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course:Course) => (
              <Link href={`/course/${course.courseId}`} key={course.id}>
                <div className="group bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wide">
                    {course.category} • {course.level}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {course.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}