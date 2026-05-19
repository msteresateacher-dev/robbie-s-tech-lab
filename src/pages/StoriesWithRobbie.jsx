import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORIES = [
  { title: "Story 1", emoji: "📖", url: "https://gemini.google.com/share/66775f24e0d2" },
  { title: "Story 2", emoji: "🤖", url: "https://gemini.google.com/share/d6c4e3c4f1d0" },
  { title: "Story 3", emoji: "💻", url: "https://gemini.google.com/share/428099325ad8" },
  { title: "Story 4", emoji: "🌟", url: "https://gemini.google.com/share/06b7cc4f5e8e" },
  { title: "Story 5", emoji: "🧩", url: "https://gemini.google.com/share/81c16ba503de" },
  { title: "Story 6", emoji: "🌐", url: "https://gemini.google.com/share/e7c88c485df3" },
  { title: "Story 7", emoji: "🚀", url: "https://gemini.google.com/share/72cf165290a3" },
  { title: "Story 8", emoji: "🎉", url: "https://gemini.google.com/share/3cf74b0b2e59" },
  { title: "Story 9", emoji: "🎨", url: "https://gemini.google.com/share/a49ff1b964bd" },
  { title: "Story 10", emoji: "🔭", url: "https://gemini.google.com/share/9d26c8e53864" },
  { title: "Story 11", emoji: "🎮", url: "https://gemini.google.com/share/64d9662d2d8f" },
  { title: "Story 12", emoji: "⭐", url: "https://gemini.google.com/share/342ceadeb7df" },
  { title: "Story 13", emoji: "🌈", url: "https://gemini.google.com/share/71425b1cf736" },
  { title: "Story 14: Robbie & Bonnie's Big Night at the Hall des Lumières", emoji: "🎩", url: "https://gemini.google.com/share/b63c2b898c76" },
];

export default function StoriesWithRobbie() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-orange-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">📖 Stories with Robbie</h1>
            <p className="text-sm text-gray-500">Read and listen along!</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
        {STORIES.map((story, index) => (
          <motion.a
            key={index}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">{story.emoji}</span>
              <div className="flex-1">
                <h2 className="text-lg font-black text-gray-800">{story.title}</h2>
              </div>
              <span className="text-2xl">▶️</span>
            </div>
          </motion.a>
        ))}
      </main>
    </div>
  );
}