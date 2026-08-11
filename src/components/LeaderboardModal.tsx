import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { getStoredLeaderboard } from '../data/levelsData';
import { Trophy, Award, Search, X, Trash2, RefreshCw } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const leaderboard = getStoredLeaderboard();

  if (!isOpen) return null;

  const filtered = leaderboard.filter((item) =>
    item.studentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Tabla de Clasificación</h3>
              <p className="text-xs text-amber-100 font-medium">I.E. Pablo Neruda • Mejores puntajes locales</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar estudiante por nombre..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-semibold text-xs">
              No hay estudiantes registrados con ese nombre.
            </div>
          ) : (
            filtered.map((entry, idx) => {
              const rankIcon =
                idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

              return (
                <div
                  key={entry.id || idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-amber-50/80 border-amber-300/80 shadow-xs'
                      : idx === 1
                      ? 'bg-slate-50 border-slate-300'
                      : idx === 2
                      ? 'bg-orange-50/50 border-orange-200'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-extrabold text-base text-slate-700">
                      {rankIcon}
                    </span>

                    <span className="text-2xl">{entry.avatar}</span>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {entry.studentName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                        <span>⭐ {entry.starsCount} estrellas</span>
                        <span>•</span>
                        <span>{entry.levelsCompletedCount}/6 niveles</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-700 block">
                      ⚡ {entry.totalXp} XP
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {entry.lastUpdated}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Guardado automáticamente en localStorage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 font-bold text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
