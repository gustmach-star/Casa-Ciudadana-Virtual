import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Configurar autenticación con Service Account
const getAuthClient = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '';
  
  // Manejar diferentes formatos de la private key
  // Puede venir con \n literal o con saltos de línea reales
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  
  console.log('Service Account Email:', email);
  console.log('Private Key exists:', !!privateKey);
  console.log('Private Key starts with:', privateKey.substring(0, 30));

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
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
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Error al guardar datos', 
      details: error.message,
      code: error.code,
      status: error.status
    });
  }
}
