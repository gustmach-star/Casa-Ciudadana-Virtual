import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { COLORS } from '../constants';

const VotingPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full mb-6 shadow-lg">
          <MapPin size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 font-heading">¿Dónde me toca votar?</h2>
        <p className="text-gray-600 font-body max-w-lg mx-auto">
          Consultá tu centro de votación y número de mesa directamente en la página oficial del Tribunal Supremo de Elecciones.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <div className="mb-6">
          <img 
            src="https://res.cloudinary.com/dkw8sr9rj/image/upload/v1765827717/Logo_Tribunal_Supremo_de_Elecciones_de_Costa_Rica.svg__ksxh6s.png"
            alt="Logo TSE Costa Rica"
            className="w-32 h-auto mx-auto mb-4"
          />
          <h3 className="text-xl font-bold text-gray-800 mb-2 font-heading">Consulta Oficial TSE</h3>
          <p className="text-gray-600 text-sm font-body">
            El Tribunal Supremo de Elecciones mantiene actualizada la información oficial del padrón electoral.
          </p>
        </div>

        <a
          href="https://www.tse.go.cr/dondevotar/donde-votar.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-xl uppercase tracking-wide shadow-md"
          style={{ backgroundColor: COLORS.green }}
        >
          <ExternalLink size={20} className="mr-2" />
          Ir a Consulta del TSE
        </a>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">
            Serás redirigido al sitio oficial del Tribunal Supremo de Elecciones de Costa Rica
          </p>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;