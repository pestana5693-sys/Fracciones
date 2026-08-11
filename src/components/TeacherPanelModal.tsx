import React, { useState } from 'react';
import { LEVEL_CONFIGS, getStoredLeaderboard } from '../data/levelsData';
import { BookOpen, GraduationCap, Download, RefreshCw, CheckCircle, Copy, X, Users, Award, ShieldAlert } from 'lucide-react';

interface TeacherPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  isOpen,
  onClose,
  onResetData,
}) => {
  const [copied, setCopied] = useState(false);
  const leaderboard = getStoredLeaderboard();

  if (!isOpen) return null;

  const handleCopyReport = () => {
    let reportText = `REPORTE DE PROGRESO MATEMÁTICAS 7° - I.E. PABLO NERUDA\n`;
    reportText += `Docente Responsable: John Pestana\n`;
    reportText += `Fecha: ${new Date().toLocaleDateString('es-CO')}\n`;
    reportText += `--------------------------------------------------\n\n`;

    leaderboard.forEach((st, i) => {
      reportText += `${i + 1}. ${st.studentName} | XP: ${st.totalXp} | Estrellas: ${st.starsCount} | Niveles Completados: ${st.levelsCompletedCount}/6\n`;
    });

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Panel Docente — Prof. John Pestana</h3>
              <p className="text-xs text-indigo-100 font-medium">I.E. Pablo Neruda (Medellín) • Unidad Pedagógica de Fracciones</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          
          {/* Section 1: Pedagogical Map */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-indigo-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Estructura Pedagógica del Plan de Estudios (6 Niveles)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEVEL_CONFIGS.map((lvl) => (
                <div key={lvl.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-700">Nivel {lvl.id}: {lvl.subtitle}</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                      Mín. 70%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {lvl.competencia}
                  </p>
                  <div className="text-[11px] text-amber-700 font-semibold pt-1">
                    Medalla: {lvl.badgeIcon} {lvl.badgeName}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Student Roster in LocalStorage */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Registros de Estudiantes en esta Sala de Sistemas ({leaderboard.length})
              </h4>

              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Planilla'}</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200 max-h-48 overflow-y-auto">
              {leaderboard.map((st, i) => (
                <div key={st.id || i} className="p-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span>{st.avatar}</span>
                    <span className="text-slate-800 font-bold">{st.studentName}</span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600">
                    <span>⚡ {st.totalXp} XP</span>
                    <span>⭐ {st.starsCount} Estrellas</span>
                    <span className="text-indigo-600">{st.levelsCompletedCount}/6 Niveles</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Classroom Instructions & Data Reset */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 space-y-2 text-amber-900">
            <h5 className="font-extrabold text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Recomendaciones de uso en la I.E. Pablo Neruda
            </h5>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Esta aplicación guarda el avance de cada estudiante en la memoria local (localStorage) del navegador. No requiere internet para funcionar después de cargar la página.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">
                ¿Quieres borrar los datos guardados para un nuevo grupo de alumnos?
              </span>
              <button
                onClick={onResetData}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Reiniciar Progreso Local
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Entendido, Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
