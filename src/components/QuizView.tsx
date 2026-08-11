import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelConfig, Question, StudentProfile } from '../types';
import { generateQuestionsForLevel, parseFractionString, fractionToString, simplifyFraction } from '../utils/mathUtils';
import { soundFX } from '../data/levelsData';
import { FractionDisplay } from './FractionDisplay';
import { FeedbackModal } from './FeedbackModal';
import { Heart, Flame, Sparkles, Timer, ArrowLeft, Check, RefreshCw, Trophy, HelpCircle, Award } from 'lucide-react';

interface QuizViewProps {
  level: LevelConfig;
  student: StudentProfile;
  onCompleteLevel: (levelId: number, scorePercentage: number, xpEarnedTotal: number, starsEarned: number) => void;
  onExitLevel: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  level,
  student,
  onCompleteLevel,
  onExitLevel,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [levelXp, setLevelXp] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // User selection states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputNum, setInputNum] = useState('');
  const [inputDen, setInputDen] = useState('');

  // Feedback modal state
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize questions on mount
  useEffect(() => {
    const qList = generateQuestionsForLevel(level.id, 8);
    setQuestions(qList);
    setCurrentIndex(0);
    setLives(3);
    setStreak(0);
    setLevelXp(0);
    setCorrectAnswersCount(0);
    setIsGameOver(false);
  }, [level.id]);

  // Non-blocking timer tick
  useEffect(() => {
    if (isGameOver || showFeedback) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, showFeedback]);

  // Calculate final results when level finishes
  const totalQuestionsCount = questions.length || 8;
  const scorePercentage = Math.round((correctAnswersCount / totalQuestionsCount) * 100);
  const isPassed = scorePercentage >= level.minScoreToPass && lives > 0;
  const starsEarned = scorePercentage >= 90 ? 3 : scorePercentage >= 80 ? 2 : scorePercentage >= 70 ? 1 : 0;

  // Trigger level finish & celebration
  useEffect(() => {
    if (isGameOver && isPassed) {
      soundFX.playLevelComplete();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isGameOver, isPassed]);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Cargando reto de fracciones...</p>
        </div>
      </div>
    );
  }

  // Handle checking the user's answer
  const handleCheckAnswer = (answerProvided?: string) => {
    if (showFeedback || isGameOver) return;

    let userAns = answerProvided ?? selectedOption;

    // If question type is fraction-input
    if (currentQuestion.type === 'fraction-input') {
      const num = parseInt(inputNum, 10);
      const den = parseInt(inputDen, 10);
      if (isNaN(num) || isNaN(den) || den === 0) return;
      const simplified = simplifyFraction(num, den);
      userAns = fractionToString(simplified);
    }

    if (!userAns) return;

    const isCorrect = userAns.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    setIsCurrentCorrect(isCorrect);

    if (isCorrect) {
      soundFX.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);

      // XP Bonus multiplier: base 50 XP + 20 XP per streak
      const streakMultiplier = newStreak >= 3 ? 1.5 : newStreak >= 2 ? 1.2 : 1.0;
      const questionXp = Math.round(50 * streakMultiplier);

      setLevelXp((prev) => prev + questionXp);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      soundFX.playIncorrect();
      setStreak(0);
      setLives((prev) => Math.max(0, prev - 1));
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setInputNum('');
    setInputDen('');

    // Check if lives reached 0
    if (lives <= 0 && !isCurrentCorrect) {
      setIsGameOver(true);
      return;
    }

    // Check if last question
    if (currentIndex + 1 >= questions.length) {
      setIsGameOver(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Format timer
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render Game Over / Level Results Screen
  if (isGameOver) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-slate-100/90 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-slate-50 border border-slate-100 text-5xl">
            {isPassed ? '🏆' : '💪'}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isPassed ? '¡Nivel Superado con Éxito!' : '¡Inténtalo de Nuevo!'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isPassed
                ? `Demostraste tu dominio en ${level.subtitle}`
                : `Necesitas un mínimo de ${level.minScoreToPass}% para desbloquear el siguiente nivel.`}
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold">
            <div>
              <span className="text-slate-400 block font-normal">Aciertos</span>
              <span className="text-base font-extrabold text-slate-800">
                {correctAnswersCount}/{questions.length} ({scorePercentage}%)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Puntos XP</span>
              <span className="text-base font-extrabold text-amber-600">⚡ {levelXp}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Estrellas</span>
              <span className="text-base font-extrabold text-yellow-600">⭐ {starsEarned}/3</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {isPassed ? (
              <button
                onClick={() => onCompleteLevel(level.id, scorePercentage, levelXp, starsEarned)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-base shadow-md hover:scale-[1.01] transition-all cursor-pointer"
              >
                ¡Guardar y Continuar en el Mapa! 🚀
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuestions(generateQuestionsForLevel(level.id, 8));
                  setCurrentIndex(0);
                  setLives(3);
                  setStreak(0);
                  setLevelXp(0);
                  setCorrectAnswersCount(0);
                  setIsGameOver(false);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-md hover:scale-[1.01] transition-all cursor-pointer"
              >
                Reintentar Nivel {level.id} 🔄
              </button>
            )}

            <button
              onClick={onExitLevel}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Volver al Mapa de Niveles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-100/80 py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={onExitLevel}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Mapa</span>
          </button>

          {/* Level Title */}
          <div className="text-center truncate px-2">
            <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block">
              Nivel {level.id}
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 truncate">
              {level.subtitle}
            </h3>
          </div>

          {/* Lives & Streak */}
          <div className="flex items-center gap-3">
            {/* Lives */}
            <div className="flex items-center gap-0.5 text-xs font-bold text-rose-600">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Pregunta {currentIndex + 1} de {questions.length}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Timer className="w-3.5 h-3.5" /> {formatTime(secondsElapsed)}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 space-y-6">
          
          {/* Question Prompt */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {currentQuestion.prompt}
            </h2>
            {currentQuestion.subPrompt && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {currentQuestion.subPrompt}
              </p>
            )}
          </div>

          {/* Visual Fraction Data if present */}
          {currentQuestion.visualData?.fraction && (
            <div className="flex justify-center py-2">
              <FractionDisplay
                fraction={currentQuestion.visualData.fraction}
                size="lg"
                showVisual={true}
                visualType={currentQuestion.visualData.shapeType || 'circle'}
              />
            </div>
          )}

          {/* Question Type 1: Multiple Choice */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedOption(opt);
                      handleCheckAnswer(opt);
                    }}
                    className={`p-4 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-between shadow-xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="font-mono">{opt}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : String.fromCharCode(65 + idx)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type 2: Compare Symbols (>, <, =) */}
          {currentQuestion.type === 'compare-symbol' && currentQuestion.visualData?.fractions && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-center gap-6 sm:gap-10 py-2 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <FractionDisplay fraction={currentQuestion.visualData.fractions[0]} size="lg" />

                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-dashed border-blue-400 flex items-center justify-center font-extrabold text-2xl text-blue-700 shadow-sm">
                  {selectedOption || '?'}
                </div>

                <FractionDisplay fraction={currentQuestion.visualData.fractions[1]} size="lg" />
              </div>

              <div className="flex items-center justify-center gap-4">
                {['>', '<', '='].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      setSelectedOption(sym);
                      handleCheckAnswer(sym);
                    }}
                    className="w-16 h-16 rounded-2xl border-2 border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-500 font-extrabold text-2xl text-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question Type 3: Fraction Input (Numerator / Denominator) */}
          {currentQuestion.type === 'fraction-input' && (
            <div className="space-y-6 pt-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="inline-flex flex-col items-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 font-mono">
                  <input
                    type="number"
                    value={inputNum}
                    onChange={(e) => setInputNum(e.target.value)}
                    placeholder="Numerador"
                    className="w-24 text-center py-2 px-2 border-2 border-slate-300 rounded-xl font-bold text-lg bg-white focus:border-blue-500 outline-none"
                  />
                  <div className="w-28 border-b-4 border-slate-700 my-2" />
                  <input
                    type="number"
                    value={inputDen}
                    onChange={(e) => setInputDen(e.target.value)}
                    placeholder="Denominador"
                    className="w-24 text-center py-2 px-2 border-2 border-slate-300 rounded-xl font-bold text-lg bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCheckAnswer()}
                disabled={!inputNum || !inputDen}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-base shadow-md disabled:opacity-50 hover:brightness-105 transition-all cursor-pointer"
              >
                Comprobar Respuesta
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Step-by-Step Teacher Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        isCorrect={isCurrentCorrect}
        question={currentQuestion}
        xpEarned={isCurrentCorrect ? Math.round(50 * (streak >= 3 ? 1.5 : streak >= 2 ? 1.2 : 1)) : 0}
        streakCount={streak}
        onNext={handleNextQuestion}
      />
    </div>
  );
};
