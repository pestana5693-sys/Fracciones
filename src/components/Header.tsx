import React from 'react';
import { StudentProfile } from '../types';
import { soundFX } from '../data/levelsData';
import { Trophy, BookOpen, Volume2, VolumeX, Award, Sparkles, User, RefreshCw, Phone } from 'lucide-react';

interface HeaderProps {
  student: StudentProfile | null;
  onOpenLeaderboard: () => void;
  onOpenTeacherPanel: () => void;
  onOpenCertificate: () => void;
  onOpenProfile: () => void;
  onOpenAICall: () => void;
  onChangeStudent: () => void;
  isSoundOn: boolean;
  setIsSoundOn: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  onOpenLeaderboard,
  onOpenTeacherPanel,
  onOpenCertificate,
  onOpenProfile,
  onOpenAICall,
  onChangeStudent,
  isSoundOn,
  setIsSoundOn,
}) => {
  const toggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    soundFX.enabled = next;
  };

  const isAllLevelsCompleted = student?.progress.completedLevels.length === 6;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Branding & Institution */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md font-bold text-xl">
              PN
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                I.E. Pablo Neruda
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  Medellín
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Matemáticas 7° • <span className="text-blue-600 font-semibold">Prof. John Pestana</span>
              </p>
            </div>
          </div>

          {/* Quick Sound & Teacher buttons for mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title={isSoundOn ? 'Silenciar' : 'Activar sonido'}
            >
              {isSoundOn ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>
            <button
              onClick={onOpenTeacherPanel}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Panel Docente"
            >
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Student Bar & Action Buttons */}
        {student ? (
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
            {/* Student Chip */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-left group"
            >
              <span className="text-2xl">{student.avatar}</span>
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-1">
                  {student.name}
                  <User className="w-3 h-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="text-amber-600 font-bold flex items-center gap-0.5">
                    ⚡ {student.progress.totalXp} XP
                  </span>
                  <span>•</span>
                  <span className="text-blue-600">
                    {student.progress.completedLevels.length}/6 Niveles
                  </span>
                </div>
              </div>
            </button>

            {/* Certificate Button if unlocked */}
            {isAllLevelsCompleted && (
              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md hover:shadow-lg hover:brightness-105 transition-all animate-pulse"
              >
                <Award className="w-4 h-4" />
                <span>Ver Certificado</span>
              </button>
            )}

            {/* AI Call Tutor Button */}
            <button
              onClick={onOpenAICall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Llamada IA</span>
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 font-semibold text-xs border border-slate-200 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Tabla de Clasificación</span>
              <span className="sm:hidden">Top</span>
            </button>

            {/* Teacher Panel Button (Desktop) */}
            <button
              onClick={onOpenTeacherPanel}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Docente</span>
            </button>

            {/* Sound Toggle (Desktop) */}
            <button
              onClick={toggleSound}
              className="hidden md:flex p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
              title={isSoundOn ? 'Sonido Activado' : 'Sonido Desactivado'}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Switch student */}
            <button
              onClick={onChangeStudent}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Cambiar de estudiante"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTeacherPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Guía Docente John Pestana</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
