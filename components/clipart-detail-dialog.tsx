'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { ClipartItem } from '@/lib/types';
import { useThemeContext } from './theme-context';
import { retroAudio } from '@/lib/retro-audio';
import {
  X,
  Download,
  Copy,
  Check,
  Heart,
  FilePlus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Layers,
  Palette,
  Sparkles,
  Maximize2,
  FileCode,
} from 'lucide-react';

interface ClipartDetailDialogProps {
  clip: ClipartItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTag?: (tag: string) => void;
}

type BgMode = 'white' | 'checkers' | 'dark' | 'word97' | 'crt';
type FilterMode = 'none' | 'sepia' | 'neon' | 'monochrome' | 'invert';

export function ClipartDetailDialog({ clip, isOpen, onClose, onSelectTag }: ClipartDetailDialogProps) {
  const { isFavorite, addFavorite, removeFavorite, addToDocument, theme, setStatusMessage } = useThemeContext();
  const [zoom, setZoom] = useState<number>(100);
  const [bgMode, setBgMode] = useState<BgMode>('checkers');
  const [filterMode, setFilterMode] = useState<FilterMode>('none');
  const [svgSource, setSvgSource] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCopyingCode, setIsCopyingCode] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props'>('preview');
  const svgImgRef = useRef<HTMLImageElement | null>(null);

  const fav = clip ? isFavorite(clip.id) : false;

  // Pre-fetch SVG source for code viewing & copying
  useEffect(() => {
    if (!clip || !isOpen) return;
    let isCancelled = false;

    fetch(clip.url)
      .then(r => r.text())
      .then(txt => {
        if (!isCancelled) setSvgSource(txt);
      })
      .catch(() => {
        if (!isCancelled) setSvgSource('');
      });

    return () => {
      isCancelled = true;
    };
  }, [clip, isOpen]);

  if (!clip) return null;

  const handleFavoriteToggle = () => {
    if (fav) {
      removeFavorite(clip.id);
    } else {
      addFavorite(clip);
    }
  };

  const handleInsert = () => {
    addToDocument(clip);
    onClose();
  };

  const handleCopySvgCode = async () => {
    try {
      setIsCopyingCode(true);
      let textToCopy = svgSource;
      if (!textToCopy) {
        const res = await fetch(clip.url);
        textToCopy = await res.text();
      }
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      retroAudio.playClick();
      setStatusMessage(`Copied SVG code for ${clip.title} to clipboard.`);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      retroAudio.playError();
    } finally {
      setIsCopyingCode(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(clip.url);
      setIsCopied(true);
      retroAudio.playClick();
      setStatusMessage('Copied direct Archive.org SVG link!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleDownloadSvg = () => {
    retroAudio.playDownload();
    const link = document.createElement('a');
    link.href = clip.url;
    link.download = clip.filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage(`Downloaded ${clip.filename}`);
  };

  const handleExportPng = async (scale = 2) => {
    try {
      setIsExportingPng(true);
      retroAudio.playDownload();

      // Render SVG to high-res canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = clip.url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const size = 512 * scale;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context failed');

      // Draw background if not checkers
      if (bgMode === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
      } else if (bgMode === 'dark') {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, size, size);
      }

      // Apply filter if needed
      if (filterMode === 'sepia') ctx.filter = 'sepia(100%)';
      else if (filterMode === 'monochrome') ctx.filter = 'grayscale(100%) contrast(150%)';
      else if (filterMode === 'invert') ctx.filter = 'invert(100%)';
      else if (filterMode === 'neon') ctx.filter = 'saturate(250%) contrast(120%)';

      ctx.drawImage(img, 0, 0, size, size);

      const pngData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngData;
      link.download = `${clip.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${size}px.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatusMessage(`Exported high-res PNG (${size}x${size}px)`);
    } catch {
      retroAudio.playError();
      setStatusMessage('Could not rasterize SVG directly due to CORS; downloading original SVG instead.');
      handleDownloadSvg();
    } finally {
      setIsExportingPng(false);
    }
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'sepia':
        return 'sepia(90%) hue-rotate(330deg)';
      case 'neon':
        return 'saturate(250%) contrast(125%) drop-shadow(0 0 6px rgba(0, 255, 255, 0.4))';
      case 'monochrome':
        return 'grayscale(100%) contrast(140%)';
      case 'invert':
        return 'invert(100%) hue-rotate(180deg)';
      default:
        return 'none';
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6"
              >
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ scale: 0.94, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 8 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                    className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-zinc-900 select-none shadow-2xl ${
                      theme === 'winxp' || theme === 'winxp-silver'
                        ? 'rounded-t-lg border-2 border-[#0055eb] bg-[#ece9d8]'
                        : theme === 'win98-desert'
                        ? 'bg-[#dfd3c3] retro-outset'
                        : theme === 'win98-rose'
                        ? 'bg-[#e0d5db] retro-outset'
                        : theme === 'winme'
                        ? 'bg-[#d4d0c8] retro-outset'
                        : 'bg-[#c0c0c0] retro-outset'
                    }`}
                  >
                    {/* Window Title Bar */}
                    <div
                      className={`flex items-center justify-between px-2.5 py-1.5 ${
                        theme === 'winxp'
                          ? 'bg-gradient-to-r from-[#0058ee] via-[#288eff] to-[#0058ee] text-white rounded-t-[5px]'
                          : theme === 'winxp-silver'
                          ? 'bg-gradient-to-r from-[#8e939d] via-[#d1d5db] to-[#737882] text-zinc-900 rounded-t-[5px]'
                          : theme === 'winme'
                          ? 'bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white'
                          : theme === 'win98-desert'
                          ? 'bg-gradient-to-r from-[#7b5530] to-[#ad8253] text-white'
                          : theme === 'win98-rose'
                          ? 'bg-gradient-to-r from-[#6b3252] to-[#98577b] text-white'
                          : 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs tracking-wide truncate">
                        <span className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[10px]">
                          🖼️
                        </span>
                        <span className="truncate">Clip Properties & Vector Inspector - {clip.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={onClose}
                          className={`w-5 h-5 flex items-center justify-center font-bold text-xs ${
                            theme === 'winxp' || theme === 'winxp-silver'
                              ? 'bg-[#e81123] hover:bg-[#f65314] text-white rounded shadow-xs'
                              : 'bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white retro-outset'
                          }`}
                          title="Cerrar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Window Content */}
                    <div className="p-3 sm:p-4 flex-1 overflow-y-auto flex flex-col gap-3">
                      {/* Top Action Ribbon */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded retro-inset">
                        {/* Tabs */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setActiveTab('preview');
                              retroAudio.playClick();
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded-xs flex items-center gap-1.5 transition-all ${
                              activeTab === 'preview'
                                ? 'bg-[#000080] text-white shadow-xs'
                                : 'bg-[#c0c0c0] text-zinc-900 hover:bg-zinc-300 retro-outset'
                            }`}
                          >
                            <ZoomIn className="w-3.5 h-3.5" /> Interactive Vector View
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('code');
                              retroAudio.playClick();
                            }}
                            className={`px-3 py-1 text-xs font-semibold rounded-xs flex items-center gap-1.5 transition-all ${
                              activeTab === 'code'
                                ? 'bg-[#000080] text-white shadow-xs'
                                : 'bg-[#c0c0c0] text-zinc-900 hover:bg-zinc-300 retro-outset'
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5" /> Raw SVG Code
                          </button>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={handleInsert}
                            className="px-2.5 py-1 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs flex items-center gap-1.5 shadow-xs transition-colors"
                            title="Insertar en Documento Word 97"
                          >
                            <FilePlus className="w-3.5 h-3.5" /> Insert in Word 97
                          </button>
                          <button
                            onClick={handleFavoriteToggle}
                            className={`px-2.5 py-1 text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors ${
                              fav
                                ? 'bg-red-600 text-white'
                                : 'bg-[#c0c0c0] hover:bg-red-100 text-zinc-900 retro-outset'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white' : 'text-red-600'}`} />
                            {fav ? 'Saved' : 'Favorite'}
                          </button>
                          <button
                            onClick={handleCopySvgCode}
                            disabled={isCopyingCode}
                            className="px-2.5 py-1 text-xs font-medium bg-[#c0c0c0] hover:bg-zinc-300 text-zinc-900 rounded-xs flex items-center gap-1.5 retro-outset"
                            title="Copiar código SVG al portapapeles"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                            {isCopied ? 'Copied!' : 'Copy SVG'}
                          </button>
                          <button
                            onClick={handleDownloadSvg}
                            className="px-3 py-1 text-xs font-semibold bg-[#000080] hover:bg-blue-800 text-white rounded-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" /> Download .SVG
                          </button>
                        </div>
                      </div>

                      {/* Main Workspace */}
                      {activeTab === 'preview' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {/* Vector Canvas (2 cols) */}
                          <div className="lg:col-span-2 flex flex-col gap-2">
                            {/* Canvas Stage */}
                            <div
                              className={`relative w-full h-80 sm:h-96 rounded-xs flex items-center justify-center overflow-hidden border border-[#808080] select-none ${
                                bgMode === 'checkers'
                                  ? 'bg-checkers'
                                  : bgMode === 'white'
                                  ? 'bg-white'
                                  : bgMode === 'dark'
                                  ? 'bg-zinc-200'
                                  : bgMode === 'crt'
                                  ? 'bg-[#002200] text-emerald-400'
                                  : 'bg-[#fffae6] border-2 border-[#d0c090]'
                              }`}
                            >
                              {bgMode === 'crt' && <div className="absolute inset-0 retro-scanlines pointer-events-none" />}

                              {bgMode === 'word97' && (
                                <div className="absolute top-2 left-4 text-[10px] text-zinc-500 font-serif italic pointer-events-none">
                                  --- Microsoft Word Document Page Preview ---
                                </div>
                              )}

                              <div
                                style={{
                                  transform: `scale(${zoom / 100})`,
                                  filter: getFilterStyle(),
                                  transition: 'transform 0.15s ease-out, filter 0.2s ease',
                                }}
                                className="w-64 h-64 sm:w-80 sm:h-80 p-4 flex items-center justify-center pointer-events-none"
                              >
                                <img
                                  ref={svgImgRef}
                                  src={clip.url}
                                  alt={clip.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>

                              {/* Corner Zoom Watermark */}
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-mono bg-black/60 text-white rounded backdrop-blur-xs">
                                {zoom}%
                              </div>
                            </div>

                            {/* Canvas Controls Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-xs text-xs retro-inset">
                              {/* Zoom Slider */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setZoom(z => Math.max(40, z - 20))}
                                  className="p-1 bg-[#c0c0c0] hover:bg-zinc-300 rounded-xs retro-outset"
                                  title="Zoom Out"
                                >
                                  <ZoomOut className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="range"
                                  min="40"
                                  max="300"
                                  step="10"
                                  value={zoom}
                                  onChange={e => setZoom(parseInt(e.target.value, 10))}
                                  className="w-24 accent-[#000080] cursor-pointer"
                                />
                                <button
                                  onClick={() => setZoom(z => Math.min(300, z + 20))}
                                  className="p-1 bg-[#c0c0c0] hover:bg-zinc-300 rounded-xs retro-outset"
                                  title="Zoom In"
                                >
                                  <ZoomIn className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setZoom(100)}
                                  className="px-1.5 py-0.5 text-[10px] font-mono bg-[#c0c0c0] hover:bg-zinc-300 rounded-xs flex items-center gap-1 retro-outset"
                                >
                                  <RotateCcw className="w-2.5 h-2.5" /> 100%
                                </button>
                              </div>

                              {/* Background Switcher */}
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-zinc-600 font-medium">BG:</span>
                                <button
                                  onClick={() => setBgMode('checkers')}
                                  className={`px-2 py-0.5 text-[10px] rounded-xs ${bgMode === 'checkers' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  Grid
                                </button>
                                <button
                                  onClick={() => setBgMode('white')}
                                  className={`px-2 py-0.5 text-[10px] rounded-xs ${bgMode === 'white' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  White
                                </button>
                                <button
                                  onClick={() => setBgMode('word97')}
                                  className={`px-2 py-0.5 text-[10px] rounded-xs ${bgMode === 'word97' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  Word 97
                                </button>
                              </div>

                              {/* Retro Color FX */}
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-zinc-600 font-medium">FX:</span>
                                <button
                                  onClick={() => setFilterMode('none')}
                                  className={`px-1.5 py-0.5 text-[10px] rounded-xs ${filterMode === 'none' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  Normal
                                </button>
                                <button
                                  onClick={() => setFilterMode('sepia')}
                                  className={`px-1.5 py-0.5 text-[10px] rounded-xs ${filterMode === 'sepia' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  Sepia
                                </button>
                                <button
                                  onClick={() => setFilterMode('neon')}
                                  className={`px-1.5 py-0.5 text-[10px] rounded-xs ${filterMode === 'neon' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  Neon 90s
                                </button>
                                <button
                                  onClick={() => setFilterMode('monochrome')}
                                  className={`px-1.5 py-0.5 text-[10px] rounded-xs ${filterMode === 'monochrome' ? 'bg-[#000080] text-white' : 'bg-[#c0c0c0] retro-outset'}`}
                                >
                                  B&W
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Clipart Metadata & Properties Sidebar (1 col) */}
                          <div className="flex flex-col gap-3 bg-white p-3 rounded-xs retro-inset text-xs">
                            <div>
                              <h3 className="font-bold text-sm text-zinc-900">{clip.title}</h3>
                              <p className="text-[11px] text-zinc-600 mt-0.5">Classic Microsoft Clip Gallery Item</p>
                            </div>

                            {/* Properties table */}
                            <div className="space-y-1.5 border-t border-b border-zinc-200 py-2">
                              <div className="flex justify-between">
                                <span className="text-zinc-600">Clip ID:</span>
                                <span className="font-mono font-bold text-[#000080]">{clip.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-600">Category:</span>
                                <span className="font-semibold capitalize text-zinc-900">{clip.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-600">File Size:</span>
                                <span className="font-mono">{(clip.size / 1024).toFixed(1)} KB</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-600">Format:</span>
                                <span className="font-mono font-bold text-emerald-700">SVG (Vector)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-600">Source:</span>
                                <span className="text-zinc-800 truncate max-w-[140px]">Office 97 / 2000 Archive</span>
                              </div>
                            </div>

                            {/* Clickable Tags Explorer */}
                            <div>
                              <div className="font-semibold text-zinc-800 mb-1.5 flex items-center justify-between">
                                <span>Search Tags & Keywords</span>
                                <span className="text-[10px] text-zinc-500">{clip.tags.length} tags</span>
                              </div>
                              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-1 bg-zinc-50 rounded border border-zinc-200">
                                {clip.tags.map((tag, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      if (onSelectTag) {
                                        onSelectTag(tag);
                                        onClose();
                                      }
                                    }}
                                    className="px-2 py-0.5 text-[10px] bg-white hover:bg-blue-100 hover:text-blue-900 text-zinc-800 rounded border border-zinc-300 transition-colors"
                                    title={`Filtrar por #${tag}`}
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Export Options */}
                            <div className="pt-2 border-t border-zinc-200 flex flex-col gap-1.5">
                              <span className="font-semibold text-zinc-800 text-[11px]">Rasterize / PNG Export:</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  onClick={() => handleExportPng(2)}
                                  disabled={isExportingPng}
                                  className="px-2 py-1 text-[11px] bg-[#c0c0c0] hover:bg-zinc-300 text-zinc-900 rounded font-medium flex items-center justify-center gap-1 retro-outset"
                                >
                                  <Download className="w-3 h-3" /> PNG 1024px
                                </button>
                                <button
                                  onClick={() => handleExportPng(4)}
                                  disabled={isExportingPng}
                                  className="px-2 py-1 text-[11px] bg-[#c0c0c0] hover:bg-zinc-300 text-zinc-900 rounded font-medium flex items-center justify-center gap-1 retro-outset"
                                >
                                  <Download className="w-3 h-3" /> PNG 2048px (HD)
                                </button>
                              </div>
                              <a
                                href={clip.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 text-[11px] text-blue-700 hover:underline flex items-center gap-1 justify-center"
                              >
                                View on Internet Archive <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Raw SVG Code Tab */
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-600">SVG XML Markup ({svgSource.length} characters)</span>
                            <button
                              onClick={handleCopySvgCode}
                              className="px-3 py-1 bg-[#000080] hover:bg-blue-800 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow-xs"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {isCopied ? 'Copied to Clipboard' : 'Copy All Code'}
                            </button>
                          </div>
                          <pre className="w-full h-80 overflow-auto p-3 font-mono text-[11px] bg-zinc-900 text-emerald-400 rounded retro-inset leading-relaxed">
                            {svgSource || 'Loading raw SVG data from Internet Archive...'}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Window Bottom Buttons */}
                    <div className="p-2.5 bg-[#c0c0c0] flex items-center justify-between border-t border-[#808080]">
                      <div className="text-[11px] text-zinc-700 font-mono">
                        Archive File: <span className="font-semibold text-black truncate">{clip.filename}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onClose}
                          className="px-5 py-1 text-xs font-bold bg-[#c0c0c0] hover:bg-zinc-300 text-black rounded-xs retro-outset"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </motion.div>
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
