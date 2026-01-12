import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { COLORS } from '../constants';
import { appendToSheet, formatVolunteerData, SHEETS } from '../services/googleSheetsService';

const VolunteerPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    roles: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format data for Google Sheets
      const rowData = formatVolunteerData(formData);

      // Send to Google Sheets via serverless API
      await appendToSheet(null, SHEETS.SUMARME, rowData);

      setSubmitted(true);
    } catch (error) {
      console.error('Error al guardar solicitud de voluntariado:', error);
      alert('Hubo un error al guardar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{ color: COLORS.green }}>
          <Heart size={40} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por sumarte!</h2>
        <p className="text-gray-600">Tus datos han sido registrados. Un coordinador territorial te contactará por WhatsApp pronto.</p>
        <button onClick={() => { setSubmitted(false); setFormData({ full_name: '', phone: '', location: '', roles: [] }); }} className="mt-8 font-bold uppercase text-sm" style={{ color: COLORS.green }}>Volver al formulario</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full mb-4 border-4" style={{ backgroundColor: COLORS.red, borderColor: COLORS.yellow }}>
          <Heart size={32} className="text-white" fill="white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Uníte al Equipo</h2>
        <p className="text-gray-600">Esta campaña la ganamos entre todos y todas. ¿Cómo te gustaría ayudar?</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Nombre Completo</label>
            <input 
              type="text" 
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              aria-label="Nombre completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
              style={{ '--tw-ring-color': COLORS.red } as React.CSSProperties} 
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
              aria-label="Teléfono o WhatsApp"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
              style={{ '--tw-ring-color': COLORS.red } as React.CSSProperties} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Cantón / Distrito</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none" 
            style={{ '--tw-ring-color': COLORS.red } as React.CSSProperties} 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 font-heading">Me gustaría colaborar en:</label>
          <div className="space-y-3">
            {['Electorales (Apoyo en Centro de Votación)', 'Transporte (Día E)', 'Comunicación/Activismo Digital', 'Volanteos y otras actividades públicas', 'Alimentación'].map((role) => (
              <label key={role} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="h-5 w-5 rounded focus:ring-red-500" 
                  style={{ color: COLORS.red }} 
                />
                <span className="ml-3 text-gray-700">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-[1.01] uppercase tracking-wide disabled:opacity-50" 
          style={{ backgroundColor: COLORS.red }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
};

export default VolunteerPage;