'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ClipartItem, ViewMode } from '@/lib/types';
import { LazySvgImage } from './lazy-svg-image';
import { useThemeContext } from './theme-context';
import { retroAudio } from '@/lib/retro-audio';
import { Heart, ZoomIn, Download, FilePlus, Sparkles } from 'lucide-react';

interface ClipartCardProps {
  clip: ClipartItem;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: (clip: ClipartItem) => void;
  onDoubleClick: (clip: ClipartItem) => void;
  priority?: boolean;
}

export const ClipartCard = React.memo(function ClipartCard({
  clip,
  viewMode,
  isSelected,
  onSelect,
  onDoubleClick,
  priority = false,
}: ClipartCardProps) {
  const { isFavorite, addFavorite, removeFavorite, addToDocument, theme } = useThemeContext();
  const fav = isFavorite(clip.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fav) {
      removeFavorite(clip.id);
    } else {
      addFavorite(clip);
    }
  };

  const handleInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToDocument(clip);
  };

  const handleQuickDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    retroAudio.playDownload();
    const link = document.createElement('a');
    link.href = clip.url;
    link.download = clip.filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardClick = () => {
    retroAudio.playClick();
    onSelect(clip);
  };

  const handleCardDoubleClick = () => {
    retroAudio.playWindowPop();
    onDoubleClick(clip);
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // List / Details view mode
  if (viewMode === 'details') {
    return (
      <div
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
        className={`group flex items-center gap-3 px-3 py-1.5 cursor-pointer text-xs transition-colors select-none ${
          isSelected
            ? theme === 'winxp' || theme === 'winxp-silver'
              ? 'bg-[#316ac5] text-white'
              : 'bg-[#000080] text-white'
            : 'hover:bg-blue-50 text-zinc-900'
        }`}
      >
        <div className="w-9 h-9 flex-shrink-0 bg-white p-1 rounded border border-zinc-300">
          <LazySvgImage src={clip.url} alt={clip.title} priority={priority} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{clip.title}</div>
          <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-zinc-500'}`}>
            {clip.tags.slice(0, 4).join(', ')}
          </div>
        </div>
        <div className={`w-24 text-[11px] capitalize ${isSelected ? 'text-blue-100' : 'text-zinc-500'}`}>
          {clip.category}
        </div>
        <div className={`w-16 text-[11px] font-mono text-right ${isSelected ? 'text-blue-100' : 'text-zinc-500'}`}>
          {formatSize(clip.size)}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavoriteToggle}
            className={`p-1 rounded ${isSelected ? 'hover:bg-blue-700 text-white' : 'hover:bg-zinc-200 text-zinc-600'}`}
            title={fav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={handleInsert}
            className={`p-1 rounded ${isSelected ? 'hover:bg-blue-700 text-white' : 'hover:bg-zinc-200 text-zinc-600'}`}
            title="Insertar en Documento Word 97"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleQuickDownload}
            className={`p-1 rounded ${isSelected ? 'hover:bg-blue-700 text-white' : 'hover:bg-zinc-200 text-zinc-600'}`}
            title="Descargar SVG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Compact view mode (Dense grid)
  if (viewMode === 'compact') {
    return (
      <div
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
        className={`group relative aspect-square p-1.5 cursor-pointer flex flex-col items-center justify-center transition-all select-none ${
          isSelected
            ? 'ring-2 ring-[#000080] bg-blue-100/60 retro-inset'
            : 'bg-white hover:bg-blue-50/50 border border-zinc-300'
        }`}
        title={`${clip.title} (Doble clic para ver en grande)`}
      >
        <div className="w-full h-full p-1 bg-white rounded flex items-center justify-center">
          <LazySvgImage src={clip.url} alt={clip.title} priority={priority} />
        </div>
        {fav && (
          <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center shadow">
            <Heart className="w-2 h-2 fill-white text-white" />
          </div>
        )}
      </div>
    );
  }

  // Medium view mode (Classic Office 97 Clip Gallery look)
  if (viewMode === 'medium') {
    return (
      <div
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
        className={`group relative p-2 cursor-pointer flex flex-col transition-all select-none ${
          isSelected
            ? theme === 'winxp' || theme === 'winxp-silver'
              ? 'bg-[#316ac5]/15 ring-2 ring-[#316ac5] shadow-sm rounded-sm'
              : 'bg-[#000080]/10 ring-2 ring-[#000080] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]'
            : 'bg-white hover:bg-blue-50/50 border border-zinc-300 hover:border-blue-400'
        }`}
      >
        {/* SVG Container */}
        <div className="relative w-full aspect-square bg-white p-2 rounded flex items-center justify-center overflow-hidden border border-zinc-200">
          <LazySvgImage src={clip.url} alt={clip.title} priority={priority} />

          {/* Hover overlay quick buttons */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
            <button
              onClick={handleCardDoubleClick}
              className="p-1.5 bg-white text-zinc-800 rounded-full hover:bg-yellow-300 shadow hover:scale-110 transition-transform"
              title="Abrir vista detallada"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleInsert}
              className="p-1.5 bg-white text-zinc-800 rounded-full hover:bg-blue-400 hover:text-white shadow hover:scale-110 transition-transform"
              title="Insertar en Word 97"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFavoriteToggle}
              className="p-1.5 bg-white text-zinc-800 rounded-full hover:bg-red-100 shadow hover:scale-110 transition-transform"
              title={fav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
            >
              <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={handleQuickDownload}
              className="p-1.5 bg-white text-zinc-800 rounded-full hover:bg-emerald-400 hover:text-white shadow hover:scale-110 transition-transform"
              title="Descargar SVG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-1.5 px-0.5">
          <div
            className={`text-xs font-medium truncate text-center ${
              isSelected ? 'font-bold text-[#000080]' : 'text-zinc-800'
            }`}
          >
            {clip.title}
          </div>
          <div className="text-[10px] text-zinc-500 text-center font-mono">{formatSize(clip.size)}</div>
        </div>

        {fav && (
          <div className="absolute top-1.5 right-1.5">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 drop-shadow" />
          </div>
        )}
      </div>
    );
  }

  // Large view mode (Full spacious preview with tags & action toolbar)
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
      className={`group relative p-3.5 cursor-pointer flex flex-col justify-between transition-all select-none rounded ${
        isSelected
          ? 'bg-blue-50 ring-2 ring-[#000080] shadow-md'
          : 'bg-white hover:shadow-md border border-zinc-300'
      }`}
    >
      {/* SVG Canvas */}
      <div className="relative w-full aspect-[4/3] bg-white p-3 rounded flex items-center justify-center overflow-hidden border border-zinc-200">
        <LazySvgImage src={clip.url} alt={clip.title} priority={priority} />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-100 text-zinc-800 rounded border border-zinc-300 shadow-xs uppercase font-medium">
            {clip.category}
          </span>
        </div>

        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform"
          title={fav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
        </button>
      </div>

      {/* Info Block */}
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-zinc-900 truncate">{clip.title}</h4>

        {/* Tags pills */}
        <div className="mt-1.5 flex flex-wrap gap-1 max-h-11 overflow-hidden">
          {clip.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-1.5 py-0.5 text-[10px] bg-zinc-100 text-zinc-700 rounded border border-zinc-200"
            >
              #{tag}
            </span>
          ))}
          {clip.tags.length > 3 && (
            <span className="text-[10px] text-zinc-500 self-center">+{clip.tags.length - 3}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-zinc-500">{formatSize(clip.size)}</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInsert}
              className="px-2 py-1 bg-[#c0c0c0] hover:bg-blue-100 text-zinc-900 rounded text-[11px] font-medium flex items-center gap-1 transition-colors retro-outset"
              title="Insertar en WordPad / Canvas"
            >
              <FilePlus className="w-3 h-3 text-blue-700" /> Insert
            </button>
            <button
              onClick={handleCardDoubleClick}
              className="px-2 py-1 bg-[#000080] hover:bg-blue-700 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors shadow-xs"
              title="Ver vector en detalle"
            >
              <ZoomIn className="w-3 h-3" /> View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
