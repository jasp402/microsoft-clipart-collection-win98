'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeType, ClipartItem, DocumentCanvasItem } from '@/lib/types';
import { retroAudio } from '@/lib/retro-audio';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  favorites: ClipartItem[];
  addFavorite: (item: ClipartItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  selectedClip: ClipartItem | null;
  setSelectedClip: (item: ClipartItem | null) => void;
  previewClip: ClipartItem | null;
  setPreviewClip: (item: ClipartItem | null) => void;
  documentItems: DocumentCanvasItem[];
  addToDocument: (item: ClipartItem) => void;
  removeFromDocument: (id: string) => void;
  clearDocument: () => void;
  isWordpadOpen: boolean;
  setIsWordpadOpen: (open: boolean) => void;
  isClippyOpen: boolean;
  setIsClippyOpen: (open: boolean) => void;
  statusMessage: string;
  setStatusMessage: (msg: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('clipart_theme') as ThemeType;
        if (savedTheme && ['win98', 'win98-desert', 'win98-rose', 'winme', 'winxp', 'winxp-silver'].includes(savedTheme)) {
          return savedTheme;
        }
      } catch {}
    }
    return 'win98';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSound = localStorage.getItem('clipart_sound_muted');
        if (savedSound !== null) {
          retroAudio.setMuted(savedSound === 'true');
          return savedSound !== 'true';
        }
      } catch {}
    }
    return true;
  });

  const [favorites, setFavorites] = useState<ClipartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavs = localStorage.getItem('clipart_favorites');
        if (savedFavs) {
          return JSON.parse(savedFavs);
        }
      } catch {}
    }
    return [];
  });

  const [selectedClip, setSelectedClip] = useState<ClipartItem | null>(null);
  const [previewClip, setPreviewClip] = useState<ClipartItem | null>(null);
  const [documentItems, setDocumentItems] = useState<DocumentCanvasItem[]>([]);
  const [isWordpadOpen, setIsWordpadOpen] = useState<boolean>(false);
  const [isClippyOpen, setIsClippyOpen] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
    retroAudio.playClick();
    try {
      localStorage.setItem('clipart_theme', t);
    } catch {}
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    retroAudio.setMuted(!enabled);
    try {
      localStorage.setItem('clipart_sound_muted', enabled ? 'false' : 'true');
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) retroAudio.playClick();
  };

  const addFavorite = (item: ClipartItem) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      const updated = [item, ...prev];
      try {
        localStorage.setItem('clipart_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    retroAudio.playInsert();
    setStatusMessage(`Saved "${item.title}" to Favorites.`);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id);
      try {
        localStorage.setItem('clipart_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    retroAudio.playClick();
    setStatusMessage('Removed clip from Favorites.');
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  const addToDocument = (item: ClipartItem) => {
    const newItem: DocumentCanvasItem = {
      id: `${item.id}-${Date.now()}`,
      clipart: item,
      x: 30 + Math.random() * 120,
      y: 40 + Math.random() * 120,
      width: 140,
      height: 140,
      rotation: 0,
    };
    setDocumentItems(prev => [...prev, newItem]);
    setIsWordpadOpen(true);
    retroAudio.playInsert();
    setStatusMessage(`Inserted "${item.title}" into Document Studio.`);
  };

  const removeFromDocument = (id: string) => {
    setDocumentItems(prev => prev.filter(i => i.id !== id));
    retroAudio.playClick();
  };

  const clearDocument = () => {
    setDocumentItems([]);
    retroAudio.playClick();
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        selectedClip,
        setSelectedClip,
        previewClip,
        setPreviewClip,
        documentItems,
        addToDocument,
        removeFromDocument,
        clearDocument,
        isWordpadOpen,
        setIsWordpadOpen,
        isClippyOpen,
        setIsClippyOpen,
        statusMessage,
        setStatusMessage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}
