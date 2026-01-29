import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DragDropSequence({ 
  steps, 
  correctOrder, 
  onComplete, 
  onAttempt,
  onNeedHint 
}) {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [incorrectItems, setIncorrectItems] = useState([]);

  useEffect(() => {
    // Shuffle the steps initially
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [steps]);

  const checkOrder = () => {
    const currentOrder = items.map(item => item.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    
    setAttempts(prev => prev + 1);
    onAttempt?.();

    if (isCorrect) {
      setShowSuccess(true);
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    } else {
      // Highlight incorrect positions
      const incorrect = currentOrder.map((id, index) => 
        id !== correctOrder[index] ? index : -1
      ).filter(i => i !== -1);
      setIncorrectItems(incorrect);
      
      setTimeout(() => setIncorrectItems([]), 1000);

      // Trigger hint after 3 failed attempts
      if (attempts >= 2) {
        onNeedHint?.();
      }
    }
  };

  const resetOrder = () => {
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setIncorrectItems([]);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-3"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="touch-none"
          >
            <motion.div
              className={`
                relative p-4 md:p-6 rounded-2xl cursor-grab active:cursor-grabbing
                bg-white shadow-lg border-4 transition-colors
                ${incorrectItems.includes(index) 
                  ? 'border-red-400 bg-red-50 shake' 
                  : 'border-orange-200 hover:border-orange-400'}
              `}
              whileDrag={{ 
                scale: 1.05, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                zIndex: 50
              }}
              layout
            >
              {/* Step number indicator */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-400 text-white font-bold flex items-center justify-center shadow-md text-lg">
                {index + 1}
              </div>

              {/* Step content */}
              <div className="flex items-center gap-4 pl-4">
                <div className="text-4xl">{item.emoji}</div>
                <span className="text-lg md:text-xl font-medium text-gray-700">{item.label}</span>
              </div>

              {/* Drag handle indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <div className="w-6 h-1 bg-gray-300 rounded-full" />
                <div className="w-6 h-1 bg-gray-300 rounded-full" />
                <div className="w-6 h-1 bg-gray-300 rounded-full" />
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={resetOrder}
          className="rounded-full px-6 py-6 text-lg border-2"
        >
          <RotateCcw className="w-6 h-6 mr-2" />
          Mix Up
        </Button>
        <Button
          size="lg"
          onClick={checkOrder}
          className="rounded-full px-8 py-6 text-lg bg-green-500 hover:bg-green-600 shadow-lg"
        >
          <Check className="w-6 h-6 mr-2" />
          Check!
        </Button>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
          >
            <motion.div
              className="bg-white rounded-3xl p-8 text-center shadow-2xl"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600">Amazing!</h2>
              <p className="text-xl text-gray-600 mt-2">You got it right!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}