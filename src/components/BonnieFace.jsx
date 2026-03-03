import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emotions = {
  happy: { eyeScale: 1, mouthCurve: 30, blush: true },
  excited: { eyeScale: 1.2, mouthCurve: 40, blush: true },
  thinking: { eyeScale: 0.8, mouthCurve: 0, blush: false },
  sleepy: { eyeScale: 0.3, mouthCurve: 5, blush: false },
  surprised: { eyeScale: 1.4, mouthCurve: 20, blush: false },
  encouraging: { eyeScale: 1.1, mouthCurve: 25, blush: true },
  neutral: { eyeScale: 1, mouthCurve: 10, blush: false }
};

export default function BonnieFace({ emotion = 'happy', speaking = false, size = 'medium', onClick }) {
  const [blinking, setBlinking] = useState(false);
  const [lookDirection, setLookDirection] = useState({ x: 0, y: 0 });
  const currentEmotion = emotions[emotion] || emotions.happy;

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const lookInterval = setInterval(() => {
      setLookDirection({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 5
      });
    }, 1800 + Math.random() * 1500);
    return () => clearInterval(lookInterval);
  }, []);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-56 h-56'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative cursor-pointer select-none`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Robot Head - smaller, rounder, more pastel */}
      <motion.div
        className="w-full h-full rounded-[2.5rem] bg-gradient-to-b from-sky-300 to-cyan-400 shadow-2xl relative overflow-hidden border-4 border-sky-200"
        animate={speaking ? {
          boxShadow: ['0 20px 40px -10px rgba(125, 211, 252, 0.4)', '0 20px 40px -10px rgba(125, 211, 252, 0.8)', '0 20px 40px -10px rgba(125, 211, 252, 0.4)']
        } : {}}
        transition={{ repeat: speaking ? Infinity : 0, duration: 0.5 }}
      >
        {/* Bow / Hair accessory */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <motion.div
            className="flex items-center gap-0.5"
            animate={{ rotate: speaking ? [-5, 5, -5] : 0 }}
            transition={{ repeat: speaking ? Infinity : 0, duration: 0.4 }}
          >
            {/* Left bow side */}
            <div className="w-5 h-4 bg-pink-400 rounded-full border-2 border-pink-300 transform -rotate-12 shadow-md" />
            {/* Center knot */}
            <div className="w-3 h-3 bg-pink-500 rounded-full border-2 border-pink-300 shadow-md z-10" />
            {/* Right bow side */}
            <div className="w-5 h-4 bg-pink-400 rounded-full border-2 border-pink-300 transform rotate-12 shadow-md" />
          </motion.div>
          <div className="w-1 h-3 bg-gray-400 rounded-full" />
        </div>

        {/* Face container */}
        <div className="absolute inset-3 flex flex-col items-center justify-center">
          {/* Eyes - slightly smaller, star-shaped highlight */}
          <div className="flex gap-5 mb-3">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="relative"
                animate={{ scaleY: blinking ? 0.1 : currentEmotion.eyeScale }}
                transition={{ duration: 0.1 }}
              >
                <div className="w-9 h-9 bg-white rounded-full shadow-inner flex items-center justify-center border-2 border-sky-100">
                  <motion.div
                    className="w-5 h-5 bg-gray-800 rounded-full relative"
                    animate={{ x: lookDirection.x, y: lookDirection.y }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {/* Star highlight */}
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white rounded-full" />
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Blush - slightly bigger / cuter */}
          <AnimatePresence>
            {currentEmotion.blush && (
              <motion.div
                className="flex gap-10 absolute top-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-7 h-4 bg-pink-300 rounded-full blur-sm" />
                <div className="w-7 h-4 bg-pink-300 rounded-full blur-sm" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mouth - smaller, cuter */}
          <motion.div className="mt-1">
            <svg width="44" height="28" viewBox="0 0 44 28">
              <motion.path
                d={`M 4 14 Q 22 ${14 + currentEmotion.mouthCurve} 40 14`}
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                animate={speaking ? {
                  d: [`M 4 14 Q 22 ${14 + currentEmotion.mouthCurve} 40 14`, `M 4 14 Q 22 ${14 + currentEmotion.mouthCurve + 8} 40 14`, `M 4 14 Q 22 ${14 + currentEmotion.mouthCurve} 40 14`]
                } : {}}
                transition={{ repeat: speaking ? Infinity : 0, duration: 0.2 }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Ear bolts - smaller */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 w-3 h-6 bg-gray-300 rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5 w-3 h-6 bg-gray-300 rounded-full" />

        {/* Screen reflection */}
        <div className="absolute top-2 left-2 right-6 h-5 bg-white/25 rounded-full blur-sm" />

        {/* Star sparkles on cheeks */}
        <div className="absolute bottom-4 left-3 text-xs">✨</div>
        <div className="absolute bottom-6 right-3 text-xs">⭐</div>
      </motion.div>
    </motion.div>
  );
}