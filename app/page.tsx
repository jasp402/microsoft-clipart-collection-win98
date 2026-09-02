'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider, useThemeContext } from '@/components/theme-context';
import { ClipartItem, ViewMode } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { CURATED_ICONIC_CLIPS } from '@/lib/curated-clips';
import { queryClipartItems, fetchFullArchiveClips } from '@/lib/clipart-service';
import { ClipartCard } from '@/components/clipart-card';
import { ClipartDetailDialog } from '@/components/clipart-detail-dialog';
import { WordpadStudioModal } from '@/components/wordpad-studio-modal';
import { ClippyAssistant } from '@/components/clippy-assistant';
import { RetroMenuBar } from '@/components/retro-menu-bar';
import { RetroStatusBar } from '@/components/retro-status-bar';
import { retroAudio } from '@/lib/retro-audio';
import {
  Search,
  X,
  Shuffle,
  LayoutGrid,
  Grid3X3,
  List,
  Eye,
  Heart,
  FilePlus,
  RefreshCw,
  Folder,
  FolderOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minus,
  SlidersHorizontal,
} from 'lucide-react';

function GalleryApp() {
  const {
    theme,
    favorites,
    selectedClip,
    setSelectedClip,
    previewClip,
    setPreviewClip,
    setIsWordpadOpen,
    setStatusMessage,
    documentItems,
  } = useThemeContext();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('medium');
  const [items, setItems] = useState<ClipartItem[]>(CURATED_ICONIC_CLIPS);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(CURATED_ICONIC_CLIPS.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isArchiveReady, setIsArchiveReady] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<'default' | 'name' | 'size-asc' | 'size-desc'>('default');

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const loadMoreObserverRef = useRef<HTMLDivElement | null>(null);

  // Fetch clips using client-side query service with pagination & caching
  const fetchClips = useCallback(
    async (pageToFetch: number, append = false, random = false) => {
      // If browsing local favorites
      if (activeCategory === 'favorites') {
        let filtered = favorites;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(f => f.title.toLowerCase().includes(q) || f.tags.some(t => t.includes(q)));
        }
        setItems(filtered);
        setTotalCount(filtered.length);
        setTotalPages(1);
        return;
      }

      try {
        setIsLoading(true);
        const data = await queryClipartItems({
          page: pageToFetch,
          limit: 48,
          category: activeCategory,
          q: searchQuery.trim(),
          random,
          sort: sortMode,
        });

        if (append) {
          setItems(prev => [...prev, ...data.items]);
        } else {
          setItems(data.items);
        }
        setTotalCount(data.total);
        setTotalPages(data.totalPages);
        setIsArchiveReady(data.isArchiveFullReady);
        setPage(pageToFetch);
      } catch (err) {
        console.warn('Could not query clips, using fallback:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeCategory, searchQuery, sortMode, favorites]
  );

  // Pre-fetch Archive.org manifest in background
  useEffect(() => {
    fetchFullArchiveClips().then(clips => {
      if (clips && clips.length > CURATED_ICONIC_CLIPS.length) {
        setIsArchiveReady(true);
        fetchClips(1, false);
      }
    });
  }, [fetchClips]);

  // Trigger search on query / category / sort change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClips(1, false);
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchClips]);

  // Infinite scroll observer
  useEffect(() => {
    const target = loadMoreObserverRef.current;
    if (!target || activeCategory === 'favorites') return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && page < totalPages) {
          fetchClips(page + 1, true);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isLoading, page, totalPages, fetchClips, activeCategory]);

  const handleRandomSurprise = () => {
    retroAudio.playClick();
    setStatusMessage('Shuffling random vintage clipart...');
    fetchClips(1, false, true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    retroAudio.playClick();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSelectCategory = (catId: string) => {
    retroAudio.playClick();
    setActiveCategory(catId);
    setPage(1);
    setStatusMessage(`Browsing category: ${catId.toUpperCase()}`);
  };

  const handleTagSearch = (tag: string) => {
    setSearchQuery(tag);
    setActiveCategory('all');
    retroAudio.playClick();
    setStatusMessage(`Searching tag: #${tag}`);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col p-2 sm:p-4 md:p-6 transition-colors select-none ${
        theme === 'winxp'
          ? 'bg-[#0055eb] text-zinc-900'
          : theme === 'winxp-silver'
          ? 'bg-[#737882] text-zinc-900'
          : theme === 'winme'
          ? 'bg-[#3a6ea5] text-zinc-900'
          : theme === 'win98-desert'
          ? 'bg-[#c4b49d] text-zinc-900'
          : theme === 'win98-rose'
          ? 'bg-[#b4a4ae] text-zinc-900'
          : 'bg-[#008080] text-zinc-900' /* Authentic Windows 98 Teal Desktop */
      }`}
    >
      {/* Main Microsoft Clip Gallery Window Frame */}
      <div
        className={`w-full max-w-7xl mx-auto flex-1 flex flex-col shadow-2xl rounded-xs overflow-hidden ${
          theme === 'winxp' || theme === 'winxp-silver'
            ? 'rounded-t-xl border-3 border-[#0055eb] bg-[#ece9d8]'
            : theme === 'win98-desert'
            ? 'bg-[#dfd3c3] retro-outset'
            : theme === 'win98-rose'
            ? 'bg-[#e0d5db] retro-outset'
            : theme === 'winme'
            ? 'bg-[#d4d0c8] retro-outset'
            : 'bg-[#c0c0c0] retro-outset'
        }`}
      >
        {/* Title Bar */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 ${
            theme === 'winxp'
              ? 'bg-gradient-to-r from-[#0058ee] via-[#288eff] to-[#0058ee] text-white rounded-t-lg'
              : theme === 'winxp-silver'
              ? 'bg-gradient-to-r from-[#8e939d] via-[#d1d5db] to-[#737882] text-zinc-900 rounded-t-lg'
              : theme === 'winme'
              ? 'bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white'
              : theme === 'win98-desert'
              ? 'bg-gradient-to-r from-[#7b5530] to-[#ad8253] text-white'
              : theme === 'win98-rose'
              ? 'bg-gradient-to-r from-[#6b3252] to-[#98577b] text-white'
              : 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm tracking-wide truncate">
            <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs">🖼️</span>
            <span className="truncate">Microsoft Clip Gallery 5.0 - [MS Office Clipart Collection SVG]</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className={`w-5 h-5 flex items-center justify-center font-bold text-xs ${
                theme === 'winxp' || theme === 'winxp-silver'
                  ? 'bg-[#288eff] hover:bg-blue-400 text-white rounded-xs shadow-xs'
                  : 'bg-[#c0c0c0] text-black hover:bg-zinc-300 retro-outset'
              }`}
              title="Minimizar"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              className={`w-5 h-5 flex items-center justify-center font-bold text-xs ${
                theme === 'winxp' || theme === 'winxp-silver'
                  ? 'bg-[#288eff] hover:bg-blue-400 text-white rounded-xs shadow-xs'
                  : 'bg-[#c0c0c0] text-black hover:bg-zinc-300 retro-outset'
              }`}
              title="Maximizar"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => retroAudio.playClick()}
              className={`w-5 h-5 flex items-center justify-center font-bold text-xs ${
                theme === 'winxp' || theme === 'winxp-silver'
                  ? 'bg-[#e81123] hover:bg-[#f65314] text-white rounded-xs shadow-xs'
                  : 'bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white retro-outset'
              }`}
              title="Cerrar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Menu Bar */}
        <RetroMenuBar
          currentCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          viewMode={viewMode}
          onChangeViewMode={mode => {
            setViewMode(mode);
            retroAudio.playClick();
          }}
          onRandomClip={handleRandomSurprise}
          totalClipsCount={totalCount}
        />

        {/* Retro Ribbon / Search & Action Toolbar */}
        <div className="p-2 sm:p-2.5 bg-inherit border-b border-[#808080] flex flex-wrap items-center gap-2 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 57,000+ clips (e.g. computer, cat, cybart, business)..."
              className="w-full pl-8 pr-7 py-1.5 bg-white text-zinc-900 placeholder-zinc-400 text-xs rounded-xs retro-inset focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-600" />
            <select
              value={sortMode}
              onChange={e => {
                setSortMode(e.target.value as 'default');
                retroAudio.playClick();
              }}
              className="px-2 py-1 bg-white border border-[#808080] text-zinc-900 rounded-xs text-xs retro-inset focus:outline-none"
            >
              <option value="default">Default Order</option>
              <option value="name">Name (A-Z)</option>
              <option value="size-asc">Size (Smallest)</option>
              <option value="size-desc">Size (Largest)</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#d4d0c8] p-0.5 rounded-xs retro-inset">
            <button
              onClick={() => {
                setViewMode('medium');
                retroAudio.playClick();
              }}
              className={`p-1 rounded-xs transition-colors ${
                viewMode === 'medium'
                  ? 'bg-[#000080] text-white shadow-xs'
                  : 'hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Classic Medium Icons"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setViewMode('large');
                retroAudio.playClick();
              }}
              className={`p-1 rounded-xs transition-colors ${
                viewMode === 'large'
                  ? 'bg-[#000080] text-white shadow-xs'
                  : 'hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Large Previews"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setViewMode('compact');
                retroAudio.playClick();
              }}
              className={`p-1 rounded-xs transition-colors ${
                viewMode === 'compact'
                  ? 'bg-[#000080] text-white shadow-xs'
                  : 'hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Compact Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setViewMode('details');
                retroAudio.playClick();
              }}
              className={`p-1 rounded-xs transition-colors ${
                viewMode === 'details'
                  ? 'bg-[#000080] text-white shadow-xs'
                  : 'hover:bg-zinc-200 text-zinc-700'
              }`}
              title="Details List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Surprise Me button */}
          <button
            onClick={handleRandomSurprise}
            className="px-2.5 py-1 bg-[#c0c0c0] hover:bg-yellow-100 text-zinc-900 font-semibold rounded-xs retro-outset flex items-center gap-1.5 transition-colors"
            title="Mostrar clips aleatorios"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">Surprise Me!</span>
          </button>

          {/* WordPad 97 Studio Button */}
          <button
            onClick={() => {
              setIsWordpadOpen(true);
              retroAudio.playClick();
            }}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xs flex items-center gap-1.5 shadow-xs transition-colors"
            title="Abrir editor de documentos retro Word 97"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Word 97 Studio</span>
            {documentItems.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-900 rounded-full text-[10px]">
                {documentItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area (Sidebar + Grid) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
          {/* Left Sidebar: Retro Categories Tree */}
          <div className="w-full md:w-60 lg:w-64 bg-[#f0f0f0] border-b md:border-b-0 md:border-r border-[#808080] flex flex-col select-none">
            <div className="p-2 bg-[#e0e0e0] border-b border-[#808080] font-bold text-xs text-zinc-800 flex items-center justify-between">
              <span>Clip Categories</span>
              <span className="text-[10px] text-zinc-600 font-normal">57k Archive</span>
            </div>

            {/* Category Tree Items */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-xs max-h-48 md:max-h-none bg-[#f8f8f8]">
              {/* Favorites special button */}
              <button
                onClick={() => handleSelectCategory('favorites')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs transition-colors text-left font-semibold ${
                  activeCategory === 'favorites'
                    ? 'bg-[#000080] text-white shadow-xs'
                    : 'hover:bg-zinc-200 text-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className={`w-3.5 h-3.5 ${activeCategory === 'favorites' ? 'fill-white text-white' : 'text-red-600'}`} />
                  <span>My Favorites</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeCategory === 'favorites' ? 'bg-white/20' : 'bg-black/10'}`}>
                  {favorites.length}
                </span>
              </button>

              <div className="h-px bg-zinc-300 my-1 retro-groove" />

              {/* Standard Categories */}
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1 rounded-xs transition-colors text-left ${
                      isActive
                        ? 'bg-[#000080] text-white font-bold shadow-xs'
                        : 'hover:bg-zinc-200 text-zinc-900'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isActive ? (
                        <FolderOpen className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                      )}
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {isActive && <ChevronRight className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Virtualized / Lazy Clipart Grid */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-white p-3 sm:p-4">
            {/* Header info in current category */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-zinc-300 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900 capitalize">
                  {activeCategory === 'favorites'
                    ? 'My Saved Favorites'
                    : CATEGORIES.find(c => c.id === activeCategory)?.name || 'All Categories'}
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-600 font-mono">{totalCount.toLocaleString()} clips found</span>
              </div>

              {searchQuery && (
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-600">Filter:</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-semibold rounded text-[11px] flex items-center gap-1 border border-blue-200">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={handleClearSearch} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Empty State */}
            {items.length === 0 && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-zinc-500 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-bold text-base text-zinc-800">No Clipart Found</h3>
                <p className="text-xs text-zinc-600 max-w-sm mt-1">
                  {activeCategory === 'favorites'
                    ? 'You have not saved any favorite clips yet. Click the heart icon on any clipart to save it!'
                    : `No results for "${searchQuery}" in this category. Try broader terms like "computer", "person", "meeting", or "animal".`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 px-3 py-1.5 bg-[#000080] hover:bg-blue-700 text-white rounded-xs text-xs font-semibold"
                >
                  Show All Clips
                </button>
              </div>
            )}

            {/* Grid Render according to ViewMode */}
            {items.length > 0 && (
              <div
                className={
                  viewMode === 'large'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : viewMode === 'medium'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3'
                    : viewMode === 'compact'
                    ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2'
                    : 'flex flex-col divide-y divide-zinc-200 border border-zinc-300 rounded'
                }
              >
                {items.map((clip, idx) => (
                  <ClipartCard
                    key={`${clip.id}-${idx}`}
                    clip={clip}
                    viewMode={viewMode}
                    isSelected={selectedClip?.id === clip.id}
                    onSelect={c => setSelectedClip(c)}
                    onDoubleClick={c => setPreviewClip(c)}
                    priority={idx < 12} // eager load first 12 items
                  />
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger / Loading Indicator */}
            {activeCategory !== 'favorites' && (
              <div ref={loadMoreObserverRef} className="py-6 flex flex-col items-center justify-center">
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#000080]" />
                    <span>Loading more high-speed vector SVG clips from Archive...</span>
                  </div>
                )}
                {!isLoading && page < totalPages && (
                  <button
                    onClick={() => fetchClips(page + 1, true)}
                    className="px-4 py-1.5 text-xs font-semibold bg-[#c0c0c0] hover:bg-zinc-300 text-black rounded-xs retro-outset"
                  >
                    Load More Clips ({page} / {totalPages})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <RetroStatusBar
          totalItems={totalCount}
          filteredCount={items.length}
          isLoading={isLoading}
          isArchiveReady={isArchiveReady}
        />
      </div>

      {/* Vector Detail & Inspector Dialog */}
      <ClipartDetailDialog
        clip={previewClip}
        isOpen={!!previewClip}
        onClose={() => setPreviewClip(null)}
        onSelectTag={handleTagSearch}
      />

      {/* WordPad 97 Clipart Document Studio Modal */}
      <WordpadStudioModal />

      {/* Clippy Desktop Assistant */}
      <ClippyAssistant
        onSearchTopic={topic => {
          setSearchQuery(topic);
          setActiveCategory('all');
        }}
        onRandomClip={handleRandomSurprise}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <GalleryApp />
    </ThemeProvider>
  );
}
