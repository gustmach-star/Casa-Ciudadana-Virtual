import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Configurar autenticación con Service Account para logging
const getAuthClient = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '';
  
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

// Función para loggear consulta a Google Sheets (no bloquea la respuesta)
async function logQueryToSheets(query: string): Promise<void> {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) return;

    const timestamp = new Date().toLocaleString('es-CR', { 
      timeZone: 'America/Costa_Rica',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Coali!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, query.slice(0, 500)]],
      },
    });
  } catch (error) {
    // Log silencioso - no debe afectar la respuesta al usuario
    console.error('Error logging query to sheets:', error);
  }
}

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      // Devolver info más específica del error para diagnóstico
      if (response.status === 400) {
        return res.status(500).json({ error: 'Error en la solicitud a Gemini', detail: 'bad_request' });
      } else if (response.status === 401 || response.status === 403) {
        return res.status(500).json({ error: 'Error de autenticación con Gemini', detail: 'auth_error' });
      } else if (response.status === 404) {
        return res.status(500).json({ error: 'Modelo no encontrado', detail: 'model_not_found' });
      } else if (response.status === 429) {
        return res.status(503).json({ error: 'Servicio temporalmente no disponible. Intenta en unos minutos.', detail: 'rate_limit' });
      }
      return res.status(500).json({ error: 'Error al procesar tu consulta', detail: response.status });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';

    // Log async a Google Sheets (no espera, no bloquea)
    logQueryToSheets(sanitizedPrompt).catch(() => {});

    return res.status(200).json({ success: true, text });
  } catch (error: any) {
    console.error('Gemini handler error:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
