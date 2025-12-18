import React, { useState } from 'react';
import { Flag, MapPin } from 'lucide-react';
import { COLORS, MERCH_ITEMS } from '../constants';

const SignsStore: React.FC = () => {
  const [cart, setCart] = useState<Record<number, number>>({});
  
  const addToCart = (id: number) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Signos Externos</h2>
          <p className="text-gray-600 mt-1">Identificáte con la Coalición. Solicitá tu material oficial aquí.</p>
        </div>
        {totalItems > 0 && (
          <div className="text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce uppercase" style={{ backgroundColor: COLORS.green }}>
            {totalItems} Artículos
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MERCH_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="h-40 bg-gray-100 flex items-center justify-center relative">
              <Flag className="text-gray-400" size={48} />
              <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-bold text-gray-800 uppercase" style={{ backgroundColor: COLORS.yellow }}>
                {item.stock}
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs font-extrabold uppercase tracking-widest mb-1 font-heading" style={{ color: COLORS.green }}>{item.type}</p>
              <h3 className="font-bold text-gray-800 text-lg mb-4">{item.name}</h3>
              <button 
                onClick={() => addToCart(item.id)}
                className="w-full border-2 font-bold py-2 rounded-lg transition-colors hover:text-white uppercase text-sm tracking-wide"
                style={{ borderColor: COLORS.green, color: COLORS.green }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = COLORS.green; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = COLORS.green; }}
              >
                Solicitar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-blue-50 p-6 rounded-xl flex items-start space-x-4">
        <MapPin className="flex-shrink-0" style={{ color: COLORS.green }} />
        <div>
          <h4 className="font-bold font-heading" style={{ color: COLORS.green }}>Puntos de Entrega</h4>
          <p className="text-sm text-gray-600 mt-1">Los signos externos se recogen en la Casa Ciudadana más cercana a tu cantón. Al confirmar tu pedido te indicaremos la dirección exacta por WhatsApp.</p>
        </div>
      </div>
    </div>
  );
};

export default SignsStore;