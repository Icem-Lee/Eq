import { GoogleGenAI } from "@google/genai";
import { FrequencyTerm } from "../types";

// Initialize Gemini client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGeminiAboutFrequency = async (
  term: FrequencyTerm,
  userQuestion: string,
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct prompt context
    const context = `
      You are an expert Audio Engineer and Mixing Master. 
      The user is asking about the frequency term: "${term.label}".
      
      Details:
      - Category: ${term.zone} (This means the signal level is ${term.zone} in this area)
      - Frequency Range: ${term.minHz}Hz - ${term.maxHz}Hz
      - Basic Description: ${term.description}
      
      Your goal is to provide practical, actionable advice on how to fix or achieve this sound using EQ, Compression, or other mixing techniques.
      Keep answers concise (under 150 words) but helpful. Use bullet points for steps.
    `;

    // Convert history to format if needed, but for single-shot Q&A with context, we can just prepend.
    // For this simple app, we will use generateContent with system instruction.
    
    const contents = [
      { role: 'user', parts: [{ text: `Context: ${context}` }] },
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: userQuestion }] }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents.map(c => ({ role: c.role, parts: c.parts })), // Ensure correct typing
      config: {
        temperature: 0.7,
        systemInstruction: "You are a helpful, professional audio mixing assistant.",
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error communicating with the AI. Please check your connection or API key.";
  }
};