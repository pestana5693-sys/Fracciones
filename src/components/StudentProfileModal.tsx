import React from 'react';
import { StudentProfile } from '../types';
import { LEVEL_CONFIGS } from '../data/levelsData';
import { Award, Star, Flame, Sparkles, X, User, CheckCircle2 } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  student: StudentProfile;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  if (!isOpen) return null;

  const { progress } = student;
  const starsCount = (Object.values(progress.levelStars) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-2xl bg-white/20 backdrop-blur-md">{student.avatar}</span>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">{student.name}</h3>
              <p className="text-xs text-blue-100 font-medium">Estudiante de Matemáticas 7° • I.E. Pablo Neruda</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Puntos XP</span>
              <span className="text-lg font-black text-amber-800">⚡ {progress.totalXp}</span>
            </div>

            <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-200 text-center">
              <span className="text-[10px] font-bold text-yellow-700 uppercase block">Estrellas</span>
              <span className="text-lg font-black text-yellow-800">⭐ {starsCount}/18</span>
            </div>

            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200 text-center">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block">Insignias</span>
              <span className="text-lg font-black text-indigo-800">🏅 {progress.badgesEarned.length}</span>
            </div>
          </div>

          {/* Level Scores */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Avance por Niveles
            </h4>

            <div className="space-y-1.5">
              {LEVEL_CONFIGS.map((lvl) => {
                const isCompleted = progress.completedLevels.includes(lvl.id);
                const stars = progress.levelStars[lvl.id] || 0;
                const score = progress.levelScores[lvl.id] ?? 0;

                return (
                  <div
                    key={lvl.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">Nivel {lvl.id}: {lvl.subtitle}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <>
                          <span className="text-emerald-700 font-extrabold">{score}%</span>
                          <span className="text-yellow-500">{'⭐'.repeat(stars)}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 font-normal">Pendiente</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Earned List */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Insignias Desbloqueadas
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {LEVEL_CONFIGS.map((lvl) => {
                const hasBadge = progress.badgesEarned.includes(lvl.badgeName);

                return (
                  <div
                    key={lvl.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                      hasBadge
                        ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400 grayscale'
                    }`}
                  >
                    <span className="text-xl">{lvl.badgeIcon}</span>
                    <span className="truncate">{lvl.badgeName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
