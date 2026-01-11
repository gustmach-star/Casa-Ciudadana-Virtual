// Google Sheets Service para enviar datos al spreadsheet de la campaña
// Usa API serverless para autenticación segura con Service Account

const SPREADSHEET_ID = '19CeLOvIVzwUiGR6XYi41Y-jjpdJt5u--fs0mwZfIiPQ';

// Nombres de las pestañas según el documento
const SHEETS = {
  IDENTIFICATE: 'Identificate',
  TRANSPORTE: 'Transporte',
  SUMARME: 'Sumarme'
};

/**
 * Agrega una fila de datos a una pestaña específica del Google Sheet
 * Usa la API serverless en /api/sheets para autenticación segura
 * @param sheetName Nombre de la pestaña (ej: "Identificate")
 * @param values Array de valores a agregar como fila
 */
export async function appendToSheet(
  _accessToken: string | null, // Mantenemos para compatibilidad, pero ya no se usa
  sheetName: string,
  values: any[]
): Promise<any> {
  const response = await fetch('/api/sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sheetName,
      rowData: values
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al guardar datos');
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
