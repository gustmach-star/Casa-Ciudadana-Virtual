
// Gemini Service - Usa API serverless para proteger la API key

export const callGemini = async (prompt: string, systemInstruction: string = ""): Promise<string> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API Error:", error);
      
      if (response.status === 429) {
        return "Estás enviando muchas consultas. Por favor espera un momento antes de intentar de nuevo.";
      }
      
      return "Hubo un error al procesar tu consulta. Por favor intenta nuevamente.";
    }

    const data = await response.json();
    return data.text || "Lo siento, estoy teniendo problemas para conectar. Intenta de nuevo.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Hubo un error de conexión. Por favor verifica tu internet e intenta nuevamente.";
  }
};
