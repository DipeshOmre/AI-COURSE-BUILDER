// src/app/dashboard/page.tsx
import { db } from "@/src/lib/db";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, PlusCircle, Clock, Sparkles } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  // 1. Clerk se current user ki ID nikaliye
  const { userId } = await auth();

  // 2. Security Check: Agar user directly URL type karke yahan aaye bina login ke, toh usko bahar fek do
  if (!userId) {
    return redirect("/");
  }

  // 3. Database Query: Sirf is user ke courses laao, sabse naye wale pehle
  const userCourses = await db.course.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen text-white p-6 md:p-12 pb-24 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 mt-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-500" />
            My Learning Vault
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Manage and revisit all the courses you've architected with AI.
          </p>
        </div>
        
        <Link href="/">
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-500 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create New Course
          </button>
        </Link>
      </div>

      {/* Conditional Rendering: Agar courses nahi hain, toh Empty State dikhao */}
      {userCourses.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-xl">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Your vault is empty!</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            You haven't generated any courses yet. Start your learning journey by architecting your first AI course.
          </p>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Generate Your First Course
            </button>
          </Link>
        </div>
      ) : (
        /* Agar courses hain, toh Grid dikhao */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map((course) => (
            <Link href={`/course/${course.courseId}`} key={course.id}>
              <div className="group bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    {course.category}
                  </div>
                  <div className="flex items-center text-slate-500 text-xs font-medium gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.createdAt.toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                  {course.name}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/50">
                  <span className="text-slate-400 text-sm font-medium">Level: <span className="text-slate-300">{course.level}</span></span>
                  <span className="text-blue-500 text-sm font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    View Course →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}