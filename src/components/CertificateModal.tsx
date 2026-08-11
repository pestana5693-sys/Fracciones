import React from 'react';
import { StudentProfile } from '../types';
import { Award, Printer, X, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  student: StudentProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const starsCount = (Object.values(student.progress.levelStars) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto print:border-2 print:shadow-none print:m-0 print:p-0">
        
        {/* Non-printable modal header */}
        <div className="bg-amber-500 p-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 font-extrabold text-sm">
            <Award className="w-5 h-5 text-white" />
            <span>Certificado de Excelencia Matemática — I.E. Pablo Neruda</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-amber-900 font-extrabold text-xs shadow-md hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DIPLOMA BODY */}
        <div className="p-8 sm:p-12 text-center space-y-6 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 relative border-8 border-double border-amber-600/30 m-4 rounded-2xl">
          
          {/* Institution Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center gap-2 text-amber-700 text-xs font-black uppercase tracking-widest">
              <GraduationCap className="w-5 h-5" />
              República de Colombia • Alcaldía de Medellín
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              Institución Educativa Pablo Neruda
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Formación Integral con Calidad y Valores • Medellín, Colombia
            </p>
          </div>

          {/* Certificate Title */}
          <div className="py-2">
            <span className="text-xs font-extrabold uppercase text-amber-800 tracking-widest bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
              Mención de Honor & Certificado de Excelencia
            </span>
          </div>

          <p className="text-sm text-slate-600 font-medium max-w-lg mx-auto">
            El Docente de Matemáticas de Grado Séptimo otorga el presente reconocimiento oficial a:
          </p>

          {/* Student Name */}
          <div className="py-2">
            <h2 className="text-3xl sm:text-4xl font-black text-blue-900 underline decoration-amber-400 decoration-4 underline-offset-8">
              {student.name}
            </h2>
            <span className="text-xs font-bold text-slate-500 mt-2 block">
              Estudiante de Grado Séptimo (7°)
            </span>
          </div>

          {/* Achievement Description */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto font-medium">
            Por haber superado exitosamente los <strong>6 Niveles Didácticos</strong> de la Aventura de Fracciones, demostrando alto dominio en identificación, comparación, suma, resta, multiplicación y división de fracciones.
          </p>

          {/* Badges & XP summary */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-3 bg-white/80 rounded-2xl border border-amber-200/80 max-w-md mx-auto shadow-xs">
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Puntos acumulados</span>
              <span className="text-base font-black text-amber-700">⚡ {student.progress.totalXp} XP</span>
            </div>
            <div className="h-6 w-px bg-amber-200" />
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Estrellas</span>
              <span className="text-base font-black text-yellow-600">⭐ {starsCount}/18</span>
            </div>
            <div className="h-6 w-px bg-amber-200" />
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Insignias</span>
              <span className="text-base font-black text-indigo-700">🏅 6 de 6</span>
            </div>
          </div>

          {/* Date & Signature section */}
          <div className="pt-8 grid grid-cols-2 gap-8 max-w-md mx-auto text-xs text-slate-700">
            <div className="border-t-2 border-slate-400 pt-2 text-center">
              <p className="font-extrabold text-slate-900">Prof. John Pestana</p>
              <p className="text-[11px] text-slate-500 font-medium">Docente de Matemáticas 7°</p>
              <p className="text-[10px] text-slate-400">I.E. Pablo Neruda</p>
            </div>

            <div className="border-t-2 border-slate-400 pt-2 text-center">
              <p className="font-extrabold text-slate-900">Medellín, Colombia</p>
              <p className="text-[11px] text-slate-500 font-medium">{currentDate}</p>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> Verificado
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
