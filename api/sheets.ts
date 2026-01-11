import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Configurar autenticación con Service Account
const getAuthClient = () => {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const SPREADSHEET_ID = process.env.VITE_GOOGLE_SPREADSHEET_ID || '19CeLOvIVzwUiGR6XYi41Y-jjpdJt5u--fs0mwZfIiPQ';

// Nombres de las hojas
const SHEETS = {
  IDENTIFICATE: 'Identificate',
  TRANSPORTE: 'Transporte',
  SUMARME: 'Sumarme',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sheetName, rowData } = req.body;

    if (!sheetName || !rowData) {
      return res.status(400).json({ error: 'Missing sheetName or rowData' });
    }

    // Validar nombre de hoja
    const validSheets = Object.values(SHEETS);
    if (!validSheets.includes(sheetName)) {
      return res.status(400).json({ error: 'Invalid sheet name' });
    }

    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Agregar fila a la hoja
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return res.status(200).json({ success: true, message: 'Datos guardados correctamente' });
  } catch (error: any) {
    console.error('Error writing to Google Sheets:', error);
    return res.status(500).json({ 
      error: 'Error al guardar datos', 
      details: error.message 
    });
  }
}
