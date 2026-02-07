import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export default function SpeechBubble({ 
  message, 
  visible = true, 
  onSpeakStart,
  onSpeakEnd,
  autoSpeak = true,
  voiceSettings = { rate: 0.85, pitch: 1.2 }
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (visible && message) {
      setDisplayedText('');
      let index = 0;
      
      const typeInterval = setInterval(() => {
        if (index < message.length) {
          setDisplayedText(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);

      // Start speaking
      if (autoSpeak && 'speechSynthesis' in window) {
        speakMessage(message);
      }

      return () => clearInterval(typeInterval);
    }
  }, [message, visible, autoSpeak]);

  const speakMessage = (text) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    
    // Try to find a friendly voice
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Google US English') ||
      v.name.includes('Microsoft Zira')
    );
    if (friendlyVoice) utterance.voice = friendlyVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakStart?.();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleReplay = () => {
    if (message) {
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
            
            {/* Replay button */}
            <button
              onClick={handleReplay}
              className={`
                absolute -right-2 -bottom-2 w-10 h-10 rounded-full 
                flex items-center justify-center transition-all
                ${isSpeaking 
                  ? 'bg-sky-400 text-white animate-pulse' 
                  : 'bg-gray-100 text-gray-500 hover:bg-sky-100 hover:text-sky-600'}
              `}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}