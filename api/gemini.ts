import { VercelRequest, VercelResponse } from '@vercel/node';

// Dominios permitidos
const ALLOWED_ORIGINS = [
  'https://agendaciudadana.com',
  'https://www.agendaciudadana.com',
  'https://casa-ciudadana-virtual.vercel.app',
  'http://localhost:5173', // Para desarrollo local
];

// Rate limiting simple en memoria (para producción usar Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests por ventana
const RATE_WINDOW = 60000; // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Sanitizar entrada del usuario (corta)
function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, 2000) // Limitar longitud para prompts de usuario
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}

// Sanitizar system instruction (permite más contenido para el plan de gobierno)
function sanitizeSystemInstruction(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, 50000) // Hasta 50KB para el plan de gobierno completo
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Obtener origen de la request
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  // Headers de seguridad
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta en un minuto.' });
  }

  try {
    const { prompt, systemInstruction } = req.body;

    // Validación de entrada
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt requerido' });
    }

    const sanitizedPrompt = sanitizeUserInput(prompt);
    const sanitizedSystem = systemInstruction ? sanitizeSystemInstruction(systemInstruction) : '';

    if (sanitizedPrompt.length < 2) {
      return res.status(400).json({ error: 'Prompt muy corto' });
    }

    // Obtener API key del servidor (no expuesta al cliente)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'Servicio no disponible' });
    }

    // Llamar a Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: sanitizedPrompt }]
            }
          ],
          systemInstruction: sanitizedSystem ? {
            parts: [{ text: sanitizedSystem }]
          } : undefined,
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      return res.status(500).json({ error: 'Error al procesar tu consulta' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';

    return res.status(200).json({ success: true, text });
  } catch (error: any) {
    console.error('Gemini handler error:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
