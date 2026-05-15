// src/app/course/[courseId]/page.tsx
import { db } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { Chapter } from "@prisma/client";
import { BookOpen, Sparkles, Target, Layers } from "lucide-react";
import QuizSection from "@/src/components/QuizSection";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  
  const course = await db.course.findUnique({
    where: {
      courseId: resolvedParams.courseId,
    },
    include: {
      chapters: true, 
      quizzes: true, 
    }
  });

  if (!course) {
    return notFound();
  }

  return (
    // 1. Removed bg-[#FAFAFA], added transparent base with text-white
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30">
      
      {/* Hero Section - 2. Glassmorphism header */}
      <div className="relative border-b border-slate-800 bg-slate-950/40 backdrop-blur-xl px-6 py-16 md:py-24 overflow-hidden">
        {/* Subtle glow behind the title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Sparkles className="w-4 h-4" />
            AI Generated Course
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            {course.name}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 font-medium backdrop-blur-sm">
              <Layers className="w-5 h-5 text-indigo-400" />
              Category: {course.category}
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 font-medium backdrop-blur-sm">
              <Target className="w-5 h-5 text-emerald-400" />
              Level: {course.level}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid Section */}
      <div className="relative max-w-5xl mx-auto px-6 py-16 z-10">
        <div className="flex items-center gap-3 mb-10">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-white">Course Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {course.chapters.map((chapter: Chapter, index: number) => (
            <div 
              key={chapter.id} 
              // 3. Dark translucent cards with neon hover effects
              className="group relative bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
            >
              {/* Decorative Number Background */}
              <div className="absolute top-4 right-6 text-6xl font-black text-slate-800/40 select-none group-hover:text-blue-900/30 transition-colors duration-300">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-6 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
                  {index + 1}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 leading-snug">
                  {chapter.name}
                </h3>
                
                <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                  {chapter.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        {course.quizzes && course.quizzes.length > 0 && (
          <QuizSection questions={course.quizzes} />
        )}
      </div>
    </div>
  );
}