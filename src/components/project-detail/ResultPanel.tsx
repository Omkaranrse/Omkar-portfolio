'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ProjectMetric, ProjectMedia } from '@/data/projects';
import { X, ZoomIn, CheckCircle } from 'lucide-react';

interface ResultPanelProps {
  result: string;
  metrics?: ProjectMetric[];
  media?: ProjectMedia[];
}

export function ResultPanel({ result, metrics, media }: ResultPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeMedia, setActiveMedia] = useState<ProjectMedia | null>(null);

  // Split result to highlight the first sentence if long
  const sentences = result.split(/(?<=[.?!])\s+/);
  const firstSentence = sentences[0] || result;
  const remainingSentences = sentences.slice(1).join(' ');

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveMedia(null);
    }
  }, []);

  useEffect(() => {
    if (activeMedia) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMedia, handleKeyDown]);

  const hasMetrics = metrics && metrics.length > 0;
  const hasMedia = media && media.length > 0;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_16px_rgba(17,18,21,0.03)] hover:shadow-[0_8px_24px_rgba(17,18,21,0.06)] hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Eyebrow badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-[#111215]" />
        <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#111215]">
          IMPACT & OUTCOMES
        </span>
      </div>

      {/* Narrative pull-quote and description */}
      <div className="space-y-4 mb-8">
        <p className="font-sans text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-[#111215] leading-snug">
          &ldquo;{firstSentence}&rdquo;
        </p>
        {remainingSentences && (
          <p className="font-sans text-sm sm:text-base text-[#565862] leading-relaxed max-w-3xl">
            {remainingSentences}
          </p>
        )}
      </div>

      {/* Metrics Row */}
      {hasMetrics && (
        <div className="pt-6 pb-2 border-t border-[rgba(17,18,21,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {metrics.map((metric, idx) => (
              <div
                key={metric.label || idx}
                className="bg-[#f8f8f5] border border-[rgba(17,18,21,0.06)] rounded-[2px] p-4 flex flex-col justify-between"
              >
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#565862] mb-1">
                  {metric.label}
                </span>
                <span className="font-sans text-2xl lg:text-3xl font-extrabold text-[#111215] tracking-tight">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Gallery / Lightbox Thumbnails */}
      {hasMedia && (
        <div className="mt-8 pt-6 border-t border-[rgba(17,18,21,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#565862]">
              PROJECT MEDIA & ARTIFACTS
            </span>
            <span className="font-mono text-[10px] text-[#8a8c98]">
              Click image to inspect
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item, idx) => (
              <button
                key={item.src || idx}
                type="button"
                onClick={() => setActiveMedia(item)}
                className="group relative aspect-video rounded-[2px] overflow-hidden border border-[rgba(17,18,21,0.08)] bg-[#f2f1ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a] text-left"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#111215]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <ZoomIn className="w-5 h-5 drop-shadow" />
                  <span className="font-mono text-xs font-medium tracking-wide drop-shadow">
                    View
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="font-mono text-[10px] text-white/90 truncate">{item.alt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Accessible Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeMedia.alt}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111215]/80 backdrop-blur-sm"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-[2px] overflow-hidden border border-white/20 shadow-2xl p-2"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(17,18,21,0.08)]">
                <span className="font-mono text-xs text-[#565862] truncate pr-4">
                  {activeMedia.alt}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="p-1 rounded-[2px] hover:bg-[#f2f1ea] text-[#111215] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black/5 mt-2">
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
