import React from 'react';
import { Phone, Bot, Sparkles } from 'lucide-react';

interface AICallWidgetProps {
  onOpenCall: () => void;
}

export const AICallWidget: React.FC<AICallWidgetProps> = ({ onOpenCall }) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
      {/* Tooltip badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white border border-blue-500/30 text-xs font-semibold shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>¡Llamada de voz con Profe IA!</span>
      </div>

      {/* Trigger button */}
      <button
        onClick={onOpenCall}
        className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 border border-white/20"
      >
        {/* Animated pulse halo */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
        </span>

        <div className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 animate-bounce" />
          <span className="hidden xs:inline">Llamada IA</span>
        </div>
      </button>
    </div>
  );
};
