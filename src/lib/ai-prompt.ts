// lib/ai-prompts.ts

export function generateCoursePrompt(topic: string, level: string) {
  // The System Prompt sets the boundaries and behavior
  const systemPrompt = `
    You are an expert curriculum designer and senior technical mentor. 
    Your task is to generate a highly logical and comprehensive course outline based on the user's topic.
    CRITICAL: You MUST respond strictly in valid JSON format. Do not include any conversational text, markdown formatting like \`\`\`json, or explanations outside the JSON block.
  `;

  // The User Prompt provides the dynamic variables and strict output shape
  const userPrompt = `
    Create a course outline for the following topic: "${topic}".
    Target Audience Level: ${level}

    The JSON output must exactly follow this schema:
    {
      "courseName": "String (A catchy title for the course)",
      "category": "String (e.g., Programming, Marketing, Design)",
      "chapters": [
        {
          "chapterName": "String (Title of the chapter)",
          "briefSummary": "String (A 2-3 sentence summary of what this chapter will cover)"
        }
      ]
    }
  `;

  return { systemPrompt, userPrompt };
}