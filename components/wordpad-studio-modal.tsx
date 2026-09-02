'use client';

import React, { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeContext } from './theme-context';
import { retroAudio } from '@/lib/retro-audio';
import confetti from 'canvas-confetti';
import {
  X,
  Printer,
  Download,
  Trash2,
  Plus,
  Type,
  Bold,
  Italic,
  Underline,
  Sparkles,
  Move,
  RotateCw,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

export function WordpadStudioModal() {
  const { isWordpadOpen, setIsWordpadOpen, documentItems, removeFromDocument, clearDocument, theme } = useThemeContext();
  const [docTitle, setDocTitle] = useState<string>('My 90s Presentation Document.doc');
  const [wordArtText, setWordArtText] = useState<string>('MICROSOFT CLIP ART 1997');
  const [wordArtStyle, setWordArtStyle] = useState<'rainbow' | '3d-blue' | 'chrome' | 'fire'>('rainbow');
  const [fontFamily, setFontFamily] = useState<string>('Comic Sans MS, cursive, sans-serif');
  const [fontSize, setFontSize] = useState<string>('16px');
  const [bodyText, setBodyText] = useState<string>(
    'Welcome to Microsoft Word 97! You can customize this nostalgic retro document, rearrange the inserted Microsoft Clip Gallery vector art, and download your retro creation.'
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [pageStyle, setPageStyle] = useState<'white' | 'lined' | 'grid' | 'parchment'>('white');
  const docPageRef = useRef<HTMLDivElement | null>(null);

  if (!isWordpadOpen) return null;

  const handlePrint = () => {
    retroAudio.playDownload();
    window.print();
  };

  const handleExportDoc = async () => {
    try {
      retroAudio.playDownload();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      alert('Document ready! Use Print -> Save as PDF or copy text.');
    } catch {}
  };

  const getWordArtClass = () => {
    switch (wordArtStyle) {
      case 'rainbow':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600 drop-shadow-[2px_2px_0px_#000] font-black italic uppercase tracking-wider text-2xl sm:text-3xl';
      case '3d-blue':
        return 'text-[#1e40af] drop-shadow-[3px_3px_0px_#93c5fd] font-black uppercase tracking-widest text-2xl sm:text-3xl';
      case 'chrome':
        return 'text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-800 drop-shadow-[2px_2px_1px_#000] font-extrabold uppercase text-2xl sm:text-3xl';
      case 'fire':
        return 'text-transparent bg-clip-text bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 drop-shadow-[2px_2px_0px_#7f1d1d] font-black text-2xl sm:text-3xl';
    }
  };

  return (
    <Dialog.Root open={isWordpadOpen} onOpenChange={open => setIsWordpadOpen(open)}>
      <AnimatePresence>
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            >
              <Dialog.Content asChild>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className={`relative w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden select-none shadow-2xl ${
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
                  {/* Title Bar */}
                  <div
                    className={`flex items-center justify-between px-3 py-1.5 ${
                      theme === 'winxp'
                        ? 'bg-gradient-to-r from-[#0058ee] via-[#288eff] to-[#0058ee] text-white rounded-t-[5px]'
                        : theme === 'winme'
                        ? 'bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white'
                        : theme === 'win98-desert'
                        ? 'bg-gradient-to-r from-[#7b5530] to-[#ad8253] text-white'
                        : theme === 'win98-rose'
                        ? 'bg-gradient-to-r from-[#6b3252] to-[#98577b] text-white'
                        : 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs truncate">
                      <span>📝</span>
                      <span className="truncate">Microsoft WordPad 97 - [{docTitle}]</span>
                    </div>
                    <button
                      onClick={() => setIsWordpadOpen(false)}
                      className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white retro-outset text-xs font-bold"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Word Toolbar */}
                  <div className="p-1.5 bg-[#c0c0c0] border-b border-[#808080] flex flex-wrap items-center gap-1.5 text-xs">
                    {/* Font Family */}
                    <select
                      value={fontFamily}
                      onChange={e => setFontFamily(e.target.value)}
                      className="px-2 py-1 bg-white border border-zinc-400 rounded-xs text-xs"
                    >
                      <option value="Comic Sans MS, cursive, sans-serif">Comic Sans MS</option>
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="Impact, sans-serif">Impact</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Arial, sans-serif">Arial</option>
                    </select>

                    {/* Font Size */}
                    <select
                      value={fontSize}
                      onChange={e => setFontSize(e.target.value)}
                      className="px-2 py-1 bg-white border border-zinc-400 rounded-xs text-xs w-16"
                    >
                      <option value="12px">12</option>
                      <option value="14px">14</option>
                      <option value="16px">16</option>
                      <option value="20px">20</option>
                      <option value="24px">24</option>
                    </select>

                    <div className="h-4 w-px bg-zinc-400 mx-1" />

                    {/* WordArt Style dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-purple-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-700" /> WordArt:
                      </span>
                      <select
                        value={wordArtStyle}
                        onChange={e => setWordArtStyle(e.target.value as unknown as 'rainbow')}
                        className="px-2 py-1 bg-white border border-purple-400 rounded-xs text-xs font-bold"
                      >
                        <option value="rainbow">🌈 Rainbow Classic</option>
                        <option value="3d-blue">🔷 3D Blue Horizon</option>
                        <option value="chrome">💿 Chrome Metallic</option>
                        <option value="fire">🔥 90s Flame</option>
                      </select>
                    </div>

                    <div className="h-4 w-px bg-zinc-400 mx-1" />

                    {/* Paper background */}
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-700 font-medium">Paper:</span>
                      <select
                        value={pageStyle}
                        onChange={e => setPageStyle(e.target.value as 'white')}
                        className="px-2 py-1 bg-white border border-zinc-400 rounded-xs text-xs"
                      >
                        <option value="white">📄 Plain White</option>
                        <option value="lined">📝 Notebook Lined</option>
                        <option value="grid">📐 Grid Paper</option>
                        <option value="parchment">📜 Parchment 90s</option>
                      </select>
                    </div>

                    <div className="flex-1" />

                    {/* Document Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={clearDocument}
                        className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded-xs flex items-center gap-1 border border-red-300"
                        title="Borrar todos los clips del documento"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Clips
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-2.5 py-1 text-xs bg-[#c0c0c0] hover:bg-zinc-300 text-zinc-900 rounded-xs flex items-center gap-1 retro-outset"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                      <button
                        onClick={() => setIsWordpadOpen(false)}
                        className="px-3 py-1 text-xs bg-[#000080] hover:bg-blue-800 text-white rounded-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Browse More Clips
                      </button>
                    </div>
                  </div>

                  {/* Document Workspace */}
                  <div className="flex-1 bg-[#808080] p-4 sm:p-6 overflow-y-auto flex items-start justify-center retro-inset">
                    {/* The A4 Virtual Page */}
                    <div
                      ref={docPageRef}
                      className={`relative w-full max-w-3xl min-h-[680px] p-8 sm:p-12 shadow-2xl rounded-xs transition-colors ${
                        pageStyle === 'white'
                          ? 'bg-white text-zinc-900'
                          : pageStyle === 'lined'
                          ? 'bg-[#fcfdf8] text-zinc-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
                          : pageStyle === 'grid'
                          ? 'bg-white text-zinc-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]'
                          : 'bg-[#faf0d7] text-amber-950 border border-[#d6c496]'
                      }`}
                    >
                      {/* WordArt Header */}
                      <div className="mb-6 text-center">
                        <input
                          type="text"
                          value={wordArtText}
                          onChange={e => setWordArtText(e.target.value)}
                          className={`w-full text-center bg-transparent border-b border-dashed border-zinc-300 focus:border-blue-500 outline-none pb-2 ${getWordArtClass()}`}
                          placeholder="ENTER WORDART TITLE"
                        />
                      </div>

                      {/* Document Body Editable Area */}
                      <div className="mb-6">
                        <textarea
                          style={{ fontFamily, fontSize }}
                          value={bodyText}
                          onChange={e => setBodyText(e.target.value)}
                          rows={4}
                          className="w-full bg-transparent resize-none border-none outline-none leading-relaxed text-zinc-800 placeholder-zinc-400"
                          placeholder="Type your story, school report, or office memo here..."
                        />
                      </div>

                      {/* Inserted Clipart Grid / Free items */}
                      <div className="mt-4 pt-4 border-t-2 border-dashed border-zinc-300">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                          <span>Inserted Clip Gallery Vectors ({documentItems.length})</span>
                          {documentItems.length === 0 && (
                            <span className="text-amber-700 font-normal">
                              Tip: Click &ldquo;Insert&rdquo; on any clipart in the gallery to place it here!
                            </span>
                          )}
                        </div>

                        {documentItems.length === 0 ? (
                          <div className="py-12 flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-300 rounded p-6 text-center">
                            <span className="text-4xl mb-2">🖼️</span>
                            <p className="font-semibold text-sm text-zinc-600">No Clip Art Inserted Yet</p>
                            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                              Click the &ldquo;Browse More Clips&rdquo; button above, then click <strong>&ldquo;Insert&rdquo;</strong> on any iconic 90s clipart!
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {documentItems.map(item => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={`group relative p-2 bg-white rounded border-2 transition-all flex flex-col items-center justify-center ${
                                  selectedItemId === item.id
                                    ? 'border-[#000080] shadow-md ring-2 ring-blue-300'
                                    : 'border-zinc-300 hover:border-zinc-500'
                                }`}
                              >
                                <div className="w-28 h-28 p-1 flex items-center justify-center">
                                  <img
                                    src={item.clipart.url}
                                    alt={item.clipart.title}
                                    className="w-full h-full object-contain pointer-events-none"
                                  />
                                </div>
                                <span className="text-[10px] font-semibold text-zinc-700 truncate w-full text-center mt-1">
                                  {item.clipart.title}
                                </span>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    removeFromDocument(item.id);
                                  }}
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                  title="Quitar clip"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="px-3 py-1.5 bg-[#c0c0c0] border-t border-[#808080] flex items-center justify-between text-[11px] text-zinc-700 font-mono">
                    <span>Page 1 of 1 | Office 97 Standard View</span>
                    <span>Clips Active: {documentItems.length}</span>
                  </div>
                </motion.div>
              </Dialog.Content>
            </motion.div>
          </Dialog.Overlay>
        </Dialog.Portal>
      </AnimatePresence>
    </Dialog.Root>
  );
}
