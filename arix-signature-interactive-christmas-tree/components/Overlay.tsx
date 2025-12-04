import React from 'react';
import { AppState, ThemeColor } from '../types';
import { Settings2, RotateCw, Lightbulb, Sparkles, BoxSelect, Maximize2 } from 'lucide-react';

interface OverlayProps {
  state: AppState;
  dispatch: React.Dispatch<Partial<AppState>>;
}

export const Overlay: React.FC<OverlayProps> = ({ state, dispatch }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 p-6 md:p-12">
      
      {/* Header */}
      <header className="flex flex-col items-start pointer-events-auto select-none animate-fade-in-down">
        <h2 className="text-arix-gold text-sm md:text-base tracking-[0.3em] uppercase font-bold font-sans mb-1 opacity-80">
          Seasonal Collection 2024
        </h2>
        <h1 className="text-4xl md:text-6xl font-display text-white drop-shadow-lg leading-tight">
          Arix <span className="text-arix-gold italic font-serif">Signature</span>
        </h1>
      </header>

      {/* Controls Panel */}
      <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 self-end md:w-80 transition-all hover:bg-black/50 hover:border-arix-gold/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
          <Settings2 className="text-arix-gold w-5 h-5" />
          <span className="text-white font-serif tracking-widest uppercase text-sm">Interactive Config</span>
        </div>

        {/* Morph Control (New) */}
        <div className="mb-6">
           <label className="text-gray-300 text-sm font-light flex items-center gap-2 mb-3">
            {state.isExploded ? <Maximize2 className="w-4 h-4 text-arix-gold" /> : <BoxSelect className="w-4 h-4 text-arix-gold" />}
            Structure Mode
          </label>
          <button 
            onClick={() => dispatch({ isExploded: !state.isExploded })}
            className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-arix-gold/50 transition-all duration-300 group flex items-center justify-center gap-3"
          >
            <span className={`text-xs uppercase tracking-widest font-bold ${state.isExploded ? 'text-arix-gold' : 'text-white'}`}>
              {state.isExploded ? 'Re-Assemble Tree' : 'Scatter Elements'}
            </span>
          </button>
        </div>

        {/* Lights Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <label className="text-gray-300 text-sm font-light flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-arix-gold" />
            Illumination
          </label>
          <button 
            onClick={() => dispatch({ lightsOn: !state.lightsOn })}
            className={`w-12 h-6 rounded-full transition-colors relative ${state.lightsOn ? 'bg-arix-gold' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${state.lightsOn ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* Theme Selector */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm font-light flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-arix-gold" />
            Ornament Theme
          </label>
          <div className="flex gap-2">
            {(['gold', 'silver', 'ruby'] as ThemeColor[]).map((theme) => (
              <button
                key={theme}
                onClick={() => dispatch({ themeColor: theme })}
                className={`flex-1 py-2 text-xs uppercase tracking-wider border transition-all
                  ${state.themeColor === theme 
                    ? 'border-arix-gold bg-arix-gold/20 text-white' 
                    : 'border-white/20 text-gray-400 hover:border-white/40'
                  }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Rotation Speed */}
        <div className="mb-2">
          <label className="text-gray-300 text-sm font-light flex items-center gap-2 mb-3">
            <RotateCw className="w-4 h-4 text-arix-gold" />
            Rotation Speed
          </label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1" 
            value={state.rotationSpeed}
            onChange={(e) => dispatch({ rotationSpeed: parseFloat(e.target.value) })}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-arix-gold hover:accent-arix-goldLight"
          />
        </div>

      </div>

      {/* Footer / Credits */}
      <div className="absolute bottom-6 left-6 text-white/30 text-xs font-light tracking-widest pointer-events-none">
        ARIX SIGNATURE • INTERACTIVE 3D
      </div>
    </div>
  );
};