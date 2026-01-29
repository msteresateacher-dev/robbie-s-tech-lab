import React, { useState } from 'react';
import { 
  Cpu, MousePointer2, Globe, RefreshCw,
  Trophy, Type, Camera, Sparkles, Zap, BrainCircuit,
  Palette, Bug, Music, Share2, Filter, Lightbulb, Home, Droplets, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const apiKey = ""; 

// --- CONSTANTS ---
const DANCE_MOVES = [
  { id: 'clap', icon: <Sparkles />, label: "Clap", color: "bg-yellow-400" },
  { id: 'spin', icon: <RefreshCw />, label: "Spin", color: "bg-orange-400" },
  { id: 'jump', icon: <Zap />, label: "Jump", color: "bg-blue-400" }
];

const BUG_LEVELS = [
  { sequence: ['up', 'up', 'down'], bugIndex: 2, correct: 'up' },
  { sequence: ['left', 'right', 'left'], bugIndex: 1, correct: 'left' }
];

const SORT_ITEMS = [
  { id: 1, name: "Apple", type: "nature", icon: "🍎" },
  { id: 2, name: "Robot", type: "tech", icon: "🤖" },
  { id: 3, name: "Leaf", type: "nature", icon: "🍃" },
  { id: 4, name: "Tablet", type: "tech", icon: "📱" }
];

const STOP_MOTION_SCENES = [
  { title: "Brooklyn Arrival", description: "Robbie wears his magenta pink bow tie!", prompt: "A friendly silver robot with a bright magenta pink bow tie standing in front of the Brooklyn Bridge, 3D Pixar style, sunny day" },
  { title: "Smart Water Saving", description: "Robbie uses AI to help Brooklyn gardens!", prompt: "A robot with a pink bow tie and a glowing brain icon helping water flowers in a Brooklyn community garden, 3D style" },
  { title: "AI Class", description: "The gang learns about technology!", prompt: "A group of cute tech characters: a robot with a pink bow tie, a colorful disk, and a glowing blue brain, all waving in a bright classroom, high quality 3D" }
];

const QWERTY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"]
];

export default function ExtraGames() {
  const [view, setView] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Game States
  const [danceSequence, setDanceSequence] = useState([]);
  const [bugLevel, setBugLevel] = useState(0);
  const [circuitOn, setCircuitOn] = useState(false);
  const [signalPos, setSignalPos] = useState(0);
  const [sortIndex, setSortIndex] = useState(0);
  const [pixels, setPixels] = useState(Array(16).fill('bg-slate-100'));
  const [targetLetter, setTargetLetter] = useState('B');
  const [currentScene, setCurrentScene] = useState(0);
  const [sceneImages, setSceneImages] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [ecoStatus, setEcoStatus] = useState('idle');

  // --- AUDIO HELPERS ---
  const speak = (text) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.3;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 1000);
    }
  };

  // --- IMAGE GENERATION (Placeholder - requires API key) ---
  const generateScene = async (index) => {
    setIsGenerating(true);
    speak("Creating a beautiful picture!");
    // Simulated generation
    setTimeout(() => {
      setSceneImages(prev => ({
        ...prev,
        [index]: `https://via.placeholder.com/800x600/FF69B4/FFFFFF?text=Scene+${index + 1}`
      }));
      setIsGenerating(false);
    }, 2000);
  };

  // --- GAME ACTIONS ---
  const handleSort = (type) => {
    if (SORT_ITEMS[sortIndex].type === type) {
      setScore(s => s + 10);
      speak("Yay! You got it! You are so smart!");
    } else {
      speak("Oh no! Let's try the other one!");
    }
    setSortIndex((sortIndex + 1) % SORT_ITEMS.length);
  };

  const handleEcoAI = () => {
    setEcoStatus('scanning');
    speak("I am using my smart brain to find water leaks!");
    setTimeout(() => {
      setEcoStatus('success');
      setScore(s => s + 30);
      speak("We did it! We saved the flowers!");
      setTimeout(() => setEcoStatus('idle'), 3000);
    }, 2000);
  };

  const checkLetter = (l) => {
    if (l === targetLetter) {
      setScore(s => s + 10);
      speak(`Wow! You found the letter ${l}!`);
      const all = QWERTY_ROWS.flat();
      setTargetLetter(all[Math.floor(Math.random() * all.length)]);
    } else {
      speak(`That's the letter ${l}. Can you find ${targetLetter}?`);
    }
  };

  // --- RENDER MENU ---
  const MenuBtn = ({ icon, label, color, onClick }) => (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${color} text-white p-6 rounded-[2rem] font-black text-xl flex flex-col items-center gap-3 shadow-xl border-b-8 border-black/20 active:translate-y-1 active:border-b-0`}
    >
      {React.cloneElement(icon, { size: 32 })} {label}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 pb-8">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-4 py-4 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <button className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-2xl transition-colors">
              <div className="bg-fuchsia-500 p-3 rounded-2xl text-white">
                <ArrowLeft size={24} />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-black text-gray-800">Robbie's Lab</h1>
                <div className="flex items-center gap-2 text-pink-500 font-bold text-xs tracking-widest">
                  <Sparkles size={12} /> BROOKLYN CAMPUS
                </div>
              </div>
            </button>
          </Link>
          <div className="flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-full border-2 border-amber-200">
            <Trophy className="text-amber-500" size={24} />
            <span className="text-2xl font-black text-amber-700">{score}</span>
          </div>
        </div>
      </header>

      <main className="px-4 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <MenuBtn icon={<Music />} label="Dance Party" color="bg-pink-500" onClick={() => setView('dance')} />
              <MenuBtn icon={<Palette />} label="Pixel Painter" color="bg-purple-500" onClick={() => setView('painter')} />
              <MenuBtn icon={<Bug />} label="Bug Hunter" color="bg-red-500" onClick={() => setView('bug')} />
              <MenuBtn icon={<Zap />} label="Circuit Lab" color="bg-yellow-500" onClick={() => setView('circuit')} />
              <MenuBtn icon={<Filter />} label="Sorting Hat" color="bg-green-500" onClick={() => setView('sort')} />
              <MenuBtn icon={<Share2 />} label="Signal Share" color="bg-blue-500" onClick={() => setView('signal')} />
              <MenuBtn icon={<Type />} label="Letter Hunt" color="bg-indigo-500" onClick={() => setView('letters')} />
              <MenuBtn icon={<Droplets />} label="Eco-AI" color="bg-cyan-500" onClick={() => setView('eco')} />
              <MenuBtn icon={<Camera />} label="Stop Motion" color="bg-orange-500" onClick={() => setView('movie')} />
            </motion.div>
          )}

          {/* DANCE PARTY */}
          {view === 'dance' && (
            <motion.div
              key="dance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black mb-6 text-pink-600">Robot Dance Party!</h2>
              <div className="flex justify-center gap-4 mb-8 min-h-[100px] border-4 border-dashed border-pink-100 rounded-3xl p-4 flex-wrap">
                {danceSequence.map((move, i) => (
                  <div key={i} className={`${move.color} text-white p-4 rounded-2xl animate-bounce`}>{move.icon}</div>
                ))}
                {danceSequence.length === 0 && (
                  <p className="text-gray-400 self-center">Pick some moves!</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {DANCE_MOVES.map(move => (
                  <button key={move.id} onClick={() => setDanceSequence([...danceSequence, move])} className={`${move.color} p-6 rounded-2xl text-white font-bold text-lg`}>
                    {move.icon} {move.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 text-gray-700 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={() => { speak("Let's dance the code together!"); setDanceSequence([]); setScore(s => s+10); }} className="bg-fuchsia-600 text-white p-6 rounded-2xl font-black flex-[2] text-xl">PLAY DANCE CODE</button>
              </div>
            </motion.div>
          )}

          {/* PIXEL PAINTER */}
          {view === 'painter' && (
            <motion.div
              key="painter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black mb-8 text-purple-600">Pixel Painter</h2>
              <div className="grid grid-cols-4 gap-2 w-80 mx-auto mb-8">
                {pixels.map((color, i) => (
                  <button key={i} onClick={() => {
                    const next = [...pixels];
                    next[i] = 'bg-purple-400';
                    setPixels(next);
                    setScore(s => s + 1);
                  }} className={`w-16 h-16 rounded-lg shadow-inner ${color} hover:brightness-110 transition-all`} />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={() => setPixels(Array(16).fill('bg-slate-100'))} className="bg-purple-100 text-purple-700 p-6 rounded-2xl font-bold flex-1">Clear Screen</button>
              </div>
            </motion.div>
          )}

          {/* ECO-AI */}
          {view === 'eco' && (
            <motion.div
              key="eco"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black mb-4 text-cyan-600">Eco-AI Helper</h2>
              <p className="text-xl font-bold text-slate-400 mb-8">Robbie uses AI to find ways to save water!</p>
              {ecoStatus === 'success' ? (
                <div className="bg-green-500 text-white p-12 rounded-[2rem] animate-bounce mb-6">
                  <Sparkles size={64} className="mx-auto mb-4" />
                  <h3 className="text-3xl font-black">LEAK FIXED!</h3>
                  <p className="text-xl">Brooklyn gardens are happy!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 mb-6">
                  <div className={`p-10 rounded-full ${ecoStatus === 'scanning' ? 'bg-cyan-100 animate-pulse' : 'bg-slate-100 text-cyan-500'}`}>
                    <BrainCircuit size={80} />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={handleEcoAI} disabled={ecoStatus !== 'idle'} className="bg-cyan-600 text-white p-6 rounded-[2rem] font-black text-xl flex-[2] disabled:opacity-50">RUN WATER SCAN</button>
              </div>
            </motion.div>
          )}

          {/* LETTER HUNT */}
          {view === 'letters' && (
            <motion.div
              key="letters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl"
            >
              <div className="text-center mb-8">
                <p className="text-slate-400 font-black uppercase tracking-widest mb-2">Find the letter</p>
                <div className="text-9xl font-black text-indigo-600">{targetLetter}</div>
              </div>
              <div className="bg-slate-900 p-6 rounded-[2rem] border-b-[12px] border-black mb-6">
                {QWERTY_ROWS.map((row, idx) => (
                  <div key={idx} className="flex justify-center gap-2 mb-2">
                    {row.map(char => (
                      <button key={char} onClick={() => checkLetter(char)} className={`w-12 h-12 rounded-xl font-bold text-xl flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all ${char === targetLetter ? 'bg-green-400 border-green-600 text-white animate-pulse' : 'bg-white border-slate-300 hover:bg-gray-50'}`}>{char}</button>
                    ))}
                  </div>
                ))}
              </div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back to Menu</button>
            </motion.div>
          )}

          {/* STOP MOTION */}
          {view === 'movie' && (
            <motion.div
              key="movie"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[3rem] shadow-2xl"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-orange-600">{STOP_MOTION_SCENES[currentScene].title}</h2>
                <p className="text-gray-600 mt-2">{STOP_MOTION_SCENES[currentScene].description}</p>
              </div>
              <div className="relative aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden border-8 border-white mb-6 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center"><RefreshCw size={48} className="animate-spin text-orange-500 mb-4 mx-auto" /><p className="font-bold text-gray-600">Developing Film...</p></div>
                ) : sceneImages[currentScene] ? (
                  <img src={sceneImages[currentScene]} alt={`Scene ${currentScene + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <button onClick={() => generateScene(currentScene)} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors">TAKE PHOTO {currentScene + 1}</button>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={() => setCurrentScene((currentScene + 1) % 3)} className="bg-slate-200 p-6 rounded-2xl font-bold flex-1">NEXT SCENE</button>
                <button onClick={() => speak("Let's watch our Brooklyn story!")} className="bg-orange-600 text-white p-6 rounded-2xl font-black flex-[2]">PLAY MOVIE</button>
              </div>
            </motion.div>
          )}

          {/* BUG HUNTER */}
          {view === 'bug' && (
            <motion.div
              key="bug"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black text-red-600 mb-8">Bug Hunter</h2>
              <p className="text-gray-600 mb-8 text-lg">Find the bug in the code!</p>
              <div className="flex justify-center gap-6 mb-12">
                {BUG_LEVELS[bugLevel].sequence.map((dir, i) => (
                  <div key={i} className="relative bg-slate-100 p-8 rounded-2xl text-6xl">
                    {dir === 'up' ? '⬆️' : dir === 'down' ? '⬇️' : dir === 'left' ? '⬅️' : '➡️'}
                    {i === BUG_LEVELS[bugLevel].bugIndex && (
                      <button onClick={() => { setScore(s=>s+20); speak("Yay! I fixed the bug!"); setBugLevel((bugLevel+1)%2); }} className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full animate-pulse hover:scale-110 transition-transform"><Bug size={32}/></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back to Menu</button>
            </motion.div>
          )}

          {/* CIRCUIT LAB */}
          {view === 'circuit' && (
            <motion.div
              key="circuit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black text-yellow-600 mb-8">Circuit Builder</h2>
              <div className="flex flex-col items-center gap-8 mb-8">
                <Lightbulb size={120} className={circuitOn ? 'text-yellow-400 drop-shadow-[0_0_30px_gold]' : 'text-slate-200'} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={() => { setCircuitOn(!circuitOn); speak(circuitOn ? "The circuit is open!" : "Power on! Bip bop!"); setScore(s => s + 5); }} className={`px-12 py-6 rounded-3xl font-black text-white text-2xl transition-all flex-[2] ${circuitOn ? 'bg-red-500' : 'bg-green-500'}`}>{circuitOn ? 'OPEN CIRCUIT' : 'CLOSE CIRCUIT'}</button>
              </div>
            </motion.div>
          )}

          {/* SORTING HAT */}
          {view === 'sort' && (
            <motion.div
              key="sort"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black text-green-600 mb-8">Data Sorting</h2>
              <div className="text-8xl mb-8">{SORT_ITEMS[sortIndex].icon}</div>
              <p className="text-2xl font-bold text-gray-700 mb-8">{SORT_ITEMS[sortIndex].name}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => handleSort('nature')} className="bg-emerald-500 text-white p-8 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-colors">🌿 NATURE</button>
                <button onClick={() => handleSort('tech')} className="bg-blue-500 text-white p-8 rounded-3xl font-black text-xl hover:bg-blue-600 transition-colors">💻 TECH</button>
              </div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back to Menu</button>
            </motion.div>
          )}

          {/* SIGNAL SHARE */}
          {view === 'signal' && (
            <motion.div
              key="signal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black text-blue-600 mb-12">Internet Signals</h2>
              <p className="text-gray-600 mb-8 text-lg">Help the signal travel across the internet!</p>
              <div className="h-6 w-full bg-slate-100 rounded-full relative mb-12">
                <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-500" style={{ left: `${signalPos}%` }}>
                  <div className="bg-blue-500 text-white p-4 rounded-xl shadow-lg"><Share2 /></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={() => { 
                  const n = signalPos + 25; 
                  if(n > 90) { setSignalPos(0); setScore(s=>s+20); speak("My message sent! Wow!"); }
                  else setSignalPos(n);
                }} className="bg-blue-600 text-white p-8 rounded-3xl font-black text-2xl flex-[2]">BOOST SIGNAL</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}