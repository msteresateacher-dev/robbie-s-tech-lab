import React, { useState } from 'react';
import {
  Cpu, MousePointer2, Globe, RefreshCw,
  Trophy, Type, Camera, Sparkles, Zap, BrainCircuit,
  Palette, Bug, Music, Share2, Filter, Lightbulb, Home, Droplets, ArrowLeft,
  Spade, Plus, Minus, Users, Volume2, Backpack, Trash2, Monitor, Keyboard,
  Power, Lock, Timer, Heart, Binary, Database, Network, Headphones, Cable,
  Puzzle, Tablet, MapPin, Cloud, Image, Hash
} from 'lucide-react';
import SymbolsGame from '@/components/games/SymbolsGame';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { openAIService } from '@/api/openAIService';


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

const GO_FISH_CARDS = [
  { id: 1, number: 1, icon: "🐟" },
  { id: 2, number: 1, icon: "🐟" },
  { id: 3, number: 2, icon: "🐠" },
  { id: 4, number: 2, icon: "🐠" },
  { id: 5, number: 3, icon: "🦈" },
  { id: 6, number: 3, icon: "🦈" },
  { id: 7, number: 4, icon: "🐙" },
  { id: 8, number: 4, icon: "🐙" },
  { id: 9, number: 5, icon: "🦀" },
  { id: 10, number: 5, icon: "🦀" }
];

const ROBBIE_SAYINGS = [
  { text: "Time to clean up, friends!", icon: <Trash2 /> },
  { text: "Put this in your backpack!", icon: <Backpack /> },
  { text: "Put your toys away, please!", icon: <Sparkles /> }
];

const CABLE_TYPES = [
  { id: 1, cable: '🔌', device: '💻', name: 'Power Cable', match: 'laptop' },
  { id: 2, cable: '📱', device: '🔋', name: 'USB Cable', match: 'phone' },
  { id: 3, cable: '🎧', device: '📻', name: 'Audio Cable', match: 'speaker' }
];

const COMPUTER_PARTS = [
  { id: 'monitor', name: 'Monitor', icon: '🖥️', position: { x: 2, y: 1 } },
  { id: 'keyboard', name: 'Keyboard', icon: '⌨️', position: { x: 2, y: 3 } },
  { id: 'mouse', name: 'Mouse', icon: '🖱️', position: { x: 3, y: 3 } },
  { id: 'cpu', name: 'Computer', icon: '💻', position: { x: 1, y: 2 } }
];

const PASSWORD_PATTERNS = [
  { pattern: ['🔴', '🔵', '🟡'], name: 'Rainbow' },
  { pattern: ['⭐', '💎', '⭐'], name: 'Star Diamond' },
  { pattern: ['🍎', '🍊', '🍎'], name: 'Apple Orange' }
];

const KINDNESS_SCENARIOS = [
  { text: 'Say "Great job!" to a friend', kind: true, emoji: '😊' },
  { text: 'Call someone a mean name', kind: false, emoji: '😢' },
  { text: 'Share your toy with others', kind: true, emoji: '🤝' },
  { text: 'Take without asking', kind: false, emoji: '😠' }
];

const BROOKLYN_LOCATIONS = [
  { name: 'Library', icon: '📚', task: 'Help organize books!', emoji: '📖' },
  { name: 'Park', icon: '🌳', task: 'Clean up the playground!', emoji: '🧹' },
  { name: 'School', icon: '🏫', task: 'Welcome new students!', emoji: '👋' }
];

const DATA_ITEMS = [
  { id: 1, type: 'photo', icon: '📷', category: 'images' },
  { id: 2, type: 'number', icon: '🔢', category: 'numbers' },
  { id: 3, type: 'color', icon: '🎨', category: 'colors' },
  { id: 4, type: 'photo', icon: '📸', category: 'images' },
  { id: 5, type: 'number', icon: '➕', category: 'numbers' },
  { id: 6, type: 'color', icon: '🌈', category: 'colors' }
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

  // New game states
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [fishDeck, setFishDeck] = useState([]);
  const [playerMatches, setPlayerMatches] = useState(0);
  const [computerMatches, setComputerMatches] = useState(0);
  const [mathProblem, setMathProblem] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
  const [tagRunning, setTagRunning] = useState(false);
  const [tagScore, setTagScore] = useState(0);
  const [tagTargets, setTagTargets] = useState([]);
  const [sayingIndex, setSayingIndex] = useState(0);

  // New concept games
  const [mouseTargets, setMouseTargets] = useState([]);
  const [mouseClicks, setMouseClicks] = useState(0);
  const [keyPressed, setKeyPressed] = useState('');
  const [screenItems, setScreenItems] = useState([]);
  const [powerOn, setPowerOn] = useState(false);
  const [currentPassword, setCurrentPassword] = useState([]);
  const [screenTime, setScreenTime] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [binaryLights, setBinaryLights] = useState([0, 0, 0, 0]);
  const [dataSort, setDataSort] = useState({});
  const [networkNodes, setNetworkNodes] = useState([]);
  const [musicSequence, setMusicSequence] = useState([]);
  const [cableMatch, setCableMatch] = useState(null);
  const [partsPlaced, setPartsPlaced] = useState([]);
  const [touchVsType, setTouchVsType] = useState({ touch: 0, type: 0 });
  const [brooklynLocation, setBrooklynLocation] = useState(0);
  const [weatherData, setWeatherData] = useState({ temp: 65, condition: 'sunny' });
  const [photoGallery, setPhotoGallery] = useState([]);

  // --- KEYBOARD INPUT HANDLING ---
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (view === 'menu') return;

      if (['Space', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (view === 'keyboard' && e.key.length === 1) {
        handleKeyPress(e.key.toUpperCase());
      }

      if (view === 'keyboard') {
        if (e.code === 'Space') handleKeyPress('SPACE');
        if (e.code === 'Enter') handleKeyPress('ENTER');
        if (e.code === 'Delete' || e.code === 'Backspace') handleKeyPress('DELETE');
      }

      if (view === 'letters' && /^[A-Z]$/i.test(e.key)) {
        checkLetter(e.key.toUpperCase());
      }

      if (view === 'binary' && /^[1-4]$/.test(e.key)) {
        toggleBinary(parseInt(e.key) - 1);
      }

      if (view === 'math' && /^[0-9]$/.test(e.key)) {
        checkMathAnswer(parseInt(e.key));
      }

      if (view === 'bug') {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
          setScore(s => s + 5);
          speak(`Arrow key pressed!`);
        }
      }

      if (e.code === 'Escape' && view !== 'menu') {
        setView('menu');
      }

      if (e.code === 'Space') {
        if (view === 'mouse' && mouseTargets.length > 0) hitTarget();
        if (view === 'power') togglePower();
        if (view === 'sayings') playSaying();
        if (view === 'network') sendNetworkMessage();
        if (view === 'brooklyn') helpBrooklyn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

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

  // --- GO FISH GAME ---
  const startGoFish = () => {
    const shuffled = [...GO_FISH_CARDS].sort(() => Math.random() - 0.5);
    setPlayerHand(shuffled.slice(0, 3));
    setComputerHand(shuffled.slice(3, 6));
    setFishDeck(shuffled.slice(6));
    setPlayerMatches(0);
    setComputerMatches(0);
    speak("Let's play Go Fish!");
  };

  const askForCard = (number) => {
    const hasCard = computerHand.find(c => c.number === number);
    if (hasCard) {
      setPlayerHand([...playerHand, hasCard]);
      setComputerHand(computerHand.filter(c => c.id !== hasCard.id));
      speak("I have that card! Here you go!");
      setScore(s => s + 10);
    } else {
      speak("Go fish!");
      if (fishDeck.length > 0) {
        setPlayerHand([...playerHand, fishDeck[0]]);
        setFishDeck(fishDeck.slice(1));
      }
    }
  };

  // --- MATH GAME ---
  const generateMathProblem = () => {
    const operations = ['+', '-'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = op === '-' ? Math.floor(Math.random() * num1) : Math.floor(Math.random() * 10) + 1;
    const answer = op === '+' ? num1 + num2 : num1 - num2;
    setMathProblem({ num1, num2, operation: op, answer });
  };

  const checkMathAnswer = (userAnswer) => {
    if (userAnswer === mathProblem.answer) {
      setScore(s => s + 15);
      speak("Amazing! You're so smart!");
      generateMathProblem();
    } else {
      speak("Not quite! Try again, friend!");
    }
  };

  // --- TAG GAME ---
  const startTagGame = () => {
    setTagRunning(true);
    setTagScore(0);
    const targets = Array(6).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 80,
      y: Math.random() * 80,
      caught: false
    }));
    setTagTargets(targets);
    speak("Let's play tag! Catch all the friends!");
  };

  const catchTarget = (id) => {
    setTagTargets(tagTargets.map(t => t.id === id ? { ...t, caught: true } : t));
    setTagScore(tagScore + 1);
    setScore(s => s + 10);
    speak("Tagged!");
    if (tagScore + 1 === 6) {
      speak("You caught everyone! Great job!");
      setTimeout(() => setTagRunning(false), 2000);
    }
  };

  // --- BROKEN RECORD ---
  const playSaying = () => {
    speak(ROBBIE_SAYINGS[sayingIndex].text);
    setSayingIndex((sayingIndex + 1) % ROBBIE_SAYINGS.length);
  };

  // --- NEW GAME FUNCTIONS ---
  const spawnMouseTarget = () => {
    setMouseTargets([{ x: Math.random() * 80, y: Math.random() * 80, id: Date.now() }]);
  };

  const hitTarget = () => {
    setMouseClicks(mouseClicks + 1);
    setScore(s => s + 5);
    speak("Nice click!");
    spawnMouseTarget();
  };

  const handleKeyPress = (key) => {
    setKeyPressed(key);
    setScore(s => s + 5);
    speak(`You pressed ${key}!`);
  };

  const togglePower = () => {
    setPowerOn(!powerOn);
    speak(powerOn ? "Turning off safely!" : "Powering on!");
  };

  const addToPassword = (symbol) => {
    if (currentPassword.length < 3) {
      setCurrentPassword([...currentPassword, symbol]);
    }
  };

  const checkPassword = () => {
    const correct = PASSWORD_PATTERNS[0].pattern;
    if (JSON.stringify(currentPassword) === JSON.stringify(correct)) {
      setScore(s => s + 20);
      speak("Password correct! Great memory!");
    } else {
      speak("Try again!");
    }
    setCurrentPassword([]);
  };

  const startScreenTimer = () => {
    setTimerRunning(true);
    setScreenTime(300);
    const interval = setInterval(() => {
      setScreenTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          speak("Time for a break!");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const checkKindness = (kind) => {
    if (KINDNESS_SCENARIOS[scenarioIndex].kind === kind) {
      setScore(s => s + 15);
      speak(kind ? "That's so kind!" : "Good job knowing that's not nice!");
    } else {
      speak("Think about how that makes others feel.");
    }
    setScenarioIndex((scenarioIndex + 1) % KINDNESS_SCENARIOS.length);
  };

  const toggleBinary = (index) => {
    const newLights = [...binaryLights];
    newLights[index] = newLights[index] === 0 ? 1 : 0;
    setBinaryLights(newLights);
    setScore(s => s + 2);
  };

  const sortDataItem = (item, category) => {
    if (item.category === category) {
      setScore(s => s + 10);
      speak("Great sorting!");
    }
  };

  const sendNetworkMessage = () => {
    speak("Sending message through the network!");
    setScore(s => s + 15);
  };

  const playMusicNote = (note) => {
    setMusicSequence([...musicSequence, note]);
    setScore(s => s + 5);
  };

  const matchCable = (cable, device) => {
    if (cable.match === device) {
      speak("Perfect match!");
      setScore(s => s + 15);
    }
  };

  const placePart = (part) => {
    if (!partsPlaced.includes(part.id)) {
      setPartsPlaced([...partsPlaced, part.id]);
      setScore(s => s + 10);
      speak(`Great! You placed the ${part.name}!`);
    }
  };

  const compareInput = (type) => {
    setTouchVsType({ ...touchVsType, [type]: touchVsType[type] + 1 });
    setScore(s => s + 5);
  };

  const helpBrooklyn = () => {
    speak(BROOKLYN_LOCATIONS[brooklynLocation].task);
    setBrooklynLocation((brooklynLocation + 1) % BROOKLYN_LOCATIONS.length);
    setScore(s => s + 20);
  };

  const checkWeather = async () => {
    speak("Checking Harlem weather with my sensors!");
    try {
      const result = await openAIService.invoke(
        "What is the current temperature in Harlem, NY and weather condition (sunny, cloudy, or rainy)? Give me just the temperature number and condition in JSON format with 'temp' and 'condition' fields.",
        {
          temperature: 0.7,
          maxTokens: 100
        }
      );

      // Parse the JSON response
      const weatherData = JSON.parse(result.content);
      setWeatherData(weatherData);
      speak(`It's ${weatherData.condition} and ${weatherData.temp} degrees in Harlem!`);
    } catch (error) {
      speak("Having trouble with my weather sensors!");
      console.error('Weather check error:', error);
    }
  };

  const takePhoto = () => {
    const photos = ['🌉', '🏙️', '🌳', '🏫', '📚'];
    setPhotoGallery([...photoGallery, photos[Math.floor(Math.random() * photos.length)]]);
    speak("Photo captured!");
    setScore(s => s + 10);
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
              {/* Basic Concepts */}
              <MenuBtn icon={<MousePointer2 />} label="Mouse Skills" color="bg-sky-500" onClick={() => { setView('mouse'); spawnMouseTarget(); }} />
              <MenuBtn icon={<Keyboard />} label="Keyboard Fun" color="bg-slate-500" onClick={() => setView('keyboard')} />
              <MenuBtn icon={<Monitor />} label="Screen World" color="bg-emerald-500" onClick={() => setView('screen')} />
              <MenuBtn icon={<Power />} label="Power On/Off" color="bg-stone-500" onClick={() => setView('power')} />

              {/* Safety */}
              <MenuBtn icon={<Lock />} label="Password" color="bg-amber-500" onClick={() => setView('password')} />
              <MenuBtn icon={<Timer />} label="Screen Time" color="bg-teal-500" onClick={() => setView('timer')} />
              <MenuBtn icon={<Heart />} label="Be Kind" color="bg-pink-500" onClick={() => setView('kindness')} />

              {/* Advanced */}
              <MenuBtn icon={<Binary />} label="Binary Lights" color="bg-indigo-500" onClick={() => setView('binary')} />
              <MenuBtn icon={<Database />} label="Data Detective" color="bg-purple-500" onClick={() => setView('data')} />
              <MenuBtn icon={<Network />} label="Network" color="bg-blue-500" onClick={() => setView('network')} />
              <MenuBtn icon={<Headphones />} label="Music Code" color="bg-violet-500" onClick={() => setView('music')} />

              {/* Physical */}
              <MenuBtn icon={<Cable />} label="Cables" color="bg-orange-500" onClick={() => setView('cables')} />
              <MenuBtn icon={<Puzzle />} label="Parts Puzzle" color="bg-red-500" onClick={() => setView('parts')} />
              <MenuBtn icon={<Tablet />} label="Touch vs Type" color="bg-fuchsia-500" onClick={() => setView('touchtype')} />

              {/* Brooklyn */}
              <MenuBtn icon={<MapPin />} label="Helper Bot" color="bg-green-500" onClick={() => setView('brooklyn')} />
              <MenuBtn icon={<Cloud />} label="Weather" color="bg-cyan-500" onClick={() => setView('weather')} />
              <MenuBtn icon={<Image />} label="Photo Memory" color="bg-rose-500" onClick={() => setView('photos')} />

              {/* Original Games */}
              <MenuBtn icon={<Spade />} label="Go Fish" color="bg-teal-600" onClick={() => { setView('gofish'); startGoFish(); }} />
              <MenuBtn icon={<Plus />} label="Math Fun" color="bg-rose-600" onClick={() => { setView('math'); generateMathProblem(); }} />
              <MenuBtn icon={<Users />} label="Tag Game" color="bg-lime-600" onClick={() => setView('tag')} />
              <MenuBtn icon={<Volume2 />} label="Broken Record" color="bg-violet-600" onClick={() => setView('sayings')} />
            </motion.div>
          )}

          {/* MOUSE SKILLS */}
          {view === 'mouse' && (
            <motion.div key="mouse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl">
              <h2 className="text-4xl font-black mb-8 text-sky-600 text-center">Mouse Skills Training!</h2>
              <div className="relative bg-sky-50 rounded-3xl h-96 mb-6 border-4 border-sky-200">
                {mouseTargets.map(target => (
                  <button key={target.id} onClick={hitTarget} className="absolute bg-sky-500 text-white p-8 rounded-full text-4xl hover:scale-110 transition-transform animate-pulse" style={{ left: `${target.x}%`, top: `${target.y}%` }}>🎯</button>
                ))}
              </div>
              <div className="text-center mb-6"><p className="text-3xl font-black text-sky-600">Clicks: {mouseClicks}</p></div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* KEYBOARD DISCOVERY */}
          {view === 'keyboard' && (
            <motion.div key="keyboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl">
              <h2 className="text-4xl font-black mb-8 text-slate-600 text-center">Keyboard Discovery!</h2>
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-3xl mb-6 min-h-[150px] flex flex-col items-center justify-center border-4 border-slate-200">
                <div className="text-6xl font-black mb-2">{keyPressed || '❓'}</div>
                <p className="text-sm text-slate-500 font-semibold">⌨️ Try pressing any key on your keyboard!</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button onClick={() => handleKeyPress('SPACE')} className="bg-slate-600 text-white p-8 rounded-2xl font-black hover:bg-slate-700">SPACE</button>
                <button onClick={() => handleKeyPress('ENTER')} className="bg-slate-600 text-white p-8 rounded-2xl font-black hover:bg-slate-700">ENTER</button>
                <button onClick={() => handleKeyPress('DELETE')} className="bg-red-500 text-white p-8 rounded-2xl font-black hover:bg-red-600">DELETE</button>
              </div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* SCREEN VS REAL */}
          {view === 'screen' && (
            <motion.div key="screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl">
              <h2 className="text-4xl font-black mb-8 text-emerald-600 text-center">Screen vs Real World!</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50 p-8 rounded-2xl border-4 border-emerald-300"><h3 className="text-2xl font-bold mb-4">On Screen 📱</h3><div className="text-6xl">🎮 📷 🎨</div></div>
                <div className="bg-amber-50 p-8 rounded-2xl border-4 border-amber-300"><h3 className="text-2xl font-bold mb-4">In Real Life 🌍</h3><div className="text-6xl">⚽ 🌳 🎨</div></div>
              </div>
              <button onClick={() => { speak("Some things are on screens, some are real!"); setScore(s => s + 10); }} className="bg-emerald-600 text-white p-8 rounded-3xl font-black text-xl w-full mb-4">LEARN MORE</button>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* POWER ON/OFF */}
          {view === 'power' && (
            <motion.div key="power" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-stone-600">Power Safety!</h2>
              <div className={`text-9xl mb-8 transition-all ${powerOn ? 'opacity-100' : 'opacity-30'}`}>💻</div>
              <button onClick={togglePower} className={`p-12 rounded-3xl font-black text-2xl w-full mb-6 ${powerOn ? 'bg-red-500' : 'bg-green-500'} text-white`}>{powerOn ? '⏻ POWER OFF' : '⏻ POWER ON'}</button>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* PASSWORD PROTECTOR */}
          {view === 'password' && (
            <motion.div key="password" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-amber-600">Password Protector!</h2>
              <div className="bg-amber-50 p-8 rounded-3xl mb-6"><p className="text-lg mb-4">Remember the pattern: {PASSWORD_PATTERNS[0].pattern.join(' ')}</p><div className="text-6xl">{currentPassword.join(' ') || '___'}</div></div>
              <div className="grid grid-cols-4 gap-4 mb-6">{['🔴', '🔵', '🟡', '⭐', '💎', '🍎', '🍊'].map((s, i) => (<button key={i} onClick={() => addToPassword(s)} className="bg-amber-200 p-6 rounded-2xl text-4xl hover:bg-amber-300">{s}</button>))}</div>
              <div className="flex gap-3"><button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button><button onClick={checkPassword} className="bg-amber-600 text-white p-6 rounded-2xl font-black flex-1">CHECK</button><button onClick={() => setCurrentPassword([])} className="bg-red-500 text-white p-6 rounded-2xl font-bold flex-1">CLEAR</button></div>
            </motion.div>
          )}

          {/* SCREEN TIME HELPER */}
          {view === 'timer' && (
            <motion.div key="timer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-teal-600">Screen Time Helper!</h2>
              <div className="text-8xl font-black mb-8">{Math.floor(screenTime / 60)}:{(screenTime % 60).toString().padStart(2, '0')}</div>
              <button onClick={startScreenTimer} disabled={timerRunning} className="bg-teal-600 text-white p-8 rounded-3xl font-black text-xl w-full mb-6 disabled:opacity-50">{timerRunning ? 'Timer Running...' : 'START 5 MIN TIMER'}</button>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* NICE ONLINE FRIEND */}
          {view === 'kindness' && (
            <motion.div key="kindness" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-pink-600">Be a Kind Friend!</h2>
              <div className="bg-pink-50 p-12 rounded-3xl mb-8"><div className="text-6xl mb-4">{KINDNESS_SCENARIOS[scenarioIndex].emoji}</div><p className="text-2xl font-bold">{KINDNESS_SCENARIOS[scenarioIndex].text}</p></div>
              <div className="grid grid-cols-2 gap-4 mb-6"><button onClick={() => checkKindness(true)} className="bg-green-500 text-white p-8 rounded-3xl font-black text-xl">😊 KIND</button><button onClick={() => checkKindness(false)} className="bg-red-500 text-white p-8 rounded-3xl font-black text-xl">😢 NOT KIND</button></div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* BINARY BASICS */}
          {view === 'binary' && (
            <motion.div key="binary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-indigo-600">Binary Lights!</h2>
              <p className="text-gray-600 mb-4">Click lights or press keys 1-4 to toggle ON (1) or OFF (0)</p>
              <p className="text-sm text-indigo-500 font-semibold mb-8">⌨️ Try keyboard numbers 1, 2, 3, 4!</p>
              <div className="flex justify-center gap-6 mb-8">{binaryLights.map((light, i) => (<button key={i} onClick={() => toggleBinary(i)} className={`w-24 h-24 rounded-full ${light ? 'bg-yellow-400 shadow-[0_0_30px_gold]' : 'bg-gray-300'}`}><div className="text-3xl font-black">{light}</div></button>))}</div>
              <div className="text-2xl font-bold mb-8">Binary: {binaryLights.join('')}</div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* DATA DETECTIVE */}
          {view === 'data' && (
            <motion.div key="data" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-purple-600">Data Detective!</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">{DATA_ITEMS.map(item => (<div key={item.id} className="bg-purple-100 p-6 rounded-2xl text-5xl cursor-pointer hover:scale-105 transition-transform" onClick={() => sortDataItem(item, item.category)}>{item.icon}</div>))}</div>
              <div className="grid grid-cols-3 gap-4 mb-6"><div className="bg-blue-100 p-6 rounded-2xl font-bold">📷 Images</div><div className="bg-green-100 p-6 rounded-2xl font-bold">🔢 Numbers</div><div className="bg-pink-100 p-6 rounded-2xl font-bold">🎨 Colors</div></div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* NETWORK NAVIGATOR */}
          {view === 'network' && (
            <motion.div key="network" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-blue-600">Network Navigator!</h2>
              <div className="bg-blue-50 p-12 rounded-3xl mb-8"><div className="flex justify-around items-center text-6xl"><div>💻</div><div>↔️</div><div>🌐</div><div>↔️</div><div>💻</div></div></div>
              <button onClick={sendNetworkMessage} className="bg-blue-600 text-white p-8 rounded-3xl font-black text-xl w-full mb-6">SEND MESSAGE!</button>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* CODE COMPOSER */}
          {view === 'music' && (
            <motion.div key="music" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-violet-600">Music Code Composer!</h2>
              <div className="bg-violet-50 p-8 rounded-3xl mb-8 min-h-[100px] flex justify-center gap-2 flex-wrap">{musicSequence.map((note, i) => (<div key={i} className="text-4xl">{note}</div>))}</div>
              <div className="grid grid-cols-4 gap-4 mb-6">{['🎵', '🎶', '🎼', '🎹'].map((note, i) => (<button key={i} onClick={() => playMusicNote(note)} className="bg-violet-500 text-white p-8 rounded-2xl text-4xl hover:bg-violet-600">{note}</button>))}</div>
              <div className="flex gap-3"><button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button><button onClick={() => setMusicSequence([])} className="bg-violet-600 text-white p-6 rounded-2xl font-bold flex-1">CLEAR</button></div>
            </motion.div>
          )}

          {/* CABLE CONNECTOR */}
          {view === 'cables' && (
            <motion.div key="cables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-orange-600">Cable Connector!</h2>
              <div className="grid grid-cols-2 gap-8 mb-8">{CABLE_TYPES.map(cable => (<div key={cable.id} className="bg-orange-50 p-8 rounded-2xl cursor-pointer hover:bg-orange-100" onClick={() => matchCable(cable, cable.match)}><div className="text-6xl mb-4">{cable.cable} → {cable.device}</div><p className="font-bold">{cable.name}</p></div>))}</div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* PARTS PUZZLE */}
          {view === 'parts' && (
            <motion.div key="parts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-red-600">Parts Puzzle!</h2>
              <div className="grid grid-cols-4 gap-4 mb-8" style={{ gridTemplateRows: 'repeat(4, 100px)' }}>{COMPUTER_PARTS.map(part => (<button key={part.id} onClick={() => placePart(part)} className={`text-6xl ${partsPlaced.includes(part.id) ? 'opacity-30' : ''}`} style={{ gridColumn: part.position.x, gridRow: part.position.y }}>{part.icon}</button>))}</div>
              <p className="text-2xl font-bold mb-6">Parts Placed: {partsPlaced.length}/4</p>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* TOUCH VS TYPE */}
          {view === 'touchtype' && (
            <motion.div key="touchtype" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-fuchsia-600">Touch vs Type!</h2>
              <div className="grid grid-cols-2 gap-8 mb-8"><button onClick={() => compareInput('touch')} className="bg-fuchsia-100 p-12 rounded-3xl hover:bg-fuchsia-200"><div className="text-6xl mb-4">📱</div><p className="font-bold text-xl">TOUCH: {touchVsType.touch}</p></button><button onClick={() => compareInput('type')} className="bg-blue-100 p-12 rounded-3xl hover:bg-blue-200"><div className="text-6xl mb-4">⌨️</div><p className="font-bold text-xl">TYPE: {touchVsType.type}</p></button></div>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* COMMUNITY HELPER BOT */}
          {view === 'brooklyn' && (
            <motion.div key="brooklyn" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-green-600">Brooklyn Helper Bot!</h2>
              <div className="bg-green-50 p-12 rounded-3xl mb-8"><div className="text-8xl mb-4">{BROOKLYN_LOCATIONS[brooklynLocation].icon}</div><h3 className="text-3xl font-black mb-2">{BROOKLYN_LOCATIONS[brooklynLocation].name}</h3><p className="text-xl">{BROOKLYN_LOCATIONS[brooklynLocation].task}</p></div>
              <button onClick={helpBrooklyn} className="bg-green-600 text-white p-8 rounded-3xl font-black text-xl w-full mb-6">HELP BROOKLYN! {BROOKLYN_LOCATIONS[brooklynLocation].emoji}</button>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* WEATHER REPORTER */}
          {view === 'weather' && (
            <motion.div key="weather" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-cyan-600">Weather Reporter!</h2>
              <div className="bg-cyan-50 p-12 rounded-3xl mb-8"><div className="text-8xl mb-4">{weatherData.condition === 'sunny' ? '☀️' : weatherData.condition === 'cloudy' ? '☁️' : '🌧️'}</div><p className="text-5xl font-black">{weatherData.temp}°F</p><p className="text-2xl capitalize mt-4">{weatherData.condition}</p></div>
              <button onClick={checkWeather} className="bg-cyan-600 text-white p-8 rounded-3xl font-black text-xl w-full mb-6">CHECK WEATHER 🌡️</button>
              <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
            </motion.div>
          )}

          {/* PHOTO MEMORY */}
          {view === 'photos' && (
            <motion.div key="photos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl text-center">
              <h2 className="text-4xl font-black mb-8 text-rose-600">Photo Memory!</h2>
              <div className="bg-rose-50 p-8 rounded-3xl mb-8 min-h-[200px] grid grid-cols-4 gap-4">{photoGallery.map((photo, i) => (<div key={i} className="text-6xl">{photo}</div>))}</div>
              <button onClick={takePhoto} className="bg-rose-600 text-white p-8 rounded-3xl font-black text-xl w-full mb-6">📷 TAKE PHOTO</button>
              <div className="flex gap-3"><button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button><button onClick={() => setPhotoGallery([])} className="bg-rose-200 p-6 rounded-2xl font-bold flex-1">Clear Gallery</button></div>
            </motion.div>
          )}

          {/* GO FISH */}
          {view === 'gofish' && (
            <motion.div
              key="gofish"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black mb-8 text-teal-600">Go Fish!</h2>
              <div className="mb-8">
                <p className="text-gray-600 mb-4">Your Hand:</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {playerHand.map(card => (
                    <div key={card.id} className="bg-teal-100 p-6 rounded-2xl text-5xl border-4 border-teal-300">
                      {card.icon}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <p className="text-gray-600 mb-4">Ask Robbie for:</p>
                <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => askForCard(num)}
                      className="bg-teal-500 text-white p-6 rounded-2xl font-black text-3xl hover:bg-teal-600"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-xl font-bold mb-6">
                <div className="flex-1 bg-green-100 p-4 rounded-2xl">
                  Your Matches: {playerMatches}
                </div>
                <div className="flex-1 bg-pink-100 p-4 rounded-2xl">
                  Robbie: {computerMatches}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={startGoFish} className="bg-teal-600 text-white p-6 rounded-2xl font-black flex-1">New Game</button>
              </div>
            </motion.div>
          )}

          {/* MATH FUN */}
          {view === 'math' && (
            <motion.div
              key="math"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black mb-8 text-rose-600">Math Fun!</h2>
              <div className="bg-rose-50 p-12 rounded-3xl mb-8">
                <p className="text-7xl font-black text-gray-800 mb-4">
                  {mathProblem.num1} {mathProblem.operation} {mathProblem.num2} = ?
                </p>
                <p className="text-sm text-rose-500 font-semibold">⌨️ Press number keys 0-9 or click below!</p>
                <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => checkMathAnswer(num)}
                      className="bg-rose-500 text-white p-6 rounded-2xl font-black text-3xl hover:bg-rose-600 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={generateMathProblem} className="bg-rose-600 text-white p-6 rounded-2xl font-black flex-1">New Problem</button>
              </div>
            </motion.div>
          )}

          {/* TAG GAME */}
          {view === 'tag' && (
            <motion.div
              key="tag"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl"
            >
              <h2 className="text-4xl font-black mb-8 text-lime-600 text-center">Tag Game!</h2>
              {!tagRunning ? (
                <div className="text-center">
                  <div className="text-8xl mb-8">🏃</div>
                  <button onClick={startTagGame} className="bg-lime-600 text-white p-8 rounded-3xl font-black text-2xl mb-6 w-full">
                    START TAG!
                  </button>
                  <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back</button>
                </div>
              ) : (
                <>
                  <div className="relative bg-lime-50 rounded-3xl h-96 mb-6 border-4 border-lime-200 overflow-hidden">
                    {tagTargets.map(target => !target.caught && (
                      <button
                        key={target.id}
                        onClick={() => catchTarget(target.id)}
                        className="absolute bg-lime-500 text-white p-4 rounded-full text-3xl hover:scale-110 transition-transform animate-bounce"
                        style={{ left: `${target.x}%`, top: `${target.y}%` }}
                      >
                        😊
                      </button>
                    ))}
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-3xl font-black text-lime-600">Tagged: {tagScore} / 6</p>
                  </div>
                  <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold w-full">Back to Menu</button>
                </>
              )}
            </motion.div>
          )}

          {/* ROBBIE SAYS */}
          {view === 'sayings' && (
            <motion.div
              key="sayings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <h2 className="text-4xl font-black mb-8 text-violet-600">Broken Record!</h2>
              <div className="bg-violet-50 p-12 rounded-3xl mb-8 min-h-[200px] flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-700">
                  {ROBBIE_SAYINGS[sayingIndex].text}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {ROBBIE_SAYINGS.map((saying, i) => (
                  <button
                    key={i}
                    onClick={() => { setSayingIndex(i); speak(saying.text); }}
                    className="bg-violet-500 text-white p-6 rounded-2xl font-bold hover:bg-violet-600 transition-colors"
                  >
                    {saying.icon}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('menu')} className="bg-gray-100 p-6 rounded-2xl font-bold flex-1">Back</button>
                <button onClick={playSaying} className="bg-violet-600 text-white p-8 rounded-3xl font-black text-2xl flex-[2]">
                  🔊 ROBBIE SPEAK!
                </button>
              </div>
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
                <button onClick={() => { speak("Let's dance the code together!"); setDanceSequence([]); setScore(s => s + 10); }} className="bg-fuchsia-600 text-white p-6 rounded-2xl font-black flex-[2] text-xl">PLAY DANCE CODE</button>
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
                <p className="text-sm text-slate-500 font-semibold mt-4">⌨️ Press the key on your keyboard or click below!</p>
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
                      <button onClick={() => { setScore(s => s + 20); speak("Yay! I fixed the bug!"); setBugLevel((bugLevel + 1) % 2); }} className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full animate-pulse hover:scale-110 transition-transform"><Bug size={32} /></button>
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
                  if (n > 90) { setSignalPos(0); setScore(s => s + 20); speak("My message sent! Wow!"); }
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