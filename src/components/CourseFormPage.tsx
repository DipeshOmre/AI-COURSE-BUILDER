// src/components/CourseForm.tsx
"use client";

import React, { useState } from "react";
import { createCourseAction } from "@/src/actions/course-actions";
import { Search, BarChart3, ArrowRight, Loader2, GraduationCap } from "lucide-react";

export default function CourseForm() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createCourseAction(topic, level);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

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

        {error && <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-400 text-sm font-medium">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Architecting your course...</>
          ) : (
            <><GraduationCap className="w-5 h-5" /> Generate My Course <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </form>
    </div>
  );
}