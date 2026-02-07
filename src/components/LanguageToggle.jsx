import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border-2 border-gray-200 hover:border-sky-400 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Globe className="w-4 h-4 text-sky-600" />
      <div className="flex items-center gap-1 font-bold text-sm">
        <span className={language === 'en' ? 'text-sky-600' : 'text-gray-400'}>EN</span>
        <span className="text-gray-300">|</span>
        <span className={language === 'es' ? 'text-sky-600' : 'text-gray-400'}>ES</span>
      </div>
    </motion.button>
  );
}