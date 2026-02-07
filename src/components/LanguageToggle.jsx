import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
    >
      <Globe className="w-5 h-5 text-purple-600" />
      <div className="flex items-center gap-1 text-sm font-bold">
        <span className={language === 'en' ? 'text-purple-600' : 'text-gray-400'}>
          EN
        </span>
        <span className="text-gray-300">|</span>
        <span className={language === 'es' ? 'text-purple-600' : 'text-gray-400'}>
          ES
        </span>
      </div>
    </motion.button>
  );
}