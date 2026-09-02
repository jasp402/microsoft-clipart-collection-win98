'use client';

import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { useThemeContext } from './theme-context';
import { ThemeType, ViewMode } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { retroAudio } from '@/lib/retro-audio';
import {
  FileText,
  Save,
  Printer,
  Copy,
  LayoutGrid,
  Grid3X3,
  List,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  HelpCircle,
  Info,
  Check,
  Folder,
  Monitor,
  Heart,
  Shuffle,
  Eye,
} from 'lucide-react';

interface RetroMenuBarProps {
  currentCategory: string;
  onSelectCategory: (catId: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onRandomClip: () => void;
  totalClipsCount: number;
}

export function RetroMenuBar({
  currentCategory,
  onSelectCategory,
  viewMode,
  onChangeViewMode,
  onRandomClip,
  totalClipsCount,
}: RetroMenuBarProps) {
  const {
    theme,
    setTheme,
    soundEnabled,
    toggleSound,
    selectedClip,
    setPreviewClip,
    setIsWordpadOpen,
    isClippyOpen,
    setIsClippyOpen,
    favorites,
  } = useThemeContext();

  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isTipsOpen, setIsTipsOpen] = useState<boolean>(false);

  const handleMenuClick = () => {
    retroAudio.playClick();
  };

  return (
    <>
      <div className="flex flex-wrap items-center px-1.5 py-0.5 bg-inherit border-b border-[#808080] text-xs select-none">
        {/* File Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={handleMenuClick}
              className="px-2 py-0.5 hover:bg-[#000080] hover:text-white focus:outline-none rounded-xs font-normal"
            >
              <u>F</u>ile
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[190px] bg-[#c0c0c0] text-black p-1 text-xs retro-outset shadow-lg"
              sideOffset={2}
            >
              <DropdownMenu.Item
                onClick={() => {
                  handleMenuClick();
                  setIsWordpadOpen(true);
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open WordPad 97 Studio...</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                disabled={!selectedClip}
                onClick={() => {
                  if (selectedClip) {
                    setPreviewClip(selectedClip);
                  }
                }}
                className={`flex items-center gap-2 px-2 py-1 outline-none rounded-xs ${
                  selectedClip
                    ? 'hover:bg-[#000080] hover:text-white cursor-pointer'
                    : 'text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Selected Clip As...</span>
              </DropdownMenu.Item>
              <div className="h-px bg-zinc-400 my-1 retro-groove" />
              <DropdownMenu.Item
                onClick={() => {
                  window.open('https://archive.org/download/MS_Clipart_Collection_SVG', '_blank');
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Internet Archive Repository</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Edit Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={handleMenuClick}
              className="px-2 py-0.5 hover:bg-[#000080] hover:text-white focus:outline-none rounded-xs font-normal"
            >
              <u>E</u>dit
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[190px] bg-[#c0c0c0] text-black p-1 text-xs retro-outset shadow-lg"
              sideOffset={2}
            >
              <DropdownMenu.Item
                disabled={!selectedClip}
                onClick={() => {
                  if (selectedClip) {
                    navigator.clipboard.writeText(selectedClip.url);
                    retroAudio.playClick();
                  }
                }}
                className={`flex items-center gap-2 px-2 py-1 outline-none rounded-xs ${
                  selectedClip
                    ? 'hover:bg-[#000080] hover:text-white cursor-pointer'
                    : 'text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Clip Link</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  onSelectCategory('favorites');
                  handleMenuClick();
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <Heart className="w-3.5 h-3.5 text-red-600" />
                <span>Show Favorites ({favorites.length})</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  onRandomClip();
                  handleMenuClick();
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <Shuffle className="w-3.5 h-3.5 text-blue-700" />
                <span>Shuffle / Surprise Me!</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* View Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={handleMenuClick}
              className="px-2 py-0.5 hover:bg-[#000080] hover:text-white focus:outline-none rounded-xs font-normal"
            >
              <u>V</u>iew
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[190px] bg-[#c0c0c0] text-black p-1 text-xs retro-outset shadow-lg"
              sideOffset={2}
            >
              <DropdownMenu.Item
                onClick={() => {
                  onChangeViewMode('medium');
                  handleMenuClick();
                }}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-3.5 h-3.5" /> Medium Icons (Classic)
                </span>
                {viewMode === 'medium' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  onChangeViewMode('large');
                  handleMenuClick();
                }}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" /> Large Previews
                </span>
                {viewMode === 'large' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  onChangeViewMode('compact');
                  handleMenuClick();
                }}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 className="w-3.5 h-3.5" /> Compact Grid
                </span>
                {viewMode === 'compact' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  onChangeViewMode('details');
                  handleMenuClick();
                }}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span className="flex items-center gap-2">
                  <List className="w-3.5 h-3.5" /> List Details
                </span>
                {viewMode === 'details' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <div className="h-px bg-zinc-400 my-1 retro-groove" />
              <DropdownMenu.Item
                onClick={() => {
                  setIsClippyOpen(!isClippyOpen);
                  handleMenuClick();
                }}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span className="flex items-center gap-2">📎 Clippy Assistant</span>
                {isClippyOpen && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Categories Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={handleMenuClick}
              className="px-2 py-0.5 hover:bg-[#000080] hover:text-white focus:outline-none rounded-xs font-normal"
            >
              <u>C</u>ategories
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 max-h-80 overflow-y-auto min-w-[220px] bg-[#c0c0c0] text-black p-1 text-xs retro-outset shadow-lg"
              sideOffset={2}
            >
              {CATEGORIES.map(cat => (
                <DropdownMenu.Item
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    handleMenuClick();
                  }}
                  className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Folder className="w-3.5 h-3.5 text-yellow-600" /> {cat.name}
                  </span>
                  {currentCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Themes Menu (Authentic Light Windows Classic Schemes) */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={handleMenuClick}
              className="px-2 py-0.5 hover:bg-[#000080] hover:text-white focus:outline-none rounded-xs font-normal"
            >
              <u>T</u>hemes
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[210px] bg-[#c0c0c0] text-black p-1 text-xs retro-outset shadow-lg"
              sideOffset={2}
            >
              <DropdownMenu.Item
                onClick={() => setTheme('win98')}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span>🪟 Windows 98 Standard</span>
                {theme === 'win98' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('win98-desert')}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span>🏜️ Windows 98 Desert</span>
                {theme === 'win98-desert' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('win98-rose')}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span>🌸 Windows 98 Rose / Lilac</span>
                {theme === 'win98-rose' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('winme')}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span>💿 Windows ME / 2000</span>
                {theme === 'winme' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('winxp')}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span>🟦 Windows XP (Luna Blue)</span>
                {theme === 'winxp' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setTheme('winxp-silver')}
                className="flex items-center justify-between px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <span>🪙 Windows XP (Silver Edition)</span>
                {theme === 'winxp-silver' && <Check className="w-3.5 h-3.5" />}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Options & Sound */}
        <button
          onClick={toggleSound}
          className="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-xs flex items-center gap-1 font-normal ml-auto"
          title={soundEnabled ? 'Mute Retro PC Sound FX' : 'Enable Retro PC Sound FX'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-800" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Audio: ON' : 'Audio: OFF'}</span>
        </button>

        {/* Help Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={handleMenuClick}
              className="px-2 py-0.5 hover:bg-[#000080] hover:text-white focus:outline-none rounded-xs font-normal"
            >
              <u>H</u>elp
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] bg-[#c0c0c0] text-black p-1 text-xs retro-outset shadow-lg"
              sideOffset={2}
            >
              <DropdownMenu.Item
                onClick={() => {
                  setIsAboutOpen(true);
                  handleMenuClick();
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About Microsoft Clip Gallery...</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  window.open('https://archive.org/download/MS_Clipart_Collection_SVG', '_blank');
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer outline-none rounded-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Internet Archive Preservation</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* About Dialog Modal */}
      <Dialog.Root open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <Dialog.Content className="w-full max-w-md bg-[#c0c0c0] text-black p-4 retro-outset shadow-2xl relative select-none">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-zinc-400">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>🖼️</span> Microsoft Clip Gallery 5.0
                </div>
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white retro-outset text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex items-center gap-3 p-2 bg-white rounded retro-inset">
                  <div className="text-3xl">🖹</div>
                  <div>
                    <h4 className="font-bold text-sm">Microsoft Clip Gallery</h4>
                    <p className="text-[11px] text-zinc-600">
                      Office 97, 2000 & XP Legendary Vector Archive
                    </p>
                  </div>
                </div>

                <p>
                  This web application faithfully preserves and serves the iconic <strong>57,000+ vector illustrations</strong> originally bundled in Microsoft Office 97 & Office 2000 CDs.
                </p>

                <p className="text-zinc-700">
                  Rescued and converted from vintage .WMF binaries into modern, crisp <strong>.SVG</strong> vector files hosted on the <strong>Internet Archive</strong>.
                </p>

                <div className="p-2 bg-blue-50 border border-blue-200 rounded font-mono text-[10px]">
                  Preserved Collection: MS_Clipart_Collection_SVG<br />
                  Total Files: ~57,026 SVGs<br />
                  Formats: Scalable Vector Graphics (SVG), High-Res PNG
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsAboutOpen(false)}
                    className="px-4 py-1.5 bg-[#c0c0c0] hover:bg-zinc-300 font-bold retro-outset text-xs"
                  >
                    OK
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
