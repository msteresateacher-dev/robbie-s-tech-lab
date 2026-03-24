import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, CheckCircle, XCircle } from 'lucide-react';

const SYMBOLS = [
  { symbol: '+', name: 'Plus', say: 'Plus sign! This means ADD. Like 2 plus 3 equals 5!', example: '2 + 3 = 5', color: 'bg-green-400', category: 'math' },
  { symbol: '−', name: 'Minus', say: 'Minus sign! This means SUBTRACT or take away. Like 5 minus 2 equals 3!', example: '5 − 2 = 3', color: 'bg-red-400', category: 'math' },
  { symbol: '×', name: 'Times', say: 'Times sign! This means MULTIPLY. Like 3 times 4 equals 12!', example: '3 × 4 = 12', color: 'bg-orange-400', category: 'math' },
  { symbol: '÷', name: 'Divide', say: 'Divide sign! This means split into equal groups. Like 12 divided by 3 equals 4!', example: '12 ÷ 3 = 4', color: 'bg-yellow-400', category: 'math' },
  { symbol: '=', name: 'Equals', say: 'Equals sign! Both sides are the SAME value. Like 4 plus 1 equals 5!', example: '4 + 1 = 5', color: 'bg-blue-400', category: 'math' },
  { symbol: '<', name: 'Less Than', say: 'Less than sign! The number on the LEFT is SMALLER. Like 3 is less than 7!', example: '3 < 7', color: 'bg-purple-400', category: 'compare' },
  { symbol: '>', name: 'Greater Than', say: 'Greater than sign! The number on the LEFT is BIGGER. Like 9 is greater than 4!', example: '9 > 4', color: 'bg-pink-400', category: 'compare' },
  { symbol: '≤', name: 'Less Than or Equal', say: 'Less than OR EQUAL TO! The number is smaller or the same. Like 5 is less than or equal to 5!', example: '5 ≤ 5', color: 'bg-violet-400', category: 'compare' },
  { symbol: '≥', name: 'Greater Than or Equal', say: 'Greater than OR EQUAL TO! The number is bigger or the same. Like 6 is greater than or equal to 6!', example: '6 ≥ 6', color: 'bg-fuchsia-400', category: 'compare' },
  { symbol: '≠', name: 'Not Equal', say: 'Not equal sign! The two sides are DIFFERENT. Like 3 is not equal to 5!', example: '3 ≠ 5', color: 'bg-rose-400', category: 'compare' },
  { symbol: '%', name: 'Percent', say: 'Percent sign! This means out of 100. Like 50 percent means half!', example: '50% = half', color: 'bg-amber-400', category: 'math' },
  { symbol: '( )', name: 'Parentheses', say: 'Parentheses! Do what is INSIDE first. Like 2 times open paren 3 plus 1 close paren equals 8!', example: '2 × (3+1) = 8', color: 'bg-teal-400', category: 'grouping' },
  { symbol: '²', name: 'Squared', say: 'Squared! Multiply a number by itself. Like 4 squared means 4 times 4 equals 16!', example: '4² = 16', color: 'bg-cyan-400', category: 'math' },
  { symbol: '√', name: 'Square Root', say: 'Square root! Find what number times itself gives you this. Like the square root of 9 is 3!', example: '√9 = 3', color: 'bg-emerald-400', category: 'math' },
  { symbol: '.', name: 'Decimal Point', say: 'Decimal point! This separates whole numbers from parts. Like 3 point 5 means three and a half!', example: '3.5 = 3½', color: 'bg-sky-400', category: 'number' },
  { symbol: ',', name: 'Comma', say: 'Comma in numbers! This helps us read big numbers. Like 1 comma 000 means one thousand!', example: '1,000', color: 'bg-indigo-400', category: 'number' },
];

const QUIZ_QUESTIONS = [
  { question: 'Which symbol means ADD?', correct: '+', choices: ['+', '-', '×', '÷'] },
  { question: 'Which symbol means the left number is SMALLER?', correct: '<', choices: ['<', '>', '=', '≠'] },
  { question: 'Which symbol means both sides are THE SAME?', correct: '=', choices: ['≠', '<', '=', '>'] },
  { question: 'Which symbol means MULTIPLY?', correct: '×', choices: ['+', '×', '÷', '-'] },
  { question: 'Which symbol means NOT EQUAL?', correct: '≠', choices: ['=', '≤', '≠', '≥'] },
  { question: 'Which symbol means the left number is BIGGER?', correct: '>', choices: ['<', '>', '=', '≤'] },
  { question: 'Which symbol means PERCENT (out of 100)?', correct: '%', choices: ['%', '²', '√', '.'] },
  { question: 'Which symbol means DO THIS PART FIRST?', correct: '( )', choices: ['[ ]', '( )', '{ }', '< >'] },
];

const speak = (text) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.2;
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
};

const CATEGORIES = ['all', 'math', 'compare', 'grouping', 'number'];

export default function SymbolsGame({ onBack }) {
  const [mode, setMode] = useState('menu'); // menu | explore | quiz
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const filteredSymbols = filterCategory === 'all'
    ? SYMBOLS
    : SYMBOLS.filter(s => s.category === filterCategory);

  const handleSymbolClick = (sym) => {
    setSelectedSymbol(sym);
    speak(`${sym.name}! ${sym.say}`);
  };

  const handleQuizAnswer = (choice) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(choice);
    const correct = QUIZ_QUESTIONS[quizIndex].correct;
    if (choice === correct) {
      setQuizScore(s => s + 1);
      speak('Yes! Great job!');
    } else {
      speak(`Not quite! The answer is ${correct}. ${SYMBOLS.find(s => s.symbol === correct)?.say || ''}`);
    }
    setTimeout(() => {
      if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
        setQuizDone(true);
      } else {
        setQuizIndex(i => i + 1);
        setQuizAnswer(null);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setQuizDone(false);
  };

  return (
    <div className="bg-white p-6 rounded-[3rem] shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={mode === 'menu' ? onBack : () => setMode('menu')} className="bg-gray-100 p-3 rounded-2xl hover:bg-gray-200 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-indigo-600">Symbols with Robbie & Bonnie! 🤖🌟</h2>
          <p className="text-sm text-gray-500 font-semibold">Learn keyboard & math symbols for the NYS Test!</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* MENU */}
        {mode === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-indigo-50 rounded-3xl p-6 mb-6 flex items-center gap-4">
              <span className="text-5xl">🤖</span>
              <div>
                <p className="font-bold text-indigo-800 text-lg">"Hi! I'm Robbie! Symbols help us talk about math on the computer test!"</p>
                <p className="text-indigo-600 text-sm mt-1">— Bonnie says: "Let's learn them together! 🌟"</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setMode('explore')} className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white p-8 rounded-3xl font-black text-xl shadow-lg hover:scale-105 transition-transform">
                <div className="text-5xl mb-3">🔍</div>
                Explore Symbols
              </button>
              <button onClick={() => { setMode('quiz'); resetQuiz(); }} className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-8 rounded-3xl font-black text-xl shadow-lg hover:scale-105 transition-transform">
                <div className="text-5xl mb-3">🏆</div>
                Quiz Time!
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm mt-4 font-semibold">Tap a symbol to hear Robbie explain it!</p>
          </motion.div>
        )}

        {/* EXPLORE */}
        {mode === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full font-bold text-sm capitalize transition-colors ${filterCategory === cat ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Symbol grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {filteredSymbols.map((sym, i) => (
                <motion.button
                  key={sym.symbol}
                  onClick={() => handleSymbolClick(sym)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className={`${sym.color} text-white p-4 rounded-2xl font-black shadow-md flex flex-col items-center gap-1 ${selectedSymbol?.symbol === sym.symbol ? 'ring-4 ring-white ring-offset-2' : ''}`}
                >
                  <span className="text-4xl">{sym.symbol}</span>
                  <span className="text-xs font-bold leading-tight text-center">{sym.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Detail card */}
            <AnimatePresence>
              {selectedSymbol && (
                <motion.div
                  key={selectedSymbol.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`${selectedSymbol.color} rounded-3xl p-6 text-white`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-7xl font-black">{selectedSymbol.symbol}</span>
                    <div>
                      <h3 className="text-2xl font-black">{selectedSymbol.name}</h3>
                      <div className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold mt-1">Example: {selectedSymbol.example}</div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-relaxed">{selectedSymbol.say}</p>
                  <button onClick={() => speak(`${selectedSymbol.name}! ${selectedSymbol.say}`)}
                    className="mt-3 bg-white/30 hover:bg-white/50 px-5 py-2 rounded-full font-bold text-sm transition-colors">
                    🔊 Hear it again!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* QUIZ */}
        {mode === 'quiz' && !quizDone && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-500">Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                <Star className="text-amber-500" size={18} />
                <span className="font-black text-amber-700">{quizScore}</span>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-8 mb-6 text-center">
              <p className="text-2xl font-black text-indigo-800">{QUIZ_QUESTIONS[quizIndex].question}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {QUIZ_QUESTIONS[quizIndex].choices.map(choice => {
                const correct = QUIZ_QUESTIONS[quizIndex].correct;
                let btnClass = 'bg-gray-100 hover:bg-gray-200 text-gray-800';
                if (quizAnswer !== null) {
                  if (choice === correct) btnClass = 'bg-green-400 text-white';
                  else if (choice === quizAnswer && choice !== correct) btnClass = 'bg-red-400 text-white';
                  else btnClass = 'bg-gray-100 text-gray-400 opacity-60';
                }
                return (
                  <button key={choice} onClick={() => handleQuizAnswer(choice)}
                    className={`${btnClass} p-6 rounded-3xl font-black text-4xl shadow-md transition-all`}>
                    {choice}
                    {quizAnswer !== null && choice === correct && <CheckCircle className="inline ml-2 mb-1" size={20} />}
                    {quizAnswer !== null && choice === quizAnswer && choice !== correct && <XCircle className="inline ml-2 mb-1" size={20} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* QUIZ DONE */}
        {mode === 'quiz' && quizDone && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <div className="text-8xl mb-4">{quizScore >= 6 ? '🏆' : quizScore >= 4 ? '⭐' : '🤖'}</div>
            <h3 className="text-4xl font-black text-indigo-700 mb-2">
              {quizScore >= 6 ? 'Amazing!' : quizScore >= 4 ? 'Great job!' : 'Keep practicing!'}
            </h3>
            <p className="text-xl text-gray-600 mb-6">You got <span className="font-black text-indigo-600">{quizScore}</span> out of {QUIZ_QUESTIONS.length} correct!</p>
            <div className="bg-indigo-50 rounded-3xl p-4 mb-6 flex items-center gap-3">
              <span className="text-4xl">🤖</span>
              <p className="text-indigo-700 font-bold text-left">"You're getting ready for the NY State Math Test! Robbie is so proud! 🌟"</p>
            </div>
            <div className="flex gap-3">
              <button onClick={resetQuiz} className="flex-1 bg-indigo-500 text-white p-5 rounded-3xl font-black text-lg">Try Again!</button>
              <button onClick={() => setMode('explore')} className="flex-1 bg-purple-500 text-white p-5 rounded-3xl font-black text-lg">Explore More</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}