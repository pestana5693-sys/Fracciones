export type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

export type QuestionType = 
  | 'multiple-choice'
  | 'classify-drag'
  | 'compare-symbol'
  | 'fraction-input';

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface MixedFraction {
  whole: number;
  numerator: number;
  denominator: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  subPrompt?: string;
  visualData?: {
    fraction?: Fraction;
    fractions?: Fraction[];
    pieSegments?: number;
    pieFilled?: number;
    shapeType?: 'circle' | 'bar';
  };
  options?: string[]; // for multiple choice
  correctAnswer: string; // string comparison e.g. "3/4" or "propia" or ">"
  explanationStepByStep: string[]; // Step-by-step teacher explanation
  categoryTag?: string;
  // Drag and drop or classification specific
  dragItems?: { id: string; text: string; category: string }[];
  categories?: string[];
}

export interface LevelConfig {
  id: LevelId;
  title: string;
  subtitle: string;
  competencia: string;
  iconName: string;
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  color: string; // Tailwind color theme
  minScoreToPass: number; // percentage, default 70
}

export interface UserProgress {
  unlockedLevels: number[]; // e.g. [1, 2]
  levelScores: Record<number, number>; // levelId -> maxScore percentage
  levelStars: Record<number, number>; // levelId -> 1, 2, or 3 stars
  completedLevels: number[];
  totalXp: number;
  maxStreak: number;
  badgesEarned: string[]; // array of badge names
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  progress: UserProgress;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  avatar: string;
  totalXp: number;
  starsCount: number;
  levelsCompletedCount: number;
  lastUpdated: string;
}

export type AICallStatus = 'idle' | 'calling' | 'connected' | 'ended';

export interface AICallMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  formula?: string;
  timestamp: string;
}

export interface AICallTopic {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

