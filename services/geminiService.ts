
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDeathCommentary(score: number): Promise<string> {
  try {
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
    console.error("Gemini Error:", error);
    return score < 5 ? "Maybe try walking instead of flying?" : "Close, but no banana!";
  }
}
