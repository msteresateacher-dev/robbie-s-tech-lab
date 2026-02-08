import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Lock, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RobbieFace from '@/components/RobbieFace';

const MISSIONS = [
  {
    id: 'wake_up_robbie',
    title: 'Wake Up Robbie',
    description: 'Learn about SEQUENCING by helping Robbie start his day!',
    emoji: '☀️',
    difficulty: 'Beginner',
    skills: ['Sequencing', 'Logic', 'Order'],
    color: 'from-amber-400 to-orange-400',
    unlocked: true
  },
  {
    id: 'hardware_anatomy',
    title: 'Hardware Anatomy',
    description: 'Discover computer parts using Robbie\'s body!',
    emoji: '🖥️',
    difficulty: 'Beginner',
    skills: ['Hardware', 'Identification', 'Vocabulary'],
    color: 'from-sky-400 to-blue-400',
    unlocked: true
  },
  {
    id: 'input_output',
    title: 'Input & Output',
    description: 'Learn how keyboards (INPUT) and screens (OUTPUT) work!',
    emoji: '⌨️',
    difficulty: 'Intermediate',
    skills: ['Input/Output', 'Keyboard', 'Cause & Effect'],
    color: 'from-green-400 to-emerald-400',
    unlocked: true
  },
  {
    id: 'robbies_race',
    title: 'Robbie\'s Big Race',
    description: 'Code Robbie\'s path using arrow blocks!',
    emoji: '🏁',
    difficulty: 'Intermediate',
    skills: ['Coding', 'Algorithms', 'Problem Solving'],
    color: 'from-purple-400 to-pink-400',
    unlocked: true
  }
];

export default function MissionSelect() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('studentId');

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const students = await base44.entities.Student.filter({ id: studentId });
      return students[0];
    },
    enabled: !!studentId
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['student-sessions', studentId],
    queryFn: () => base44.entities.MissionSession.filter({ student_id: studentId }),
    enabled: !!studentId
  });

  const getCompletedMissions = () => {
    const completed = {};
    sessions.forEach(session => {
      if (session.completed) {
        completed[session.mission_name] = true;
      }
    });
    return completed;
  };

  const completedMissions = getCompletedMissions();

  const handleMissionClick = (missionId) => {
    navigate(createPageUrl('Mission') + `?studentId=${studentId}&missionId=${missionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('StudentPortal')}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">Choose a Mission</h1>
            <p className="text-sm text-gray-500">{student?.name}'s Adventures</p>
          </div>
          <Link to={createPageUrl('LearningPath') + `?student=${studentId}`}>
            <Button variant="outline" className="rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Learning Path
            </Button>
          </Link>
        </div>
      </header>

      <main className="px-4 py-8 max-w-4xl mx-auto">
        {/* Robbie greeting */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <RobbieFace emotion="excited" size="small" />
          <p className="mt-4 text-xl text-gray-700 font-medium text-center">
            Pick an adventure, {student?.name}!
          </p>
        </motion.div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {MISSIONS.map((mission, index) => {
            const isCompleted = completedMissions[mission.title];
            const isLocked = !mission.unlocked;

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => !isLocked && handleMissionClick(mission.id)}
                  disabled={isLocked}
                  className={`
                    w-full text-left p-6 rounded-3xl shadow-xl border-4 transition-all
                    ${isLocked 
                      ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed' 
                      : 'bg-white border-transparent hover:scale-105 hover:shadow-2xl active:scale-95'
                    }
                  `}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-4xl
                      bg-gradient-to-br ${mission.color} shadow-lg
                    `}>
                      {isLocked ? <Lock className="w-8 h-8 text-white" /> : mission.emoji}
                    </div>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="bg-green-500 rounded-full p-2"
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {mission.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {mission.description}
                  </p>

                  {/* Difficulty Badge */}
                  <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-3">
                    {mission.difficulty}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {mission.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Status indicator */}
                  {isCompleted && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-green-600 font-medium text-sm">
                        ✓ Completed! Play again to improve your score!
                      </p>
                    </div>
                  )}

                  {isLocked && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm">
                        🔒 Complete previous missions to unlock
                      </p>
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Progress</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-sky-500">
                {Object.keys(completedMissions).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">
                {student?.total_hints_used || 0}
              </div>
              <div className="text-sm text-gray-600">Hints Used</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">
                {Math.max(0, 20 - (student?.total_hints_used || 0))}
              </div>
              <div className="text-sm text-gray-600">Stars Earned</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}