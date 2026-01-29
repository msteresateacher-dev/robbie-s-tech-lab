import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import SpeechBubble from '@/components/SpeechBubble';

const INTRO_MESSAGES = [
  { text: "Let me teach you about INPUT and OUTPUT!", emotion: 'excited' },
  { text: "INPUT is when YOU tell the computer something. OUTPUT is when the computer shows or tells YOU something!", emotion: 'teaching' },
  { text: "Let's practice! Press the keys I ask for, and watch what appears on my screen!", emotion: 'encouraging' }
];

const ROUNDS = [
  { key: 'A', output: '🍎', word: 'Apple', sound: 'A is for Apple!' },
  { key: 'B', output: '🎈', word: 'Balloon', sound: 'B is for Balloon!' },
  { key: 'C', output: '🐱', word: 'Cat', sound: 'C is for Cat!' },
  { key: 'D', output: '🦕', word: 'Dinosaur', sound: 'D is for Dinosaur!' },
  { key: 'E', output: '🐘', word: 'Elephant', sound: 'E is for Elephant!' }
];

const HINTS = [
  "Look at the keyboard! Find the letter that's glowing yellow and tap it!",
  "The letter matches what I'm asking for. Look carefully at the keyboard!",
  "You're doing great! Just tap the glowing key on the keyboard below!"
];

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function InputOutput({ 
  onComplete, 
  onNeedHint, 
  onAttempt,
  currentHint,
  showHint 
}) {
  const [introIndex, setIntroIndex] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const round = ROUNDS[currentRound];

  const advanceIntro = () => {
    if (introIndex < INTRO_MESSAGES.length - 1) {
      setIntroIndex(prev => prev + 1);
    } else {
      setPhase('playing');
    }
  };

  const handleKeyPress = (key) => {
    onAttempt?.();
    setAttempts(prev => prev + 1);

    if (key === round.key) {
      // Correct key!
      setShowOutput(true);
      
      // Play sound
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(round.sound);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      }

      setTimeout(() => {
        setShowOutput(false);
        if (currentRound < ROUNDS.length - 1) {
          setCurrentRound(prev => prev + 1);
          setAttempts(0);
        } else {
          setPhase('complete');
          setTimeout(onComplete, 1500);
        }
      }, 3000);
    } else {
      // Wrong key - trigger hint after 3 attempts
      if (attempts >= 2) {
        onNeedHint?.();
      }
    }
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
              {introIndex < INTRO_MESSAGES.length - 1 ? 'Next' : "Let's Try!"}
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
            {/* Instructions */}
            {!showOutput && !showHint && (
              <div className="mb-6">
                <SpeechBubble
                  message={`Press the letter ${round.key}!`}
                  visible={true}
                />
              </div>
            )}

            {showHint && !showOutput && (
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
                Letter {currentRound + 1} of {ROUNDS.length}
              </p>
            </div>

            {/* Output Screen (Monitor) */}
            <motion.div
              className="w-full max-w-lg mx-auto mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="bg-gray-800 rounded-2xl p-4 shadow-2xl border-4 border-gray-700">
                <div className="bg-sky-400 rounded-xl aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {!showOutput ? (
                      <motion.div
                        key="waiting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <div className="text-6xl mb-2">👀</div>
                        <p className="text-white text-xl font-bold">Waiting for INPUT...</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="output"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="text-center"
                      >
                        <motion.div
                          className="text-8xl mb-2"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1 
                          }}
                        >
                          {round.output}
                        </motion.div>
                        <p className="text-white text-3xl font-bold">{round.word}</p>
                        <div className="absolute top-2 right-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          >
                            <Volume2 className="w-8 h-8 text-yellow-300" />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-bold text-sm">
                  📺 OUTPUT (What you see)
                </span>
              </div>
            </motion.div>

            {/* Keyboard (Input) */}
            <motion.div
              className="w-full max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gray-700 rounded-2xl p-4 shadow-2xl">
                <div className="space-y-2">
                  {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div 
                      key={rowIndex}
                      className="flex justify-center gap-1 md:gap-2"
                      style={{ paddingLeft: rowIndex === 1 ? '2rem' : rowIndex === 2 ? '4rem' : 0 }}
                    >
                      {row.map(key => {
                        const isTarget = key === round.key;
                        const isPressed = showOutput && isTarget;
                        
                        return (
                          <motion.button
                            key={key}
                            onClick={() => handleKeyPress(key)}
                            disabled={showOutput}
                            className={`
                              w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold text-lg md:text-xl
                              transition-all shadow-md
                              ${isPressed 
                                ? 'bg-green-400 text-white translate-y-1' 
                                : isTarget
                                ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-300'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:translate-y-1'
                              }
                              disabled:opacity-50
                            `}
                            animate={isTarget && !showOutput ? {
                              boxShadow: [
                                '0 0 20px rgba(250, 204, 21, 0.6)',
                                '0 0 40px rgba(250, 204, 21, 0.9)',
                                '0 0 20px rgba(250, 204, 21, 0.6)'
                              ]
                            } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {key}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 font-bold text-sm">
                  ⌨️ INPUT (What you type)
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const inputOutputConfig = {
  hints: HINTS,
  emotion: 'teaching'
};