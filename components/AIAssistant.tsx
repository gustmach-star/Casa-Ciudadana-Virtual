import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Send } from 'lucide-react';
import { callGemini } from '../services/geminiService';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy el Asistente Virtual de La Casa Común. Estoy aquí para contarte sobre nuestras propuestas de Economía Digital, Educación e Infraestructura. ¿Qué te gustaría saber?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const systemPrompt = `
      Eres un asistente de campaña política amable, patriótico y moderno para el partido 'La Casa Común' en Costa Rica. 
      Tus ejes son: 
      1. Economía Digital (Nómadas digitales, startups).
      2. Educación Bilingüe (Inglés para todos).
      3. Infraestructura Verde (Trenes eléctricos).
      Responde a las preguntas del usuario basándote en estos ejes. Usa modismos ticos suaves (como 'pura vida', 'vos') pero mantén el profesionalismo. 
      Si te preguntan algo fuera de tema, redirígelos amablemente a las propuestas del partido. Sé conciso (máximo 3 párrafos).
    `;

    const response = await callGemini(userMsg, systemPrompt);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full mb-4 shadow-lg">
          <Sparkles size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-heading">Inteligencia Ciudadana</h2>
        <p className="text-gray-600 font-body">Utilizamos IA para escucharte mejor y construir soluciones juntos.</p>
      </div>

      {/* CHAT MODE */}
      {(
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-[500px] flex flex-col">
          <div className="bg-indigo-600 p-4 text-white font-bold flex justify-between items-center">
            <span>Chat con La Casa</span>
            <span className="text-xs bg-indigo-500 px-2 py-1 rounded text-indigo-100">Powered by Gemini</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Preguntá sobre nuestras propuestas..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;