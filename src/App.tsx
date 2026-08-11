import React, { useState, useEffect } from 'react';
import { StudentProfile, LevelConfig } from './types';
import {
  getStoredCurrentStudent,
  saveCurrentStudent,
  LEVEL_CONFIGS,
  updateLeaderboard,
  soundFX,
} from './data/levelsData';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { LevelMap } from './components/LevelMap';
import { QuizView } from './components/QuizView';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherPanelModal } from './components/TeacherPanelModal';
import { CertificateModal } from './components/CertificateModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AICallModal } from './components/AICallModal';
import { AICallWidget } from './components/AICallWidget';

export default function App() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'map' | 'quiz'>('login');
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAICallOpen, setIsAICallOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Load existing student on mount if any
  useEffect(() => {
    const saved = getStoredCurrentStudent();
    if (saved) {
      setStudent(saved);
      setCurrentView('map');
    }
  }, []);

  // Handle Login / Registration
  const handleStartStudent = (newStudent: StudentProfile) => {
    setStudent(newStudent);
    saveCurrentStudent(newStudent);
    setCurrentView('map');
  };

  // Handle Level Selection
  const handleSelectLevel = (levelId: number) => {
    const lvl = LEVEL_CONFIGS.find((l) => l.id === levelId);
    if (lvl) {
      setActiveLevel(lvl);
      setCurrentView('quiz');
    }
  };

  // Handle Level Completion
  const handleCompleteLevel = (
    levelId: number,
    scorePercentage: number,
    xpEarnedTotal: number,
    starsEarned: number
  ) => {
    if (!student) return;

    const currentLevelConfig = LEVEL_CONFIGS.find((l) => l.id === levelId);
    const badgeName = currentLevelConfig?.badgeName;

    const prevProgress = student.progress;

    // Scores
    const updatedLevelScores = {
      ...prevProgress.levelScores,
      [levelId]: Math.max(prevProgress.levelScores[levelId] || 0, scorePercentage),
    };

    // Stars
    const updatedLevelStars = {
      ...prevProgress.levelStars,
      [levelId]: Math.max(prevProgress.levelStars[levelId] || 0, starsEarned),
    };

    // Completed Levels
    const updatedCompletedLevels = Array.from(
      new Set([...prevProgress.completedLevels, levelId])
    );

    // Unlock Next Level if passed >= 70%
    let updatedUnlocked = [...prevProgress.unlockedLevels];
    if (scorePercentage >= 70 && levelId < 6) {
      updatedUnlocked = Array.from(new Set([...updatedUnlocked, levelId + 1]));
    }

    // Badges
    let updatedBadges = [...prevProgress.badgesEarned];
    if (badgeName && !updatedBadges.includes(badgeName) && scorePercentage >= 70) {
      updatedBadges.push(badgeName);
    }

    // Grand Badge for all 6 levels
    if (updatedCompletedLevels.length === 6 && !updatedBadges.includes('Campeón Matemático Nerudista')) {
      updatedBadges.push('Campeón Matemático Nerudista');
    }

    const updatedProfile: StudentProfile = {
      ...student,
      progress: {
        ...prevProgress,
        unlockedLevels: updatedUnlocked,
        levelScores: updatedLevelScores,
        levelStars: updatedLevelStars,
        completedLevels: updatedCompletedLevels,
        totalXp: prevProgress.totalXp + xpEarnedTotal,
        badgesEarned: updatedBadges,
      },
    };

    setStudent(updatedProfile);
    saveCurrentStudent(updatedProfile);
    setCurrentView('map');
    setActiveLevel(null);
  };

  // Change Student
  const handleChangeStudent = () => {
    setCurrentView('login');
  };

  // Handle earning XP from AI Call tutor
  const handleEarnCallXp = (xpEarned: number) => {
    if (!student) return;
    const updatedStudent: StudentProfile = {
      ...student,
      progress: {
        ...student.progress,
        totalXp: student.progress.totalXp + xpEarned,
      },
    };
    setStudent(updatedStudent);
    saveCurrentStudent(updatedStudent);
    updateLeaderboard(updatedStudent);
  };

  // Reset Local Data
  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas borrar los registros guardados en esta computadora?')) {
      localStorage.clear();
      setStudent(null);
      setCurrentView('login');
      setIsTeacherPanelOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* Top Header */}
      <Header
        student={student}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAICall={() => setIsAICallOpen(true)}
        onChangeStudent={handleChangeStudent}
        isSoundOn={isSoundOn}
        setIsSoundOn={setIsSoundOn}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'login' && (
          <LoginScreen
            onStart={handleStartStudent}
            onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {currentView === 'map' && student && (
          <LevelMap
            student={student}
            onSelectLevel={handleSelectLevel}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {currentView === 'quiz' && activeLevel && student && (
          <QuizView
            level={activeLevel}
            student={student}
            onCompleteLevel={handleCompleteLevel}
            onExitLevel={() => {
              setCurrentView('map');
              setActiveLevel(null);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>I.E. Pablo Neruda</strong> (Medellín, Colombia) • Unidad de Fracciones — Matemáticas 7°
          </div>
          <div>
            Docente Responsable: <strong className="text-blue-600">John Pestana</strong>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <TeacherPanelModal
        isOpen={isTeacherPanelOpen}
        onClose={() => setIsTeacherPanelOpen(false)}
        onResetData={handleResetData}
      />

      {student && (
        <>
          <CertificateModal
            isOpen={isCertificateOpen}
            student={student}
            onClose={() => setIsCertificateOpen(false)}
          />

          <StudentProfileModal
            isOpen={isProfileOpen}
            student={student}
            onClose={() => setIsProfileOpen(false)}
          />
        </>
      )}

      {/* AI Voice Call Assistant Modal & Floating Widget */}
      <AICallModal
        isOpen={isAICallOpen}
        onClose={() => setIsAICallOpen(false)}
        student={student}
        currentLevelName={activeLevel?.title}
        onEarnXp={handleEarnCallXp}
      />

      <AICallWidget onOpenCall={() => setIsAICallOpen(true)} />

    </div>
  );
}
