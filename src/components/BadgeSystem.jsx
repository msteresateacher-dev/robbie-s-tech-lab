import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Crown, Zap, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BADGES = [
  { id: 'week1', name: 'Computer Explorer', description: 'Completed Week 1', emoji: '🖥️', color: 'from-sky-400 to-blue-500', week: 1 },
  { id: 'week2', name: 'Control Master', description: 'Completed Week 2', emoji: '🖱️', color: 'from-purple-400 to-pink-500', week: 2 },
  { id: 'week3', name: 'Safety Champion', description: 'Completed Week 3', emoji: '🛡️', color: 'from-green-400 to-emerald-500', week: 3 },
  { id: 'week4', name: 'Logic Genius', description: 'Completed Week 4', emoji: '🧠', color: 'from-amber-400 to-orange-500', week: 4 },
  { id: 'week5', name: 'Network Navigator', description: 'Completed Week 5', emoji: '🌐', color: 'from-indigo-400 to-purple-500', week: 5 },
  { id: 'week6', name: 'Brooklyn Tech Hero', description: 'Completed Week 6', emoji: '🦸', color: 'from-pink-400 to-rose-500', week: 6 },
  { id: 'perfect', name: 'Perfect Score', description: 'Completed all tasks without hints', emoji: '💯', color: 'from-yellow-400 to-orange-400', special: true },
  { id: 'speedster', name: 'Speed Champion', description: 'Completed 10 tasks', emoji: '⚡', color: 'from-cyan-400 to-blue-500', special: true }
];

export default function BadgeSystem({ completedWeeks = [], totalCompleted = 0, hintsUsed = 0 }) {
  const unlockedBadges = BADGES.filter(badge => {
    if (badge.week) return completedWeeks.includes(badge.week);
    if (badge.id === 'perfect') return totalCompleted >= 5 && hintsUsed === 0;
    if (badge.id === 'speedster') return totalCompleted >= 10;
    return false;
  });

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" />
              Achievement Badges
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {unlockedBadges.length} / {BADGES.length} Earned
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg">
            {unlockedBadges.length}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge, index) => {
            const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <button
                  className={`
                    w-full p-4 rounded-2xl transition-all border-4
                    ${isUnlocked 
                      ? `bg-gradient-to-br ${badge.color} text-white shadow-lg hover:scale-105` 
                      : 'bg-gray-100 border-gray-200 opacity-50'
                    }
                  `}
                >
                  <div className={`text-5xl mb-2 ${!isUnlocked && 'grayscale opacity-30'}`}>
                    {badge.emoji}
                  </div>
                  <h4 className={`font-bold text-sm mb-1 ${!isUnlocked && 'text-gray-500'}`}>
                    {badge.name}
                  </h4>
                  <p className={`text-xs ${isUnlocked ? 'text-white/80' : 'text-gray-400'}`}>
                    {badge.description}
                  </p>
                  
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg"
                    >
                      <Award className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}