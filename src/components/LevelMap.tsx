import React from 'react';
import { LevelConfig, StudentProfile } from '../types';
import { LEVEL_CONFIGS } from '../data/levelsData';
import { Lock, Star, CheckCircle, Trophy, Award, Play, Sparkles, Shapes, Scale, PlusCircle, MinusCircle, XCircle, DivideCircle } from 'lucide-react';

interface LevelMapProps {
  student: StudentProfile;
  onSelectLevel: (levelId: number) => void;
  onOpenCertificate: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  student,
  onSelectLevel,
  onOpenCertificate,
}) => {
  const { progress } = student;
  const { unlockedLevels, levelScores, levelStars, completedLevels, totalXp, badgesEarned } = progress;

  const totalStarsCount = (Object.values(levelStars) as number[]).reduce((a, b) => a + b, 0);
  const isAllCompleted = completedLevels.length === 6;

  // Render Icon dynamically based on LevelConfig
  const getLevelIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Shapes': return <Shapes className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'PlusCircle': return <PlusCircle className={className} />;
      case 'MinusCircle': return <MinusCircle className={className} />;
      case 'XCircle': return <XCircle className={className} />;
      case 'DivideCircle': return <DivideCircle className={className} />;
      default: return <Shapes className={className} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-100/80 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Student Stats Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-md border-2 border-white">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{student.name}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Estudiante 7°
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                I.E. Pablo Neruda • Progreso actual en la Aventura
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center min-w-[90px]">
              <span className="text-xs font-bold text-amber-700 block">Puntos XP</span>
              <span className="text-lg font-extrabold text-amber-800 flex items-center justify-center gap-1">
                ⚡ {totalXp}
              </span>
            </div>

            <div className="bg-yellow-50 border border-yellow-200/80 rounded-2xl p-3 text-center min-w-[90px]">
              <span className="text-xs font-bold text-yellow-700 block">Estrellas</span>
              <span className="text-lg font-extrabold text-yellow-800 flex items-center justify-center gap-1">
                ⭐ {totalStarsCount}/18
              </span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-3 text-center min-w-[90px]">
              <span className="text-xs font-bold text-indigo-700 block">Insignias</span>
              <span className="text-lg font-extrabold text-indigo-800 flex items-center justify-center gap-1">
                🏅 {badgesEarned.length}/6
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Alert Banner if all 6 levels completed */}
        {isAllCompleted && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <h3 className="text-lg font-extrabold">¡Felicitaciones! Has completado todos los niveles</h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Ya puedes ver y descargar tu Certificado Oficial de la I.E. Pablo Neruda.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenCertificate}
              className="px-5 py-3 rounded-2xl bg-white text-amber-900 font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              🎓 Ver Certificado Oficial
            </button>
          </div>
        )}

        {/* Level Map Header */}
        <div className="text-center py-2">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Mapa del Mundo de las Fracciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supera cada nivel con al menos un 70% de aciertos para desbloquear el siguiente reto.
          </p>
        </div>

        {/* Game Levels Path */}
        <div className="relative py-4">
          <div className="space-y-6">
            {LEVEL_CONFIGS.map((level, idx) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isCompleted = completedLevels.includes(level.id);
              const stars = levelStars[level.id] || 0;
              const maxScore = levelScores[level.id] ?? null;

              // Alternate left/right offset for winding trail look
              const isEven = idx % 2 === 0;

              return (
                <div key={level.id} className="relative flex flex-col items-center">
                  
                  {/* Connector Line to next level */}
                  {idx < LEVEL_CONFIGS.length - 1 && (
                    <div className="absolute top-20 bottom-0 w-1.5 bg-slate-300 z-0 rounded-full" />
                  )}

                  {/* Level Card Node */}
                  <div
                    className={`relative z-10 w-full max-w-xl rounded-3xl p-5 border-2 transition-all duration-300 shadow-md ${
                      isUnlocked
                        ? isCompleted
                          ? 'bg-white border-emerald-400 hover:border-emerald-500 hover:shadow-lg'
                          : 'bg-white border-blue-500 shadow-blue-100 hover:shadow-xl ring-4 ring-blue-100'
                        : 'bg-slate-50/90 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Left: Level Icon & Info */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                            isUnlocked
                              ? `bg-gradient-to-tr ${level.color}`
                              : 'bg-slate-400'
                          }`}
                        >
                          {isUnlocked ? (
                            getLevelIcon(level.iconName, 'w-7 h-7')
                          ) : (
                            <Lock className="w-6 h-6 text-slate-200" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                              Nivel {level.id}
                            </span>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" /> Completado
                              </span>
                            )}
                            {!isUnlocked && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                <Lock className="w-3 h-3" /> Bloqueado
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                            {level.subtitle}
                          </h3>

                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {level.competencia}
                          </p>

                          {/* Stars & Score preview */}
                          {isUnlocked && (
                            <div className="flex items-center gap-3 mt-2.5">
                              {/* Star rating */}
                              <div className="flex items-center gap-1">
                                {[1, 2, 3].map((starNum) => (
                                  <Star
                                    key={starNum}
                                    className={`w-4 h-4 ${
                                      starNum <= stars
                                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                        : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>

                              {maxScore !== null && (
                                <span className="text-xs font-bold text-slate-500">
                                  Mejor Acierto: {maxScore}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Action Button */}
                      <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                        {isUnlocked ? (
                          <button
                            onClick={() => onSelectLevel(level.id)}
                            className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110'
                            }`}
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{isCompleted ? 'Volver a Jugar' : '¡Iniciar Reto!'}</span>
                          </button>
                        ) : (
                          <div className="w-full sm:w-auto text-center px-4 py-2.5 rounded-2xl bg-slate-200 text-slate-500 text-xs font-semibold">
                            Supera el Nivel {level.id - 1} para desbloquear
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges / Medals Showcase */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Colección de Medallas de la I.E. Pablo Neruda
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {badgesEarned.length} de 6 obtenidas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {LEVEL_CONFIGS.map((lvl) => {
              const hasBadge = badgesEarned.includes(lvl.badgeName);

              return (
                <div
                  key={lvl.id}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                    hasBadge
                      ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
                  }`}
                >
                  <span className="text-3xl mb-1">{lvl.badgeIcon}</span>
                  <span className="text-xs font-extrabold text-slate-800 line-clamp-1">
                    {lvl.badgeName}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                    {hasBadge ? '¡Desbloqueada!' : `Nivel ${lvl.id}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
