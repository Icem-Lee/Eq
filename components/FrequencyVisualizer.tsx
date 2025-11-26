import React, { useState, useRef, useEffect } from 'react';
import { BANDS, FREQUENCY_TERMS, FREQ_MAX, FREQ_MIN } from '../constants';
import { FrequencyTerm, Zone } from '../types';
import { Info } from 'lucide-react';

interface Props {
  selectedTermId: string | null;
  onSelectTerm: (term: FrequencyTerm) => void;
}

// Logarithmic Scale Helper
const getLogPosition = (freq: number) => {
  const minLog = Math.log10(FREQ_MIN);
  const maxLog = Math.log10(FREQ_MAX);
  const freqLog = Math.log10(Math.max(freq, FREQ_MIN));
  return ((freqLog - minLog) / (maxLog - minLog)) * 100;
};

// Inverse Log Helper (Position % -> Hz)
const getFreqFromPosition = (pos: number) => {
  const minLog = Math.log10(FREQ_MIN);
  const maxLog = Math.log10(FREQ_MAX);
  const logFreq = (pos / 100) * (maxLog - minLog) + minLog;
  return Math.pow(10, logFreq);
};

const FrequencyVisualizer: React.FC<Props> = ({ selectedTermId, onSelectTerm }) => {
  const [hoverFreq, setHoverFreq] = useState<number | null>(null);
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTerm = FREQUENCY_TERMS.find(t => t.id === selectedTermId);
  const previewTerm = FREQUENCY_TERMS.find(t => t.id === hoveredTermId);
  
  // Determine which term to visualize (Selected takes priority, then Hover)
  const visualizedTerm = activeTerm || previewTerm;
  const isPreview = !activeTerm && !!previewTerm;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setHoverFreq(getFreqFromPosition(percentage));
  };

  const handleMouseLeave = () => {
    setHoverFreq(null);
  };

  // Generate SVG Path for the "EQ Curve"
  const getCurvePath = (term: FrequencyTerm, height: number) => {
    const startX = getLogPosition(term.minHz);
    const endX = getLogPosition(term.maxHz);
    const width = endX - startX;
    const centerX = startX + width / 2;
    
    // Amplitude based on Zone
    let amplitude = 0;
    if (term.zone === Zone.TooMuch) amplitude = -height * 0.8; // Up (Boost)
    else if (term.zone === Zone.TooLittle) amplitude = height * 0.8; // Down (Cut)
    else amplitude = -height * 0.3; // Gentle Up (Balanced)

    // Bezier Control Points for a Bell Curve shape
    // M start,0 C c1x,0 c2x,peak center,peak S c4x,0 end,0
    const zeroY = height / 2;
    const peakY = zeroY + amplitude;
    
    // Smooth bell curve approximation
    return `M ${startX},${zeroY} 
            C ${startX + width * 0.25},${zeroY} ${centerX - width * 0.25},${peakY} ${centerX},${peakY} 
            S ${endX - width * 0.25},${zeroY} ${endX},${zeroY}`;
  };

  const gridLines = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

  return (
    <div className="w-full bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col select-none">
      
      {/* 1. Header & Legend */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-white font-bold text-lg tracking-tight">Spectrum Analyzer</h2>
          <p className="text-slate-400 text-xs font-mono">20Hz - 20kHz • Logarithmic</p>
        </div>
        
        {/* Visual Legend */}
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-red-400">
            <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-red-500/20"></div>
            <span>Too Much (Boost)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-emerald-500/20"></div>
            <span>Balanced</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-3 h-3 rounded-full border-2 border-cyan-500 bg-cyan-500/20"></div>
            <span>Too Little (Cut)</span>
          </div>
        </div>
      </div>

      {/* 2. Main Visualization Area (Scrollable container for mobile) */}
      <div className="relative w-full overflow-x-auto hide-scrollbar bg-slate-900">
        <div 
          ref={containerRef}
          className="relative min-w-[800px] h-[500px] flex flex-col"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          
          {/* --- GRAPH SECTION (Top 40%) --- */}
          <div className="h-[200px] relative border-b border-slate-800 bg-slate-900/50">
            
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {gridLines.map(hz => {
                const x = getLogPosition(hz);
                return (
                  <g key={hz}>
                    <line x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="currentColor" className="text-slate-400" strokeDasharray="4 4" />
                    <text x={`${x}%`} y="15" fill="currentColor" className="text-slate-300 text-[10px]" textAnchor="start" dx="4">
                      {hz >= 1000 ? `${hz/1000}k` : hz}
                    </text>
                  </g>
                );
              })}
              {/* Center Zero Line */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" className="text-slate-500" strokeWidth="1" />
            </svg>

            {/* Active Curve */}
            {visualizedTerm && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl z-10">
                <path 
                  d={getCurvePath(visualizedTerm, 200)} 
                  fill="none" 
                  stroke={
                    visualizedTerm.zone === Zone.TooMuch ? '#ef4444' : 
                    visualizedTerm.zone === Zone.TooLittle ? '#06b6d4' : '#10b981'
                  }
                  strokeWidth="3"
                  className={`transition-all duration-300 ease-out ${isPreview ? 'opacity-40' : 'opacity-100'}`}
                />
                {/* Area Fill */}
                <path 
                  d={`${getCurvePath(visualizedTerm, 200)} L ${getLogPosition(visualizedTerm.maxHz)}%,50% L ${getLogPosition(visualizedTerm.minHz)}%,50% Z`} 
                  fill={
                    visualizedTerm.zone === Zone.TooMuch ? 'url(#gradTooMuch)' : 
                    visualizedTerm.zone === Zone.TooLittle ? 'url(#gradTooLittle)' : 'url(#gradBalanced)'
                  }
                  className={`transition-all duration-300 ${isPreview ? 'opacity-20' : 'opacity-60'}`}
                />
                
                <defs>
                  <linearGradient id="gradTooMuch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="gradTooLittle" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="gradBalanced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* Ruler Line (Mouse Follower) */}
            {hoverFreq && (
              <div 
                className="absolute top-0 bottom-0 border-l border-yellow-400 z-50 pointer-events-none shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                style={{ left: `${getLogPosition(hoverFreq)}%` }}
              >
                <div className="absolute top-8 left-1 bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                  {Math.round(hoverFreq)} Hz
                </div>
              </div>
            )}
          </div>

          {/* --- SWIMLANES SECTION (Bottom 60%) --- */}
          <div className="flex-1 relative flex flex-col justify-between py-4 gap-2">
            
            {/* Background Band Colors (Subtle) */}
            <div className="absolute inset-0 flex opacity-10 pointer-events-none">
              {BANDS.map(band => (
                <div 
                  key={band.label}
                  style={{ width: `${getLogPosition(band.maxHz) - getLogPosition(band.minHz)}%` }}
                  className={`h-full border-r border-white/10 ${band.color}`}
                />
              ))}
            </div>

            {/* Lane: Too Much */}
            <div className="relative h-12 flex items-center">
              <div className="absolute left-2 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-slate-900 px-1 z-10 border border-red-900/50 rounded">Too Much</div>
              <div className="w-full h-[1px] bg-red-900/30 absolute"></div>
              {FREQUENCY_TERMS.filter(t => t.zone === Zone.TooMuch).map(term => (
                <TermButton 
                  key={term.id} 
                  term={term} 
                  isSelected={selectedTermId === term.id}
                  onSelect={onSelectTerm}
                  onHover={setHoveredTermId}
                  colorClass="bg-red-500 hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  dim={!!selectedTermId && selectedTermId !== term.id}
                />
              ))}
            </div>

             {/* Lane: Balanced */}
             <div className="relative h-12 flex items-center">
              <div className="absolute left-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-slate-900 px-1 z-10 border border-emerald-900/50 rounded">Balanced</div>
              <div className="w-full h-[1px] bg-emerald-900/30 absolute"></div>
              {FREQUENCY_TERMS.filter(t => t.zone === Zone.Balanced).map(term => (
                <TermButton 
                  key={term.id} 
                  term={term} 
                  isSelected={selectedTermId === term.id}
                  onSelect={onSelectTerm}
                  onHover={setHoveredTermId}
                  colorClass="bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  dim={!!selectedTermId && selectedTermId !== term.id}
                />
              ))}
            </div>

             {/* Lane: Too Little */}
             <div className="relative h-12 flex items-center">
              <div className="absolute left-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest bg-slate-900 px-1 z-10 border border-cyan-900/50 rounded">Too Little</div>
              <div className="w-full h-[1px] bg-cyan-900/30 absolute"></div>
              {FREQUENCY_TERMS.filter(t => t.zone === Zone.TooLittle).map(term => (
                <TermButton 
                  key={term.id} 
                  term={term} 
                  isSelected={selectedTermId === term.id}
                  onSelect={onSelectTerm}
                  onHover={setHoveredTermId}
                  colorClass="bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  dim={!!selectedTermId && selectedTermId !== term.id}
                />
              ))}
            </div>

            {/* Band Labels Footer */}
            <div className="h-6 mt-2 relative w-full text-[10px] text-slate-500 font-mono uppercase tracking-tight">
               {BANDS.map(band => (
                  <div
                    key={band.label}
                    className="absolute text-center border-l border-slate-700 pl-1 overflow-hidden whitespace-nowrap"
                    style={{ left: `${getLogPosition(band.minHz)}%`, width: `${getLogPosition(band.maxHz) - getLogPosition(band.minHz)}%` }}
                  >
                    {band.label}
                  </div>
               ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const TermButton: React.FC<{
  term: FrequencyTerm;
  isSelected: boolean;
  onSelect: (t: FrequencyTerm) => void;
  onHover: (id: string | null) => void;
  colorClass: string;
  dim: boolean;
}> = ({ term, isSelected, onSelect, onHover, colorClass, dim }) => {
  const left = getLogPosition(term.minHz);
  const width = getLogPosition(term.maxHz) - left;

  return (
    <button
      onClick={() => onSelect(term)}
      onMouseEnter={() => onHover(term.id)}
      onMouseLeave={() => onHover(null)}
      className={`absolute h-7 text-[10px] sm:text-xs font-bold rounded-full text-white transition-all duration-200 flex items-center justify-center px-2 z-20
        ${isSelected ? 'ring-2 ring-white scale-110 z-30' : ''}
        ${dim ? 'opacity-30 blur-[0.5px] scale-95 grayscale' : 'opacity-90 hover:opacity-100 hover:scale-105'}
        ${colorClass}
      `}
      style={{
        left: `${left}%`,
        width: `${width}%`
      }}
    >
      <span className="truncate">{term.label}</span>
    </button>
  );
};

export default FrequencyVisualizer;