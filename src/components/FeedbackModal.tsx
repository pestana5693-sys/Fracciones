import React from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  question: Question;
  xpEarned: number;
  streakCount: number;
  onNext: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  question,
  xpEarned,
  streakCount,
  onNext,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div
          className={`p-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden ${
            isCorrect
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
              : 'bg-gradient-to-r from-amber-500 to-orange-600'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            {isCorrect ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <BookOpen className="w-10 h-10 text-white" />
            )}
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight">
            {isCorrect ? '¡Excelente Trabajo! 🎉' : '¡Casi lo logras! Revisa la explicación'}
          </h3>

          <p className="text-xs text-white/90 mt-1 font-medium">
            {isCorrect
              ? '¡Tu respuesta es matemáticamente correcta!'
              : 'En matemáticas cada error es una oportunidad para aprender.'}
          </p>

          {/* XP & Streak Floating Badge */}
          {isCorrect && xpEarned > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>+{xpEarned} XP</span>
              {streakCount > 1 && (
                <span className="text-amber-200">🔥 Racha x{streakCount}</span>
              )}
            </div>
          )}
        </div>

        {/* Content & Teacher Explanation */}
        <div className="p-6 space-y-4">
          {!isCorrect && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold">
                <span className="text-base">👨‍🏫</span>
                <span>Explicación Paso a Paso — Prof. John Pestana:</span>
              </div>

              <div className="space-y-1.5 text-slate-700 font-medium leading-relaxed pl-1">
                {question.explanationStepByStep.map((step, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-700 font-bold shrink-0">•</span>
                    <span>{step}</span>
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-amber-200/60 font-bold text-amber-900 flex items-center justify-between">
                <span>Respuesta correcta:</span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 font-mono text-sm text-emerald-700">
                  {question.correctAnswer}
                </span>
              </div>
            </div>
          )}

          {isCorrect && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-1.5 text-center font-medium">
              <p className="font-extrabold text-sm text-emerald-800">
                ¡Sigue así, estás cada vez más cerca del siguiente nivel!
              </p>
              <p className="text-emerald-700">
                Respuesta: <strong className="font-mono text-sm text-emerald-900">{question.correctAnswer}</strong>
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onNext}
            className={`w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-base shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}
          >
            <span>Continuar el Reto</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
