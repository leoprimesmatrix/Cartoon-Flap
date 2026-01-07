
import { GoogleGenAI } from "@google/genai";

export async function getDeathCommentary(score: number): Promise<string> {
  try {
    // The GoogleGenAI instance is created inside the function call.
    // This prevents the entire application from crashing at startup if process.env.API_KEY is missing.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The player just died in a Flappy Bird game with a score of ${score}. 
      Provide a short, sassy, cartoonish, and funny one-liner (max 15 words) 
      roasting their performance or offering sarcastic encouragement.`,
      config: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text?.trim() || "Ouch! Gravity wins again.";
  } catch (error) {
    // If the API key is missing or invalid, we log the error and return a fun fallback string.
    // This ensures the game remains playable even without AI functionality.
    console.error("Gemini Service Error:", error);
    return score < 5 ? "Maybe try walking instead of flying?" : "Close, but no banana!";
  }
}
