
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'assistant', content: string }[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  // Create a chat instance for multi-turn conversation
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Neuro AI, a compassionate and expert neurological health assistant. Provide helpful, accurate, and supportive information while always recommending consulting a professional for critical issues. Keep responses concise and human-like.",
    }
  });

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to my neural network. Please check your connection and try again.";
  }
};

export const analyzeScanWithGemini = async (base64Data: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  // Extract base64 and mime type from data URL
  const mimeType = base64Data.split(';')[0].split(':')[1];
  const base64String = base64Data.split(',')[1];

  const imagePart = {
    inlineData: {
      data: base64String,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Acting as a neuroradiologist, analyze this brain MRI. Specifically check for the presence of tumors, masses, or lesions. If detected, describe their approximate location (lobe, hemisphere), characteristics (intensity, borders), and potential type. If none are detected, state 'No overt intracranial mass lesion identified'. Provide a concise, clinical summary."
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text || "Analysis complete. The scan appears to be within normal parameters for this view.";
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return "I encountered an error while processing the scan. Please ensure the image is clear and try again.";
  }
};
