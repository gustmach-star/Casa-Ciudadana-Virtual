
import React, { useState } from 'react';
import { Flag, MapPin, ShoppingCart } from 'lucide-react';
import { COLORS, MERCH_ITEMS } from '../constants';
import { appendToSheet, formatSignsData, SHEETS } from '../services/googleSheetsService';

interface SignsPageProps {
  cart: Record<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  showCartModal: boolean;
  setShowCartModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignsPage: React.FC<SignsPageProps> = ({ cart, setCart, showCartModal, setShowCartModal }) => {
  const [flagSize, setFlagSize] = useState<string>('Grande');
  const [shirtSize, setShirtSize] = useState<string>('M');
  const [flyerPackage, setFlyerPackage] = useState<string>('50 unidades');
  const [lonaSize, setLonaSize] = useState<string>('1x1');
  const [capColor, setCapColor] = useState<string>('Blanco');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerProvince, setCustomerProvince] = useState<string>('');
  const [customerCanton, setCustomerCanton] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const addToCart = (id: number, size?: string) => {
    const key = `${id}-${size || ''}`;
    setCart(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    setShowCartModal(false); // Asegurar que el modal esté cerrado al agregar items
  };

  const saveCartToDrive = async () => {
    setUploadError(null);
    setUploadedUrl(null);
    setUploading(true);
    try {
      if (Object.keys(cart).length === 0) {
        throw new Error('El carrito está vacío. Agrega items antes de guardar.');
      }
      
      if (!customerName.trim() || !customerEmail.trim() || !customerId.trim() || !customerPhone.trim() || !customerProvince.trim() || !customerCanton.trim()) {
        throw new Error('Por favor completa todos los campos requeridos (nombre, correo, cédula, teléfono, provincia y cantón).');
      }

      // Format data for Google Sheets
      const rowData = formatSignsData(cart, MERCH_ITEMS, customerName, customerEmail, customerId, customerPhone, customerProvince, customerCanton);

      // Append to Google Sheets via serverless API
      await appendToSheet(null, SHEETS.IDENTIFICATE, rowData);
      
      // Clear cart and form after successful submission
      setCart({});
      setCustomerName('');
      setCustomerEmail('');
      setCustomerId('');
      setCustomerPhone('');
      setCustomerProvince('');
      setCustomerCanton('');
      setShowCartModal(false);
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error al guardar pedido:', err);
      setUploadError(err?.message || 'Error desconocido al guardar el pedido.');
    } finally {
      setUploading(false);
    }
  };
  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Mensaje de Éxito */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold text-lg">¡Pedido Confirmado!</p>
              <p className="text-sm">Tu solicitud ha sido registrada exitosamente</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Signos Externos</h2>
          <p className="text-gray-600 mt-1">Identificáte con la Coalición. Solicitá tu material oficial y <span className="font-bold">GRATUITO</span> aquí.</p>
        </div>
        {totalItems > 0 && (
          <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
            <button
              disabled
              onClick={() => setShowCartModal(s => !s)}
              className="text-white px-4 py-2 rounded-full text-sm font-bold uppercase animate-bounce shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.green }}
            >
              <ShoppingCart size={24} />
              <span>{totalItems} Artículos</span>
            </button>

            {showCartModal && (
              <div className="absolute bottom-14 right-0 w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-3 text-sm z-40">
                <div className="font-bold mb-2">Carrito</div>
                {Object.entries(cart).map(([key, qty]) => {
                  const [idStr, size] = key.split('-');
                  const idNum = Number(idStr);
                  const item = MERCH_ITEMS.find(i => i.id === idNum);
                  return (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <div>
                        <div className="font-semibold">{item?.name || 'Item'}</div>
                        {size && size !== '' && <div className="text-xs text-gray-500">Tamaño: {size}</div>}
                      </div>
                      <div className="font-bold">x{qty}</div>
                    </div>
                  );
                })}
                <div className="text-right mt-3 font-bold">Total: {totalItems}</div>
                
                {/* Campos de Nombre y Cédula */}
                <div className="mt-4 space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cédula *</label>
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder="Número de cédula"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej: 8888-8888"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Provincia *</label>
                    <input
                      type="text"
                      value={customerProvince}
                      onChange={(e) => setCustomerProvince(e.target.value)}
                      placeholder="Ej: San José"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cantón *</label>
                    <input
                      type="text"
                      value={customerCanton}
                      onChange={(e) => setCustomerCanton(e.target.value)}
                      placeholder="Ej: Desamparados"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <button
                    disabled
                    onClick={saveCartToDrive}
                    className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Guardando...' : 'Confirmar Pedido'}
                  </button>
                  <button
                    disabled
                    onClick={() => { setCart({}); setUploadedUrl(null); setUploadError(null); }}
                    className="flex-1 border border-gray-300 font-bold py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Vaciar
                  </button>
                </div>
                {uploadedUrl && (
                  <div className="mt-2 text-xs text-green-700 break-words">¡Pedido registrado! <a href={uploadedUrl} target="_blank" rel="noreferrer" className="underline">Ver en Google Sheets</a></div>
                )}
                {uploadError && (
                  <div className="mt-2 text-xs text-red-600">Error: {uploadError}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 px-4 py-2 bg-yellow-50 text-center text-xs text-gray-600 rounded-lg border border-yellow-200">
        <span className="font-medium">Nota:</span> El material está sujeto a disponibilidad del producto al momento de hacer el pedido.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MERCH_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 flex flex-col" style={{ borderColor: COLORS.red }}>
            <div className="h-40 bg-gray-100 flex items-center justify-center relative flex-shrink-0">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className={`w-full h-full ${item.id === 5 || item.id === 6 ? 'object-contain' : 'object-cover'}`}
                  style={item.id === 7 ? { objectPosition: 'center 15%' } : item.id === 8 ? { objectPosition: 'center 70%' } : undefined}
                />
              ) : (
                <Flag className="text-gray-400" size={48} />
              )}
              <span 
                className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-bold uppercase shadow-sm ${item.stock === 'Agotado' ? 'text-white' : 'text-gray-800'}`} 
                style={{ backgroundColor: item.stock === 'Agotado' ? COLORS.red : COLORS.yellow }}
              >
                {item.stock}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <p className="text-xs font-extrabold uppercase tracking-widest mb-1 font-heading" style={{ color: COLORS.green }}>{item.type}</p>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{item.name}</h3>

              {/* Selector de paquete para Volantes (ID 2) */}
              {item.id === 2 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Paquete de:</p>
                  <div className="flex flex-wrap gap-2">
                    {['50 unidades', '100 unidades', '200 unidades'].map((pkg) => (
                      <button
                        disabled
                        key={pkg}
                        onClick={() => setFlyerPackage(pkg)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          flyerPackage === pkg
                            ? 'text-white border-transparent'
                            : 'text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                        style={{
                          backgroundColor: flyerPackage === pkg ? COLORS.green : 'transparent'
                        }}
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Leyenda para Calcomanías (ID 4) */}
              {item.id === 4 && (
                <p className="text-sm text-gray-600 mb-3 italic">Set de 3 calcomanías</p>
              )}

              {/* Checklist de tamaño para la Bandera (ID 1) */}
              {item.id === 1 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Seleccionar Tamaño:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pequeña', 'Mediana', 'Grande', 'Carro'].map((size) => (
                      <button
                        disabled
                        key={size}
                        onClick={() => setFlagSize(size)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${flagSize === size
                          ? 'text-white border-transparent'
                          : 'text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                        style={{
                          backgroundColor: flagSize === size ? COLORS.green : 'transparent'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de talla para Camiseta Oficial (ID 3) */}
              {item.id === 3 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Seleccionar Talla:</p>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        disabled
                        key={size}
                        onClick={() => setShirtSize(size)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${shirtSize === size
                          ? 'text-white border-transparent'
                          : 'text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                        style={{
                          backgroundColor: shirtSize === size ? COLORS.green : 'transparent'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de tamaño para Lonas (ID 5) */}
              {item.id === 5 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Seleccionar Tamaño:</p>
                  <div className="flex flex-wrap gap-2">
                    {['1x1', '1x2', '1.5x3'].map((size) => (
                      <button
                        disabled
                        key={size}
                        onClick={() => setLonaSize(size)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${lonaSize === size
                          ? 'text-white border-transparent'
                          : 'text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                        style={{
                          backgroundColor: lonaSize === size ? COLORS.green : 'transparent'
                        }}
                      >
                        {size} mts
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de color para Gorras (ID 7) */}
              {item.id === 7 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Seleccionar Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Blanco', 'Amarillo', 'Rojo', 'Verde'].map((color) => (
                      <button
                        disabled
                        key={color}
                        onClick={() => setCapColor(color)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${capColor === color
                          ? 'text-white border-transparent'
                          : 'text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                        style={{
                          backgroundColor: capColor === color ? COLORS.green : 'transparent'
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button
                  disabled
                  onClick={() => addToCart(item.id, item.id === 1 ? flagSize : item.id === 2 ? flyerPackage : item.id === 3 ? shirtSize : item.id === 5 ? lonaSize : item.id === 7 ? capColor : undefined)}
                  className={`w-full border-2 font-bold py-2 rounded-lg transition-colors uppercase text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${item.stock === 'Agotado' ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
                  style={{ borderColor: item.stock === 'Agotado' ? '#9ca3af' : COLORS.green, color: item.stock === 'Agotado' ? '#9ca3af' : COLORS.green }}
                  onMouseOver={(e) => { if (item.stock !== 'Agotado') { e.currentTarget.style.backgroundColor = COLORS.green; e.currentTarget.style.color = 'white'; } }}
                  onMouseOut={(e) => { if (item.stock !== 'Agotado') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = COLORS.green; } }}
                >
                  {item.stock === 'Agotado' ? 'No Disponible' : `Solicitar ${item.id === 1 ? `(${flagSize})` : item.id === 2 ? `(${flyerPackage})` : item.id === 3 ? `(${shirtSize})` : item.id === 5 ? `(${lonaSize} mts)` : item.id === 7 ? `(${capColor})` : ''}`}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-xl flex items-start space-x-4">
        <MapPin className="flex-shrink-0" style={{ color: COLORS.green }} />
        <div>
          <h4 className="font-bold font-heading" style={{ color: COLORS.green }}>Puntos de Entrega</h4>
          <p className="text-sm text-gray-600 mt-1">La entrega de los signos externos se coordina con la persona encargada de tu cantón. Al confirmar el pedido te contactaremos por WhatsApp para los detalles.</p>
        </div>
      </div>
    </div>
  );
};

export default SignsPage;