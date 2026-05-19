import React from 'react';
import { motion } from 'framer-motion';
import RobbieFace from '@/components/RobbieFace';

export default function WelcomeSplash({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center gap-6 px-8 text-center"
      >
        <RobbieFace emotion="excited" speaking={false} size="large" />

        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome to Robbie's Tech Lab! 🤖
          </h1>
          <p className="text-gray-500 text-lg">Tap below to start with sound</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onStart}
          className="mt-2 px-10 py-5 text-2xl font-bold rounded-3xl bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl shadow-green-200"
        >
          🔊 Tap to Begin!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}