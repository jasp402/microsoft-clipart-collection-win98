'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff, RefreshCw } from 'lucide-react';

interface LazySvgImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onClick?: () => void;
  priority?: boolean;
}

export const LazySvgImage = React.memo(function LazySvgImage({
  src,
  alt,
  className = '',
  onClick,
  priority = false,
}: LazySvgImageProps) {
  const [isInView, setIsInView] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (priority) return;
    const currentElem = containerRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '250px', // preload before reaching viewport
        threshold: 0.01,
      }
    );

    observer.observe(currentElem);
    return () => {
      observer.disconnect();
    };
  }, [priority, retryKey]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoaded(false);
    setRetryKey(k => k + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
      onClick={onClick}
    >
      <AnimatePresence mode="wait">
        {!isLoaded && !hasError && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 p-2"
          >
            {/* Retro 90s placeholder pixel frame */}
            <div className="w-8 h-8 rounded border border-dashed border-zinc-400 flex items-center justify-center opacity-70">
              <span className="text-[9px] font-mono font-bold text-zinc-500">SVG</span>
            </div>
          </motion.div>
        )}

        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-red-50 text-zinc-600 text-center"
          >
            <ImageOff className="w-5 h-5 text-red-400 mb-1" />
            <span className="text-[10px] text-zinc-600">Offline</span>
            <button
              onClick={handleRetry}
              className="mt-1 px-1.5 py-0.5 text-[9px] bg-[#c0c0c0] hover:bg-zinc-300 text-zinc-900 rounded-xs flex items-center gap-1 retro-outset"
              title="Reintentar carga"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {isInView && !hasError && (
        <img
          key={`${src}-${retryKey}`}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={() => {
            setHasError(true);
            setIsLoaded(false);
          }}
          className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});
