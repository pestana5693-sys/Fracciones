import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { AVATARS, createNewStudent, getStoredLeaderboard } from '../data/levelsData';
import { Sparkles, Trophy, BookOpen, GraduationCap, Play, ChevronRight, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onStart: (student: StudentProfile) => void;
  onOpenTeacherPanel: () => void;
  onOpenLeaderboard: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onStart,
  onOpenTeacherPanel,
  onOpenLeaderboard,
}) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].emoji);
  const [errorMsg, setErrorMsg] = useState('');

  const leaderboard = getStoredLeaderboard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor escribe tu nombre o apodo para iniciar la aventura.');
      return;
    }
    setErrorMsg('');
    const student = createNewStudent(name, selectedAvatar);
    onStart(student);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-b from-blue-50 via-indigo-50/50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden my-6">
        {/* Banner Hero */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 text-white relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-12 top-4 text-6xl opacity-20 pointer-events-none font-mono">
            ¾ + ½
          </div>

          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-100 mb-3 border border-white/20">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            I.E. Pablo Neruda • Medellín
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Aventura de Fracciones
          </h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-lg leading-relaxed">
            Aprende, practica y domina el mundo de las fracciones mediante retos interactivos, niveles y medallas.
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-3 text-xs text-blue-200">
            <span>Docente de Matemáticas: <strong className="text-white font-semibold">John Pestana</strong></span>
            <span>•</span>
            <span>Grado Séptimo (7°)</span>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                1. ¿Cómo te llamas?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ej. Mateo Pérez (7°A)"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-800 font-semibold text-base placeholder:text-slate-400 outline-none"
                maxLength={30}
              />
              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                  ⚠️ {errorMsg}
                </p>
              )}
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                2. Elige tu Avatar para el mapa
              </label>
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.emoji)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all ${
                      selectedAvatar === av.emoji
                        ? 'border-blue-600 bg-blue-50/80 scale-105 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{av.emoji}</span>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1 truncate w-full text-center">
                      {av.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white group-hover:translate-x-0.5 transition-transform" />
              <span>¡Comenzar la Aventura!</span>
            </button>
          </form>

          {/* Quick Stats or Leaderboard Preview */}
          {leaderboard.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" /> Top Estudiantes en esta computadora
                </span>
                <button
                  onClick={onOpenLeaderboard}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  Ver todos <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {leaderboard.slice(0, 3).map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <span className="text-lg">{entry.avatar}</span>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate">{entry.studentName}</div>
                      <div className="text-slate-500 font-semibold">{entry.totalXp} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Info Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>¿Eres docente o quieres conocer la guía pedagógica de los 6 niveles?</span>
            </div>
            <button
              onClick={onOpenTeacherPanel}
              className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-100 transition-colors shadow-xs shrink-0 ml-2"
            >
              Ver Guía Docente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
