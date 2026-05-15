// src/app/page.tsx
"use client";
import { useState } from "react";
import { createCourseAction } from "@/src/actions/course-actions";


export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-50 text-black">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-3xl font-bold text-center mb-6">AI Course Builder</h1>

        <form onSubmit={handleGenerateCourse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to learn?</label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g., Advanced React Patterns, Machine Learning..."
              className="w-full border p-3 rounded-md text-black"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
            <select
              className="w-full border p-3 rounded-md text-black"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Generating Course (This takes a few seconds)..." : "Generate Course"}
          </button>
        </form>
      </div>
    </main>
  );
}