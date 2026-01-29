import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import SpeechBubble from '@/components/SpeechBubble';

const HARDWARE_PARTS = [
  { 
    id: 'monitor', 
    name: 'Monitor (Screen)', 
    emoji: '🖥️',
    description: "This is my FACE! The monitor is where you SEE everything the computer shows you.",
    position: { top: '15%', left: '50%', transform: 'translateX(-50%)' },
    highlightArea: { top: '8%', left: '30%', width: '40%', height: '25%' }
  },
  { 
    id: 'keyboard', 
    name: 'Keyboard', 
    emoji: '⌨️',
    description: "These are like my TEETH! You press keys to tell the computer what to do. Each key is a button!",
    position: { bottom: '25%', left: '50%', transform: 'translateX(-50%)' },
    highlightArea: { bottom: '18%', left: '25%', width: '50%', height: '15%' }
  },
  { 
    id: 'mouse', 
    name: 'Mouse', 
    emoji: '🖱️',
    description: "This is like my HAND! You move it around to point at things on the screen.",
    position: { bottom: '25%', right: '15%' },
    highlightArea: { bottom: '22%', right: '10%', width: '15%', height: '10%' }
  },
  { 
    id: 'cpu', 
    name: 'CPU (Brain)', 
    emoji: '🧠',
    description: "This is my BRAIN! The CPU thinks and remembers everything. It does all the computer's work!",
    position: { top: '50%', left: '15%', transform: 'translateY(-50%)' },
    highlightArea: { top: '40%', left: '8%', width: '18%', height: '20%' }
  },
  { 
    id: 'speakers', 
    name: 'Speakers', 
    emoji: '🔊',
    description: "These are my EARS! Well, actually they help me TALK! Speakers let you hear sounds from the computer.",
    position: { top: '30%', right: '10%' },
    highlightArea: { top: '28%', right: '8%', width: '12%', height: '8%' }
  }
];

const INTRO_MESSAGES = [
  { text: "Hi! Let me show you all the parts of a computer!", emotion: 'excited' },
  { text: "Each part has a special job. Can you help me find them all?", emotion: 'encouraging' },
  { text: "Tap on the glowing spots to learn about each part!", emotion: 'happy' }
];

const HINTS = [
  "Look for the glowing yellow spots! Each one is a computer part waiting to be discovered!",
  "Try tapping on the bright spots on my robot body. Each one teaches you about computers!",
  "Great job! Keep finding all the glowing parts. You're learning about computer hardware!"
];

export default function HardwareAnatomy({ 
  onComplete, 
  onNeedHint, 
  onAttempt,
  currentHint,
  showHint 
}) {
  const [introIndex, setIntroIndex] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [discoveredParts, setDiscoveredParts] = useState([]);
  const [currentPart, setCurrentPart] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  const advanceIntro = () => {
    if (introIndex < INTRO_MESSAGES.length - 1) {
      setIntroIndex(prev => prev + 1);
    } else {
      setPhase('playing');
    }
  };

  const handlePartClick = (part) => {
    if (discoveredParts.includes(part.id)) return;
    
    onAttempt?.();
    setCurrentPart(part);
    setShowDescription(true);
    setDiscoveredParts(prev => [...prev, part.id]);

    setTimeout(() => {
      setShowDescription(false);
      setCurrentPart(null);
      
      if (discoveredParts.length + 1 === HARDWARE_PARTS.length) {
        setTimeout(() => {
          setPhase('complete');
          setTimeout(onComplete, 1500);
        }, 500);
      }
    }, 4000);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <SpeechBubble
              message={INTRO_MESSAGES[introIndex].text}
              visible={true}
            />
            <button
              onClick={advanceIntro}
              className="mt-4 w-full max-w-md mx-auto h-14 text-lg rounded-2xl bg-sky-400 hover:bg-sky-500 text-white font-semibold transition-colors"
            >
              {introIndex < INTRO_MESSAGES.length - 1 ? 'Next' : "Let's Learn!"}
            </button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showDescription && currentPart && (
              <div className="mb-6">
                <SpeechBubble
                  message={currentPart.description}
                  visible={true}
                />
              </div>
            )}

            {showHint && !showDescription && (
              <div className="mb-6">
                <SpeechBubble
                  message={currentHint}
                  visible={true}
                />
              </div>
            )}

            {/* Progress */}
            <div className="text-center mb-4">
              <p className="text-gray-600 font-medium text-lg">
                Found: {discoveredParts.length} / {HARDWARE_PARTS.length}
              </p>
            </div>

            {/* Interactive Robot Diagram */}
            <div className="relative w-full max-w-lg mx-auto aspect-square bg-gradient-to-b from-sky-100 to-sky-200 rounded-3xl border-4 border-sky-300 overflow-hidden shadow-xl">
              {/* Computer Setup Illustration */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Monitor */}
                <rect x="120" y="50" width="160" height="120" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="3"/>
                <rect x="130" y="60" width="140" height="100" rx="4" fill="#3b82f6" opacity="0.3"/>
                
                {/* Monitor Stand */}
                <rect x="185" y="170" width="30" height="30" fill="#64748b"/>
                <rect x="150" y="200" width="100" height="8" rx="4" fill="#64748b"/>
                
                {/* CPU Tower */}
                <rect x="40" y="180" width="60" height="100" rx="6" fill="#475569" stroke="#334155" strokeWidth="2"/>
                <circle cx="70" cy="200" r="6" fill="#22c55e"/>
                <rect x="50" y="220" width="40" height="3" rx="1.5" fill="#94a3b8"/>
                <rect x="50" y="230" width="40" height="3" rx="1.5" fill="#94a3b8"/>
                
                {/* Keyboard */}
                <rect x="100" y="250" width="200" height="50" rx="6" fill="#64748b" stroke="#334155" strokeWidth="2"/>
                {/* Keys */}
                {[...Array(8)].map((_, i) => (
                  <rect key={i} x={110 + i * 24} y="260" width="18" height="12" rx="2" fill="#94a3b8"/>
                ))}
                {[...Array(8)].map((_, i) => (
                  <rect key={i} x={110 + i * 24} y="278" width="18" height="12" rx="2" fill="#94a3b8"/>
                ))}
                
                {/* Mouse */}
                <ellipse cx="340" cy="270" rx="20" ry="28" fill="#64748b" stroke="#334155" strokeWidth="2"/>
                <line x1="340" y1="250" x2="340" y2="280" stroke="#94a3b8" strokeWidth="2"/>
                
                {/* Speakers */}
                <rect x="320" y="130" width="35" height="50" rx="4" fill="#475569" stroke="#334155" strokeWidth="2"/>
                <circle cx="337" cy="145" r="8" fill="#64748b"/>
                <circle cx="337" cy="165" r="8" fill="#64748b"/>
              </svg>

              {/* Interactive Hotspots */}
              {HARDWARE_PARTS.map(part => {
                const isDiscovered = discoveredParts.includes(part.id);
                const isCurrent = currentPart?.id === part.id;
                
                return (
                  <React.Fragment key={part.id}>
                    {/* Highlight area */}
                    {!isDiscovered && (
                      <motion.button
                        onClick={() => handlePartClick(part)}
                        className="absolute border-4 border-yellow-400 bg-yellow-400/20 rounded-xl cursor-pointer hover:bg-yellow-400/40 transition-all"
                        style={part.highlightArea}
                        animate={{
                          boxShadow: ['0 0 20px rgba(250, 204, 21, 0.6)', '0 0 40px rgba(250, 204, 21, 0.9)', '0 0 20px rgba(250, 204, 21, 0.6)']
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      />
                    )}

                    {/* Label badge */}
                    <motion.div
                      className={`absolute rounded-full px-4 py-2 font-bold text-sm shadow-lg flex items-center gap-2 ${
                        isDiscovered 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white text-gray-700 border-2 border-yellow-400'
                      }`}
                      style={part.position}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: introIndex === INTRO_MESSAGES.length ? 0.1 * HARDWARE_PARTS.indexOf(part) : 0 }}
                    >
                      <span className="text-xl">{part.emoji}</span>
                      {isDiscovered && <Check className="w-4 h-4" />}
                    </motion.div>

                    {/* Success animation */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 1 }}
                      >
                        <div className="text-6xl">{part.emoji}</div>
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Parts legend */}
            <div className="mt-6 grid grid-cols-2 gap-2 max-w-md mx-auto">
              {HARDWARE_PARTS.map(part => (
                <div
                  key={part.id}
                  className={`p-3 rounded-xl border-2 flex items-center gap-2 ${
                    discoveredParts.includes(part.id)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{part.emoji}</span>
                  <span className={`text-sm font-medium ${
                    discoveredParts.includes(part.id) ? 'text-green-700' : 'text-gray-400'
                  }`}>
                    {part.name}
                  </span>
                  {discoveredParts.includes(part.id) && (
                    <Check className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const hardwareAnatomyConfig = {
  hints: HINTS,
  emotion: 'excited'
};