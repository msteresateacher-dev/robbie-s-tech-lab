import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';

const KEY_MISSIONS = [
  {
    id: 'sequencing',
    title: 'Sequencing',
    description: 'Wake Up Robbie',
    emoji: '🔢',
    icon: '🤖',
    color: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-orange-200',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50',
    // matches mission_name in sessions
    missionNames: ['Wake Up Robbie', 'wake_up_robbie'],
  },
  {
    id: 'hardware',
    title: 'Hardware Anatomy',
    description: 'Learn Computer Parts',
    emoji: '🖥️',
    icon: '⚙️',
    color: 'from-sky-400 to-blue-500',
    shadowColor: 'shadow-blue-200',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    missionNames: ['Hardware Anatomy', 'hardware_anatomy'],
  },
  {
    id: 'io',
    title: 'Inputs & Outputs',
    description: 'How Computers Listen',
    emoji: '⌨️',
    icon: '🖱️',
    color: 'from-purple-400 to-pink-500',
    shadowColor: 'shadow-purple-200',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    missionNames: ['Input & Output', 'input_output', 'Inputs & Outputs'],
  },
  {
    id: 'coding',
    title: 'Coding',
    description: 'Music Code & Logic',
    emoji: '💻',
    icon: '🎵',
    color: 'from-green-400 to-emerald-500',
    shadowColor: 'shadow-green-200',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
    missionNames: ['Music Code', 'music_code', 'Coding'],
  },
];

export default function MissionAchievementMap({ completedMissions = [] }) {
  const isMissionComplete = (mission) =>
    mission.missionNames.some(name =>
      completedMissions.some(m => m.toLowerCase() === name.toLowerCase())
    );

  const totalComplete = KEY_MISSIONS.filter(isMissionComplete).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          🗺️ Mission Achievement Map
        </h3>
        <div className="bg-white px-4 py-2 rounded-full shadow-md border-2 border-amber-200">
          <span className="font-bold text-amber-600">{totalComplete} / {KEY_MISSIONS.length} Complete</span>
        </div>
      </div>

      {/* Path connector map */}
      <div className="relative bg-gradient-to-r from-sky-100 via-purple-50 to-green-100 rounded-3xl p-6 shadow-xl border-4 border-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-around pointer-events-none select-none">
          <span>⭐</span><span>⭐</span><span>⭐</span>
        </div>

        {/* Path line */}
        <div className="absolute top-1/2 left-8 right-8 h-2 bg-white/60 rounded-full -translate-y-1/2 hidden md:block" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {KEY_MISSIONS.map((mission, index) => {
            const completed = isMissionComplete(mission);
            return (
              <motion.div
                key={mission.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15, type: 'spring' }}
                className="flex flex-col items-center gap-3"
              >
                {/* Mission Icon Circle */}
                <div className="relative">
                  <motion.div
                    animate={completed ? {
                      boxShadow: ['0 0 0 0 rgba(34,197,94,0.4)', '0 0 0 12px rgba(34,197,94,0)', '0 0 0 0 rgba(34,197,94,0)']
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                    className={`
                      w-24 h-24 rounded-full flex flex-col items-center justify-center
                      border-4 transition-all duration-500
                      ${completed
                        ? `bg-gradient-to-br ${mission.color} border-white shadow-2xl ${mission.shadowColor}`
                        : 'bg-gray-100 border-gray-300 opacity-50'
                      }
                    `}
                  >
                    <span className="text-4xl">{mission.emoji}</span>
                  </motion.div>

                  {/* Completion badge */}
                  {completed ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: index * 0.15 + 0.3 }}
                      className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 border-3 border-white shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <div className="absolute -top-2 -right-2 bg-gray-300 rounded-full p-1.5 shadow">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Mission Label */}
                <div className={`text-center px-3 py-2 rounded-2xl border-2 w-full ${completed ? `${mission.bgColor} ${mission.borderColor}` : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-sm font-black ${completed ? 'text-gray-800' : 'text-gray-400'}`}>
                    {mission.title}
                  </p>
                  <p className={`text-xs ${completed ? 'text-gray-500' : 'text-gray-300'}`}>
                    {mission.description}
                  </p>
                  {completed && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-xs font-bold text-green-600">✓ Done!</span>
                    </div>
                  )}
                </div>

                {/* Connector arrow (not on last) */}
                {index < KEY_MISSIONS.length - 1 && (
                  <div className="hidden md:block absolute" style={{ left: `calc(${(index + 1) * 25}% - 12px)`, top: '50%', transform: 'translateY(-50%)' }}>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* All complete banner */}
        {totalComplete === KEY_MISSIONS.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-center text-white shadow-xl"
          >
            <p className="text-xl font-black">🏆 All Core Missions Complete! You're a Tech Star! ⭐</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}