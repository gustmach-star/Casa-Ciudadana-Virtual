import React, { useState } from 'react';
import { Heart, Bus, MapPin } from 'lucide-react';
import { COLORS } from '../constants';

export const VolunteerForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{ color: COLORS.green }}>
          <Heart size={40} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por sumarte!</h2>
        <p className="text-gray-600">Un coordinador territorial te contactará por WhatsApp pronto.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 font-bold uppercase text-sm" style={{ color: COLORS.green }}>Volver al formulario</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Uníte al Equipo</h2>
        <p className="text-gray-600">Esta campaña la ganamos entre todos y todas. ¿Cómo te gustaría ayudar?</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Nombre Completo</label>
            <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{ '--tw-ring-color': COLORS.red } as React.CSSProperties} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Teléfono / WhatsApp</label>
            <input type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{ '--tw-ring-color': COLORS.red } as React.CSSProperties} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Cantón / Distrito</label>
          <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" style={{ '--tw-ring-color': COLORS.red } as React.CSSProperties} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 font-heading">Me gustaría colaborar en:</label>
          <div className="space-y-3">
            {['Electorales (Apoyo en Centro de Votación)', 'Transporte (Día E)', 'Comunicación/Activismo Digital', 'Volanteos y otras actividades públicas', 'Alimentación'].map((role) => (
              <label key={role} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" className="h-5 w-5 rounded focus:ring-red-500" style={{ color: COLORS.red }} />
                <span className="ml-3 text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.01] uppercase tracking-wide" style={{ backgroundColor: COLORS.red }}>
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export const TransportRequest: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4" style={{ color: COLORS.green }}>
          <Bus size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Transporte Día E</h2>
        <p className="text-gray-600 mt-2">
          Nadie se queda sin votar. Si necesitás transporte o conocés a alguien que lo necesite, completá este formulario.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 text-white text-center text-sm font-bold uppercase tracking-wide" style={{ backgroundColor: COLORS.green }}>
          Solo para el domingo 1 de febrero de 2026
        </div>
        <div className="p-8 space-y-6">
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Ubicación de recogida</label>
             <div className="flex">
               <input type="text" placeholder="Dirección exacta o link de Waze" className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 outline-none" style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties} />
               <button className="bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 text-gray-600">
                 <MapPin size={24} />
               </button>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Hora preferida</label>
               <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                 <option>Mañana (6am - 10am)</option>
                 <option>Mediodía (10am - 2pm)</option>
                 <option>Tarde (2pm - 5pm)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Pasajeros</label>
               <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                 <option>1</option>
                 <option>2</option>
                 <option>3+</option>
                 <option>Necesito rampa (Ley 7600)</option>
               </select>
             </div>
          </div>

          <button className="w-full text-white font-bold py-3 rounded-lg shadow transition-colors hover:opacity-90 uppercase tracking-wide" style={{ backgroundColor: COLORS.green }}>
            Agendar Transporte
          </button>
        </div>
      </div>
    </div>
  );
};