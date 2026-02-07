import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { t } from '@/components/translations';

export const VOICE_OPTIONS = [
  { id: 'friendly', name: 'voiceFriendly', icon: '😊', rate: 0.85, pitch: 1.2 },
  { id: 'robot', name: 'voiceRobot', icon: '🤖', rate: 0.75, pitch: 0.8 },
  { id: 'high', name: 'voiceHigh', icon: '🎈', rate: 0.95, pitch: 1.5 },
];

export default function VoiceSelector({ currentVoice, onVoiceChange }) {
  const { language } = useLanguage();
  
  return (
    <div className="flex gap-3 justify-center">
      {VOICE_OPTIONS.map((voice) => (
        <motion.button
          key={voice.id}
          onClick={() => onVoiceChange({
            ...voice,
            lang: language === 'es' ? 'es-US' : 'en-US'
          })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex flex-col items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all
            ${currentVoice === voice.id
              ? 'bg-sky-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-sky-50'
            }
          `}
        >
          <span className="text-2xl">{voice.icon}</span>
          <span className="text-xs">{t(voice.name, language)}</span>
        </motion.button>
      ))}
    </div>
  );
}