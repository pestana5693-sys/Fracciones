import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, AICallStatus, AICallMessage, AICallTopic } from '../types';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  BookOpen,
  Award,
  X,
  Send,
  HelpCircle,
  Activity,
  CheckCircle2,
  RotateCcw,
  Zap,
  Bot,
  PieChart,
  Monitor
} from 'lucide-react';

interface AICallModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  currentLevelName?: string;
  onEarnXp?: (xp: number) => void;
}

const PRESET_TOPICS: AICallTopic[] = [
  {
    id: '1',
    title: 'Suma de Fracciones',
    prompt: 'Profe Alex, ¿cómo puedo sumar 1/2 y 1/3 de forma fácil?',
    icon: '➕',
  },
  {
    id: '2',
    title: 'Simplificar Fracciones',
    prompt: '¿Cómo se simplifica una fracción como 8/12?',
    icon: '✂️',
  },
  {
    id: '3',
    title: 'Fracciones Equivalentes',
    prompt: '¿Qué es una fracción equivalente y cómo encuentro una?',
    icon: '⚖️',
  },
  {
    id: '4',
    title: 'Ayuda con mi Nivel',
    prompt: 'Profe, ¿me das un consejo o pista para superar el nivel actual?',
    icon: '🎯',
  },
];

export const AICallModal: React.FC<AICallModalProps> = ({
  isOpen,
  onClose,
  student,
  currentLevelName,
  onEarnXp,
}) => {
  const [callStatus, setCallStatus] = useState<AICallStatus>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [viewMode, setViewMode] = useState<'avatar' | 'whiteboard' | 'transcript'>('avatar');
  
  // Conversation state
  const [messages, setMessages] = useState<AICallMessage[]>([]);
  const [currentFormula, setCurrentFormula] = useState<string>('1/2 + 1/3 = 3/6 + 2/6 = 5/6');
  const [textInput, setTextInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  // Voice Recognition state
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  // Call summary metrics
  const [formulasReviewedCount, setFormulasReviewedCount] = useState(0);
  const [xpBonusEarned, setXpBonusEarned] = useState(0);

  // Refs
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Start call lifecycle
  useEffect(() => {
    if (isOpen && callStatus === 'idle') {
      startOutgoingCall();
    }
    if (!isOpen && callStatus !== 'idle') {
      endCall();
    }
  }, [isOpen]);

  // Handle call timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callStatus]);

  // Synthesize soft phone ring tone
  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 tone
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
      }, 1200);
    } catch {
      // AudioContext not allowed or silent mode
    }
  };

  // Start outgoing call sequence
  const startOutgoingCall = () => {
    setCallStatus('calling');
    setCallDuration(0);
    setMessages([]);
    setFormulasReviewedCount(0);
    playRingtone();

    // Connect after 2 seconds
    setTimeout(() => {
      setCallStatus('connected');
      const welcomeText = `¡Hola ${student?.name || 'estudiante'}! Hablas con el Profe Alex, tu tutor con IA de Matemáticas de la I.E. Pablo Neruda. ¿En qué duda de fracciones te puedo colaborar hoy?`;
      
      const welcomeMsg: AICallMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        text: welcomeText,
        formula: '1/2 + 1/3 = 5/6',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages([welcomeMsg]);
      setCurrentFormula('1/2 + 1/3 = 3/6 + 2/6 = 5/6');
      speakText(welcomeText);
    }, 2200);
  };

  // End call
  const endCall = () => {
    stopSpeech();
    stopListening();
    setCallStatus('ended');
    const bonus = Math.min(50, 15 + messages.length * 5);
    setXpBonusEarned(bonus);
    if (onEarnXp && bonus > 0) {
      onEarnXp(bonus);
    }
  };

  // Reset & restart call
  const handleRestartCall = () => {
    setCallStatus('idle');
    setTimeout(() => {
      startOutgoingCall();
    }, 100);
  };

  // Text-to-Speech Engine
  const speakText = async (text: string) => {
    if (!isSpeakerOn) return;
    setIsAiSpeaking(true);

    try {
      // First try Gemini Server TTS endpoint
      const res = await fetch('/api/ai-call/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Kore' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          // Play raw PCM audio or data URL
          const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
          audio.onended = () => setIsAiSpeaking(false);
          audio.onerror = () => fallbackWebSpeech(text);
          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback
    }

    fallbackWebSpeech(text);
  };

  const fallbackWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Try to find Spanish voice
      const voices = window.speechSynthesis.getVoices();
      const esVoice = voices.find((v) => v.lang.includes('es'));
      if (esVoice) utterance.voice = esVoice;

      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsAiSpeaking(false);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  };

  // Web Speech API Voice Input
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz directo. Puedes escribir tu mensaje en el campo de texto.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'es-CO';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        stopSpeech();
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (liveTranscript.trim()) {
          handleSendMessage(liveTranscript.trim());
          setLiveTranscript('');
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Send Message to AI Call backend
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isAiThinking) return;

    stopSpeech();
    setTextInput('');

    const userMsg: AICallMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/ai-call/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          studentName: student?.name,
          levelName: currentLevelName,
          history: messages,
        }),
      });

      const data = await res.json();
      setIsAiThinking(false);

      const aiReplyText = data.replyText || 'Interesante pregunta. Recuerda que para resolver fracciones debes mantener el mismo denominador.';
      const formula = data.whiteboardFormula || '';

      if (formula) {
        setCurrentFormula(formula);
        setFormulasReviewedCount((prev) => prev + 1);
      }

      const aiMsg: AICallMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        formula: formula,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(aiReplyText);
    } catch (error) {
      console.error('Error sending call message:', error);
      setIsAiThinking(false);

      const fallbackText = 'En fracciones, siempre simplificamos dividiendo el numerador y denominador por el mismo número primo.';
      const aiMsg: AICallMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(fallbackText);
    }
  };

  // Format Duration string
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 min-h-[580px] max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg font-black text-lg">
                <Bot className="w-6 h-6" />
              </div>
              {callStatus === 'connected' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white leading-tight">Profe Alex IA</h3>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Llamada HD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Tutor de Fracciones • I.E. Pablo Neruda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {callStatus === 'connected' && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold px-3 py-1 rounded-full">
                <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>{formatTime(callDuration)}</span>
              </div>
            )}

            <button
              onClick={() => {
                endCall();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call Screen Body */}
        {callStatus === 'calling' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-indigo-950/40">
            {/* Pulsing Avatar */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping scale-150"></div>
              <div className="absolute -inset-4 rounded-full bg-indigo-500/20 animate-pulse"></div>
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
                  👨‍🏫
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-white mb-1">Llamando al Profe Alex...</h4>
            <p className="text-sm text-slate-400 mb-6">Conectando servicio de voz con Inteligencia Artificial</p>

            <div className="flex items-center justify-center gap-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>

            <button
              onClick={endCall}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Cancelar Llamada</span>
            </button>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/60">
            {/* View Mode Nav Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/50 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('avatar')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                    viewMode === 'avatar'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Avatar Tutor</span>
                </button>
                <button
                  onClick={() => setViewMode('whiteboard')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                    viewMode === 'whiteboard'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Pizarra Virtual</span>
                </button>
                <button
                  onClick={() => setViewMode('transcript')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                    viewMode === 'transcript'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Transcripción</span>
                </button>
              </div>

              {/* Speaker Toggle */}
              <button
                onClick={() => {
                  setIsSpeakerOn(!isSpeakerOn);
                  if (isSpeakerOn) stopSpeech();
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSpeakerOn
                    ? 'bg-slate-800 text-blue-400 border-slate-700'
                    : 'bg-slate-800 text-rose-400 border-rose-900/50'
                }`}
                title={isSpeakerOn ? 'Silenciar altavoz de IA' : 'Activar altavoz'}
              >
                {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* View Mode Content Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
              {viewMode === 'avatar' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  {/* Interactive Audio Wave Visualizer Avatar */}
                  <div className="relative mb-6">
                    <div
                      className={`absolute -inset-6 rounded-full bg-blue-500/10 transition-all ${
                        isAiSpeaking ? 'animate-ping scale-125' : ''
                      }`}
                    ></div>
                    <div
                      className={`relative w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-2xl transition-transform ${
                        isAiSpeaking ? 'scale-105 border-4 border-blue-400' : ''
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
                        👨‍🏫
                      </div>
                    </div>

                    {/* Speaking Equalizer Bars Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-blue-500/40 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <span className={`w-1 h-3 bg-blue-400 rounded-full ${isAiSpeaking ? 'animate-bounce' : ''}`}></span>
                      <span className={`w-1 h-5 bg-indigo-400 rounded-full ${isAiSpeaking ? 'animate-bounce [animation-delay:0.15s]' : ''}`}></span>
                      <span className={`w-1 h-3 bg-purple-400 rounded-full ${isAiSpeaking ? 'animate-bounce [animation-delay:0.3s]' : ''}`}></span>
                    </div>
                  </div>

                  {/* AI Status Text */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      {isAiThinking
                        ? 'Profe Alex pensando respuesta...'
                        : isAiSpeaking
                        ? 'Hablando en alta voz...'
                        : isListening
                        ? 'Escuchando tu voz...'
                        : 'En línea - Haz tu pregunta'}
                    </span>
                  </div>

                  {/* Latest AI Message Bubble */}
                  {messages.length > 0 && (
                    <div className="max-w-lg bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl text-left relative text-sm leading-relaxed text-slate-200">
                      <p className="font-medium">
                        "{messages[messages.length - 1].text}"
                      </p>
                      {messages[messages.length - 1].formula && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/30 text-amber-300 font-mono text-center font-bold text-sm">
                          {messages[messages.length - 1].formula}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'whiteboard' && (
                <div className="flex-1 flex flex-col justify-center items-center p-4">
                  <div className="w-full max-w-lg bg-slate-950 border-2 border-emerald-600/40 rounded-2xl p-6 shadow-2xl relative">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                        <Monitor className="w-4 h-4" />
                        <span>Pizarra Digital Nerudista</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                        En vivo
                      </span>
                    </div>

                    <div className="my-6 text-center">
                      <p className="text-xs text-slate-400 mb-2 uppercase font-mono">Fórmula Explicada:</p>
                      <div className="inline-block px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-2xl text-amber-300 font-black tracking-wide shadow-inner">
                        {currentFormula || '1/2 + 1/3 = 5/6'}
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <p className="font-bold text-emerald-400 mb-1">💡 Regla clave de Fracciones:</p>
                      <p>
                        Para sumar o restar fracciones heterogéneas, busca el Mínimo Común Múltiplo (MCM) de los denominadores para convertir a fracciones equivalentes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'transcript' && (
                <div className="flex-1 overflow-y-auto space-y-3 p-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                        <span>{msg.sender === 'user' ? student?.name || 'Tú' : 'Profe Alex IA'}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                        {msg.formula && (
                          <div className="mt-2 p-1.5 bg-slate-950/70 rounded-lg text-amber-300 font-mono text-xs">
                            {msg.formula}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
                      <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Profe Alex formulando explicación...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Shortcut Call Topics */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Temas rápidos para consultar en la llamada:</span>
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleSendMessage(topic.prompt)}
                      disabled={isAiThinking}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 text-xs font-medium text-slate-200 transition-all disabled:opacity-50"
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Microphone & Input Control Panel */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
              {/* Live Transcript Banner */}
              {isListening && (
                <div className="bg-blue-950/80 border border-blue-500/40 p-2.5 rounded-xl text-xs text-blue-200 flex items-center gap-2 animate-pulse">
                  <Mic className="w-4 h-4 text-blue-400 animate-bounce" />
                  <span className="font-medium">Escuchando: "{liveTranscript || 'Habla ahora...'}"</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Voice Record Mic Button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3.5 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-900/50'
                      : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105'
                  }`}
                  title={isListening ? 'Detener micrófono' : 'Hablar por micrófono'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text Prompt Input */}
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(textInput);
                  }}
                  placeholder="Pregunta o habla con el Profe Alex..."
                  disabled={isAiThinking}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage(textInput)}
                  disabled={!textInput.trim() || isAiThinking}
                  className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>

                {/* Hangup Red Button */}
                <button
                  onClick={endCall}
                  className="p-3.5 rounded-2xl bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg transition-all hover:scale-105 ml-1"
                  title="Colgar Llamada"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call Summary Modal when ended */}
        {callStatus === 'ended' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-extrabold text-white mb-1">Llamada Finalizada</h4>
            <p className="text-xs text-slate-400 mb-6">Resumen de tutoría telefónica con el Profe Alex IA</p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-8">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
                <span className="block text-xs text-slate-400">Duración</span>
                <span className="text-lg font-bold text-white font-mono">{formatTime(callDuration)}</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
                <span className="block text-xs text-slate-400">Fórmulas</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{formulasReviewedCount}</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
                <span className="block text-xs text-slate-400">Bonus XP</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">+{xpBonusEarned} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestartCall}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Llamar de Nuevo</span>
              </button>
              <button
                onClick={() => {
                  setCallStatus('idle');
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
