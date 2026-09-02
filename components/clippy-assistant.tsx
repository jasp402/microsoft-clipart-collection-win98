'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeContext } from './theme-context';
import { retroAudio } from '@/lib/retro-audio';
import { X, Sparkles, HelpCircle, Shuffle, ChevronUp, ChevronDown } from 'lucide-react';

const CLIPPY_TIPS = [
  'It looks like you are looking for vintage vector art! Try searching for "Cybart", "floppy disk", or "trophy".',
  'Did you know? Microsoft Clip Gallery debuted in Office 97 with over 3,000 WMF vectors, now converted to modern lossless .SVG!',
  'Double-click any clipart to open the high-resolution vector zoom inspector & live color palette filter.',
  'Click the "Word 97 Studio" button to compose retro memos and WordArt headlines with your favorite cliparts!',
  'Looking for tech icons? Check out the "Computers & Tech" category for CRT screens, 3.5" diskettes, and modems.',
  'All 57,000+ files are preserved on the Internet Archive for public domain and historical exploration.',
];

interface ClippyAssistantProps {
  onSearchTopic?: (topic: string) => void;
  onRandomClip?: () => void;
}

export function ClippyAssistant({ onSearchTopic, onRandomClip }: ClippyAssistantProps) {
  const { isClippyOpen, setIsClippyOpen, theme } = useThemeContext();
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % CLIPPY_TIPS.length);
    }, 18000);
    return () => clearInterval(timer);
  }, []);

  if (!isClippyOpen) {
    return (
      <button
        onClick={() => {
          setIsClippyOpen(true);
          retroAudio.playClick();
        }}
        className="fixed bottom-3 right-3 z-40 p-2.5 bg-yellow-300 hover:bg-yellow-400 text-zinc-900 rounded-full shadow-lg border-2 border-yellow-500 flex items-center gap-1.5 text-xs font-bold transition-transform hover:scale-105"
        title="Summon Clippy Assistant"
      >
        <span>📎</span>
        <span className="hidden sm:inline">Clippy</span>
      </button>
    );
  }

  const handleNextTip = () => {
    retroAudio.playClick();
    setCurrentTipIndex(prev => (prev + 1) % CLIPPY_TIPS.length);
  };

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end max-w-xs sm:max-w-sm select-none">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-2 p-3 bg-[#ffffcc] text-zinc-900 border-2 border-zinc-700 rounded-lg shadow-xl relative text-xs"
          >
            {/* Comic Bubble Pointer */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#ffffcc] border-r-2 border-b-2 border-zinc-700 transform rotate-45" />

            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-300">
              <span className="font-bold flex items-center gap-1 text-[11px] text-zinc-800">
                <span>📎</span> Microsoft Office Assistant
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-0.5 hover:bg-yellow-200 rounded text-zinc-600"
                  title="Minimizar"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsClippyOpen(false);
                    retroAudio.playClick();
                  }}
                  className="p-0.5 hover:bg-red-200 rounded text-zinc-600"
                  title="Ocultar Clippy"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tip text */}
            <p className="text-zinc-800 leading-relaxed font-sans">{CLIPPY_TIPS[currentTipIndex]}</p>

            {/* Action Shortcuts */}
            <div className="mt-2.5 pt-2 border-t border-zinc-300 flex flex-wrap gap-1">
              <button
                onClick={() => {
                  retroAudio.playClick();
                  if (onRandomClip) onRandomClip();
                }}
                className="px-2 py-0.5 text-[10px] font-semibold bg-white hover:bg-yellow-100 text-zinc-800 rounded border border-zinc-400 flex items-center gap-1 shadow-2xs"
              >
                <Shuffle className="w-2.5 h-2.5 text-blue-600" /> Surprise Me!
              </button>
              <button
                onClick={() => {
                  retroAudio.playClick();
                  if (onSearchTopic) onSearchTopic('cybart');
                }}
                className="px-2 py-0.5 text-[10px] bg-white hover:bg-yellow-100 text-zinc-800 rounded border border-zinc-400 shadow-2xs"
              >
                Cybart Cartoons
              </button>
              <button
                onClick={() => {
                  retroAudio.playClick();
                  if (onSearchTopic) onSearchTopic('floppy disk');
                }}
                className="px-2 py-0.5 text-[10px] bg-white hover:bg-yellow-100 text-zinc-800 rounded border border-zinc-400 shadow-2xs"
              >
                Floppy Disks
              </button>
              <button
                onClick={handleNextTip}
                className="ml-auto px-1.5 py-0.5 text-[10px] text-zinc-600 hover:text-zinc-900 underline"
              >
                Next tip →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clippy Body Animation */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsMinimized(prev => !prev);
          retroAudio.playClick();
        }}
        className="w-14 h-14 cursor-pointer relative flex items-center justify-center filter drop-shadow-md"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Paperclip wire body */}
          <path
            d="M 24 48 C 24 54 36 54 36 48 L 36 18 C 36 10 20 10 20 18 L 20 44 C 20 48 30 48 30 44 L 30 22 C 30 18 26 18 26 22 L 26 40"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 24 48 C 24 54 36 54 36 48 L 36 18 C 36 10 20 10 20 18 L 20 44 C 20 48 30 48 30 44 L 30 22 C 30 18 26 18 26 22 L 26 40"
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Googly Eyes */}
          <circle cx="24" cy="22" r="6" fill="white" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="36" cy="22" r="6" fill="white" stroke="#0f172a" strokeWidth="1.5" />

          {/* Pupils with lively gaze */}
          <motion.circle
            animate={{
              cx: [25, 23, 26, 25],
              cy: [23, 21, 23, 23],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            r="3"
            fill="#0f172a"
          />
          <motion.circle
            animate={{
              cx: [37, 35, 38, 37],
              cy: [23, 21, 23, 23],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            r="3"
            fill="#0f172a"
          />

          {/* Eyebrows */}
          <path d="M 18 14 Q 24 11 29 14" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 31 14 Q 36 11 41 14" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
