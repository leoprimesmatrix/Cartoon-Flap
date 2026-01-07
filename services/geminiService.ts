
import { GoogleGenAI } from "@google/genai";

export async function getDeathCommentary(score: number): Promise<string> {
  // Check if API key is present and valid string
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    console.warn("Gemini API Key missing. Using fallback commentary.");
    return score < 5 ? "Maybe try walking instead of flying?" : "Close, but no banana!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
    console.error("Gemini Service Error:", error);
    return score < 10 ? "That was... certainly an attempt." : "Impressive, for a birdbrain!";
  }
}
