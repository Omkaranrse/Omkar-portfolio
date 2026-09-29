'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ProjectMetric, ProjectMedia } from '@/data/projects';
import {
  X,
  ZoomIn,
  TrendingUp,
  Sparkles,
  Play,
  Terminal,
  FileText,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ResultPanelProps {
  result: string;
  metrics?: ProjectMetric[];
  media?: ProjectMedia[];
}

interface DemoQuery {
  id: string;
  prompt: string;
  latency: string;
  source: string;
  summary: string;
  stats: { label: string; val: string }[];
}

const DEMO_QUERIES: DemoQuery[] = [
  {
    id: 'q1',
    prompt: 'Compare Q2 vs Q3 MRR across enterprise tiers and flag anomalies',
    latency: '240ms',
    source: 'Q3_Financials_Consolidated.csv (p. 12)',
    summary:
      'Q3 Enterprise MRR reached $1.82M (+28.4% YoY). However, renewal cycle duration lengthened from 18 days to 32 days in August due to security review backlogs.',
    stats: [
      { label: 'Q3 Revenue', val: '$1.82M' },
      { label: 'Net Growth', val: '+28.4%' },
      { label: 'Confidence', val: '98.2%' },
    ],
  },
  {
    id: 'q2',
    prompt: 'Summarize top 3 causes of user churn cited in exit interviews',
    latency: '190ms',
    source: 'Customer_Exit_Survey_2024.pdf (Sec. 4)',
    summary:
      '1. Latency on complex nested aggregations (>8s prior to caching).\n2. Absence of self-service CSV formula editor.\n3. Delayed webhook sync with customer Salesforce instances.',
    stats: [
      { label: 'Interviews', val: '142' },
      { label: 'Primary Cause', val: 'Query Latency' },
      { label: 'Severity', val: 'High' },
    ],
  },
  {
    id: 'q3',
    prompt: 'Generate an executive summary of vector store token efficiency',
    latency: '310ms',
    source: 'RAG_Benchmark_Telemetry_Report.csv',
    summary:
      'Semantic chunking with sliding windows cut context token payload by 38% compared to naive document dumping, reducing Groq token expenditure while improving MRR retrieval precision to 94.6%.',
    stats: [
      { label: 'Cost Cut', val: '-38%' },
      { label: 'Token Rate', val: '840 T/s' },
      { label: 'Avg Latency', val: '0.84s' },
    ],
  },
];

export function ResultPanel({ result, metrics, media }: ResultPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeMedia, setActiveMedia] = useState<ProjectMedia | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<DemoQuery>(DEMO_QUERIES[0]);

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
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[4px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(17,18,21,0.03)] hover:shadow-[0_10px_30px_rgba(17,18,21,0.06)] transition-all duration-300 space-y-8"
    >
      {/* Eyebrow badge */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,18,21,0.06)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#eb4c2a]" />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#111215]">
            MEASURABLE IMPACT & OUTCOMES
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#10b981] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          VERIFIED IN PROD
        </span>
      </div>

      {/* Narrative pull-quote and description */}
      <div className="space-y-4">
        <blockquote className="border-l-3 border-[#eb4c2a] pl-5 sm:pl-6 my-2">
          <p className="font-sans text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-[#111215] leading-snug">
            &ldquo;{firstSentence}&rdquo;
          </p>
        </blockquote>
        {remainingSentences && (
          <p className="font-sans text-sm sm:text-base text-[#565862] leading-relaxed max-w-4xl pl-5 sm:pl-6">
            {remainingSentences}
          </p>
        )}
      </div>

      {/* Metrics Row */}
      {hasMetrics && (
        <div className="pt-4">
          <div className="flex items-center gap-1.5 mb-4 text-[#8a8c98] font-mono text-[10px] uppercase tracking-wider font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-[#eb4c2a]" />
            KEY PERFORMANCE BENCHMARKS
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            {metrics.map((metric, idx) => (
              <div
                key={metric.label || idx}
                className="bg-[#fafaf7] border border-[rgba(17,18,21,0.08)] rounded-[4px] p-4 sm:p-5 flex flex-col justify-between hover:border-[#eb4c2a]/40 hover:bg-[#fffdfb] transition-all shadow-2xs group"
              >
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#565862] mb-1.5 font-medium group-hover:text-[#eb4c2a] transition-colors">
                  {metric.label}
                </span>
                <span className="font-sans text-2xl lg:text-3xl font-black text-[#111215] tracking-tight">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Production Verification Sandbox */}
      <div className="rounded-[8px] bg-[#0e1015] border border-[rgba(255,255,255,0.12)] p-5 sm:p-6 text-white space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#eb4c2a]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              LIVE INTERACTIVE QUERY VERIFICATION SANDBOX
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#00ffcc] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse" />
            Connected to ChromaDB RAG Vector Store
          </span>
        </div>

        {/* Query Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {DEMO_QUERIES.map((demo) => {
            const isSelected = selectedDemo.id === demo.id;
            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => setSelectedDemo(demo)}
                className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#eb4c2a] text-white font-bold shadow-md'
                    : 'bg-[#181a22] text-[#8a8c98] hover:text-white hover:bg-white/10'
                }`}
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span className="truncate max-w-[240px] sm:max-w-none">{demo.prompt}</span>
              </button>
            );
          })}
        </div>

        {/* Result Output Card */}
        <div className="p-4 rounded-lg bg-[#14161f] border border-[rgba(255,255,255,0.08)] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-[#00ffcc] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              Synthesized by Groq LPU (Llama-3-70B)
            </span>
            <div className="flex items-center gap-3 text-[#8a8c98] text-[10px]">
              <span>Latency: <strong className="text-white">{selectedDemo.latency}</strong></span>
              <span className="hidden sm:inline">Source: <strong className="text-white">{selectedDemo.source}</strong></span>
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#d1d5db] leading-relaxed whitespace-pre-line">
            {selectedDemo.summary}
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
            {selectedDemo.stats.map((s, idx) => (
              <div key={idx} className="p-2 rounded bg-[#0d0f14] text-center">
                <span className="text-[9px] text-[#8a8c98] block uppercase">{s.label}</span>
                <span className="text-white font-bold text-xs">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Gallery / Lightbox Thumbnails if present */}
      {hasMedia && (
        <div className="mt-8 pt-6 border-t border-[rgba(17,18,21,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#565862]">
              ARTIFACTS & PRODUCTION MEDIA
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
                <div className="absolute inset-0 bg-[#111215]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <ZoomIn className="w-5 h-5 drop-shadow" />
                  <span className="font-mono text-xs font-medium tracking-wide drop-shadow">
                    Inspect
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                  <p className="font-mono text-[10px] text-white/95 truncate">{item.alt}</p>
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
                  className="p-1.5 rounded-[2px] hover:bg-[#f2f1ea] text-[#111215] transition-colors"
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

export default ResultPanel;
