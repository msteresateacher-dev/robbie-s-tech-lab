import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Lock, Star, Sparkles,
  Monitor, MousePointer2, Shield, Binary, Network, MapPin,
  Trophy, Lightbulb, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RobbieFace from '@/components/RobbieFace';

const WEEKLY_THEMES = [
  {
    week: 1,
    title: "Meet the Computer!",
    description: "Let's discover what computers are and how they work",
    icon: Monitor,
    color: "from-sky-400 to-blue-500",
    tasks: [
      { id: "identify-parts", title: "Find Computer Parts", emoji: "🖥️", type: "game", game: "Hardware Anatomy" },
      { id: "touch-keyboard", title: "Keyboard Explorer", emoji: "⌨️", type: "game", game: "Keyboard Fun" },
      { id: "power-on", title: "Power Button Practice", emoji: "⚡", type: "game", game: "Power On/Off" },
      { id: "screen-real", title: "Screen vs Real World", emoji: "📱", type: "game", game: "Screen World" }
    ]
  },
  {
    week: 2,
    title: "I Can Control It!",
    description: "Learn how we tell computers what to do",
    icon: MousePointer2,
    color: "from-purple-400 to-pink-500",
    tasks: [
      { id: "mouse-clicks", title: "Master the Mouse", emoji: "🖱️", type: "game", game: "Mouse Skills" },
      { id: "type-letters", title: "Letter Hunt", emoji: "🔤", type: "game", game: "Letter Hunt" },
      { id: "input-output", title: "Input & Output", emoji: "⌨️", type: "game", game: "Input & Output" },
      { id: "touch-type", title: "Touch vs Type", emoji: "📱", type: "game", game: "Touch vs Type" }
    ]
  },
  {
    week: 3,
    title: "Stay Safe & Kind",
    description: "Be a good friend online and keep secrets safe",
    icon: Shield,
    color: "from-green-400 to-emerald-500",
    tasks: [
      { id: "passwords", title: "Password Protector", emoji: "🔒", type: "game", game: "Password Protector" },
      { id: "be-kind", title: "Kindness Detective", emoji: "💖", type: "game", game: "Be Kind" },
      { id: "screen-time", title: "Screen Time Helper", emoji: "⏰", type: "game", game: "Screen Time Helper" },
      { id: "private-info", title: "What's Private?", emoji: "🤫", type: "activity", points: 10 }
    ]
  },
  {
    week: 4,
    title: "Think Like a Computer",
    description: "Discover patterns, sorting, and how computers organize",
    icon: Binary,
    color: "from-amber-400 to-orange-500",
    tasks: [
      { id: "binary", title: "Binary Lights", emoji: "💡", type: "game", game: "Binary Lights" },
      { id: "sorting", title: "Data Detective", emoji: "🔍", type: "game", game: "Data Detective" },
      { id: "patterns", title: "Pattern Master", emoji: "🎨", type: "game", game: "Pixel Painter" },
      { id: "sequences", title: "Wake Up Robbie", emoji: "🤖", type: "game", game: "Wake Up Robbie" }
    ]
  },
  {
    week: 5,
    title: "Connect & Communicate",
    description: "See how computers talk to each other",
    icon: Network,
    color: "from-indigo-400 to-purple-500",
    tasks: [
      { id: "cables", title: "Cable Connector", emoji: "🔌", type: "game", game: "Cables" },
      { id: "network", title: "Network Navigator", emoji: "🌐", type: "game", game: "Network Navigator" },
      { id: "messages", title: "Send Messages", emoji: "✉️", type: "game", game: "Signal Share" },
      { id: "music-code", title: "Music Code", emoji: "🎵", type: "game", game: "Music Code" }
    ]
  },
  {
    week: 6,
    title: "Brooklyn Tech Hero",
    description: "Use technology to help our community!",
    icon: MapPin,
    color: "from-pink-400 to-rose-500",
    tasks: [
      { id: "helper-bot", title: "Community Helper", emoji: "🏘️", type: "game", game: "Helper Bot" },
      { id: "weather", title: "Weather Reporter", emoji: "🌤️", type: "game", game: "Weather Reporter" },
      { id: "photos", title: "Photo Memory", emoji: "📷", type: "game", game: "Photo Memory" },
      { id: "celebration", title: "Tech Fair!", emoji: "🎉", type: "activity", points: 50 }
    ]
  }
];

export default function LearningPath() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student');
  const [selectedWeek, setSelectedWeek] = useState(1);

  const { data: student } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => base44.entities.Student.list().then(students => 
      students.find(s => s.id === studentId)
    ),
    enabled: !!studentId
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', studentId],
    queryFn: () => base44.entities.MissionSession.filter({ student_id: studentId }),
    enabled: !!studentId
  });

  const currentWeek = WEEKLY_THEMES[selectedWeek - 1];
  const completedTasks = sessions.filter(s => s.completed).map(s => s.mission_name);

  const getTaskProgress = (task) => {
    if (task.type === 'game') {
      return completedTasks.includes(task.game);
    }
    return false;
  };

  const weekProgress = currentWeek.tasks.filter(t => getTaskProgress(t)).length;
  const weekTotal = currentWeek.tasks.length;
  const isWeekComplete = weekProgress === weekTotal;

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
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

      <main className="px-4 pt-6 max-w-4xl mx-auto">
        {/* Robbie Encouragement */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <RobbieFace emotion="excited" size="medium" />
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-lg max-w-md text-center border-4 border-sky-200">
            <p className="text-lg font-semibold text-gray-700">
              {isWeekComplete 
                ? `Amazing! You finished Week ${selectedWeek}! 🎉` 
                : `Let's learn together, ${student.name}! 🌟`
              }
            </p>
          </div>
        </motion.div>

        {/* Week Selector */}
        <div className="mb-8">
          <h2 className="text-center text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
            Choose Your Week
          </h2>
          <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
            {WEEKLY_THEMES.map((week) => {
              const Icon = week.icon;
              const completed = week.tasks.every(t => getTaskProgress(t));
              return (
                <button
                  key={week.week}
                  onClick={() => setSelectedWeek(week.week)}
                  className={`
                    relative p-4 rounded-2xl transition-all
                    ${selectedWeek === week.week 
                      ? 'bg-gradient-to-br ' + week.color + ' text-white shadow-lg scale-105' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${selectedWeek === week.week ? 'text-white' : 'text-gray-400'}`} />
                  <div className="text-xs font-bold">{week.week}</div>
                  {completed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

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
            <p className="text-xl mb-6">You're a computer learning superstar!</p>
            {selectedWeek < 6 && (
              <Button
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-black text-xl"
              >
                Start Week {selectedWeek + 1} →
              </Button>
            )}
            {selectedWeek === 6 && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mt-4">
                <p className="text-2xl font-bold">🏆 You completed the entire course! 🏆</p>
                <p className="mt-2">You're now a certified Tech Hero!</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}