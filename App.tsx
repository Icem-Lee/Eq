import React, { useState } from 'react';
import FrequencyVisualizer from './components/FrequencyVisualizer';
import AssistantPanel from './components/AssistantPanel';
import { FrequencyTerm } from './types';
import { AudioWaveform, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<FrequencyTerm | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <AudioWaveform className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Spectral</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Frequency Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-300">System Ready</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Visualizer (Dominant) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
             <div className="p-2 bg-indigo-50 rounded-md text-indigo-600">
               <Zap className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-sm font-bold text-slate-800">Interactive Mixing Map</h3>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                 Visualize mixing issues instantly. Hover over the spectrum to see frequency values. 
                 Click any term (like <span className="font-mono bg-red-50 text-red-600 px-1 rounded">Muddy</span> or <span className="font-mono bg-cyan-50 text-cyan-600 px-1 rounded">Thin</span>) 
                 to see its EQ curve and get AI solutions.
               </p>
             </div>
          </div>

          <FrequencyVisualizer 
            selectedTermId={selectedTerm?.id || null} 
            onSelectTerm={setSelectedTerm} 
          />

          {/* Quick Stats / Info Footer */}
          <div className="grid grid-cols-3 gap-4 text-center opacity-60">
             <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Sub Bass: 20-60Hz</div>
             <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Mids: 500-2kHz</div>
             <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Air: 10k-20kHz</div>
          </div>
        </div>

        {/* Right: Assistant (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 h-[600px] lg:h-[calc(100vh-8rem)]">
          <AssistantPanel 
            term={selectedTerm} 
            onClose={() => setSelectedTerm(null)}
          />
        </div>

      </main>
    </div>
  );
};

export default App;