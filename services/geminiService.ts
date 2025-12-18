
import { GoogleGenAI } from "@google/genai";

export const callGemini = async (prompt: string, systemInstruction: string = ""): Promise<string> => {
  try {
    // Get API key from Vite environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      console.error("API Key missing or not configured");
      return "Error: La API de Gemini no está configurada. Por favor contacta al administrador del sitio para obtener acceso al asistente virtual.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Lo siento, estoy teniendo problemas para conectar con la base de datos de propuestas. Intenta de nuevo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error de conexión. Por favor verifica tu internet e intenta nuevamente.";
  }
};
