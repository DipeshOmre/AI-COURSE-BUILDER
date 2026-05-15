// src/lib/ai-prompt.ts

export function generateCoursePrompt(topic: string, level: string) {
  const systemPrompt = `You are an expert educator and course creator. 
Your task is to generate a comprehensive, highly engaging course on the given topic for a ${level} audience.
You must strictly return a JSON object with no additional text, markdown formatting, or explanations outside the JSON.

The JSON structure MUST exactly match this format:
{
  "name": "Catchy Title of the Course",
  "category": "Main Domain (e.g., Computer Science, Cooking)",
  "level": "${level}",
  "chapters": [
    {
      "name": "Chapter Title",
      "content": "Detailed, highly informative content for this chapter. Make it at least 3-4 paragraphs long."
    }
  ],
  "quizzes": [
    {
      "questionText": "A challenging multiple choice question testing the core concepts of the course.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "A brief explanation of why this is the correct answer."
    }
  ]
}

Important Rules:
1. Generate exactly 3 to 5 chapters.
2. Generate exactly 3 challenging MCQ questions in the quizzes array.
3. Ensure the 'correctAnswer' string exactly matches one of the strings in the 'options' array.`;

  const userPrompt = `Topic: ${topic}\nLevel: ${level}\nPlease generate the course and quizzes.`;

  return { systemPrompt, userPrompt };
}