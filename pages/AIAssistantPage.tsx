
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Lightbulb, Send } from 'lucide-react';
import { callGemini } from '../services/geminiService';
import { GOVERNMENT_PLAN_TEXT } from '../data/governmentPlan';

type Message = {
  role: 'user' | 'model';
  text: string;
};

const AIAssistantPage: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'ideas'>('chat');
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy Coali, tu Asistente Virtual de La Coalición Agenda Ciudadana. Conozco a fondo nuestro Programa de Gobierno 2026-2030. Preguntame sobre nuestras propuestas en educación, seguridad, economía, ambiente o cualquier otro tema.' }
  ]);
  const [ideaResult, setIdeaResult] = useState('');
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
      Eres Coali, el asistente oficial de campaña del partido "La Casa Común" (Coalición Agenda Ciudadana) para las elecciones de Costa Rica 2026.
      
      TU OBJETIVO: Responder a las preguntas de la ciudadanía basándote ÚNICAMENTE en el texto del Programa de Gobierno que se te proporciona abajo.

      INSTRUCCIONES CLAVE:
      1. Tu nombre es Coali. Usa un tono amable, patriótico, costarricense (puedes usar "vos") y profesional.
      2. Si la respuesta a la pregunta del usuario NO está en el texto provisto, di honestamente: "Esa propuesta específica no aparece en nuestro plan de gobierno actual, pero estamos abiertos a escuchar tus ideas". No inventes propuestas.
      3. Sé conciso. Respuestas de máximo 3 párrafos.
      4. Si te preguntan por la candidata, es Claudia Dobles Camargo.
      
      CONTEXTO (PROGRAMA DE GOBIERNO):
      ${GOVERNMENT_PLAN_TEXT}
    `;

    const response = await callGemini(userMsg, systemPrompt);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const handleIdeaSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const problem = input;
    setLoading(true);
    
    const systemPrompt = `
      Eres Coali, una experta en innovación social del partido 'Coalición Agenda Ciudadana'. 
      El usuario te dará un problema de su comunidad. 
      Tu tarea es generar una 'Propuesta Solución' corta, inspiradora y viable que utilice tecnología o sostenibilidad, alineada con la visión del partido.
      
      CONTEXTO DEL PARTIDO:
      ${GOVERNMENT_PLAN_TEXT.substring(0, 5000)}... (Resumen de principios)

      Estructura la respuesta así:
      🎯 Título de la Solución
      💡 La Idea (2 oraciones)
      🚀 Impacto Esperado
    `;

    const response = await callGemini(problem, systemPrompt);
    setIdeaResult(response);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full mb-4 shadow-lg">
          <Sparkles size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-heading">Coali: Tu asistente de IA</h2>
        <p className="text-gray-600 font-body">Hablá con Coali para conocer nuestras propuestas o generar soluciones juntos.</p>
      </div>

      {/* Toggle Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button 
            onClick={() => setMode('chat')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center ${mode === 'chat' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Bot size={18} className="mr-2" />
            Coali
          </button>
          <button 
            onClick={() => { setMode('ideas'); setInput(''); }}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center ${mode === 'ideas' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Lightbulb size={18} className="mr-2" />
            Ideatón
          </button>
        </div>
      </div>

      {/* CHAT MODE */}
      {mode === 'chat' && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-[60vh] md:h-[500px] flex flex-col">
          <div className="bg-indigo-600 p-4 text-white font-bold flex justify-between items-center">
            <span>Chat con Coali</span>
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
              aria-label="Escribir mensaje a Coali"
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

      {/* IDEAS MODE */}
      {mode === 'ideas' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {!ideaResult ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading">Transformá tu queja en una propuesta</h3>
              <p className="text-gray-600 mb-6 text-sm">Contanos qué problema ves en tu barrio (ej: huecos, falta de luz, basura) y Coali generará una propuesta de política pública alineada con nuestros valores.</p>
              
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ejemplo: En mi barrio hay un parque abandonado que se ha vuelto peligroso por las noches..."
                className="w-full border border-gray-300 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] font-body text-sm"
              />
              
              <button 
                onClick={handleIdeaSubmit}
                disabled={loading || !input.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.01] flex items-center justify-center shadow-md"
              >
                {loading ? (
                  <>
                    <Sparkles size={20} className="animate-spin mr-2" />
                    Generando Solución...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    Generar Propuesta con IA
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-indigo-900 font-heading">Propuesta Generada</h3>
                <button 
                  onClick={() => { setIdeaResult(''); setInput(''); }}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium underline"
                >
                  Nueva Idea
                </button>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 whitespace-pre-line leading-relaxed text-gray-800 shadow-inner font-body">
                {ideaResult}
              </div>

              <div className="mt-6 flex justify-center">
                 <button className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                    Guardar en mis propuestas
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
