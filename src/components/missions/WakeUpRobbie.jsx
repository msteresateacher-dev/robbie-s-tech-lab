import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechBubble from '@/components/SpeechBubble';
import DragDropSequence from '@/components/DragDropSequence';

const MISSION_STEPS = [
  { id: 'wake', emoji: '☀️', label: 'Open your eyes' },
  { id: 'stretch', emoji: '🙆', label: 'Stretch your arms' },
  { id: 'brush', emoji: '🪥', label: 'Brush your teeth' },
  { id: 'dress', emoji: '👕', label: 'Get dressed' },
  { id: 'eat', emoji: '🥣', label: 'Eat breakfast' }
];

const CORRECT_ORDER = ['wake', 'stretch', 'brush', 'dress', 'eat'];

const HINTS = [
  "Hmm, what do you do first thing when you wake up? I bet it starts with your eyes!",
  "Think about what happens in the morning. First we wake up, then we stretch our sleepy arms!",
  "Oops! Let me help. We open our eyes first, stretch, brush teeth, get dressed, then eat breakfast!"
];

const INTRO_MESSAGES = [
  { text: "Oh no! I forgot how to start my morning!", emotion: 'surprised' },
  { text: "Can you help me put these steps in the right order?", emotion: 'encouraging' },
  { text: "This is called SEQUENCING - putting things in the right order. Just like computers do!", emotion: 'excited' }
];

export default function WakeUpRobbie({ 
  onComplete, 
  onNeedHint, 
  onAttempt,
  currentHint,
  showHint 
}) {
  const [introIndex, setIntroIndex] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const advanceIntro = () => {
    if (introIndex < INTRO_MESSAGES.length - 1) {
      setIntroIndex(prev => prev + 1);
    } else {
      setPhase('playing');
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
              onSpeakStart={() => setIsSpeaking(true)}
              onSpeakEnd={() => setIsSpeaking(false)}
            />
            <button
              onClick={advanceIntro}
              className="mt-4 w-full max-w-md mx-auto h-14 text-lg rounded-2xl bg-sky-400 hover:bg-sky-500 text-white font-semibold transition-colors"
            >
              {introIndex < INTRO_MESSAGES.length - 1 ? 'Next' : "Let's Help Robbie!"}
            </button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {showHint && (
              <div className="mb-6">
                <SpeechBubble
                  message={currentHint}
                  visible={true}
                />
              </div>
            )}
            <div className="text-center mb-4">
              <p className="text-gray-600 font-medium text-lg">
                Drag the steps into the right order!
              </p>
            </div>
            <DragDropSequence
              steps={MISSION_STEPS}
              correctOrder={CORRECT_ORDER}
              onComplete={() => {
                setPhase('complete');
                setTimeout(onComplete, 1500);
              }}
              onAttempt={onAttempt}
              onNeedHint={onNeedHint}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const wakeUpRobbieConfig = {
  hints: HINTS,
  emotion: 'sleepy'
};