import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GraduationCap, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RobbieFace from '@/components/RobbieFace';
import BonnieFace from '@/components/BonnieFace';
import SpeechBubble from '@/components/SpeechBubble';
import VoiceSelector, { VOICE_OPTIONS } from '@/components/VoiceSelector';
import { useLanguage } from '@/components/LanguageContext';
import { getTranslation } from '@/components/translations';
import LanguageToggle from '@/components/LanguageToggle';

export default function Home() {
  const { language } = useLanguage();
  const [robbieEmotion, setRobbieEmotion] = useState('happy');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentVoice, setCurrentVoice] = useState('friendly');
  const [voiceSettings, setVoiceSettings] = useState(VOICE_OPTIONS[0]);

  const handleRobbieClick = () => {
    setHasInteracted(true);
    setRobbieEmotion('excited');
    setTimeout(() => setRobbieEmotion('happy'), 2000);
  };

  const handleBonnieClick = () => {
    const utterance = new SpeechSynthesisUtterance("I wike learning about compooters with my big bwother Wobbie!");
    utterance.pitch = 2.0;
    utterance.rate = 0.75;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    // Try to pick a child/female voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /samantha|karen|victoria|female|girl|child/i.test(v.name)) || voices[0];
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (voice) => {
    setCurrentVoice(voice.id);
    setVoiceSettings(voice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50">
      <LanguageToggle />
      
      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 backdrop-blur rounded-full shadow-sm"
        >
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="font-bold text-gray-700">{getTranslation(language, 'appName')}</span>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-12">
        {/* Robbie & Bonnie Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mt-8"
        >
          {/* Sibling duo */}
          <div className="flex items-end justify-center gap-4 mb-2">
            <motion.div
              className="flex flex-col items-center"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <RobbieFace
                emotion={robbieEmotion}
                speaking={isSpeaking}
                size="large"
                onClick={handleRobbieClick}
              />
              <span className="mt-2 text-sm font-bold text-gray-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">Robbie the Robot 🤖</span>
            </motion.div>

            <motion.div
              className="flex flex-col items-center mb-4"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <BonnieFace emotion="happy" size="medium" onClick={handleBonnieClick} />
              <span className="mt-2 text-sm font-bold text-pink-500 bg-white/80 px-3 py-1 rounded-full shadow-sm">Bonnie Bit 🌟</span>
              <p className="text-xs text-gray-500 mt-1 text-center">Baby Bot Sister</p>
            </motion.div>
          </div>
          
          <div className="mt-8 w-full max-w-md">
            <SpeechBubble
              message={hasInteracted 
                ? getTranslation(language, 'welcomeInteracted')
                : getTranslation(language, 'welcomeInitial')
              }
              visible={true}
              onSpeakStart={() => setIsSpeaking(true)}
              onSpeakEnd={() => setIsSpeaking(false)}
              voiceSettings={voiceSettings}
            />
          </div>


        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 max-w-sm mx-auto space-y-4"
        >
          <Link to={createPageUrl('StudentPortal')} className="block">
            <Button
              size="lg"
              className="w-full h-20 text-xl rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-lg shadow-green-200"
            >
              <Users className="w-8 h-8 mr-3" />
              {getTranslation(language, 'startLearning')}
            </Button>
          </Link>

          <Link to="/StoriesWithRobbie" className="block">
            <Button
              size="lg"
              className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 shadow-lg"
            >
              <span className="text-2xl mr-2">📖</span>
              Stories with Robbie
            </Button>
          </Link>

          <Link to={createPageUrl('ExtraGames')} className="block">
            <Button
              size="lg"
              className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 shadow-lg"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              {getTranslation(language, 'extraGames')}
            </Button>
          </Link>

          <Link to={createPageUrl('TeacherDashboard')} className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-white shadow-lg"
            >
              <GraduationCap className="w-6 h-6 mr-2" />
              {getTranslation(language, 'teacherDashboard')}
            </Button>
          </Link>

          <a href="https://www.typing.com/student/lessons" target="_blank" rel="noopener noreferrer" className="block">
            <Button
              size="lg"
              className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-lg"
            >
              <span className="text-2xl mr-2">⌨️</span>
              Typing
            </Button>
          </a>

          <Button
            size="lg"
            onClick={() => {
              const text = `Let's Get Hooked. We all know that by age five, children are already digital natives—but there's a massive difference between a child who can swipe on a tablet and a child who understands why the computer reacts. In the critical window of early childhood, we aren't just teaching skills; we're wiring brains for logic. But most STEM tools are either too abstract or too passive. That's why we built Robbie's Tech Lab. The Problem and The Solution. Early learners need tactile, immediate feedback to understand cause and effect. Robbie's Tech Lab isn't just another app—it's a Remote Engineering Hub. Through our live interface of Robbie the Robot's Tech Lab, we turn complex concepts of computer vocabulary and hardware identification into a gamified experience. When a child uses Robbie, they aren't just playing a game; they have a low tech mascot companion alongside them. We are moving them from being consumers of technology to the architects of it. The Value Proposition. The value here is three-fold. Confidence: We create a How-to experience to test real-world hardware like mouse, speakers, and monitor. Digital Literacy: We are teaching the Grammar of Robotics—sequencing, algorithms and logic—before they even learn to write a full sentence. Engagement: By linking the app to a physical character like Robbie, we create an emotional connection to STEM that sticks for a lifetime. Final Reflection. Robbie's Tech Lab is the bridge between a child's imagination and the physical world of engineering. We're not just building robots; we're building the next generation of problem solvers.`;
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.pitch = 1.0;
              utterance.rate = 0.95;
              utterance.volume = 1;
              window.speechSynthesis.speak(utterance);
            }}
            className="w-full h-16 text-lg rounded-2xl shadow-lg"
            style={{ backgroundColor: '#fefce8', color: '#78350f', border: '2px solid #fde68a' }}
          >
            <span className="text-2xl mr-2">🤖</span>
            Why Robbie?
          </Button>




        </motion.div>

        {/* Fun facts section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-md mx-auto"
        >
          <div className="bg-white/60 backdrop-blur rounded-3xl p-6 shadow-lg border border-white">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-3">
              <span className="text-2xl">💡</span>
              {getTranslation(language, 'funFact')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getTranslation(language, 'funFactText')}
            </p>
          </div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-100/50 to-transparent pointer-events-none" />
    </div>
  );
}