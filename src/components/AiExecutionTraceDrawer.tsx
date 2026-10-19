'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Database,
  Cpu,
  Layers,
  Copy,
  Check,
  Zap,
  Clock,
  Code2,
  Terminal,
  Share2,
} from 'lucide-react';
import { onAppEvent } from '@/lib/events';

export interface ExecutionTraceData {
  query: string;
  response: string;
  timestamp: string;
  model: string;
  totalLatencyMs: number;
  inputTokens: number;
  outputTokens: number;
  tokensPerSec: number;
  steps: {
    name: string;
    type: 'router' | 'retrieval' | 'assembly' | 'inference';
    latencyMs: number;
    details: string;
    metadata?: Record<string, any>;
  }[];
  retrievedChunks?: {
    id: string;
    similarity: number;
    source: string;
    snippet: string;
  }[];
}

export const DEFAULT_TRACE_SAMPLE: ExecutionTraceData = {
  query: 'How does Omkar structure Flutter apps with Clean Architecture and Riverpod?',
  response:
    'Omkar utilizes a feature-first Clean Architecture divided into Presentation, Domain, and Data layers. Riverpod providers manage unidirectional reactive data flow, decoupling UI from business logic.',
  timestamp: new Date().toISOString(),
  model: 'llama-3.3-70b-versatile (Groq LPU)',
  totalLatencyMs: 194,
  inputTokens: 412,
  outputTokens: 188,
  tokensPerSec: 148,
  steps: [
    {
      name: 'Query Intent Classifier',
      type: 'router',
      latencyMs: 16,
      details: 'Classified domain as MOBILE_SYSTEMS · ARCHITECTURE with confidence 0.99',
      metadata: { route: 'rag_flutter_knowledge_pipeline', confidence: 0.99 },
    },
    {
      name: 'ChromaDB Vector Retrieval',
      type: 'retrieval',
      latencyMs: 32,
      details: 'Queried vector store with top_k=3 embeddings; threshold=0.75',
      metadata: { metric: 'cosine_similarity', index_size: '128_vectors' },
    },
    {
      name: 'Context Augmentation & Prompt Assembler',
      type: 'assembly',
      latencyMs: 8,
      details: 'Merged system persona with retrieved knowledge fragments into context window',
      metadata: { prompt_tokens: 412, context_window_fill: '5.1%' },
    },
    {
      name: 'Groq LPU LLM Inference',
      type: 'inference',
      latencyMs: 138,
      details: 'Streamed completion tokens via ultra-low latency hardware acceleration',
      metadata: { tokens: 188, speed: '148 tokens/sec', finish_reason: 'stop' },
    },
  ],
  retrievedChunks: [
    {
      id: 'chunk-flutter-clean-arch-01',
      similarity: 0.942,
      source: 'data/experience.ts [Metaphi]',
      snippet:
        'Architecting modular mobile interfaces with Clean Architecture and Riverpod reactive state management with compile-safe DI.',
    },
    {
      id: 'chunk-flutter-projects-smart-presence',
      similarity: 0.891,
      source: 'data/projects.ts [Smart Presence]',
      snippet:
        'Production mobile attendance platform with Flutter & Riverpod delivering 60fps mobile interfaces across iOS and Android.',
    },
    {
      id: 'chunk-tech-stack-riverpod',
      similarity: 0.835,
      source: 'data/techStack.ts',
      snippet:
        'State Management: Riverpod, BLoC, Clean Architecture, Repository Pattern with immutable state models.',
    },
  ],
};

export default function AiExecutionTraceDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'retrieval' | 'json'>('pipeline');
  const [trace, setTrace] = useState<ExecutionTraceData>(DEFAULT_TRACE_SAMPLE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return onAppEvent('OPEN_TRACE_INSPECTOR', (data) => {
      if (data) setTrace(data);
      setIsOpen(true);
    });
  }, []);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-xl h-full bg-[#0d1017] border-l border-white/15 text-neutral-100 shadow-2xl flex flex-col font-sans select-none z-10"
            role="dialog"
            aria-label="AI Execution Trace Inspector"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    LangGraph Execution Trace
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      SUCCESS · 200 OK
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Telemetry &amp; RAG Vector Inspector
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyJson}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                  title="Copy full trace JSON"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>JSON</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-white/10 bg-black/40 font-mono text-xs">
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-neutral-400 block">TOTAL LATENCY</span>
                <span className="text-white font-bold text-sm text-emerald-400">
                  {trace.totalLatencyMs}ms
                </span>
              </div>
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-neutral-400 block">TOKENS/SEC</span>
                <span className="text-white font-bold text-sm text-sky-400">
                  {trace.tokensPerSec}
                </span>
              </div>
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-neutral-400 block">IN/OUT TOKENS</span>
                <span className="text-white font-bold text-sm">
                  {trace.inputTokens}/{trace.outputTokens}
                </span>
              </div>
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                <span className="text-[10px] text-neutral-400 block">INFERENCE MODEL</span>
                <span className="text-white font-bold text-[11px] truncate block text-amber-400">
                  Llama 3.3 70B
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-white/10 bg-white/[0.01]">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'pipeline'
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Pipeline DAG Steps ({trace.steps.length})
              </button>
              <button
                onClick={() => setActiveTab('retrieval')}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'retrieval'
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Vector Matches ({trace.retrievedChunks?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Raw Payload
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'pipeline' && (
                <div className="space-y-3">
                  {trace.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 pb-2 before:absolute before:left-2 before:top-3 before:bottom-0 before:w-0.5 before:bg-white/10 last:before:hidden"
                    >
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>

                      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white tracking-tight">
                            {idx + 1}. {step.name}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {step.latencyMs}ms
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed mb-2">
                          {step.details}
                        </p>

                        {step.metadata && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5 font-mono text-[10px]">
                            {Object.entries(step.metadata).map(([k, v]) => (
                              <span
                                key={k}
                                className="bg-white/5 px-2 py-0.5 rounded text-neutral-400"
                              >
                                {k}: <strong className="text-neutral-200">{String(v)}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'retrieval' && (
                <div className="space-y-3">
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-neutral-300">
                    <span className="font-semibold text-white block mb-0.5">
                      ChromaDB Similarity Retrieval
                    </span>
                    Similarity metric: Cosine distance over high-dimensional vector embeddings. Top 3 matched chunks injected into system context window.
                  </div>

                  {trace.retrievedChunks?.map((chunk, i) => (
                    <div
                      key={chunk.id}
                      className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-sky-400 truncate max-w-[240px]">
                          {chunk.source}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span className="text-neutral-400 text-[10px]">SCORE</span>
                          <span className="text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            {(chunk.similarity * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 italic bg-black/30 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                        &ldquo;{chunk.snippet}&rdquo;
                      </p>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        Chunk ID: {chunk.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'json' && (
                <div className="relative">
                  <pre className="bg-black/60 border border-white/10 p-4 rounded-xl text-[11px] font-mono text-emerald-400/90 overflow-x-auto max-h-[460px] scrollbar-thin">
                    {JSON.stringify(trace, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>LangGraph v0.2.16 · Groq LPU</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Telemetry Ready
              </span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
