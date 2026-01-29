import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';

const avatarColors = [
  'bg-pink-400',
  'bg-purple-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-red-400',
  'bg-teal-400'
];

export default function StudentCard({ student, onClick, selected = false, showStats = false }) {
  const colorClass = student.avatar_color || avatarColors[student.name?.charCodeAt(0) % avatarColors.length];
  const initial = student.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <motion.button
      onClick={() => onClick?.(student)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative p-6 rounded-3xl transition-all w-full
        ${selected 
          ? 'bg-sky-100 border-4 border-sky-400 shadow-lg' 
          : 'bg-white border-4 border-gray-100 hover:border-orange-200 shadow-md'}
      `}
    >
      {/* Avatar */}
      <div className={`
        w-20 h-20 mx-auto rounded-full ${colorClass} 
        flex items-center justify-center text-white text-3xl font-bold
        shadow-lg
      `}>
        {initial}
      </div>

      {/* Name */}
      <h3 className="mt-4 text-xl font-bold text-gray-800 text-center">
        {student.name}
      </h3>

      {/* Stats */}
      {showStats && (
        <div className="mt-3 flex justify-center gap-4">
          <div className="flex items-center gap-1 text-orange-500">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">{student.missions_completed || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{Math.max(0, 10 - (student.total_hints_used || 0))}</span>
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-lg">✓</span>
        </motion.div>
      )}
    </motion.button>
  );
}