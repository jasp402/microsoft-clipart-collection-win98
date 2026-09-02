'use client';

import React from 'react';
import { useThemeContext } from './theme-context';
import { HardDrive, Wifi, Heart, FileText, CheckCircle2 } from 'lucide-react';

interface RetroStatusBarProps {
  totalItems: number;
  filteredCount: number;
  isLoading: number | boolean;
  isArchiveReady: boolean;
}

export function RetroStatusBar({
  totalItems,
  filteredCount,
  isLoading,
  isArchiveReady,
}: RetroStatusBarProps) {
  const { statusMessage, selectedClip, favorites, documentItems, theme } = useThemeContext();

  return (
    <div
      className={`flex flex-wrap items-center justify-between px-2 py-1 text-[11px] font-mono select-none border-t border-[#808080] ${
        theme === 'win98-desert'
          ? 'bg-[#dfd3c3] text-stone-800'
          : theme === 'win98-rose'
          ? 'bg-[#e0d5db] text-zinc-800'
          : theme === 'winme'
          ? 'bg-[#d4d0c8] text-zinc-800'
          : theme === 'winxp' || theme === 'winxp-silver'
          ? 'bg-[#ece9d8] text-zinc-800'
          : 'bg-[#c0c0c0] text-zinc-800'
      }`}
    >
      {/* Left status message */}
      <div className="flex-1 min-w-[200px] flex items-center gap-2 truncate px-2 py-0.5 retro-inset bg-white/60 mr-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
        <span className="truncate">
          {selectedClip ? `Selected: ${selectedClip.title} (${selectedClip.id})` : statusMessage}
        </span>
      </div>

      {/* Center status: Archive & Filter counts */}
      <div className="flex items-center gap-2 px-2 py-0.5 retro-inset bg-white/60 mr-1.5">
        <span className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-[#000080]" />
          <span>Archive.org: 57,015 SVGs</span>
        </span>
        <span className="text-zinc-400">|</span>
        <span>Showing: {filteredCount} clips</span>
      </div>

      {/* Right status: Favorites & Document Canvas */}
      <div className="flex items-center gap-3 px-2 py-0.5 retro-inset bg-white/60">
        <span className="flex items-center gap-1 text-red-600">
          <Heart className="w-3 h-3 fill-current" />
          <span>{favorites.length} Favs</span>
        </span>
        <span className="flex items-center gap-1 text-[#000080]">
          <FileText className="w-3 h-3" />
          <span>{documentItems.length} in Doc</span>
        </span>
      </div>
    </div>
  );
}
