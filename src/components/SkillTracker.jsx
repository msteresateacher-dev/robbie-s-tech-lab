import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Bug, Lightbulb, Puzzle, Box, Eye, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SKILLS = [
  {
    id: 'algorithms',
    name: 'Algorithms',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    description: 'Step-by-step instructions to solve problems',
    examples: 'Like following a recipe: first this, then that, then finish!',
    games: ['Wake Up Robbie', "Robbie's Race"],
    emoji: '📝'
  },
  {
    id: 'debugging',
    name: 'Debugging',
    icon: Bug,
    color: 'from-red-500 to-pink-600',
    description: 'Finding and fixing mistakes in code',
    examples: 'When something goes wrong, we find the problem and fix it!',
    games: ['Bug Hunter'],
    emoji: '🐛'
  },
  {
    id: 'logic',
    name: 'Logic',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-600',
    description: 'Using reasoning to make decisions',
    examples: 'If this happens, then do that. Cause and effect!',
    games: ['Input & Output', 'Binary Lights'],
    emoji: '💡'
  },
  {
    id: 'patterns',
    name: 'Patterns',
    icon: Puzzle,
    color: 'from-purple-500 to-violet-600',
    description: 'Recognizing things that repeat',
    examples: 'Red, blue, red, blue... what comes next?',
    games: ['Pixel Painter', 'Password Protector'],
    emoji: '🎨'
  },
  {
    id: 'decomposition',
    name: 'Decomposition',
    icon: Box,
    color: 'from-green-500 to-emerald-600',
    description: 'Breaking big problems into smaller parts',
    examples: 'Big task is hard. Small tasks are easy! Do small tasks one by one.',
    games: ['Wake Up Robbie', 'Parts Puzzle'],
    emoji: '📦'
  },
  {
    id: 'abstraction',
    name: 'Abstraction',
    icon: Eye,
    color: 'from-teal-500 to-cyan-600',
    description: 'Finding what matters and hiding details',
    examples: "We don't need to know how TV works inside to watch cartoons!",
    games: ['Hardware Anatomy', 'Data Detective'],
    emoji: '👁️'
  }
];

export default function SkillTracker({ completedGames = [] }) {
  const [selectedSkill, setSelectedSkill] = useState(null);

  const getSkillProgress = (skill) => {
    const completed = skill.games.filter(game => 
      completedGames.includes(game)
    ).length;
    return {
      completed,
      total: skill.games.length,
      percentage: (completed / skill.games.length) * 100
    };
  };

  return (
    <>
      <Card className="border-0 shadow-xl bg-white">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Puzzle className="w-7 h-7 text-purple-500" />
            Computer Science Skills
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Tap each skill to learn what it means! Track your progress.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SKILLS.map((skill, index) => {
              const Icon = skill.icon;
              const progress = getSkillProgress(skill);
              const isMastered = progress.completed === progress.total && progress.total > 0;

              return (
                <motion.button
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSkill(skill)}
                  className={`
                    relative p-5 rounded-2xl transition-all border-4
                    ${isMastered 
                      ? `bg-gradient-to-br ${skill.color} text-white shadow-lg border-transparent` 
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:bg-white'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{skill.emoji}</div>
                  <h4 className={`font-bold text-sm mb-2 ${isMastered ? 'text-white' : 'text-gray-800'}`}>
                    {skill.name}
                  </h4>
                  
                  {/* Progress Bar */}
                  <div className={`h-2 rounded-full overflow-hidden ${isMastered ? 'bg-white/30' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      className={`h-full ${isMastered ? 'bg-white' : 'bg-purple-500'}`}
                    />
                  </div>
                  
                  <p className={`text-xs mt-2 font-semibold ${isMastered ? 'text-white/90' : 'text-gray-600'}`}>
                    {progress.completed} / {progress.total} Games
                  </p>

                  {isMastered && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg border-4 border-white"
                    >
                      <span className="text-lg">⭐</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                bg-gradient-to-br ${selectedSkill.color} 
                rounded-3xl p-8 max-w-lg w-full text-white shadow-2xl
                border-8 border-white
              `}
            >
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{selectedSkill.emoji}</div>
                <h2 className="text-4xl font-black mb-2">{selectedSkill.name}</h2>
                <div className="h-1 bg-white/50 rounded-full w-24 mx-auto" />
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-3">What is it?</h3>
                <p className="text-lg leading-relaxed mb-4">{selectedSkill.description}</p>
                
                <h3 className="font-bold text-xl mb-3">Example:</h3>
                <p className="text-lg leading-relaxed">{selectedSkill.examples}</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                <h3 className="font-bold text-xl mb-3">Practice in these games:</h3>
                <div className="space-y-2">
                  {selectedSkill.games.map((game) => {
                    const isCompleted = completedGames.includes(game);
                    return (
                      <div
                        key={game}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl
                          ${isCompleted ? 'bg-green-500/30' : 'bg-white/10'}
                        `}
                      >
                        <span className="text-2xl">{isCompleted ? '✅' : '⭕'}</span>
                        <span className="font-semibold">{game}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="mt-6 w-full bg-white text-purple-600 hover:bg-gray-100 font-black text-xl py-4 rounded-2xl transition-colors"
              >
                Got It! 🎯
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}