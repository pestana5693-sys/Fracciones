import { LevelConfig, StudentProfile, LeaderboardEntry } from '../types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    title: 'Nivel 1: Explorador de Tipos',
    subtitle: 'Identificación y Tipos de Fracciones',
    competencia: 'Diferenciar e identificar fracciones propias, impropias, mixtas y equivalentes.',
    iconName: 'Shapes',
    badgeName: 'Explorador de Fracciones',
    badgeIcon: '🏅',
    badgeDescription: 'Otorgado por dominar los tipos de fracciones (propias, impropias, mixtas y equivalentes).',
    color: 'from-blue-500 to-indigo-600',
    minScoreToPass: 70,
  },
  {
    id: 2,
    title: 'Nivel 2: Balanza Matemática',
    subtitle: 'Comparación y Ordenación de Fracciones',
    competencia: 'Comparar y ordenar fracciones mediante productos cruzados y denominadores comunes (>, <, =).',
    iconName: 'Scale',
    badgeName: 'Maestro de la Comparación',
    badgeIcon: '⚖️',
    badgeDescription: 'Otorgado por comparar y ordenar fracciones con precisión y rapidez.',
    color: 'from-emerald-500 to-teal-600',
    minScoreToPass: 70,
  },
  {
    id: 3,
    title: 'Nivel 3: El Puente de la Suma',
    subtitle: 'Suma de Fracciones',
    competencia: 'Sumar fracciones de igual y distinto denominador con simplificación final.',
    iconName: 'PlusCircle',
    badgeName: 'Experto en Suma Fraccionaria',
    badgeIcon: '➕',
    badgeDescription: 'Otorgado por dominar la adición de fracciones homogéneas y heterogéneas.',
    color: 'from-amber-500 to-orange-600',
    minScoreToPass: 70,
  },
  {
    id: 4,
    title: 'Nivel 4: El Valle de la Resta',
    subtitle: 'Resta de Fracciones',
    competencia: 'Restar fracciones de igual y diferente denominador simplificando el resultado.',
    iconName: 'MinusCircle',
    badgeName: 'Guardián de la Resta',
    badgeIcon: '➖',
    badgeDescription: 'Otorgado por sustraer fracciones con denominadores comunes y diversos.',
    color: 'from-rose-500 to-red-600',
    minScoreToPass: 70,
  },
  {
    id: 5,
    title: 'Nivel 5: La Torre de la Multiplicación',
    subtitle: 'Multiplicación de Fracciones',
    competencia: 'Multiplicar fracciones directamente (numerador × numerador y denominador × denominador).',
    iconName: 'XCircle',
    badgeName: 'Alquimista del Producto',
    badgeIcon: '✖️',
    badgeDescription: 'Otorgado por calcular productos de fracciones y enteros con elegancia.',
    color: 'from-purple-500 to-pink-600',
    minScoreToPass: 70,
  },
  {
    id: 6,
    title: 'Nivel 6: El Templo de la División',
    subtitle: 'División de Fracciones',
    competencia: 'Dividir fracciones utilizando productos cruzados o el inverso multiplicativo.',
    iconName: 'DivideCircle',
    badgeName: 'Gran Sabio de la División',
    badgeIcon: '➗',
    badgeDescription: 'Otorgado por resolver divisiones entre fracciones y completar la gran aventura.',
    color: 'from-cyan-500 to-blue-700',
    minScoreToPass: 70,
  },
];

export const AVATARS = [
  { id: 'student_boy1', emoji: '🧑‍🎓', name: 'Mateo', bg: 'bg-blue-100 text-blue-700' },
  { id: 'student_girl1', emoji: '👩‍🎓', name: 'Valentina', bg: 'bg-pink-100 text-pink-700' },
  { id: 'student_boy2', emoji: '👦', name: 'Santiago', bg: 'bg-green-100 text-green-700' },
  { id: 'student_girl2', emoji: '👧', name: 'Camila', bg: 'bg-purple-100 text-purple-700' },
  { id: 'student_owl', emoji: '🦉', name: 'Búho Sabio', bg: 'bg-amber-100 text-amber-700' },
  { id: 'student_robot', emoji: '🤖', name: 'MathBot', bg: 'bg-cyan-100 text-cyan-700' },
];

const LOCAL_STORAGE_KEY_CURRENT_USER = 'ie_pablo_neruda_current_student_v1';
const LOCAL_STORAGE_KEY_LEADERBOARD = 'ie_pablo_neruda_leaderboard_v1';

export function getStoredCurrentStudent(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentStudent(profile: StudentProfile): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_USER, JSON.stringify(profile));
    updateLeaderboard(profile);
  } catch (e) {
    console.error('Error saving student to localStorage', e);
  }
}

export function getStoredLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LEADERBOARD);
    if (!raw) return getDefaultLeaderboard();
    const list: LeaderboardEntry[] = JSON.parse(raw);
    return list.sort((a, b) => b.totalXp - a.totalXp);
  } catch {
    return getDefaultLeaderboard();
  }
}

export function updateLeaderboard(student: StudentProfile): void {
  try {
    const currentList = getStoredLeaderboard();
    const starsCount = Object.values(student.progress.levelStars).reduce((a, b) => a + b, 0);
    const existingIndex = currentList.findIndex((item) => item.id === student.id || item.studentName.toLowerCase() === student.name.toLowerCase());

    const entry: LeaderboardEntry = {
      id: student.id,
      studentName: student.name,
      avatar: student.avatar,
      totalXp: student.progress.totalXp,
      starsCount,
      levelsCompletedCount: student.progress.completedLevels.length,
      lastUpdated: new Date().toLocaleDateString('es-CO'),
    };

    if (existingIndex >= 0) {
      currentList[existingIndex] = entry;
    } else {
      currentList.push(entry);
    }

    currentList.sort((a, b) => b.totalXp - a.totalXp);
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADERBOARD, JSON.stringify(currentList));
  } catch (e) {
    console.error('Error updating leaderboard', e);
  }
}

export function createNewStudent(name: string, avatar: string): StudentProfile {
  return {
    id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    avatar,
    createdAt: new Date().toLocaleDateString('es-CO'),
    progress: {
      unlockedLevels: [1], // Level 1 is always unlocked first
      levelScores: {},
      levelStars: {},
      completedLevels: [],
      totalXp: 0,
      maxStreak: 0,
      badgesEarned: [],
    },
  };
}

function getDefaultLeaderboard(): LeaderboardEntry[] {
  return [
    {
      id: 'demo_1',
      studentName: 'Mariana López (7°A)',
      avatar: '👩‍🎓',
      totalXp: 1850,
      starsCount: 18,
      levelsCompletedCount: 6,
      lastUpdated: '04/08/2026',
    },
    {
      id: 'demo_2',
      studentName: 'Kevin Restrepo (7°B)',
      avatar: '🧑‍🎓',
      totalXp: 1420,
      starsCount: 15,
      levelsCompletedCount: 5,
      lastUpdated: '04/08/2026',
    },
    {
      id: 'demo_3',
      studentName: 'Sofía Jaramillo (7°A)',
      avatar: '👧',
      totalXp: 980,
      starsCount: 10,
      levelsCompletedCount: 3,
      lastUpdated: '04/08/2026',
    },
  ];
}

// 🔊 Web Audio API Synthesizer for Offline Sound FX
class SoundFXManager {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  playIncorrect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.2); // E3

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  playLevelComplete() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const soundFX = new SoundFXManager();
