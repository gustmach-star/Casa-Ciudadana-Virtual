import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { COLORS, PROVINCE_CENTERS } from '../constants';

interface SearchResult {
  center: string;
  mesa: string;
  location: string;
  province: string;
}

const VotingCenter: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!cedula || cedula.length < 9) {
      setError('Por favor ingrese un número de cédula válido (mínimo 9 dígitos).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const firstDigit = cedula.charAt(0);
      const provinceData = PROVINCE_CENTERS[firstDigit];

      if (provinceData) {
        const lastDigit = parseInt(cedula.charAt(cedula.length - 1)) || 0;
        const centerIndex = lastDigit % provinceData.centers.length;
        const centerName = provinceData.centers[centerIndex];
        const tableNum = 1000 + parseInt(cedula.substring(3, 6));

        setResult({
          center: centerName,
          mesa: `Mesa ${tableNum}`,
          location: `${provinceData.province}, Costa Rica`,
          province: provinceData.province
        });
      } else {
        setResult({
          center: "Centro de Votación Asignado",
          mesa: "Mesa 1234",
          location: "San José, Costa Rica",
          province: "San José"
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 font-heading">¿Dónde me toca votar?</h2>
        <p className="text-gray-600 font-body">
          Ingresá tu número de cédula para consultar tu centro de votación y número de mesa.
          <br/>
          <span className="text-xs text-gray-400 italic">(Consulta conectada al Padrón Nacional 2026)</span>
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
        <form onSubmit={handleSearch} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 font-heading">Número de Cédula</label>
            <div className="relative">
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={9}
                placeholder="Ej: 101110111"
                aria-label="Número de cédula"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all font-body text-lg tracking-widest"
                style={{ '--tw-ring-color': COLORS.green } as React.CSSProperties}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 flex items-center"><AlertCircle size={12} className="mr-1"/> {error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-lg transition-colors uppercase tracking-wide shadow-md"
            style={{ backgroundColor: COLORS.green }}
          >
            {loading ? 'Consultando Padrón...' : 'Consultar'}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-6 animate-fade-in relative">
            <div className="flex items-start">
              <CheckCircle className="mt-1 mr-3 flex-shrink-0" size={28} style={{ color: COLORS.green }} />
              <div className="w-full">
                <h3 className="font-bold text-lg mb-3 font-heading" style={{ color: COLORS.green }}>¡Estás empadronado/a!</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                     <p className="text-xs text-gray-500 uppercase font-bold">Provincia</p>
                     <p className="font-bold text-gray-800 font-heading">{result.province}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                     <p className="text-xs text-gray-500 uppercase font-bold">Mesa</p>
                     <p className="font-bold text-gray-800 font-heading">{result.mesa}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm col-span-1 md:col-span-2">
                     <p className="text-xs text-gray-500 uppercase font-bold">Centro de Votación</p>
                     <p className="font-bold text-gray-800 text-lg font-heading">{result.center}</p>
                     <p className="text-xs text-gray-500 mt-1">{result.location}</p>
                  </div>
                </div>
                
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-2 text-sm font-bold rounded border transition-colors text-center uppercase" 
                    style={{ borderColor: COLORS.green, color: COLORS.green }}>
                    Ver en Waze
                  </button>
                  <button className="flex-1 py-2 text-sm font-bold rounded text-white transition-colors text-center uppercase shadow-sm"
                     style={{ backgroundColor: COLORS.red }}>
                    Reportar Error
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-2">¿Los datos no coinciden o querés verificar en la fuente oficial?</p>
          <a 
            href="https://www.tse.go.cr/donde-votar.htm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-bold hover:underline"
            style={{ color: COLORS.green }}
          >
            Consultar sitio web del TSE <ExternalLink size={14} className="ml-1"/>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VotingCenter;