
import React, { useState } from 'react';
import { Vote, Bus, Flag, Users, Search, Menu, X, Sparkles, ShoppingCart } from 'lucide-react';
import { COLORS, CANDIDATE_NAME } from '../constants';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  cart: Record<string, number>;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, cart, onCartClick }) => {
  const [logoError, setLogoError] = useState(false);
  
  // Usamos la URL de Cloudinary proporcionada
  const LogoSrc = "https://res.cloudinary.com/dkw8sr9rj/image/upload/v1763833479/Logo_C_Trans_sqpmj9.png";

  const navItems = [
    { id: 'home', label: 'Inicio', icon: <Vote size={18} /> },
    { id: 'ai', label: 'Coali', icon: <Sparkles size={18} className="text-yellow-300" /> },
    { id: 'donde-votar', label: '¿Dónde Voto?', icon: <Search size={18} /> },
    { id: 'signos', label: 'Identificáte', icon: <Flag size={18} /> },
    { id: 'transporte', label: 'Te llevamos a Votar', icon: <Bus size={18} /> },
    { id: 'voluntariado', label: 'Sumarme', icon: <Users size={18} /> },
  ];

  return (
    <nav className="text-white sticky top-0 z-50 shadow-lg" style={{ backgroundColor: COLORS.green }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 font-bold text-xl cursor-pointer group brand-text" onClick={() => setActiveTab('home')}>
            <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 overflow-hidden relative flex-shrink-0">
               {!logoError ? (
                 <img 
                   src={LogoSrc} 
                   alt="Logo La Casa Común" 
                   className="w-full h-full object-cover scale-150"
                   onError={() => setLogoError(true)}
                 />
               ) : (
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                   {/* Teal Segment (Top Left) */}
                   <path 
                     d="M 20 50 A 30 30 0 0 1 50 20" 
                     fill="none" 
                     stroke="#008e88" 
                     strokeWidth="18" 
                   />
                   {/* Yellow Segment (Top Right) */}
                   <path 
                     d="M 50 20 A 30 30 0 0 1 76 35" 
                     fill="none" 
                     stroke="#f5bf29" 
                     strokeWidth="18" 
                   />
                   {/* Red Segment (Bottom) */}
                   <path 
                     d="M 20 50 A 30 30 0 0 0 76 65" 
                     fill="none" 
                     stroke="#c92a2b" 
                     strokeWidth="18" 
                   />
                   {/* Chat Bubble Tail Hint (Negative Space) */}
                   <path d="M 60 50 L 75 55 L 70 45 Z" fill="white" /> 
                 </svg>
               )}
            </div>
            <span className="block tracking-tight text-xl sm:text-2xl font-extrabold">{CANDIDATE_NAME}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  activeTab === item.id ? 'font-bold border-b-2 border-white' : 'hover:bg-white/10 text-gray-100 font-medium'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-white/10 rounded-md transition-colors"
            >
              <ShoppingCart size={20} />
              {Object.keys(cart).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {Object.keys(cart).length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 pb-4" style={{ backgroundColor: COLORS.green }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`nav-item block w-full text-left px-4 py-3 font-medium ${
                activeTab === item.id ? 'bg-black/10 border-l-4 border-yellow-400 font-bold' : 'hover:bg-black/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
