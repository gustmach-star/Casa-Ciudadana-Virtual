
import React, { useState, useEffect } from 'react';
import { MapPin, Users, Heart, Search, ChevronRight, Vote, CreditCard, MessageSquare, ExternalLink, Flag, Bus, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

export const Hero: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => (
  <div className="relative overflow-hidden min-h-[700px] xl:min-h-[900px] flex items-center bg-white">
    
    {/* Green Background Shape (Diagonal Split) */}
    <div className="hero-bg-shape absolute top-0 left-0 w-full xl:w-[60%] h-[55%] xl:h-full z-0" 
         style={{ 
           background: `linear-gradient(120deg, ${COLORS.green} 0%, ${COLORS.greenDark} 100%)`,
           clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)' // Default mobile clip
         }}>
         <style>{`
           @media (min-width: 1280px) {
             .hero-bg-shape {
               clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%) !important;
             }
           }
         `}</style>
    </div>

    {/* Pattern Overlay (Left Side Only) */}
    <div className="absolute inset-0 opacity-10 pattern-grid-lg text-white z-0 pointer-events-none" style={{ width: '100%', maxWidth: '65%' }}></div>

    <div className="max-w-7xl mx-auto px-4 relative z-10 w-full flex flex-col xl:flex-row items-center h-full">
      
      {/* Left Column: Content */}
      <div className="w-full xl:w-1/2 text-center xl:text-left text-white pt-24 xl:pt-0 mb-4 xl:mb-0 z-20">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wide mb-4 text-gray-800 shadow-lg border-2" style={{ backgroundColor: COLORS.yellow, borderColor: COLORS.red, fontFamily: 'var(--font-heading)' }}>
          ELECCIONES 2026
        </div>
        <h1 className="text-4xl md:text-5xl xl:text-7xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-sm">
          Tu Casa Ciudadana <br />
          Digital
        </h1>
        <p className="text-lg md:text-xl xl:text-2xl text-gray-100 mb-6 max-w-lg mx-auto xl:mx-0 font-light leading-relaxed drop-shadow-sm">
          Doná, gestioná tu voluntariado, consultá nuestras propuestas, tu centro de votación, solicitá transporte y signos externos de manera virtual.
        </p>
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto xl:mx-0">
          {/* 1. Donar */}
          <button 
            onClick={() => {
              const donationSection = document.getElementById('donation-section');
              if (donationSection) {
                donationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="text-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-sm backdrop-blur-sm bg-red-600/90 hover:bg-red-600 border-4"
            style={{ backgroundColor: COLORS.red, borderColor: COLORS.yellow }}
          >
            <Heart className="mr-2" size={22} />
            Donar
          </button>
          {/* 2. Coali IA */}
          <button 
            onClick={() => setActiveTab('asistente')}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-sm backdrop-blur-sm border-2 border-purple-300"
          >
            <Sparkles className="mr-2" size={22} style={{ color: COLORS.yellow }} />
            Coali IA
          </button>
          {/* 3. Propaganda */}
          <button 
            onClick={() => setActiveTab('signos')}
            className="bg-white/90 hover:bg-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-sm backdrop-blur-sm border-2"
            style={{ color: COLORS.green, borderColor: COLORS.red }}
          >
            <Flag className="mr-2" size={22} />
            Propaganda
          </button>
          {/* 4. Sumáte */}
          <button 
            onClick={() => setActiveTab('voluntariado')}
            className="bg-white/90 hover:bg-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-sm backdrop-blur-sm border-2"
            style={{ color: COLORS.green, borderColor: COLORS.red }}
          >
            <Users className="mr-2" size={22} />
            Sumáte
          </button>
          {/* 5. ¿Dónde Voto? */}
          <button 
            onClick={() => setActiveTab('donde-votar')}
            className="bg-white/90 hover:bg-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-sm backdrop-blur-sm border-2"
            style={{ color: COLORS.green, borderColor: COLORS.red }}
          >
            <Search className="mr-2" size={22} />
            ¿Dónde Voto?
          </button>
          {/* 6. Te llevamos */}
          <button 
            onClick={() => setActiveTab('transporte')}
            className="bg-white/90 hover:bg-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-sm backdrop-blur-sm border-2"
            style={{ color: COLORS.green, borderColor: COLORS.red }}
          >
            <Bus className="mr-2" size={22} />
            Te llevamos
          </button>
        </div>
      </div>

      {/* Right Column: Candidate Image on White Background */}
      <div className="w-full xl:w-1/2 flex justify-center xl:justify-end items-end relative mt-0 h-full pointer-events-none flex-grow xl:flex-grow-0">
         <div className="relative w-full flex justify-center xl:justify-end items-end h-full">
            {/* Candidate Image - High Z-Index */}
            <img 
              src="https://res.cloudinary.com/dkw8sr9rj/image/upload/v1763858459/Foto_Claudia_Transp_Grande_kl17s0.png" 
              alt="Candidata Claudia Dobles" 
              className="relative z-20 w-[130%] md:w-[100%] max-w-none mx-auto h-auto object-contain origin-bottom scale-135 md:scale-100 -translate-y-4 md:-translate-y-0 xl:w-full xl:max-w-[1200px] xl:mx-auto xl:origin-bottom xl:mb-[-2rem] xl:scale-[2.61] xl:translate-y-[75%] xl:translate-x-[-15%]"
              style={{ 
                filter: 'contrast(1.05) brightness(1.02)',
              }}
            />
         </div>
      </div>

    </div>

    {/* Coalition Logo Overlay - Positioned: Mobile/Tablet (Bottom Right next to photo), Desktop (Top Right) */}
    <img 
      src="https://res.cloudinary.com/dkw8sr9rj/image/upload/v1766335478/Casilla_yqvdo4.png" 
      alt="Coalición Agenda Ciudadana"
      loading="eager"
      className="absolute z-30 bottom-8 right-2 w-36 md:w-72 lg:w-80 bg-white/95 p-1 rounded-lg xl:shadow-none xl:bg-transparent xl:p-0 xl:w-[24rem] xl:top-4 xl:right-8 xl:bottom-auto"
    />
  </div>
);

export const CountDown: React.FC = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date('2026-02-01T00:00:00');
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white py-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <span className="text-gray-600 font-bold uppercase tracking-widest text-sm mb-2 md:mb-0 font-heading">Tiempo para las elecciones (1 Feb 2026)</span>
        <div className="flex space-x-4 text-center">
          <div>
            <span className="text-xl md:text-2xl font-extrabold" style={{ color: COLORS.yellow }}>{timeLeft.days}</span>
            <span className="block text-xs text-gray-500 font-bold uppercase">Días</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-black">:</div>
          <div>
            <span className="text-xl md:text-2xl font-extrabold" style={{ color: COLORS.green }}>{timeLeft.hours}</span>
            <span className="block text-xs text-gray-500 font-bold uppercase">Horas</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-black">:</div>
          <div>
            <span className="text-xl md:text-2xl font-extrabold" style={{ color: COLORS.red }}>{timeLeft.minutes}</span>
            <span className="block text-xs text-gray-500 font-bold uppercase">Min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Proposals: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
       <div className="max-w-4xl mx-auto px-4 text-center">
         <div className="inline-block p-3 rounded-full mb-4 bg-white shadow-md border-2" style={{ borderColor: COLORS.yellow }}>
           <Vote size={32} style={{ color: COLORS.red }} />
         </div>
         <h2 className="text-3xl font-bold text-gray-800 mb-4 font-heading">Nuestras Propuestas</h2>
         <p className="text-lg text-gray-600 mb-8 font-body max-w-2xl mx-auto leading-relaxed">
           Tenemos una visión clara para el futuro de Costa Rica. Conocé en detalle nuestros ejes programáticos y descargá el plan de gobierno completo aquí.
         </p>
         
         <a 
           href="https://scan.page/p/1T6Vtd"
           target="_blank"
           rel="noopener noreferrer" 
           className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all uppercase tracking-wide group"
           style={{ backgroundColor: COLORS.green }}
         >
           DESCARGÁ NUESTRO PLAN DE GOBIERNO
           <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
         </a>
       </div>
    </section>
  )
}

export const Donation: React.FC = () => (
  <div id="donation-section" className="text-white py-12 mt-8" style={{ backgroundColor: COLORS.green }}>
    <div className="max-w-4xl mx-auto px-4 text-center">
      <div className="inline-block p-3 rounded-full mb-4 border-4" style={{ backgroundColor: 'white', borderColor: COLORS.yellow }}>
        <CreditCard size={32} style={{ color: COLORS.red }} />
      </div>
      <h2 className="text-3xl font-bold mb-4">Tu aporte hace la diferencia</h2>
      <p className="text-blue-100 mb-8 max-w-xl mx-auto">
        Esta campaña es financiada por personas como vos. Ayúdanos a llevar el mensaje a cada rincón del país.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-xl border-4" style={{ color: COLORS.green, borderColor: COLORS.yellow }}>
          <h3 className="font-bold text-lg mb-2 font-heading">SINPE Móvil</h3>
          <p className="text-3xl font-extrabold mb-1 font-heading" style={{ color: COLORS.red }}>6110-3247</p>
          <p className="text-xs text-gray-500">A nombre de Partido Acción Ciudadana</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-4" style={{ color: COLORS.green, borderColor: COLORS.red }}>
          <h3 className="font-bold text-lg mb-2 font-heading">Transferencia</h3>
          <p className="font-mono text-sm mb-1 font-bold" style={{ color: COLORS.red }}>CR20015108020011082227</p>
          <p className="text-xs text-gray-500">Banco Nacional</p>
          <p className="text-xs text-gray-500">A nombre de Partido Acción Ciudadana</p>
        </div>
        <div className="text-white p-6 rounded-xl border-4 flex flex-col justify-center items-center cursor-pointer hover:bg-white/10" style={{ borderColor: COLORS.yellow }}>
          <a 
            href="https://wa.me/50684287549" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
              alt="WhatsApp"
              className="w-8 h-8 mb-2"
            />
            <span className="font-bold font-heading">Reportá tu donación</span>
            <p className="text-sm text-center mt-2 text-white/90">Enviános tu comprobante con tu nombre completo y número de cédula</p>
          </a>
        </div>
      </div>
    </div>
  </div>
);
