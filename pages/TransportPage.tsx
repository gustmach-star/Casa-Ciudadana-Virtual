import React, { useState } from 'react';
import { Bus, MapPin, CheckCircle } from 'lucide-react';
import { COLORS } from '../constants';
import { appendToSheet, formatTransportData, SHEETS } from '../services/googleSheetsService';

const TransportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup_location: '',
    preferred_time: '6:00 AM',
    passengers: '1',
    special_condition: '',
    special_condition_detail: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format data for Google Sheets
      const rowData = formatTransportData(formData);

      // Send to Google Sheets via serverless API
      await appendToSheet(null, SHEETS.TRANSPORTE, rowData);

      setSubmitted(true);
    } catch (error) {
      console.error('Error al guardar solicitud de transporte:', error);
      alert('Hubo un error al guardar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
     return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6 text-green-600">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Solicitud Recibida!</h2>
        <p className="text-gray-600 mb-8">Hemos registrado tu solicitud de transporte. Te contactaremos el día antes de las elecciones para coordinar los detalles.</p>
        <button onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', pickup_location: '', preferred_time: '6:00 AM', passengers: '1', needs_ramp: false })}} className="text-indigo-600 font-bold underline">
          Solicitar otro transporte
        </button>
      </div>
     );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full mb-4 border-4" style={{ backgroundColor: COLORS.green, borderColor: COLORS.yellow }}>
          <Bus size={32} className="text-white" />
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
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Nombre del solicitante</label>
             <input 
               type="text" 
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               required
               placeholder="Tu nombre completo"
               aria-label="Nombre del solicitante"
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
               style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties} 
             />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Teléfono / WhatsApp</label>
             <input 
               type="tel" 
               name="phone"
               value={formData.phone}
               onChange={handleInputChange}
               required
               placeholder="Ej: 8888-8888"
               aria-label="Teléfono o WhatsApp"
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
               style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties} 
             />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Ubicación de recogida (incluye tu distrito, cantón y provincia)</label>
             <div className="flex">
               <input 
                 type="text" 
                 name="pickup_location"
                 value={formData.pickup_location}
                 onChange={handleInputChange}
                 required
                 placeholder="Dirección exacta o link de Waze" 
                 className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 outline-none" 
                 style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties} 
               />
               <button type="button" className="bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 text-gray-600">
                 <MapPin size={24} />
               </button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Hora preferida</label>
               <select 
                 name="preferred_time"
                 value={formData.preferred_time}
                 onChange={handleInputChange}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
               >
                 <option>6:00 AM</option>
                 <option>6:30 AM</option>
                 <option>7:00 AM</option>
                 <option>7:30 AM</option>
                 <option>8:00 AM</option>
                 <option>8:30 AM</option>
                 <option>9:00 AM</option>
                 <option>9:30 AM</option>
                 <option>10:00 AM</option>
                 <option>10:30 AM</option>
                 <option>11:00 AM</option>
                 <option>11:30 AM</option>
                 <option>12:00 PM</option>
                 <option>12:30 PM</option>
                 <option>1:00 PM</option>
                 <option>1:30 PM</option>
                 <option>2:00 PM</option>
                 <option>2:30 PM</option>
                 <option>3:00 PM</option>
                 <option>3:30 PM</option>
                 <option>4:00 PM</option>
                 <option>4:30 PM</option>
                 <option>5:00 PM</option>
                 <option>5:30 PM</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Pasajeros</label>
               <select 
                 name="passengers"
                 value={formData.passengers}
                 onChange={handleInputChange}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
               >
                 <option>1</option>
                 <option>2</option>
                 <option>3+</option>
               </select>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tengo una condición especial
            </label>
            <select
              name="special_condition"
              value={formData.special_condition}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
              style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties}
            >
              <option value="">Ninguna</option>
              <option value="Discapacidad Visual">Discapacidad Visual</option>
              <option value="Discapacidad Auditiva">Discapacidad Auditiva</option>
              <option value="Movilidad Reducida">Movilidad Reducida</option>
              <option value="Otra">Otra</option>
            </select>
          </div>

          {formData.special_condition === 'Otra' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Especifique la condición
              </label>
              <input
                type="text"
                name="special_condition_detail"
                value={formData.special_condition_detail}
                onChange={handleInputChange}
                placeholder="Describa la condición especial"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full text-white font-bold py-3 rounded-lg shadow transition-colors hover:opacity-90 uppercase tracking-wide disabled:opacity-50" 
            style={{ backgroundColor: COLORS.green }}
          >
            {isSubmitting ? 'Enviando...' : 'Agendar Transporte'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransportPage;