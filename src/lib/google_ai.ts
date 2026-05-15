// src/lib/google-ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
// Initialize the SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// We use the 'flash' model because it's free, fast, and great for JSON generation
export const courseModel = genAI.getGenerativeModel({
model: "gemini-2.5-flash", 
  generationConfig: {
    responseMimeType: "application/json",
  },
 
});