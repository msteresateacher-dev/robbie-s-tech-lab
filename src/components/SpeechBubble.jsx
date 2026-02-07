import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { speakWithGemini } from './GeminiTTS';
import { useLanguage } from './LanguageContext';
import { getTranslation } from './translations';

export default function SpeechBubble({ 
  message, 
  visible = true, 
  onSpeakStart,
  onSpeakEnd,
  autoSpeak = false,
  voiceSettings = { rate: 0.85, pitch: 1.2 }
}) {
  const { language } = useLanguage();
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (visible && message) {
      setDisplayedText('');
      setError(null);
      let index = 0;
      
      const typeInterval = setInterval(() => {
        if (index < message.length) {
          setDisplayedText(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    }
  }, [message, visible]);

  const speakMessage = async (text) => {
    try {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setIsLoading(true);
      setError(null);
      
      // Get API key from secrets
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      // Generate audio with Gemini TTS
      const audioUrl = await speakWithGemini(text, 'Puck', apiKey);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onloadeddata = () => {
        setIsLoading(false);
      };
      
      audio.onplay = () => {
        setIsSpeaking(true);
        onSpeakStart?.();
      };
      
      audio.onended = () => {
        setIsSpeaking(false);
        onSpeakEnd?.();
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsLoading(false);
        setIsSpeaking(false);
        setError(getTranslation(language, 'voiceOffline'));
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (err) {
      console.error('TTS Error:', err);
      setIsLoading(false);
      setIsSpeaking(false);
      setError(getTranslation(language, 'voiceOffline'));
    }
  };

  const handleReplay = () => {
    if (message && !isLoading) {
      speakMessage(message);
    }
  };

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          className="relative bg-white rounded-3xl p-6 shadow-xl max-w-md mx-auto border-4 border-sky-200"
        >
          {/* Speech bubble pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-l-4 border-t-4 border-sky-200 rotate-45" />
          
          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
              {displayedText}
            </p>
            
            {/* Status messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-orange-500 flex items-center gap-2"
              >
                ⚠️ {error}
              </motion.div>
            )}
            {isSpeaking && !error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-green-500 flex items-center gap-2"
              >
                ✓ {getTranslation(language, 'voiceOnline')}
              </motion.div>
            )}
            
            {/* Speak button */}
            <button
              onClick={handleReplay}
              disabled={isLoading}
              className={`
                absolute -right-2 -bottom-2 w-10 h-10 rounded-full 
                flex items-center justify-center transition-all
                ${isLoading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : isSpeaking 
                    ? 'bg-sky-400 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-sky-100 hover:text-sky-600'}
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              )}
            </button>
            
            {/* Audio visualizer */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -left-12 top-1/2 -translate-y-1/2 flex gap-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-sky-400 rounded-full"
                    animate={{
                      height: ['8px', '16px', '8px'],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}