import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ProgressBar({ currentStep, totalSteps, label }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className="text-sm font-bold text-orange-500">
            {currentStep} / {totalSteps}
          </span>
        </div>
      )}
      
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Star markers */}
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${((i + 1) / totalSteps) * 100 - 4}%` }}
          >
            <Star
              className={`w-4 h-4 ${
                currentStep > i ? 'text-yellow-300 fill-yellow-300' : 'text-gray-400'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}