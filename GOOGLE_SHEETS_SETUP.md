# Configuración de Google Sheets para La Casa Común

Este documento explica cómo está configurada la integración con Google Sheets para almacenar las solicitudes de las diferentes secciones del sitio web.

## Google Sheet Vinculado

**URL:** https://docs.google.com/spreadsheets/d/19CeLOvIVzwUiGR6XYi41Y-jjpdJt5u--fs0mwZfIiPQ/edit?gid=1376903276#gid=1376903276

**Spreadsheet ID:** `19CeLOvIVzwUiGR6XYi41Y-jjpdJt5u--fs0mwZfIiPQ`

## Pestañas Requeridas

El Google Sheet debe tener las siguientes pestañas con sus respectivos encabezados:

### 1. Pestaña: "Identificáte"
Almacena los pedidos de material de campaña (banderas, volantes, camisetas, calcomanías).

**Encabezados requeridos (Fila 1):**
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Fecha/Hora | Nombre Completo | Cédula | Teléfono | Provincia | Cantón | Productos | Total Items |

**Ejemplo de datos:**
```
18/12/2025 14:30:25 | Juan Pérez Rodríguez | 1-2345-6789 | 8888-8888 | San José | Desamparados | Bandera (Grande): 2; Volantes (50 unidades): 1 | 3
```

### 2. Pestaña: "Te llevamos a Votar"
Almacena las solicitudes de transporte para el día de las elecciones.

**Encabezados requeridos (Fila 1):**
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Fecha/Hora | Nombre | Teléfono | Ubicación de Recogida | Hora Preferida | Pasajeros | Necesita Rampa |

**Ejemplo de datos:**
```
17/12/2025 14:30:25 | Juan Pérez | 8888-8888 | San José, 100m norte del parque | 8:00 AM | 2 | No
```

### 3. Pestaña: "Sumarme"
Almacena las solicitudes de voluntariado.

**Encabezados requeridos (Fila 1):**
| A | B | C | D | E |
|---|---|---|---|---|
| Fecha/Hora | Nombre Completo | Teléfono | Cantón/Distrito | Roles |

**Ejemplo de datos:**
```
17/12/2025 14:30:25 | María González | 8777-7777 | Cartago Centro | Electorales (Fiscal General, Apoyo en Centro de Votación), Comunicación/Activismo Digital
```

## Permisos Requeridos

Para que la aplicación funcione correctamente:

1. El Google Sheet debe estar en la cuenta de Google vinculada al `VITE_GOOGLE_CLIENT_ID` configurado en `.env.local`
2. El usuario debe autorizar los siguientes scopes de OAuth:
   - `https://www.googleapis.com/auth/spreadsheets` - Para escribir en Google Sheets

## Configuración Técnica

### Variables de Entorno
Asegúrate de tener configurada la variable en `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=tu-client-id-de-google-oauth.apps.googleusercontent.com
```

### Archivos Involucrados

- **`services/googleSheetsService.ts`**: Servicio principal que maneja la comunicación con Google Sheets API
- **`pages/SignsPage.tsx`**: Envía pedidos de material a la pestaña "Identificáte"
- **`pages/TransportPage.tsx`**: Envía solicitudes de transporte a "Te llevamos a Votar"
- **`pages/VolunteerPage.tsx`**: Envía solicitudes de voluntariado a "Sumarme"

### Flujo de Autenticación

1. Usuario llena formulario y hace clic en "Enviar"/"Confirmar Pedido"
2. Se solicita autenticación OAuth de Google (si no está autenticado)
3. Usuario autoriza el acceso a Google Sheets
4. Los datos se envían mediante Google Sheets API v4
5. Se agrega una nueva fila en la pestaña correspondiente
6. Usuario recibe confirmación de que su solicitud fue registrada

## Notas Importantes

- **Formato de Fecha/Hora**: Se usa el timezone de Costa Rica (America/Costa_Rica)
- **Formato de Fecha**: DD/MM/YYYY HH:mm:ss
- **Los datos se agregan al final**: Cada nueva solicitud se agrega como una nueva fila al final de la pestaña
- **No se valida duplicados**: El sistema no verifica si una persona ya envió una solicitud

## Solución de Problemas

### Error: "No se obtuvo el token"
- Verifica que `VITE_GOOGLE_CLIENT_ID` esté correctamente configurado
- Asegúrate de que el dominio esté autorizado en la consola de Google Cloud

### Error: "Error al escribir en Google Sheets"
- Verifica que los nombres de las pestañas coincidan exactamente
- Asegúrate de que el Google Sheet existe y es accesible
- Confirma que el usuario ha dado permisos de Sheets

### Los datos no aparecen
- Verifica que estés viendo el Google Sheet correcto
- Revisa que el Spreadsheet ID sea el correcto
- Confirma que estás en la pestaña correcta

## Monitoreo

Para ver las solicitudes en tiempo real:
1. Abre el Google Sheet en tu navegador
2. Las nuevas filas aparecerán automáticamente al final de cada pestaña
3. Puedes usar filtros y ordenar por fecha para gestionar las solicitudes
