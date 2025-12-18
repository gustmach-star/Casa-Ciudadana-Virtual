// Google Sheets Service para enviar datos al spreadsheet de la campaña
// Spreadsheet ID: 19CeLOvIVzwUiGR6XYi41Y-jjpdJt5u--fs0mwZfIiPQ

const SPREADSHEET_ID = '19CeLOvIVzwUiGR6XYi41Y-jjpdJt5u--fs0mwZfIiPQ';

// Nombres de las pestañas según el documento
const SHEETS = {
  IDENTIFICATE: 'Identificáte',
  TRANSPORTE: 'Te llevamos a Votar',
  SUMARME: 'Sumarme'
};

/**
 * Agrega una fila de datos a una pestaña específica del Google Sheet
 * @param accessToken Token de acceso OAuth2 de Google
 * @param sheetName Nombre de la pestaña (ej: "Identificáte")
 * @param values Array de valores a agregar como fila
 */
export async function appendToSheet(
  accessToken: string,
  sheetName: string,
  values: any[]
): Promise<any> {
  const range = `${sheetName}!A:Z`; // Rango completo de la pestaña
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [values]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al escribir en Google Sheets: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * Formatea datos del carrito de signos para Google Sheets
 * Formato esperado: Fecha/Hora | Nombre | Cédula | Teléfono | Provincia | Cantón | Productos | Total Items
 */
export function formatSignsData(cart: Record<string, number>, merchItems: any[], customerName: string, customerId: string, customerPhone: string, customerProvince: string, customerCanton: string): any[] {
  const timestamp = new Date().toLocaleString('es-CR', { 
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Convertir el carrito a una cadena de texto con todos los productos
  const productos = Object.entries(cart).map(([key, qty]) => {
    const [idStr, size] = key.split('-');
    const id = Number(idStr);
    const item = merchItems.find(i => i.id === id);
    const itemName = item?.name || 'Item';
    const sizeInfo = size && size !== '' ? ` (${size})` : '';
    return `${itemName}${sizeInfo}: ${qty}`;
  }).join('; ');

  const totalItems = Object.values(cart).reduce((a: number, b: number) => a + b, 0);

  return [timestamp, customerName, customerId, customerPhone, customerProvince, customerCanton, productos, totalItems];
}

/**
 * Formatea datos de transporte para Google Sheets
 * Formato esperado: Fecha/Hora | Nombre | Teléfono | Ubicación | Hora Preferida | Pasajeros | Necesita Rampa
 */
export function formatTransportData(formData: {
  name: string;
  phone: string;
  pickup_location: string;
  preferred_time: string;
  passengers: string;
  needs_ramp: boolean;
}): any[] {
  const timestamp = new Date().toLocaleString('es-CR', { 
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return [
    timestamp,
    formData.name,
    formData.phone,
    formData.pickup_location,
    formData.preferred_time,
    formData.passengers,
    formData.needs_ramp ? 'Sí' : 'No'
  ];
}

/**
 * Formatea datos de voluntariado para Google Sheets
 * Formato esperado: Fecha/Hora | Nombre | Teléfono | Cantón/Distrito | Roles
 */
export function formatVolunteerData(formData: {
  full_name: string;
  phone: string;
  location: string;
  roles: string[];
}): any[] {
  const timestamp = new Date().toLocaleString('es-CR', { 
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const roles = formData.roles.join(', ');

  return [
    timestamp,
    formData.full_name,
    formData.phone,
    formData.location,
    roles
  ];
}

export { SHEETS, SPREADSHEET_ID };
