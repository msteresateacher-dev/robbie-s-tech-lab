import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { studentService, missionSessionService } from '@/api/dataService';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Lock, Star, Sparkles,
  Monitor, MousePointer2, Shield, Binary, Network, MapPin,
  Trophy, Lightbulb, Heart, Crown, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RobbieFace from '@/components/RobbieFace';
import BadgeSystem from '@/components/BadgeSystem';
import SkillTracker from '@/components/SkillTracker';
import MissionAchievementMap from '@/components/MissionAchievementMap';

const WEEKLY_THEMES = [
  {
    week: 1,
    title: "Introduction to Computers",
    description: "What is a Computer?",
    icon: Monitor,
    color: "from-sky-400 to-blue-500",
    mapPosition: { x: 10, y: 80 },
    tasks: [
      { id: "identify-parts", title: "Find Computer Parts", emoji: "🖥️", type: "game", game: "Hardware Anatomy", skill: "decomposition" },
      { id: "touch-keyboard", title: "Keyboard Explorer", emoji: "⌨️", type: "game", game: "Keyboard Fun", skill: "logic" },
      { id: "power-on", title: "Power Button Practice", emoji: "⚡", type: "game", game: "Power On/Off", skill: "logic" },
      { id: "screen-real", title: "Screen vs Real World", emoji: "📱", type: "game", game: "Screen World", skill: "abstraction" }
    ]
  },
  {
    week: 2,
    title: "Input & Output Basics",
    description: "How We Talk to Computers",
    icon: MousePointer2,
    color: "from-purple-400 to-pink-500",
    mapPosition: { x: 30, y: 60 },
    tasks: [
      { id: "mouse-clicks", title: "Master the Mouse", emoji: "🖱️", type: "game", game: "Mouse Skills", skill: "logic" },
      { id: "type-letters", title: "Letter Hunt", emoji: "🔤", type: "game", game: "Letter Hunt", skill: "patterns" },
      { id: "input-output", title: "Input & Output", emoji: "⌨️", type: "game", game: "Input & Output", skill: "logic" },
      { id: "touch-type", title: "Touch vs Type", emoji: "📱", type: "game", game: "Touch vs Type", skill: "abstraction" }
    ]
  },
  {
    week: 3,
    title: "Staying Safe Online",
    description: "Being Kind & Safe",
    icon: Shield,
    color: "from-green-400 to-emerald-500",
    mapPosition: { x: 50, y: 50 },
    tasks: [
      { id: "passwords", title: "Password Protector", emoji: "🔒", type: "game", game: "Password Protector", skill: "patterns" },
      { id: "be-kind", title: "Kindness Detective", emoji: "💖", type: "game", game: "Be Kind", skill: "logic" },
      { id: "screen-time", title: "Screen Time Helper", emoji: "⏰", type: "game", game: "Screen Time Helper", skill: "logic" },
      { id: "private-info", title: "What's Private?", emoji: "🤫", type: "activity", points: 10, skill: "abstraction" }
    ]
  },
  {
    week: 4,
    title: "How Computers Think",
    description: "Binary, Data & Sorting",
    icon: Binary,
    color: "from-amber-400 to-orange-500",
    mapPosition: { x: 70, y: 40 },
    tasks: [
      { id: "binary", title: "Binary Lights", emoji: "💡", type: "game", game: "Binary Lights", skill: "patterns" },
      { id: "sorting", title: "Data Detective", emoji: "🔍", type: "game", game: "Data Detective", skill: "patterns" },
      { id: "patterns", title: "Pattern Master", emoji: "🎨", type: "game", game: "Pixel Painter", skill: "patterns" },
      { id: "sequences", title: "Wake Up Robbie", emoji: "🤖", type: "game", game: "Wake Up Robbie", skill: "algorithms" }
    ]
  },
  {
    week: 5,
    title: "Connections & Communication",
    description: "How Computers Connect",
    icon: Network,
    color: "from-indigo-400 to-purple-500",
    mapPosition: { x: 85, y: 60 },
    tasks: [
      { id: "cables", title: "Cable Connector", emoji: "🔌", type: "game", game: "Cables", skill: "decomposition" },
      { id: "network", title: "Network Navigator", emoji: "🌐", type: "game", game: "Network Navigator", skill: "abstraction" },
      { id: "messages", title: "Send Messages", emoji: "✉️", type: "game", game: "Signal Share", skill: "algorithms" },
      { id: "music-code", title: "Music Code", emoji: "🎵", type: "game", game: "Music Code", skill: "algorithms" }
    ]
  },
  {
    week: 6,
    title: "Brooklyn Tech Heroes",
    description: "Computers Help Our Community",
    icon: MapPin,
    color: "from-pink-400 to-rose-500",
    mapPosition: { x: 90, y: 80 },
    tasks: [
      { id: "helper-bot", title: "Community Helper", emoji: "🏘️", type: "game", game: "Helper Bot", skill: "algorithms" },
      { id: "weather", title: "Weather Reporter", emoji: "🌤️", type: "game", game: "Weather Reporter", skill: "abstraction" },
      { id: "photos", title: "Photo Memory", emoji: "📷", type: "game", game: "Photo Memory", skill: "decomposition" },
      { id: "celebration", title: "Tech Fair!", emoji: "🎉", type: "activity", points: 50, skill: "algorithms" }
    ]
  }
];

export default function LearningPath() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  const { data: student } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => studentService.list().then(students =>
      students.find(s => s.id === studentId)
    ),
    enabled: !!studentId
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', studentId],
    queryFn: () => missionSessionService.getByStudent(studentId),
    enabled: !!studentId
  });

  const completedTasks = sessions.filter(s => s.completed).map(s => s.mission_name);

  const getTaskProgress = (task) => {
    if (task.type === 'game') {
      return completedTasks.includes(task.game);
    }
    return false;
  };

  // Calculate completed weeks and gamification stats
  const completedWeeks = WEEKLY_THEMES.filter(week =>
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

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && selectedWeek !== null) {
        setSelectedWeek(null);
      }
      if (selectedWeek === null) {
        const numKey = parseInt(e.key);
        if (numKey >= 1 && numKey <= 6) {
          const weekToSelect = WEEKLY_THEMES[numKey - 1];
          const progress = getWeekProgress(weekToSelect);
          // Only allow selection if previous week is complete or it's week 1
          if (numKey === 1 || completedWeeks.includes(numKey - 1)) {
            setSelectedWeek(numKey);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedWeek, completedWeeks]);

  if (!studentId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl">🗺️</div>
        <h2 className="text-2xl font-black text-gray-800 text-center">Choose a Student First!</h2>
        <p className="text-gray-500 text-center">You need to select a student profile to view their Learning Path.</p>
        <Link to={createPageUrl('StudentPortal')}>
          <Button size="lg" className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-lg rounded-2xl">
            Go to Student Portal
          </Button>
        </Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-500">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('MissionSelect') + `?student=${studentId}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">{student.name}'s Learning Path</h1>
            <p className="text-sm text-gray-500">6-Week Computer Course</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-100 px-3 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-amber-700">{student.missions_completed}</span>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-6xl mx-auto">
        {selectedWeek === null ? (
          <>
            {/* Mario World Style Map */}
            <div className="mb-8 text-center">
              <RobbieFace emotion="excited" size="medium" className="mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                {student.name}'s Learning Journey
              </h2>
              <p className="text-gray-600 mb-4">
                Click a week or press keys 1-6 to begin! 🎮
              </p>
            </div>

            {/* World Map */}
            <div className="relative bg-gradient-to-b from-sky-200 via-green-100 to-amber-50 rounded-3xl p-8 mb-8 min-h-[600px] overflow-hidden shadow-2xl border-8 border-white">
              {/* Decorative clouds */}
              <div className="absolute top-8 left-12 text-6xl opacity-30">☁️</div>
              <div className="absolute top-16 right-20 text-5xl opacity-30">☁️</div>
              <div className="absolute bottom-32 left-24 text-4xl opacity-30">🌳</div>
              <div className="absolute bottom-24 right-16 text-4xl opacity-30">🏔️</div>

              {/* Path connecting nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {WEEKLY_THEMES.slice(0, -1).map((week, i) => {
                  const nextWeek = WEEKLY_THEMES[i + 1];
                  return (
                    <motion.line
                      key={`path-${i}`}
                      x1={`${week.mapPosition.x}%`}
                      y1={`${week.mapPosition.y}%`}
                      x2={`${nextWeek.mapPosition.x}%`}
                      y2={`${nextWeek.mapPosition.y}%`}
                      stroke="url(#pathGradient)"
                      strokeWidth="8"
                      strokeDasharray="20,10"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: completedWeeks.includes(week.week) ? 1 : 0 }}
                      transition={{ duration: 1 }}
                    />
                  );
                })}
              </svg>

              {/* Week Nodes */}
              {WEEKLY_THEMES.map((week, index) => {
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
                    whileHover={isAvailable ? { scale: 1.1 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2
                      w-32 h-32 rounded-full transition-all
                      ${progress.isComplete
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl border-8 border-white'
                        : isLocked
                          ? 'bg-gray-300 border-4 border-gray-400 opacity-50 cursor-not-allowed'
                          : 'bg-gradient-to-br ' + week.color + ' shadow-xl border-8 border-white hover:shadow-2xl'
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
                        <Lock className="w-10 h-10 text-gray-600" />
                      ) : (
                        <>
                          <Icon className={`w-10 h-10 mb-1 ${progress.isComplete ? 'text-white' : 'text-white'}`} />
                          <span className="text-xs font-black text-white">{week.week}</span>
                        </>
                      )}
                    </div>

                    {/* Completion Star */}
                    {progress.isComplete && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 shadow-lg border-4 border-white"
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </motion.div>
                    )}

                    {/* Progress indicator */}
                    {!progress.isComplete && progress.completed > 0 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-2 py-1 shadow-md">
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
                className="absolute text-6xl"
                style={{ left: '5%', top: '85%' }}
              >
                🚩
              </motion.div>

              {/* Finish Trophy */}
              {completedWeeks.length === 6 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 1 }}
                  className="absolute text-8xl"
                  style={{ left: '92%', top: '75%' }}
                >
                  🏆
                </motion.div>
              )}
            </div>

            {/* Keyboard Hint */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-purple-200">
                <span className="text-sm font-semibold text-gray-700">💡 Pro Tip:</span>
                <span className="text-sm text-gray-600">Press keys 1-6 on your keyboard!</span>
              </div>
            </div>

            {/* Level Progression */}
            {completedWeeks.length >= 3 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8"
              >
                <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />
                    <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                    <h3 className="text-3xl font-black mb-2">Ready for Level 2?</h3>
                    <p className="text-white/90 mb-6 text-lg">
                      You've mastered {completedWeeks.length} weeks! Time for advanced challenges!
                    </p>
                    <Link to={createPageUrl('LearningPath2') + `?student=${studentId}`}>
                      <Button
                        size="lg"
                        className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-black text-xl"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Start Learning Path 2.0
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mission Achievement Map */}
            <MissionAchievementMap completedMissions={completedTasks} />

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
                variant="outline"
                className="rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Map
              </Button>
            </div>

            {(() => {
              const currentWeek = WEEKLY_THEMES[selectedWeek - 1];
              const weekProgress = currentWeek.tasks.filter(t => getTaskProgress(t)).length;
              const weekTotal = currentWeek.tasks.length;
              const isWeekComplete = weekProgress === weekTotal;

              return (
                <>
                  {/* Current Week Details */}
                  <Card className={`mb-8 overflow-hidden border-0 shadow-2xl bg-gradient-to-br ${currentWeek.color}`}>
                    <CardContent className="p-6 text-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                              <span className="text-sm font-bold">Week {currentWeek.week}</span>
                            </div>
                          </div>
                          <h2 className="text-3xl font-black mb-2">{currentWeek.title}</h2>
                          <p className="text-white/90 text-lg">{currentWeek.description}</p>
                        </div>
                        <currentWeek.icon className="w-16 h-16 opacity-50" />
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Your Progress</span>
                          <span className="text-sm font-bold">{weekProgress} / {weekTotal} Tasks</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(weekProgress / weekTotal) * 100}%` }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks Grid */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-amber-500" />
                      This Week's Tasks
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
                                ? 'border-green-400 bg-green-50'
                                : isLocked
                                  ? 'border-gray-200 bg-gray-50 opacity-60'
                                  : 'border-purple-200 bg-white hover:shadow-xl hover:scale-105'
                              }
                            `}>
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className={`
                                    text-5xl flex-shrink-0
                                    ${isLocked ? 'opacity-30' : ''}
                                  `}>
                                    {task.emoji}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                                      {task.title}
                                    </h4>
                                    {task.type === 'game' && (
                                      <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm text-gray-600">Interactive Game</span>
                                      </div>
                                    )}
                                    {task.type === 'activity' && (
                                      <div className="flex items-center gap-2 mb-3">
                                        <Heart className="w-4 h-4 text-pink-500" />
                                        <span className="text-sm text-gray-600">Hands-On Activity</span>
                                      </div>
                                    )}

                                    {isCompleted ? (
                                      <div className="flex items-center gap-2 text-green-600 font-bold">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Completed!</span>
                                      </div>
                                    ) : isLocked ? (
                                      <div className="flex items-center gap-2 text-gray-400 font-semibold">
                                        <Lock className="w-5 h-5" />
                                        <span>Complete previous task first</span>
                                      </div>
                                    ) : task.type === 'game' ? (
                                      <Link to={createPageUrl('Mission') + `?student=${studentId}&mission=${task.game.toLowerCase().replace(/\s+/g, '_')}`}>
                                        <Button className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500">
                                          Start Task
                                        </Button>
                                      </Link>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        className="mt-2"
                                        onClick={() => alert(`Ask your teacher about this activity! 🎨`)}
                                      >
                                        Ask Teacher
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Completion Badge */}
                                {isCompleted && (
                                  <div className="absolute top-3 right-3">
                                    <div className="bg-green-500 text-white rounded-full p-2">
                                      <Star className="w-5 h-5" />
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

                  {/* Week Completion Celebration */}
                  {isWeekComplete && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-12 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-8 text-center text-white shadow-2xl"
                    >
                      <div className="text-7xl mb-4">🎉</div>
                      <h2 className="text-4xl font-black mb-3">Week {selectedWeek} Complete!</h2>
                      <p className="text-xl mb-6">Badge Earned! You're amazing!</p>
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
                            className="bg-green-500 text-white hover:bg-green-600 font-black text-xl"
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