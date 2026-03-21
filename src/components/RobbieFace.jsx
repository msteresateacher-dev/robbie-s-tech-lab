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

export default function RobbieFace({ emotion = 'neutral', speaking = false, size = 'large', onClick }) {
  const [blinking, setBlinking] = useState(false);
  const [lookDirection, setLookDirection] = useState({ x: 0, y: 0 });
  const currentEmotion = emotions[emotion] || emotions.neutral;

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Random eye movement
  useEffect(() => {
    const lookInterval = setInterval(() => {
      setLookDirection({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6
      });
    }, 2000 + Math.random() * 1500);
    return () => clearInterval(lookInterval);
  }, []);

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64 md:w-80 md:h-80'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative cursor-pointer select-none`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Robot Head */}
      <motion.div
        className="w-full h-full rounded-[2rem] bg-gradient-to-b from-gray-300 to-gray-400 shadow-2xl relative overflow-hidden border-4 border-gray-200"
        animate={speaking ? { 
          boxShadow: ['0 25px 50px -12px rgba(156, 163, 175, 0.4)', '0 25px 50px -12px rgba(156, 163, 175, 0.7)', '0 25px 50px -12px rgba(156, 163, 175, 0.4)']
        } : {}}
        transition={{ repeat: speaking ? Infinity : 0, duration: 0.5 }}
      >
        {/* Antenna */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <motion.div
            className="w-4 h-4 rounded-full bg-orange-400 shadow-lg"
            animate={{ 
              backgroundColor: speaking ? ['#fb923c', '#fbbf24', '#fb923c'] : '#fb923c',
              scale: speaking ? [1, 1.2, 1] : 1
            }}
            transition={{ repeat: speaking ? Infinity : 0, duration: 0.3 }}
          />
          <div className="w-1.5 h-5 bg-gray-400 rounded-full" />
        </div>

        {/* Face container */}
        <div className="absolute inset-4 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-8 md:gap-12 mb-4">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="relative"
                animate={{ scaleY: blinking ? 0.1 : currentEmotion.eyeScale }}
                transition={{ duration: 0.1 }}
              >
                {/* Eye white */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-inner flex items-center justify-center">
                  {/* Pupil */}
                  <motion.div
                    className="w-6 h-6 md:w-8 md:h-8 bg-gray-800 rounded-full relative"
                    animate={{ x: lookDirection.x, y: lookDirection.y }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {/* Highlight */}
                    <div className="absolute top-1 right-1 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Blush */}
          <AnimatePresence>
            {currentEmotion.blush && (
              <motion.div
                className="flex gap-16 md:gap-24 absolute top-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-6 h-4 md:w-8 md:h-5 bg-pink-300 rounded-full blur-sm" />
                <div className="w-6 h-4 md:w-8 md:h-5 bg-pink-300 rounded-full blur-sm" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mouth */}
          <motion.div className="mt-2">
            <svg width="60" height="40" viewBox="0 0 60 40" className="md:w-20 md:h-14">
              <motion.path
                d={`M 5 20 Q 30 ${20 + currentEmotion.mouthCurve} 55 20`}
                stroke="#374151"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={speaking ? { 
                  d: [`M 5 20 Q 30 ${20 + currentEmotion.mouthCurve} 55 20`, `M 5 20 Q 30 ${20 + currentEmotion.mouthCurve + 10} 55 20`, `M 5 20 Q 30 ${20 + currentEmotion.mouthCurve} 55 20`]
                } : {}}
                transition={{ repeat: speaking ? Infinity : 0, duration: 0.2 }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Ear bolts */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-4 h-8 bg-gray-400 rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-4 h-8 bg-gray-400 rounded-full" />

        {/* Screen reflection */}
        <div className="absolute top-2 left-2 right-8 h-8 bg-white/20 rounded-full blur-sm" />
      </motion.div>
    </motion.div>
  );
}