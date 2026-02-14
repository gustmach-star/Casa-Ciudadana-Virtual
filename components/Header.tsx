
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
    { id: 'ai', label: 'Coali IA', icon: <Sparkles size={18} className="text-yellow-300" /> },
    { id: 'donde-votar', label: '¿Dónde Voto?', icon: <Search size={18} /> },
    { id: 'transporte', label: 'Te llevamos', icon: <Bus size={18} /> },
    { id: 'signos', label: 'Propaganda', icon: <Flag size={18} /> },
    { id: 'voluntariado', label: 'Sumáte', icon: <Users size={18} /> },
  ];

  return (
    <nav className="text-white sticky top-0 z-50 shadow-lg" style={{ backgroundColor: COLORS.red }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <div className="bg-white px-1 py-0.5 rounded-lg shadow-md transition-transform group-hover:scale-105">
              <img 
                src="https://res.cloudinary.com/dkw8sr9rj/image/upload/c_crop,ar_16:9/v1766333321/Logo_solo_Coalicion.pdf_dboqal.png"
                alt="Coalición Agenda Ciudadana" 
                className="h-28 w-auto"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item flex items-center space-x-1 px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                  activeTab === item.id ? 'font-bold border-b-2' : 'hover:bg-white/10 text-gray-100 font-medium'
                }`}
                style={activeTab === item.id ? { borderBottomColor: COLORS.yellow, fontSize: '14.5px' } : { fontSize: '14.5px' }}
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
              <ShoppingCart size={24} />
              {Object.keys(cart).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {Object.keys(cart).length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 pb-4 pt-5" style={{ backgroundColor: COLORS.red }}>
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
