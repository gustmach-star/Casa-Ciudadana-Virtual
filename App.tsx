import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AIAssistantPage from './pages/AIAssistantPage';
import VotingPage from './pages/VotingPage';
import VolunteerPage from './pages/VolunteerPage';
import TransportPage from './pages/TransportPage';
import SignsPage from './pages/SignsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'ai':
        return <AIAssistantPage />;
      case 'donde-votar':
        return <VotingPage />;
      case 'voluntariado':
        return <VolunteerPage />;
      case 'signos':
        return <SignsPage cart={cart} setCart={setCart} showCartModal={showCartModal} setShowCartModal={setShowCartModal} />;
      case 'transporte':
        return <TransportPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        cart={cart}
        onCartClick={() => { setActiveTab('signos'); setShowCartModal(true); }}
      />
      
      <main>
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}