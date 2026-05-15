// src/components/QuizSection.tsx
"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

// Types define kar rahe hain jo Prisma se aayenge
type Question = {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
};

export default function QuizSection({ questions }: { questions: Question[] }) {
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
    const [showResults, setShowResults] = useState(false);

    // Jab user kisi option par click kare
    const handleOptionSelect = (questionId: string, option: string) => {
        if (showResults) return; // Agar result dekh chuke hain toh change nahi karne denge
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    return (
        <div className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">?</span>
                Knowledge Check
            </h2>

            {questions.map((q, index) => (
                <div key={q.id} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-lg">
                    <h3 className="text-xl font-medium text-white mb-6">
                        <span className="text-slate-500 mr-2">Q{index + 1}.</span> {q.questionText}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((option, i) => {
                            const isSelected = selectedAnswers[q.id] === option;
                            const isCorrect = option === q.correctAnswer;

                            // Dynamic classes for styling based on selection and results
                            let buttonStyle = "border-slate-700/50 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800";

                            if (showResults) {
                                if (isCorrect) buttonStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300";
                                else if (isSelected && !isCorrect) buttonStyle = "border-red-500 bg-red-500/20 text-red-300";
                            } else if (isSelected) {
                                buttonStyle = "border-blue-500 bg-blue-500/20 text-blue-300";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(q.id, option)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
                                >
                                    {option}
                                    {showResults && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                    {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation Section (Reveals only after submitting) */}
                    {showResults && (
                        <div className={`mt-6 p-4 rounded-xl border ${selectedAnswers[q.id] === q.correctAnswer ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-200' : 'bg-slate-800/50 border-slate-700 text-slate-300'}`}>
                            <strong>Explanation:</strong> {q.explanation}
                        </div>
                    )}
                </div>
            ))}

            {/* Submit Button */}
            {!showResults && (
                <button
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(selectedAnswers).length !== questions.length}
                    className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Quiz Answers
                </button>
            )}
        </div>
    );
}