// src/components/CourseForm.tsx
"use client";

import React, { useState } from "react";
import { Search, BarChart3, ArrowRight, Loader2, GraduationCap, CheckCircle2, Sparkles } from "lucide-react";
// 👇 IMPORTING THE VERCEL STREAMING HOOK
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { saveGeneratedCourseAction } from "@/src/actions/course-actions";


export default function CourseForm() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [isSaving, setIsSaving] = useState(false);

  // 👇 THE STREAMING ENGINE
  const { submit, isLoading, object, error } = useObject({
    api: '/api/generate-course',
    onFinish: async ({ object }) => {
      // Jab AI poora type kar le, tab database mein save karo
      if (object) {
        setIsSaving(true);
        await saveGeneratedCourseAction(object);
      }
    }
  });

  const handleGenerateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    // API route par data bhejna stream start karne ke liye
    submit({ topic, level });
  };

  // Agar load ho raha hai ya object ban raha hai, toh STREAMING UI dikhao
  if (isLoading || object || isSaving) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] min-h-[400px] flex flex-col">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <h3 className="text-xl font-bold text-white">
            {isSaving ? "Saving to your Vault..." : "Architecting your course live..."}
          </h3>
        </div>

        {/* Live Course Name */}
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4 animate-pulse">
          {object?.name || "Synthesizing topic..."}
        </h2>

        {/* Live Chapters Generation */}
        <div className="space-y-4 flex-1">
          {object?.chapters?.map((chapter: any, index: number) => (
            <div key={index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="font-bold text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {chapter?.name || `Generating Module ${index + 1}...`}
              </h4>
              {/* Content preview snippet */}
              <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                {chapter?.content || "Writing curriculum..."}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-slate-500 flex items-center justify-center gap-2">
           <Sparkles className="w-4 h-4 text-amber-400" />
           Powered by Gemini Streaming
        </div>
      </div>
    );
  }

  // 👇 The Original Form (Normal State)
  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <form onSubmit={handleGenerateCourse} className="space-y-8">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
            <Search className="w-4 h-4 text-blue-400" />
            WHAT DO YOU WANT TO LEARN?
          </label>
          <input
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Quantum Computing, Italian Cooking..."
            className="w-full bg-slate-950/50 border-2 border-slate-700/50 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all duration-200"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            SELECT YOUR EXPERTISE
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Beginner", "Intermediate", "Advanced"].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                  level === l
                    ? "border-blue-500 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-400 text-sm font-medium">Failed to generate stream. Please try again.</div>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          <GraduationCap className="w-5 h-5" /> Generate My Course <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}