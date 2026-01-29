import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowRight, Play, RotateCcw, Trash2 } from 'lucide-react';
import SpeechBubble from '@/components/SpeechBubble';
import { Button } from '@/components/ui/button';

const INTRO_MESSAGES = [
  { text: "Let's race to the finish line! But I need your help!", emotion: 'excited' },
  { text: "You'll give me INSTRUCTIONS using arrow blocks. This is called CODING!", emotion: 'teaching' },
  { text: "Drag the arrows to make a path for me. Then press GO!", emotion: 'encouraging' }
];

const HINTS = [
  "I need to go UP three times, then RIGHT three times to reach the star!",
  "Try using 3 UP arrows ⬆️ and then 3 RIGHT arrows ➡️",
  "The path is: UP, UP, UP, RIGHT, RIGHT, RIGHT. Drag those arrows!"
];

const GRID_SIZE = 4;
const START_POS = { x: 0, y: 3 };
const END_POS = { x: 3, y: 0 };

const OBSTACLES = [
  { x: 1, y: 2 },
  { x: 2, y: 1 }
];

export default function RobbiesRace({ 
  onComplete, 
  onNeedHint, 
  onAttempt,
  currentHint,
  showHint 
}) {
  const [introIndex, setIntroIndex] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [instructions, setInstructions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPos, setCurrentPos] = useState(START_POS);
  const [visitedCells, setVisitedCells] = useState([START_POS]);
  const [attempts, setAttempts] = useState(0);

  const advanceIntro = () => {
    if (introIndex < INTRO_MESSAGES.length - 1) {
      setIntroIndex(prev => prev + 1);
    } else {
      setPhase('playing');
    }
  };

  const addInstruction = (direction) => {
    if (instructions.length < 10 && !isRunning) {
      setInstructions([...instructions, direction]);
    }
  };

  const removeInstruction = (index) => {
    if (!isRunning) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const clearInstructions = () => {
    if (!isRunning) {
      setInstructions([]);
    }
  };

  const runProgram = async () => {
    if (instructions.length === 0) return;
    
    onAttempt?.();
    setAttempts(prev => prev + 1);
    setIsRunning(true);
    setCurrentPos(START_POS);
    setVisitedCells([START_POS]);

    let pos = { ...START_POS };
    let path = [START_POS];
    let crashed = false;

    for (let i = 0; i < instructions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));

      const instruction = instructions[i];
      let newPos = { ...pos };

      if (instruction === 'up') newPos.y -= 1;
      if (instruction === 'right') newPos.x += 1;

      // Check boundaries
      if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
        crashed = true;
        break;
      }

      // Check obstacles
      if (OBSTACLES.some(obs => obs.x === newPos.x && obs.y === newPos.y)) {
        crashed = true;
        break;
      }

      pos = newPos;
      path.push(pos);
      setCurrentPos(pos);
      setVisitedCells([...path]);

      // Check if reached goal
      if (pos.x === END_POS.x && pos.y === END_POS.y) {
        setTimeout(() => {
          setPhase('complete');
          setTimeout(onComplete, 2000);
        }, 1000);
        return;
      }
    }

    // Failed
    setTimeout(() => {
      setIsRunning(false);
      setCurrentPos(START_POS);
      setVisitedCells([START_POS]);
      
      if (attempts >= 2) {
        onNeedHint?.();
      }
    }, 1000);
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
              {introIndex < INTRO_MESSAGES.length - 1 ? 'Next' : "Let's Code!"}
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
            {showHint && (
              <div className="mb-6">
                <SpeechBubble
                  message={currentHint}
                  visible={true}
                />
              </div>
            )}

            {!showHint && !isRunning && (
              <div className="text-center mb-4">
                <p className="text-gray-600 font-medium text-lg">
                  Build my path to the ⭐ star!
                </p>
              </div>
            )}

            {/* Game Grid */}
            <div className="w-full max-w-md mx-auto mb-6">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 shadow-xl border-4 border-green-300">
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                    const x = idx % GRID_SIZE;
                    const y = Math.floor(idx / GRID_SIZE);
                    const isStart = x === START_POS.x && y === START_POS.y;
                    const isEnd = x === END_POS.x && y === END_POS.y;
                    const isObstacle = OBSTACLES.some(obs => obs.x === x && obs.y === y);
                    const isRobbie = currentPos.x === x && currentPos.y === y;
                    const isVisited = visitedCells.some(cell => cell.x === x && cell.y === y);

                    return (
                      <motion.div
                        key={idx}
                        className={`
                          aspect-square rounded-xl flex items-center justify-center text-3xl
                          ${isObstacle ? 'bg-gray-700' : 'bg-white/60'}
                          ${isVisited && !isRobbie ? 'bg-sky-200' : ''}
                          border-2 border-white/50
                        `}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        {isObstacle && '🪨'}
                        {isStart && !isRobbie && '🏁'}
                        {isEnd && !isRobbie && (
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            ⭐
                          </motion.div>
                        )}
                        {isRobbie && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-4xl"
                          >
                            🤖
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Instruction Blocks */}
            <div className="w-full max-w-md mx-auto mb-6">
              <h3 className="text-center font-bold text-gray-700 mb-3">Your Code:</h3>
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-200 min-h-[80px]">
                {instructions.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">Drag arrows here</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="relative group"
                      >
                        <div className={`
                          w-16 h-16 rounded-xl flex items-center justify-center
                          ${instruction === 'up' ? 'bg-blue-400' : 'bg-orange-400'}
                          text-white shadow-md
                          ${isRunning ? 'opacity-50' : 'hover:scale-110 transition-transform'}
                        `}>
                          {instruction === 'up' ? (
                            <ArrowUp className="w-8 h-8" />
                          ) : (
                            <ArrowRight className="w-8 h-8" />
                          )}
                        </div>
                        {!isRunning && (
                          <button
                            onClick={() => removeInstruction(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="text-white text-xs">×</span>
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-md mx-auto space-y-4">
              {/* Arrow buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => addInstruction('up')}
                  disabled={isRunning || instructions.length >= 10}
                  className="h-16 px-6 bg-blue-400 hover:bg-blue-500 text-white rounded-2xl"
                >
                  <ArrowUp className="w-6 h-6 mr-2" />
                  Up
                </Button>
                <Button
                  size="lg"
                  onClick={() => addInstruction('right')}
                  disabled={isRunning || instructions.length >= 10}
                  className="h-16 px-6 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  Right
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearInstructions}
                  disabled={isRunning || instructions.length === 0}
                  className="flex-1 h-12 rounded-xl"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear
                </Button>
                <Button
                  size="lg"
                  onClick={runProgram}
                  disabled={isRunning || instructions.length === 0}
                  className="flex-1 h-12 bg-green-500 hover:bg-green-600 rounded-xl"
                >
                  {isRunning ? (
                    <>Running...</>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      GO!
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const robbiesRaceConfig = {
  hints: HINTS,
  emotion: 'excited'
};