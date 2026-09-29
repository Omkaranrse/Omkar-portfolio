'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ArchNode, ProjectEdge } from '@/data/projects';
import {
  Network,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Database,
  ArrowRight,
  Server,
  Zap,
  ShieldCheck,
  Code2,
  GitBranch,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface ArchitectureDiagramProps {
  nodes: ArchNode[];
  edges?: ProjectEdge[];
}

interface DetailedNode {
  id: string;
  name: string;
  tag: string;
  role: string;
  protocol: string;
  latency: string;
  tech: string;
  payloadIn: string;
  payloadOut: string;
  icon: React.ElementType;
}

const DETAILED_SYSTEM_NODES: DetailedNode[] = [
  {
    id: 'client',
    name: 'Next.js 15 Client',
    tag: 'EDGE FRONTEND',
    role: 'Natural language input, real-time token streaming with SSE reader, optimistic chat cache',
    protocol: 'HTTPS / HTTP-2',
    latency: '< 15ms',
    tech: 'React 19, TypeScript, TailwindCSS',
    payloadIn: '{ query: "Analyze Q3 churn trends", file_ids: ["csv_902"] }',
    payloadOut: '{ event: "token", data: "Analyzed 4,200 records..." }',
    icon: Radio,
  },
  {
    id: 'gateway',
    name: 'FastAPI Gateway',
    tag: 'API & AUTH LAYER',
    role: 'Asynchronous REST gateway, JWT session validation, tenant data scoping, and rate limiting',
    protocol: 'Async ASGI / REST',
    latency: '8ms - 12ms',
    tech: 'FastAPI, Pydantic v2, Python 3.11',
    payloadIn: 'POST /api/v1/query { user_id: "usr_42", prompt: "..." }',
    payloadOut: 'EventStream Response (SSE chunked transfer)',
    icon: Server,
  },
  {
    id: 'langgraph',
    name: 'LangGraph State Machine',
    tag: 'COGNITIVE ENGINE',
    role: 'Cyclic state graph: query rewriter, intent classifier, conditional retrieval router, and hallucination checker',
    protocol: 'In-Process State Graph',
    latency: '24ms - 45ms',
    tech: 'LangGraph, LangChain Core',
    payloadIn: 'StateGraphContext { original_query, user_filters, history }',
    payloadOut: 'StateGraphContext { rewritten_queries: 3, top_chunks: 5 }',
    icon: GitBranch,
  },
  {
    id: 'vector',
    name: 'ChromaDB Vector Store',
    tag: 'EMBEDDINGS & RETRIEVAL',
    role: 'Cosine distance index, hybrid semantic + keyword filter over document embeddings (1536-dim)',
    protocol: 'Embedded Vector DB / IPC',
    latency: '35ms - 60ms',
    tech: 'ChromaDB, text-embedding-3-small',
    payloadIn: 'query_embedding: [0.0142, -0.0418, ...], top_k: 5',
    payloadOut: 'RetrievedDocuments [chunks: 5, avg_similarity: 0.946]',
    icon: Database,
  },
  {
    id: 'groq',
    name: 'Groq LPU Inference',
    tag: 'LLM REASONING',
    role: 'Ultra-low latency LLM inference executing Llama-3-70B with context grounded in retrieved chunks',
    protocol: 'Streaming HTTP/2',
    latency: '180ms - 240ms',
    tech: 'Groq Tensor Streaming Engine, Llama-3-70B',
    payloadIn: '{ system_prompt, context_chunks, user_query }',
    payloadOut: 'Token stream @ 840 Tokens/sec',
    icon: Zap,
  },
  {
    id: 'db',
    name: 'PostgreSQL Relational DB',
    tag: 'PERSISTENCE',
    role: 'User metadata, organization ACL permissions, chat history sessions, and audit logging',
    protocol: 'asyncpg / SSL',
    latency: '4ms - 8ms',
    tech: 'PostgreSQL 16, SQLAlchemy Async',
    payloadIn: 'INSERT INTO chat_sessions (id, user_id, telemetry)',
    payloadOut: 'OK (1 row committed)',
    icon: ShieldCheck,
  },
];

export default function ArchitectureDiagram({
  nodes,
  edges,
}: ArchitectureDiagramProps) {
  const reducedMotion = useReducedMotion();
  const [selectedNode, setSelectedNode] = useState<DetailedNode>(DETAILED_SYSTEM_NODES[0]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'topology' | 'rag' | 'metrics'>('topology');

  // Interactive step-by-step query simulation
  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(0);

    const stepIntervals = [0, 1, 2, 3, 4, 5];
    stepIntervals.forEach((step, idx) => {
      setTimeout(() => {
        setActiveStep(step);
        setSelectedNode(DETAILED_SYSTEM_NODES[step]);
        if (idx === stepIntervals.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
          }, 1200);
        }
      }, idx * 700);
    });
  };

  return (
    <div className="relative rounded-[8px] bg-[#101217] text-white border border-[rgba(255,255,255,0.12)] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(235, 76, 42, 0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* Ambient gradient glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #eb4c2a 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Blueprint Header & Interactive Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[rgba(255,255,255,0.1)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eb4c2a] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#eb4c2a]">
              HIGH-CONCURRENCY SYSTEM ARCHITECTURE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
            DataMind AI Production System Topology
          </h3>
        </div>

        {/* View Switcher & Live Simulation Trigger Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-full bg-[#181a22] border border-[rgba(255,255,255,0.08)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('topology')}
              className={`px-3 py-1 rounded-full transition-colors ${
                activeTab === 'topology' ? 'bg-[#eb4c2a] text-white font-bold' : 'text-[#8a8c98] hover:text-white'
              }`}
            >
              System Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rag')}
              className={`px-3 py-1 rounded-full transition-colors ${
                activeTab === 'rag' ? 'bg-[#eb4c2a] text-white font-bold' : 'text-[#8a8c98] hover:text-white'
              }`}
            >
              RAG Loop
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1 rounded-full transition-colors ${
                activeTab === 'metrics' ? 'bg-[#eb4c2a] text-white font-bold' : 'text-[#8a8c98] hover:text-white'
              }`}
            >
              Latency Profiler
            </button>
          </div>

          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all shadow-md ${
              isSimulating
                ? 'bg-[#eb4c2a] text-white animate-pulse'
                : 'bg-white text-[#111215] hover:bg-[#eb4c2a] hover:text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Packet...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Query Flow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'topology' && (
        <div className="relative z-10 space-y-8">
          {/* Interactive Topology Node Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DETAILED_SYSTEM_NODES.map((node, idx) => {
              const isSelected = selectedNode.id === node.id;
              const isSimActive = activeStep === idx;
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`group relative p-5 rounded-lg border cursor-pointer transition-all duration-300 ${
                    isSimActive
                      ? 'bg-[#1e1418] border-[#eb4c2a] ring-2 ring-[#eb4c2a]/40 shadow-[0_0_24px_rgba(235,76,42,0.3)] scale-[1.02]'
                      : isSelected
                      ? 'bg-[#1a1c24] border-[#eb4c2a]/80 shadow-[0_4px_20px_rgba(235,76,42,0.15)]'
                      : 'bg-[#15171f] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[#181b24]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] font-bold text-[#eb4c2a] uppercase tracking-wider">
                      0{idx + 1}. {node.tag}
                    </span>
                    <span className="font-mono text-[10px] text-[#00ffcc] flex items-center gap-1 font-semibold">
                      <Zap className="w-3 h-3" />
                      {node.latency}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSimActive
                          ? 'bg-[#eb4c2a] text-white'
                          : isSelected
                          ? 'bg-[#eb4c2a]/20 text-[#eb4c2a]'
                          : 'bg-white/5 text-[#8a8c98] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-mono font-bold text-base text-white group-hover:text-[#eb4c2a] transition-colors truncate">
                      {node.name}
                    </div>
                  </div>

                  <p className="text-xs text-[#9698a3] line-clamp-2 leading-relaxed mb-3">
                    {node.role}
                  </p>

                  <div className="pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] font-mono text-[#8a8c98]">
                    <span>{node.protocol}</span>
                    <span className="text-[#00ffcc]">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Deep Dive Inspector Box */}
          <div className="p-6 rounded-lg bg-[#161821] border border-[rgba(255,255,255,0.12)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#eb4c2a] flex items-center justify-center text-white">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#eb4c2a] uppercase font-bold tracking-wider block">
                    ACTIVE ARCHITECTURAL INSPECTOR
                  </span>
                  <h4 className="font-mono font-bold text-lg text-white">
                    {selectedNode.name} · ({selectedNode.tech})
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#8a8c98]">Protocol:</span>
                <span className="text-white px-2.5 py-0.5 rounded bg-white/10">{selectedNode.protocol}</span>
                <span className="text-[#8a8c98]">Latency:</span>
                <span className="text-[#00ffcc] font-bold">{selectedNode.latency}</span>
              </div>
            </div>

            <p className="text-sm text-[#c4c7d0] leading-relaxed">
              {selectedNode.role}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded bg-[#0e1015] border border-[rgba(255,255,255,0.08)] space-y-1.5 font-mono text-xs">
                <span className="text-[#eb4c2a] text-[10px] font-bold uppercase tracking-wider block">
                  INCOMING TELEMETRY / PAYLOAD
                </span>
                <code className="text-[#00ffcc] block overflow-x-auto whitespace-pre-wrap break-all">
                  {selectedNode.payloadIn}
                </code>
              </div>

              <div className="p-3.5 rounded bg-[#0e1015] border border-[rgba(255,255,255,0.08)] space-y-1.5 font-mono text-xs">
                <span className="text-[#10b981] text-[10px] font-bold uppercase tracking-wider block">
                  OUTGOING REASONING / RESPONSE
                </span>
                <code className="text-white/90 block overflow-x-auto whitespace-pre-wrap break-all">
                  {selectedNode.payloadOut}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rag' && (
        <div className="relative z-10 space-y-6">
          <div className="p-6 rounded-lg bg-[#151720] border border-[rgba(255,255,255,0.08)]">
            <h4 className="font-mono text-base font-bold text-white mb-2">
              End-to-End RAG Ingestion & Vector Retrieval Pipeline
            </h4>
            <p className="text-xs text-[#9698a3] mb-6">
              How user documents transition from unstructured raw files into semantic vector coordinates and verified grounded answers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded bg-[#101218] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[#eb4c2a] font-bold text-[10px]">STEP 01</span>
                <h5 className="font-bold text-white text-sm">Parser & Normalizer</h5>
                <p className="text-[#8a8c98] text-[11px] leading-relaxed">
                  PyMuPDF for PDF text streams; CSV recursive row sanitizer; stripping metadata bloat.
                </p>
              </div>

              <div className="p-4 rounded bg-[#101218] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[#eb4c2a] font-bold text-[10px]">STEP 02</span>
                <h5 className="font-bold text-white text-sm">Recursive Chunker</h5>
                <p className="text-[#8a8c98] text-[11px] leading-relaxed">
                  500 token sliding windows with 50 token overlap; preserves paragraph semantics.
                </p>
              </div>

              <div className="p-4 rounded bg-[#101218] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[#eb4c2a] font-bold text-[10px]">STEP 03</span>
                <h5 className="font-bold text-white text-sm">1536-Dim Embeddings</h5>
                <p className="text-[#8a8c98] text-[11px] leading-relaxed">
                  OpenAI text-embedding-3-small vectors indexed into local ChromaDB collection.
                </p>
              </div>

              <div className="p-4 rounded bg-[#101218] border border-[rgba(255,255,255,0.06)] space-y-2">
                <span className="text-[#00ffcc] font-bold text-[10px]">STEP 04</span>
                <h5 className="font-bold text-white text-sm">Cross-Encoder Re-rank</h5>
                <p className="text-[#8a8c98] text-[11px] leading-relaxed">
                  Calculates cross-attention score to eliminate irrelevant chunks before LLM ingestion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="relative z-10 space-y-6">
          <div className="p-6 rounded-lg bg-[#151720] border border-[rgba(255,255,255,0.08)] space-y-4">
            <h4 className="font-mono text-base font-bold text-white">
              End-to-End Latency Waterfall Breakdown
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[#8a8c98] mb-1">
                  <span>Client Request & Gateway Auth</span>
                  <span className="text-white">12ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#10b981] w-[6%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8a8c98] mb-1">
                  <span>LangGraph Query Rewrite & Branching</span>
                  <span className="text-white">28ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#00ffcc] w-[14%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8a8c98] mb-1">
                  <span>ChromaDB Cosine Similarity Search</span>
                  <span className="text-white">42ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#ffbd2e] w-[21%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8a8c98] mb-1">
                  <span>Groq LPU Time to First Token (TTFT)</span>
                  <span className="text-white">195ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#eb4c2a] w-[59%]" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex justify-between font-mono text-sm font-bold">
              <span className="text-[#8a8c98]">Total End-to-End Latency:</span>
              <span className="text-[#00ffcc]">277ms (Sub-second response)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ArchitectureDiagram };
