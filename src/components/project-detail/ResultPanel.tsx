'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ProjectMetric, ProjectMedia } from '@/data/projects';
import {
  X,
  ZoomIn,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface ResultPanelProps {
  result: string;
  metrics?: ProjectMetric[];
  media?: ProjectMedia[];
}

export function ResultPanel({ result, metrics, media }: ResultPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeMedia, setActiveMedia] = useState<ProjectMedia | null>(null);

  // Split result to highlight the first sentence as lead
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
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      variants={prefersReducedMotion ? undefined : staggerContainer(0.08)}
      className="space-y-8"
    >
      {/* Outcome narrative */}
      <motion.div
        variants={prefersReducedMotion ? undefined : fadeUp}
        className="bg-white border border-[rgba(17,18,21,0.08)] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[rgba(17,18,21,0.06)]">
          <Sparkles className="w-4 h-4 text-[#eb4c2a]" />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#111215]">
            What happened
          </span>
        </div>

        <blockquote className="border-l-[3px] border-[#eb4c2a] pl-5 sm:pl-6">
          <p className="font-sans text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-[#111215] leading-snug">
            &ldquo;{firstSentence}&rdquo;
          </p>
        </blockquote>

        {remainingSentences && (
          <p className="font-sans text-sm sm:text-base text-[#565862] leading-relaxed max-w-4xl pl-5 sm:pl-6">
            {remainingSentences}
          </p>
        )}

        <div className="flex items-center gap-1.5 pt-2 pl-5 sm:pl-6">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="font-mono text-[10px] font-semibold text-[#10b981] uppercase tracking-wider">
            Shipped & functional
          </span>
        </div>
      </motion.div>

      {/* Metrics grid */}
      {hasMetrics && (
        <motion.div
          variants={prefersReducedMotion ? undefined : fadeUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label || idx}
              variants={prefersReducedMotion ? undefined : fadeUp}
              className="group relative bg-white border border-[rgba(17,18,21,0.08)] rounded-2xl p-5 sm:p-6 hover:border-[#eb4c2a]/30 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Decorative accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#eb4c2a] to-[#eb4c2a]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#8a8c98] block mb-2 font-medium group-hover:text-[#eb4c2a] transition-colors">
                {metric.label}
              </span>
              <span className="font-display text-2xl lg:text-3xl font-black text-[#111215] tracking-tight block">
                {metric.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Media Gallery */}
      {hasMedia && (
        <motion.div variants={prefersReducedMotion ? undefined : fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#565862]">
              Project media
            </span>
            <span className="font-mono text-[10px] text-[#8a8c98]">
              Click to expand
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item, idx) => (
              <button
                key={item.src || idx}
                type="button"
                onClick={() => setActiveMedia(item)}
                className="group relative aspect-video rounded-xl overflow-hidden border border-[rgba(17,18,21,0.08)] bg-[#f2f1ea] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a] text-left"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#111215]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <ZoomIn className="w-5 h-5 drop-shadow" />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                  <p className="font-mono text-[10px] text-white/95 truncate">
                    {item.alt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lightbox Modal */}
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
              className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl p-2"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(17,18,21,0.08)]">
                <span className="font-mono text-xs text-[#565862] truncate pr-4">
                  {activeMedia.alt}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="p-1.5 rounded-lg hover:bg-[#f2f1ea] text-[#111215] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black/5 mt-2 rounded-lg overflow-hidden">
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

export default ResultPanel;
