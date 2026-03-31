import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { studentService, missionSessionService } from '@/api/dataService';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Lock, Star, Sparkles,
  Monitor, MousePointer2, Shield, Binary, Network, MapPin,
  Trophy, Lightbulb, Heart, Zap, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RobbieFace from '@/components/RobbieFace';
import BadgeSystem from '@/components/BadgeSystem';
import SkillTracker from '@/components/SkillTracker';

const WEEKLY_THEMES_ADVANCED = [
  {
    week: 1,
    title: "Computer Systems Deep Dive",
    description: "Advanced Hardware & Software",
    icon: Monitor,
    color: "from-sky-500 to-blue-600",
    mapPosition: { x: 10, y: 80 },
    tasks: [
      { id: "cpu-memory", title: "CPU & Memory Explorer", emoji: "🧠", type: "game", game: "CPU Memory", skill: "decomposition" },
      { id: "os-basics", title: "Operating System Master", emoji: "💻", type: "game", game: "OS Basics", skill: "abstraction" },
      { id: "file-system", title: "File System Navigator", emoji: "📁", type: "game", game: "File System", skill: "decomposition" },
      { id: "hardware-quiz", title: "Hardware Challenge", emoji: "⚙️", type: "activity", points: 20, skill: "logic" }
    ]
  },
  {
    week: 2,
    title: "Advanced Input & Output",
    description: "Complex Interactions & Devices",
    icon: MousePointer2,
    color: "from-purple-500 to-pink-600",
    mapPosition: { x: 30, y: 60 },
    tasks: [
      { id: "multi-input", title: "Multi-Device Control", emoji: "🎮", type: "game", game: "Multi Input", skill: "logic" },
      { id: "touch-gestures", title: "Gesture Master", emoji: "✋", type: "game", game: "Gestures", skill: "patterns" },
      { id: "accessibility", title: "Accessibility Hero", emoji: "♿", type: "game", game: "Accessibility", skill: "abstraction" },
      { id: "typing-speed", title: "Speed Typing Pro", emoji: "⚡", type: "game", game: "Speed Type", skill: "algorithms" }
    ]
  },
  {
    week: 3,
    title: "Cybersecurity Expert",
    description: "Advanced Safety & Privacy",
    icon: Shield,
    color: "from-green-500 to-emerald-600",
    mapPosition: { x: 50, y: 50 },
    tasks: [
      { id: "encryption", title: "Encryption Detective", emoji: "🔐", type: "game", game: "Encryption", skill: "algorithms" },
      { id: "phishing", title: "Phishing Hunter", emoji: "🎣", type: "game", game: "Phishing", skill: "logic" },
      { id: "privacy", title: "Privacy Guardian", emoji: "🕵️", type: "game", game: "Privacy Guard", skill: "abstraction" },
      { id: "secure-browse", title: "Safe Browsing Expert", emoji: "🌐", type: "activity", points: 25, skill: "logic" }
    ]
  },
  {
    week: 4,
    title: "Computational Thinking Pro",
    description: "Advanced Algorithms & Logic",
    icon: Binary,
    color: "from-amber-500 to-orange-600",
    mapPosition: { x: 70, y: 40 },
    tasks: [
      { id: "loops", title: "Loop Master", emoji: "🔄", type: "game", game: "Loops", skill: "algorithms" },
      { id: "conditionals", title: "If-Then Champion", emoji: "❓", type: "game", game: "Conditionals", skill: "logic" },
      { id: "variables", title: "Variable Wizard", emoji: "📊", type: "game", game: "Variables", skill: "abstraction" },
      { id: "debugging-pro", title: "Debug Challenge", emoji: "🐞", type: "game", game: "Debug Pro", skill: "debugging" }
    ]
  },
  {
    week: 5,
    title: "Network Engineering",
    description: "Internet & Cloud Computing",
    icon: Network,
    color: "from-indigo-500 to-purple-600",
    mapPosition: { x: 85, y: 60 },
    tasks: [
      { id: "protocols", title: "Protocol Expert", emoji: "📡", type: "game", game: "Protocols", skill: "abstraction" },
      { id: "cloud", title: "Cloud Commander", emoji: "☁️", type: "game", game: "Cloud", skill: "decomposition" },
      { id: "api", title: "API Connector", emoji: "🔗", type: "game", game: "API", skill: "algorithms" },
      { id: "web-build", title: "Web Builder", emoji: "🌍", type: "activity", points: 30, skill: "decomposition" }
    ]
  },
  {
    week: 6,
    title: "Tech Innovation Leader",
    description: "Create & Share Technology",
    icon: MapPin,
    color: "from-pink-500 to-rose-600",
    mapPosition: { x: 90, y: 80 },
    tasks: [
      { id: "ai-basics", title: "AI Explorer", emoji: "🤖", type: "game", game: "AI Basics", skill: "algorithms" },
      { id: "robotics", title: "Robotics Pioneer", emoji: "🦾", type: "game", game: "Robotics", skill: "decomposition" },
      { id: "app-design", title: "App Designer", emoji: "📱", type: "game", game: "App Design", skill: "abstraction" },
      { id: "tech-showcase", title: "Innovation Showcase", emoji: "🎪", type: "activity", points: 100, skill: "algorithms" }
    ]
  }
];

export default function LearningPath2() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student');
  const [selectedWeek, setSelectedWeek] = useState(null);

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const students = await studentService.list();
      return students.find(s => s.id === studentId);
    },
    enabled: !!studentId && studentId !== 'null' && studentId !== 'undefined'
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', studentId],
    queryFn: () => missionSessionService.getByStudent(studentId),
    enabled: !!studentId && studentId !== 'null' && studentId !== 'undefined'
  });

  const completedTasks = sessions.filter(s => s.completed).map(s => s.mission_name);

  const completedWeeksEarly = useMemo(() => {
    return WEEKLY_THEMES_ADVANCED.filter(week =>
      week.tasks.every(t => t.type === 'game' ? completedTasks.includes(t.game) : false)
    ).map(w => w.week);
  }, [completedTasks]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && selectedWeek !== null) {
        setSelectedWeek(null);
      }
      if (selectedWeek === null) {
        const numKey = parseInt(e.key);
        if (numKey >= 1 && numKey <= 6) {
          const isAvailable = numKey === 1 || completedWeeksEarly.includes(numKey - 1);
          if (isAvailable) {
            setSelectedWeek(numKey);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedWeek, completedWeeksEarly]);

  if (!studentId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Please select a student first</p>
            <Link to={createPageUrl('StudentPortal')}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                Go to Student Portal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (studentLoading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          <p className="text-gray-600 font-semibold">Loading Level 2...</p>
        </div>
      </div>
    );
  }

  const getTaskProgress = (task) => {
    if (task.type === 'game') {
      return completedTasks.includes(task.game);
    }
    return false;
  };

  const completedWeeks = WEEKLY_THEMES_ADVANCED.filter(week =>
    week.tasks.every(t => getTaskProgress(t))
  ).map(w => w.week);

  const totalCompleted = completedTasks.length;
  const totalHintsUsed = student?.total_hints_used || 0;

  const getWeekProgress = (week) => {
    const completed = week.tasks.filter(t => getTaskProgress(t)).length;
    return {
      completed,
      total: week.tasks.length,
      isComplete: completed === week.tasks.length,
      percentage: (completed / week.tasks.length) * 100
    };
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-orange-100 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('MissionSelect') + `?student=${studentId}`}>
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-yellow-300" />
              <h1 className="text-xl font-black">LEVEL 2: ADVANCED</h1>
              <Crown className="w-5 h-5 text-yellow-300" />
            </div>
            <p className="text-sm text-white/90">{student.name}'s Pro Journey</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-400 text-purple-900 px-3 py-2 rounded-full">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{student.missions_completed}</span>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-6xl mx-auto">
        {selectedWeek === null ? (
          <>
            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-8"
            >
              <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-3xl p-6 shadow-2xl border-8 border-white">
                <div className="text-6xl mb-2">🎖️</div>
                <h2 className="text-3xl font-black text-white mb-1">Learning Path 2.0</h2>
                <p className="text-white/90 font-semibold">Advanced Computer Science</p>
              </div>
            </motion.div>

            <div className="mb-8 text-center">
              <RobbieFace emotion="excited" size="medium" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ready for the Next Level, {student.name}?
              </h2>
              <p className="text-gray-600 mb-2">
                Click a week or press keys 1-6! 🚀
              </p>
              <Link to={createPageUrl('LearningPath') + `?student=${studentId}`}>
                <Button variant="outline" className="mt-2">
                  ← Back to Level 1
                </Button>
              </Link>
            </div>

            {/* Advanced World Map */}
            <div className="relative bg-gradient-to-b from-indigo-200 via-purple-100 to-pink-50 rounded-3xl p-8 mb-8 min-h-[600px] overflow-hidden shadow-2xl border-8 border-white">
              {/* Decorative elements */}
              <div className="absolute top-8 left-12 text-5xl opacity-30">⚡</div>
              <div className="absolute top-16 right-20 text-5xl opacity-30">💎</div>
              <div className="absolute bottom-32 left-24 text-4xl opacity-30">🔮</div>
              <div className="absolute bottom-24 right-16 text-4xl opacity-30">🌟</div>

              {/* Path connecting nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="pathGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                {WEEKLY_THEMES_ADVANCED.slice(0, -1).map((week, i) => {
                  const nextWeek = WEEKLY_THEMES_ADVANCED[i + 1];
                  return (
                    <motion.line
                      key={`path-${i}`}
                      x1={`${week.mapPosition.x}%`}
                      y1={`${week.mapPosition.y}%`}
                      x2={`${nextWeek.mapPosition.x}%`}
                      y2={`${nextWeek.mapPosition.y}%`}
                      stroke="url(#pathGradient2)"
                      strokeWidth="10"
                      strokeDasharray="15,10"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: completedWeeks.includes(week.week) ? 1 : 0 }}
                      transition={{ duration: 1 }}
                    />
                  );
                })}
              </svg>

              {/* Week Nodes */}
              {WEEKLY_THEMES_ADVANCED.map((week, index) => {
                const Icon = week.icon;
                const progress = getWeekProgress(week);
                const isLocked = index > 0 && !completedWeeks.includes(index);
                const isAvailable = index === 0 || completedWeeks.includes(index);

                return (
                  <motion.button
                    key={week.week}
                    onClick={() => isAvailable && setSelectedWeek(week.week)}
                    disabled={isLocked}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2, type: 'spring' }}
                    whileHover={isAvailable ? { scale: 1.15 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2
                      w-36 h-36 rounded-full transition-all
                      ${progress.isComplete
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl border-8 border-white'
                        : isLocked
                          ? 'bg-gray-400 border-4 border-gray-500 opacity-40 cursor-not-allowed'
                          : 'bg-gradient-to-br ' + week.color + ' shadow-2xl border-8 border-white hover:shadow-3xl'
                      }
                    `}
                    style={{
                      left: `${week.mapPosition.x}%`,
                      top: `${week.mapPosition.y}%`,
                      zIndex: 10
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      {isLocked ? (
                        <Lock className="w-12 h-12 text-gray-700" />
                      ) : (
                        <>
                          <Icon className="w-12 h-12 mb-1 text-white drop-shadow-lg" />
                          <span className="text-xs font-black text-white">LV2-{week.week}</span>
                        </>
                      )}
                    </div>

                    {progress.isComplete && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2.5 shadow-xl border-4 border-white"
                      >
                        <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                      </motion.div>
                    )}

                    {!progress.isComplete && progress.completed > 0 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg border-2 border-purple-300">
                        <span className="text-xs font-bold text-purple-600">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}

              {/* Start Flag */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute text-7xl"
                style={{ left: '5%', top: '85%' }}
              >
                🏁
              </motion.div>

              {/* Finish Trophy */}
              {completedWeeks.length === 6 && (
                <motion.div
                  initial={{ scale: 0, rotate: 360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 1 }}
                  className="absolute text-9xl"
                  style={{ left: '92%', top: '75%' }}
                >
                  👑
                </motion.div>
              )}
            </div>

            {/* Keyboard Hint */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-semibold">Advanced Mode: Press 1-6 to Navigate!</span>
              </div>
            </div>

            {/* Badges Section */}
            <div className="mb-8">
              <BadgeSystem
                completedWeeks={completedWeeks}
                totalCompleted={totalCompleted}
                hintsUsed={totalHintsUsed}
              />
            </div>

            {/* Skills Tracking */}
            <div className="mb-8">
              <SkillTracker completedGames={completedTasks} />
            </div>
          </>
        ) : (
          <>
            {/* Week Detail View */}
            <div className="mb-6">
              <Button
                onClick={() => setSelectedWeek(null)}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Level 2 Map
              </Button>
            </div>

            {(() => {
              const currentWeek = WEEKLY_THEMES_ADVANCED[selectedWeek - 1];
              const weekProgress = currentWeek.tasks.filter(t => getTaskProgress(t)).length;
              const weekTotal = currentWeek.tasks.length;
              const isWeekComplete = weekProgress === weekTotal;

              return (
                <>
                  <Card className={`mb-8 overflow-hidden border-0 shadow-2xl bg-gradient-to-br ${currentWeek.color}`}>
                    <CardContent className="p-6 text-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-white/30 backdrop-blur px-3 py-1 rounded-full">
                              <span className="text-sm font-bold">Level 2 - Week {currentWeek.week}</span>
                            </div>
                            <div className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full">
                              <span className="text-xs font-bold">ADVANCED</span>
                            </div>
                          </div>
                          <h2 className="text-3xl font-black mb-2">{currentWeek.title}</h2>
                          <p className="text-white/90 text-lg">{currentWeek.description}</p>
                        </div>
                        <currentWeek.icon className="w-16 h-16 opacity-60" />
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Your Progress</span>
                          <span className="text-sm font-bold">{weekProgress} / {weekTotal} Tasks</span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(weekProgress / weekTotal) * 100}%` }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-500" />
                      Advanced Challenges
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {currentWeek.tasks.map((task, index) => {
                        const isCompleted = getTaskProgress(task);
                        const isLocked = index > 0 && !getTaskProgress(currentWeek.tasks[index - 1]);

                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className={`
                              relative overflow-hidden border-4 transition-all
                              ${isCompleted
                                ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                                : isLocked
                                  ? 'border-gray-300 bg-gray-100 opacity-60'
                                  : 'border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl hover:scale-105'
                              }
                            `}>
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className={`text-5xl flex-shrink-0 ${isLocked ? 'opacity-30' : ''}`}>
                                    {task.emoji}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                                      {task.title}
                                    </h4>
                                    {task.type === 'game' && (
                                      <div className="flex items-center gap-2 mb-3">
                                        <Zap className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-600">Advanced Challenge</span>
                                      </div>
                                    )}

                                    {isCompleted ? (
                                      <div className="flex items-center gap-2 text-green-600 font-bold">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Mastered!</span>
                                      </div>
                                    ) : isLocked ? (
                                      <div className="flex items-center gap-2 text-gray-400 font-semibold">
                                        <Lock className="w-5 h-5" />
                                        <span>Complete previous task</span>
                                      </div>
                                    ) : (
                                      <Button
                                        className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500"
                                        onClick={() => alert(`Coming soon! This is Level 2 content. 🚀`)}
                                      >
                                        Start Challenge
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {isCompleted && (
                                  <div className="absolute top-3 right-3">
                                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full p-2">
                                      <Trophy className="w-5 h-5" />
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {isWeekComplete && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 text-center text-white shadow-2xl"
                    >
                      <div className="text-8xl mb-4">🏆</div>
                      <h2 className="text-4xl font-black mb-3">Level 2 Week {selectedWeek} Complete!</h2>
                      <p className="text-xl mb-6">Elite Badge Earned! You're incredible!</p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => setSelectedWeek(null)}
                          size="lg"
                          className="bg-white text-purple-600 hover:bg-gray-100 font-black text-xl"
                        >
                          ← Back to Map
                        </Button>
                        {selectedWeek < 6 && completedWeeks.includes(selectedWeek) && (
                          <Button
                            onClick={() => setSelectedWeek(selectedWeek + 1)}
                            size="lg"
                            className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-black text-xl"
                          >
                            Next Week →
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </main>
    </div>
  );
}