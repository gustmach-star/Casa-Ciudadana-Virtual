import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Dominios permitidos
const ALLOWED_ORIGINS = [
  'https://agendaciudadana.com',
  'https://www.agendaciudadana.com',
  'https://casa-ciudadana-virtual.vercel.app',
  'http://localhost:5173',
];

// Rate limiting simple
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// Sanitizar entrada
function sanitizeInput(input: any): string {
  if (typeof input !== 'string') return String(input || '').slice(0, 500);
  return input.trim().slice(0, 500).replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ');
}

// Configurar autenticación con Service Account
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

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Nombres de las hojas
const SHEETS = {
  IDENTIFICATE: 'Identificate',
  TRANSPORTE: 'Transporte',
  SUMARME: 'Sumarme',
  COALI: 'Coali',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS seguro
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

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

  // Verificar configuración
  if (!SPREADSHEET_ID) {
    console.error('GOOGLE_SPREADSHEET_ID not configured');
    return res.status(500).json({ error: 'Servicio no disponible' });
  }

  try {
    const { sheetName, rowData } = req.body;

    if (!sheetName || !rowData) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Validar nombre de hoja
    const validSheets = Object.values(SHEETS);
    if (!validSheets.includes(sheetName)) {
      return res.status(400).json({ error: 'Hoja no válida' });
    }

    // Validar y sanitizar datos
    if (!Array.isArray(rowData) || rowData.length === 0 || rowData.length > 20) {
      return res.status(400).json({ error: 'Formato de datos inválido' });
    }

    const sanitizedData = rowData.map(sanitizeInput);

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [sanitizedData],
      },
    });

    return res.status(200).json({ success: true, message: 'Datos guardados correctamente' });
  } catch (error: any) {
    console.error('Sheets API error:', error.message);
    return res.status(500).json({ error: 'Error al guardar datos' });
  }
}
