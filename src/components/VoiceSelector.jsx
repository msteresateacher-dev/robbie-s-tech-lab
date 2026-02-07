import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';

const VOICE_OPTIONS = [
  { id: 'Kore', name: 'Friendly', icon: '😊', prompt: 'Say cheerfully and warmly:', rate: 0.85, pitch: 1.2 },
  { id: 'Fenrir', name: 'Deep Voice', icon: '🎙️', prompt: 'Say in a deep, calm, professional voice:', rate: 0.75, pitch: 0.8 },
  { id: 'Puck', name: 'Excited', icon: '⚡', prompt: 'Say in a very high-energy and excited voice:', rate: 1.1, pitch: 1.5 }
];

export default function VoiceSelector({ currentVoice, onVoiceChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  
  // Rule: API Key must be empty string
  const apiKey = "";

  // Helper: Convert PCM16 (L16) to WAV for browser playback
  const pcmToWav = (pcmBase64, sampleRate = 24000) => {
    const byteCharacters = atob(pcmBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const buffer = byteArray.buffer;
    
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + buffer.byteLength, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, buffer.byteLength, true);

    const blob = new Blob([wavHeader, buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const handleVoiceChange = async (voice) => {
    onVoiceChange(voice);
    setIsLoading(true);

    const fetchTTS = async (retries = 5, delay = 1000) => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: `${voice.prompt} Hi! This is how I sound!` }] 
            }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice.id }
                }
              }
            }
          })
        });

        if (!response.ok) throw new Error("TTS Request Failed");

        const result = await response.json();
        const audioData = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;

        if (audioData) {
          const url = pcmToWav(audioData.data);
          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
          }
        }
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchTTS(retries - 1, delay * 2), delay);
        } else {
          console.error("Final TTS Error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    await fetchTTS();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <audio ref={audioRef} hidden />
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Choose a Mission Voice</h2>
          <p className="text-gray-500 mt-2">Select a character voice for your mini-missions</p>
        </div>

        <div className="flex flex-col gap-3">
          {VOICE_OPTIONS.map(voice => (
            <motion.button
              key={voice.id}
              onClick={() => handleVoiceChange(voice)}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all border-2 ${
                currentVoice === voice.id
                  ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-fuchsia-200'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{voice.icon}</span>
                <span className="text-lg">{voice.name}</span>
              </div>
              
              {isLoading && currentVoice === voice.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className={`w-3 h-3 rounded-full ${currentVoice === voice.id ? 'bg-white' : 'bg-gray-200'}`} />
              )}
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 italic">
            "Testing... 1, 2, 3! Can you hear me?"
          </p>
        </div>
      </div>
    </div>
  );
};

export { VOICE_OPTIONS };