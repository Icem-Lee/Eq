import React, { useState, useEffect, useRef } from 'react';
import { FrequencyTerm } from '../types';
import { askGeminiAboutFrequency } from '../services/geminiService';
import { Loader2, Send, Bot, X, Zap } from 'lucide-react';

interface Props {
  term: FrequencyTerm | null;
  onClose: () => void;
}

const AssistantPanel: React.FC<Props> = ({ term, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (term) {
      setMessages([{
        role: 'model',
        text: `**${term.label}** detected at ${term.minHz}Hz - ${term.maxHz}Hz.\n\n${term.description}\n\nAsk me for an EQ fix, compressor setting, or mixing tip!`
      }]);
      setInputValue('');
    }
  }, [term]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !term) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askGeminiAboutFrequency(term, userMsg, messages);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const QuickAction = ({ text }: { text: string }) => (
    <button
      onClick={() => {
        setInputValue(text);
        // Optional: Trigger immediately
      }}
      className="text-xs text-left bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
    >
      <Zap className="w-3 h-3 text-amber-500" />
      {text}
    </button>
  );

  if (!term) {
    return (
      <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 rotate-3 transform transition-transform hover:rotate-0">
            <Bot className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">AI Assistant Ready</h3>
          <p className="mt-2 text-sm max-w-[200px] leading-relaxed">
            Select a frequency region in the analyzer to get started.
          </p>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Guide</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Red: Cut these frequencies (Too Much)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>Blue: Boost these frequencies (Too Little)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden ring-1 ring-slate-900/5">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center shadow-md z-10">
        <div>
          <div className="flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full ${
                 term.zone === 'Too Much' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 
                 term.zone === 'Too Little' ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
             }`}></span>
             <h2 className="font-bold text-lg leading-none">{term.label}</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1 opacity-80">{term.minHz}Hz - {term.maxHz}Hz</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-gray-200 rounded-bl-none'}`}
            >
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={`min-h-[1rem] ${line.startsWith('-') ? 'pl-2' : ''}`}>
                   {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                       .replace(/__(.*?)__/g, '<em>$1</em>')
                       .split(/(<strong>.*?<\/strong>|<em>.*?<\/em>)/g).map((part, j) => {
                         if (part.startsWith('<strong>')) return <strong key={j} className="font-bold">{part.replace(/<\/?strong>/g, '')}</strong>;
                         if (part.startsWith('<em>')) return <em key={j}>{part.replace(/<\/?em>/g, '')}</em>;
                         return part;
                       })
                  }
                </p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              <span className="text-xs text-slate-500 font-medium">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 space-y-3">
        {/* Chips */}
        {messages.length < 2 && (
          <div className="flex gap-2 flex-wrap">
             <QuickAction text="How to fix this with EQ?" />
             <QuickAction text="What creates this sound?" />
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this frequency..."
            className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-slate-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !inputValue.trim()}
            className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;