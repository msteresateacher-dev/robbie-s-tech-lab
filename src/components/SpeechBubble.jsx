import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export default function SpeechBubble({ 
  message, 
  visible = true, 
  onSpeakStart,
  onSpeakEnd,
  autoSpeak = false,
  voiceSettings = { rate: 0.85, pitch: 1.2 }
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef([]);

  // Load voices - they load asynchronously in most browsers
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Typing animation
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
      return () => clearInterval(typeInterval);
    }
  }, [message, visible]);

  const speakMessage = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.rate ?? 0.85;
    utterance.pitch = voiceSettings.pitch ?? 1.2;
    utterance.volume = 1;

    // Pick a friendly voice if available
    const voices = voicesRef.current.length
      ? voicesRef.current
      : window.speechSynthesis.getVoices();

    const friendlyVoice = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Google US English') ||
      v.name.includes('Microsoft Zira') ||
      (v.lang === 'en-US' && v.localService)
    ) || voices.find(v => v.lang?.startsWith('en')) || voices[0];

    if (friendlyVoice) utterance.voice = friendlyVoice;

    utterance.onstart = () => { setIsSpeaking(true); onSpeakStart?.(); };
    utterance.onend   = () => { setIsSpeaking(false); onSpeakEnd?.(); };
    utterance.onerror = () => { setIsSpeaking(false); onSpeakEnd?.(); };

    window.speechSynthesis.speak(utterance);
  };

  const handleReplay = () => {
    if (message) speakMessage(message);
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
              {displayedText.length < message.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>

            {/* Replay / Speak button */}
            <button
              onClick={handleReplay}
              title="Tap to hear Robbie speak"
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