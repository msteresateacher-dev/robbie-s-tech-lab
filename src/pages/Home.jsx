import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GraduationCap, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RobbieFace from '@/components/RobbieFace';
import SpeechBubble from '@/components/SpeechBubble';
import VoiceSelector, { VOICE_OPTIONS } from '@/components/VoiceSelector';
import { useLanguage } from '@/components/LanguageContext';
import { getTranslation } from '@/utils/translations';
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
        {/* Robbie Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mt-8"
        >
          <RobbieFace 
            emotion={robbieEmotion} 
            speaking={isSpeaking}
            size="large"
            onClick={handleRobbieClick}
          />
          
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

          {/* Voice Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg"
          >
            <p className="text-sm text-gray-600 text-center mb-3 font-medium">{getTranslation(language, 'chooseVoice')}</p>
            <VoiceSelector currentVoice={currentVoice} onVoiceChange={handleVoiceChange} />
          </motion.div>
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
              className="w-full h-20 text-xl rounded-2xl bg-gradient-to-r from-fuchsia-400 to-pink-500 hover:from-fuchsia-500 hover:to-pink-600 shadow-lg shadow-pink-200"
            >
              <Users className="w-8 h-8 mr-3" />
              {getTranslation(language, 'startLearning')}
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
              className="w-full h-16 text-lg rounded-2xl border-2 border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <GraduationCap className="w-6 h-6 mr-2" />
              {getTranslation(language, 'teacherDashboard')}
            </Button>
          </Link>
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