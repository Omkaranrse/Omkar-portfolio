'use client';

import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import {
  ExternalLink,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Database,
  Cpu,
  FileSpreadsheet,
  FileText,
  Search,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  GitBranch,
} from 'lucide-react';

interface ProjectHeroProps {
  project: Project;
  prevProject?: Project;
  nextProject?: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'analytics' | 'trace' | 'schema'>('analytics');
  const primaryMedia = project.media && project.media.length > 0 ? project.media[0] : null;

  return (
    <header className="relative pt-24 pb-16 sm:pb-20 border-b border-[rgba(17,18,21,0.08)] bg-[#f7f6f0] overflow-hidden">
      {/* Editorial ambient spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 pointer-events-none opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(235, 76, 42, 0.08) 0%, rgba(247, 246, 240, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle crumpled paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply bg-repeat"
        style={{
          backgroundImage: "url('/textures/crumpled-paper.jpg')",
          backgroundSize: '800px 800px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 12-Column Hero Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Project Info (6 cols on desktop) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Monospace Eyebrow in vermilion/orange-red */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#eb4c2a]/10 border border-[#eb4c2a]/20 font-mono text-[11px] font-bold uppercase tracking-wider text-[#eb4c2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] animate-pulse" />
                {project.number}
              </span>

              <div className="flex items-center gap-2 font-mono text-xs text-[#565862]">
                <span className="font-semibold text-[#111215] uppercase tracking-wide">
                  {project.category}
                </span>
                <span className="text-[#8a8c98]">·</span>
                <span>{project.year}</span>
              </div>
            </div>

            {/* Title: Bold geometric sans, tight tracking */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-black text-[#111215] tracking-[-0.035em] font-display leading-[1.06]">
              {project.title}
            </h1>

            {/* Short description */}
            <p className="text-base sm:text-lg text-[#565862] leading-relaxed max-w-2xl font-sans">
              {project.shortDesc}
            </p>

            {/* Role & Focus Points Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-mono font-medium bg-[#111215] text-[#f8f8f5] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a]" />
                Role: {project.role}
              </span>

              {project.focusPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-[2px] text-xs font-mono text-[#565862] bg-white border border-[rgba(17,18,21,0.08)] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {point}
                </span>
              ))}
            </div>

            {/* Links / GitHub Action Buttons with magnetic hover feel */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold bg-[#111215] text-white shadow-[0_4px_16px_rgba(17,18,21,0.18)] hover:bg-[#eb4c2a] hover:shadow-[0_8px_24px_rgba(235,76,42,0.3)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
                    whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                    whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  >
                    <span>View {link.label} Repository</span>
                    <ExternalLink className="w-4 h-4 opacity-80" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: High-End Live Interactive Application Mockup (6 cols on desktop) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[12px] bg-[#0e1015] border border-[rgba(255,255,255,0.12)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
              {/* Top macOS Browser Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#16181f] border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a0c10] border border-[rgba(255,255,255,0.08)] text-[11px] font-mono text-[#8a8c98]">
                  <span className="text-[#00ffcc]">https://</span>
                  <span className="text-white">datamind.ai/workspace/demo</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-ping ml-1" />
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-[#00ffcc]">
                  <Activity className="w-3 h-3" />
                  <span>24ms</span>
                </div>
              </div>

              {/* Subheader Toolbar & Interactive Tabs */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#12141a] border-b border-[rgba(255,255,255,0.06)] text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-[#eb4c2a] text-white font-bold'
                        : 'text-[#8a8c98] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    AI Insights
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('trace')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      activeTab === 'trace'
                        ? 'bg-[#eb4c2a] text-white font-bold'
                        : 'text-[#8a8c98] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    LangGraph Trace
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('schema')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      activeTab === 'schema'
                        ? 'bg-[#eb4c2a] text-white font-bold'
                        : 'text-[#8a8c98] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Data Preview
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#8a8c98]">
                  <Database className="w-3 h-3 text-[#eb4c2a]" />
                  <span>ChromaDB: 14.8k Chunks</span>
                </div>
              </div>

              {/* Mockup Body Content */}
              <div className="p-4 sm:p-5 space-y-4 min-h-[340px]">
                {/* Simulated Natural Language Prompt Input Bar */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#181b23] border border-[rgba(255,255,255,0.1)] text-xs font-mono shadow-inner">
                  <Search className="w-4 h-4 text-[#eb4c2a] flex-shrink-0" />
                  <span className="text-white font-medium truncate">
                    &quot;Identify top 3 drivers of Q3 churn and compare MRR impact&quot;
                  </span>
                  <span className="ml-auto px-2 py-0.5 rounded bg-[#eb4c2a]/20 text-[#eb4c2a] text-[10px] font-bold">
                    SUBMITTED
                  </span>
                </div>

                {activeTab === 'analytics' && (
                  <div className="space-y-3.5">
                    {/* Streaming Agent Response Box */}
                    <div className="p-3.5 rounded-lg bg-[#141720] border border-[rgba(255,255,255,0.08)] space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#00ffcc] flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          DataMind RAG Agent (Groq Llama-3-70B)
                        </span>
                        <span className="text-[#8a8c98]">Match score: 94.6%</span>
                      </div>
                      <p className="text-xs text-[#d1d5db] leading-relaxed">
                        Analyzed 4,200 records across Q3 financial sheets. Revenue reached <strong className="text-white">$2.29M (+24.3%)</strong>, but enterprise churn peaked in August due to API integration latency (&gt;450ms).
                      </p>
                    </div>

                    {/* Interactive High-Res SVG Metric & Trend Visualizer */}
                    <div className="p-3.5 rounded-lg bg-[#12141c] border border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                        <span className="text-[#8a8c98] uppercase">Q2 vs Q3 Revenue & Churn Velocity</span>
                        <span className="text-[#10b981] font-bold">+$450K NET</span>
                      </div>

                      {/* SVG Line & Area Chart */}
                      <svg viewBox="0 0 400 110" className="w-full h-24 overflow-visible">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#eb4c2a" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#eb4c2a" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Subtle Gridlines */}
                        <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="0" y1="55" x2="400" y2="55" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                        {/* Shaded Area */}
                        <path
                          d="M 10 90 Q 90 75, 170 50 T 270 30 T 390 15 L 390 100 L 10 100 Z"
                          fill="url(#chartGradient)"
                        />

                        {/* Glowing Curve */}
                        <path
                          d="M 10 90 Q 90 75, 170 50 T 270 30 T 390 15"
                          fill="none"
                          stroke="#eb4c2a"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Data Points */}
                        <circle cx="10" cy="90" r="3.5" fill="#eb4c2a" />
                        <circle cx="170" cy="50" r="3.5" fill="#eb4c2a" />
                        <circle cx="270" cy="30" r="3.5" fill="#eb4c2a" />
                        <circle cx="390" cy="15" r="4.5" fill="#ffffff" stroke="#eb4c2a" strokeWidth="2.5" />
                      </svg>
                    </div>

                    {/* Bottom KPI Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-[#181b23] border border-[rgba(255,255,255,0.06)] text-center">
                        <span className="text-[#8a8c98] block text-[9px]">TOKEN RATE</span>
                        <span className="text-white font-bold">840 T/s</span>
                      </div>
                      <div className="p-2 rounded bg-[#181b23] border border-[rgba(255,255,255,0.06)] text-center">
                        <span className="text-[#8a8c98] block text-[9px]">CHROMA LATENCY</span>
                        <span className="text-[#00ffcc] font-bold">42ms</span>
                      </div>
                      <div className="p-2 rounded bg-[#181b23] border border-[rgba(255,255,255,0.06)] text-center">
                        <span className="text-[#8a8c98] block text-[9px]">RECALL</span>
                        <span className="text-[#10b981] font-bold">96.8%</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'trace' && (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-[#151821] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                      <span className="text-[#00ffcc] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                        1. Query Rewriter
                      </span>
                      <span className="text-[#8a8c98] text-[10px]">18ms · Generated 3 vectors</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#151821] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                      <span className="text-[#00ffcc] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                        2. ChromaDB Hybrid Search
                      </span>
                      <span className="text-[#8a8c98] text-[10px]">42ms · Top-k=5 retrieved</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#151821] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                      <span className="text-[#00ffcc] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                        3. Cross-Encoder Re-ranker
                      </span>
                      <span className="text-[#8a8c98] text-[10px]">24ms · 2 chunks filtered</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#151821] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                      <span className="text-[#eb4c2a] flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-[#eb4c2a] animate-spin" />
                        4. Groq Llama-3-70B Synthesis
                      </span>
                      <span className="text-[#00ffcc] text-[10px]">190ms · 410 tokens</span>
                    </div>
                  </div>
                )}

                {activeTab === 'schema' && (
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-[#151821] border border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center gap-2 text-[#00ffcc] text-[11px] mb-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Q3_P&L_Financial_Report.csv (1.4MB, 4,200 rows)</span>
                      </div>
                      <div className="text-[10px] text-[#8a8c98] space-y-1">
                        <div>Headers: [date, cohort_id, plan_tier, mrr, churn_status, latency_ms]</div>
                        <div className="text-[#10b981]">Embedding: text-embedding-3-small (1536 dim)</div>
                        <div className="text-white/80">Indexing Strategy: Recursive Character (500 tokens, 50 overlap)</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-[#151821] border border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center gap-2 text-[#00ffcc] text-[11px] mb-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#eb4c2a]" />
                        <span>Annual_Customer_Retention_Brief_2024.pdf (820KB)</span>
                      </div>
                      <div className="text-[10px] text-[#8a8c98]">
                        Parsed via PyMuPDF · 48 semantic sections · Vector indexed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { ProjectHero };
