import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

const VOICE_OPTIONS = [
  { id: 'friendly', name: 'Friendly', icon: '😊', rate: 0.85, pitch: 1.2 },
  { id: 'deep', name: 'Deep Voice', icon: '🎙️', rate: 0.75, pitch: 0.8 },
  { id: 'excited', name: 'Excited', icon: '⚡', rate: 1.1, pitch: 1.5 }
];

export default function VoiceSelector({ currentVoice, onVoiceChange }) {
  return (
    <div className="flex gap-3 justify-center items-center">
      <Volume2 className="w-5 h-5 text-gray-500" />
      {VOICE_OPTIONS.map(voice => (
        <motion.button
          key={voice.id}
          onClick={() => onVoiceChange(voice)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            currentVoice === voice.id
              ? 'bg-fuchsia-500 text-white shadow-lg'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-fuchsia-300'
          }`}
        >
          <span className="text-xl mr-2">{voice.icon}</span>
          <span className="text-sm">{voice.name}</span>
        </motion.button>
      ))}
    </div>
  );
}

export { VOICE_OPTIONS };