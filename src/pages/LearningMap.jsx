import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Lock, Star, Trophy, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageContext';
import { getTranslation } from '@/components/translations';

const getWeeks = (language) => [
  {
    id: 1,
    titleKey: 'week1Title',
    subtitleKey: 'week1Subtitle',
    theme: 'from-green-400 to-emerald-600',
    icon: '🌳',
    position: { x: 10, y: 60 },
    activityKey: 'week1Activity',
    learningKey: 'week1Learning',
    color: 'green'
  },
  {
    id: 2,
    titleKey: 'week2Title',
    subtitleKey: 'week2Subtitle',
    theme: 'from-slate-500 to-stone-700',
    icon: '🦇',
    position: { x: 25, y: 40 },
    activityKey: 'week2Activity',
    learningKey: 'week2Learning',
    color: 'slate'
  },
  {
    id: 3,
    titleKey: 'week3Title',
    subtitleKey: 'week3Subtitle',
    theme: 'from-red-400 to-rose-600',
    icon: '🏰',
    position: { x: 40, y: 55 },
    activityKey: 'week3Activity',
    learningKey: 'week3Learning',
    color: 'red'
  },
  {
    id: 4,
    titleKey: 'week4Title',
    subtitleKey: 'week4Subtitle',
    theme: 'from-sky-400 to-blue-600',
    icon: '☁️',
    position: { x: 55, y: 30 },
    activityKey: 'week4Activity',
    learningKey: 'week4Learning',
    color: 'sky'
  },
  {
    id: 5,
    titleKey: 'week5Title',
    subtitleKey: 'week5Subtitle',
    theme: 'from-cyan-400 to-teal-600',
    icon: '🐠',
    position: { x: 70, y: 65 },
    activityKey: 'week5Activity',
    learningKey: 'week5Learning',
    color: 'cyan'
  },
  {
    id: 6,
    titleKey: 'week6Title',
    subtitleKey: 'week6Subtitle',
    theme: 'from-purple-400 to-violet-600',
    icon: '👑',
    position: { x: 85, y: 45 },
    activityKey: 'week6Activity',
    learningKey: 'week6Learning',
    color: 'purple'
  }
];

export default function LearningMap() {
  const { language } = useLanguage();
  const WEEKS = getWeeks(language);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [robbiePosition, setRobbiePosition] = useState(WEEKS[0].position);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learningMapProgress');
    if (saved) {
      const { current, completed } = JSON.parse(saved);
      setCurrentWeek(current);
      setCompletedWeeks(completed);
      setRobbiePosition(WEEKS[current - 1]?.position || WEEKS[0].position);
    }
  }, []);

  const handleLevelClick = (week) => {
    if (week.id <= currentWeek) {
      setRobbiePosition(week.position);
      setTimeout(() => setSelectedLevel(week), 500);
    }
  };

  const completeLevel = (weekId) => {
    if (!completedWeeks.includes(weekId)) {
      const newCompleted = [...completedWeeks, weekId];
      const newCurrent = Math.min(currentWeek + 1, 6);
      setCompletedWeeks(newCompleted);
      setCurrentWeek(newCurrent);
      
      localStorage.setItem('learningMapProgress', JSON.stringify({
        current: newCurrent,
        completed: newCompleted
      }));
    }
    setSelectedLevel(null);
  };

  const getPathPoints = () => {
    return WEEKS.map(w => `${w.position.x}% ${w.position.y}%`).join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-200 to-green-200 overflow-hidden relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-red-500 to-orange-500 border-b-4 border-yellow-400 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-white hover:bg-white/20 font-bold" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getTranslation(language, 'back')}
            </Button>
          </Link>
          <h1 className="text-white font-bold text-center" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
            🎮 {getTranslation(language, 'learningPath')} 🎮
          </h1>
          <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full border-2 border-yellow-600 shadow-md">
            <Trophy className="w-5 h-5 text-yellow-800" />
            <span className="font-black text-yellow-900" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}>
              {completedWeeks.length}/6
            </span>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative w-full h-[calc(100vh-80px)] overflow-x-auto overflow-y-hidden">
        <div className="relative min-w-[1200px] h-full" style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 50px, rgba(255,255,255,0.1) 51px)',
          backgroundSize: '50px 50px'
        }}>
          
          {/* Path Trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <path
              d={`M ${WEEKS.map(w => `${w.position.x}% ${w.position.y}%`).join(' L ')}`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="10,5"
              strokeLinecap="round"
            />
          </svg>

          {/* Ground Elements */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-600 to-transparent" style={{ zIndex: 0 }} />
          
          {/* Clouds */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-70"
              style={{ 
                left: `${10 + i * 15}%`, 
                top: `${5 + (i % 3) * 10}%`,
                zIndex: 0
              }}
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            >
              ☁️
            </motion.div>
          ))}

          {/* Week Levels */}
          {WEEKS.map((week, index) => {
            const isUnlocked = week.id <= currentWeek;
            const isCompleted = completedWeeks.includes(week.id);
            const isCurrent = week.id === currentWeek;

            return (
              <motion.div
                key={week.id}
                className="absolute"
                style={{ 
                  left: week.position.x + '%', 
                  top: week.position.y + '%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Platform */}
                <div className="relative">
                  <div className={`w-28 h-28 rounded-2xl border-4 shadow-xl cursor-pointer transition-all ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${week.theme} border-yellow-400 hover:scale-110` 
                      : 'bg-gray-400 border-gray-600'
                  }`}
                  onClick={() => handleLevelClick(week)}
                  style={{
                    boxShadow: isUnlocked ? '0 8px 0 rgba(0,0,0,0.3)' : '0 4px 0 rgba(0,0,0,0.2)',
                  }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {isUnlocked ? (
                        <>
                          <div className="text-4xl mb-1">{week.icon}</div>
                          <div className="text-white font-black text-xs" style={{ fontFamily: "'Press Start 2P', cursive", textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>
                            {getTranslation(language, 'weekShort')}{week.id}
                          </div>
                        </>
                      ) : (
                        <Lock className="w-12 h-12 text-gray-600" />
                      )}
                    </div>

                    {/* Completed Star */}
                    {isCompleted && (
                      <motion.div
                        className="absolute -top-4 -right-4 bg-yellow-300 rounded-full p-2 border-4 border-yellow-500"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring" }}
                      >
                        <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                      </motion.div>
                    )}

                    {/* Current Indicator */}
                    {isCurrent && !isCompleted && (
                      <motion.div
                        className="absolute -top-6 left-1/2 -translate-x-1/2"
                        animate={{ y: [-5, 0, -5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>

                  {/* Level Name */}
                  <div className="mt-3 text-center">
                    <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full border-2 border-gray-800 shadow-md">
                      <p className="text-xs font-black text-gray-800" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                        {getTranslation(language, week.titleKey)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Robbie Character */}
          <motion.div
            className="absolute text-6xl"
            animate={{
              left: robbiePosition.x + '%',
              top: robbiePosition.y + '%',
            }}
            transition={{ type: "spring", damping: 15 }}
            style={{ 
              transform: 'translate(-50%, -50%)',
              zIndex: 15,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          >
            🤖
          </motion.div>
        </div>
      </div>

      {/* Mission Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLevel(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className={`bg-gradient-to-br ${selectedLevel.theme} p-1 rounded-3xl max-w-2xl w-full shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '4px solid rgba(255,255,255,0.3)'
              }}
            >
              <div className="bg-white rounded-3xl p-8 relative">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">{selectedLevel.icon}</div>
                  <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                    {getTranslation(language, 'week')} {selectedLevel.id}
                  </h2>
                  <h3 className="text-2xl font-bold text-gray-700 mb-1">
                    {getTranslation(language, selectedLevel.titleKey)}
                  </h3>
                  <p className="text-lg text-gray-500 italic">
                    {getTranslation(language, selectedLevel.subtitleKey)}
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎯</span>
                      {getTranslation(language, 'activity')}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {getTranslation(language, selectedLevel.activityKey)}
                    </p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      {getTranslation(language, 'whatYoullLearn')}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {getTranslation(language, selectedLevel.learningKey)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setSelectedLevel(null)}
                    variant="outline"
                    className="flex-1 h-14 text-lg font-bold border-2"
                  >
                    {getTranslation(language, 'close')}
                  </Button>
                  <Button
                    onClick={() => completeLevel(selectedLevel.id)}
                    className={`flex-1 h-14 text-lg font-bold bg-gradient-to-r ${selectedLevel.theme} text-white`}
                    disabled={completedWeeks.includes(selectedLevel.id)}
                  >
                    {completedWeeks.includes(selectedLevel.id) ? (
                      <>
                        <Star className="w-5 h-5 mr-2" />
                        {getTranslation(language, 'completed')}
                      </>
                    ) : (
                      <>
                        {getTranslation(language, 'completeWeek')}
                        <Trophy className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Press Start 2P Font */}
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
    </div>
  );
}