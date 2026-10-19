'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Server,
  Database,
  Cpu,
  Layers,
  Shield,
  ArrowRight,
  Info,
  X,
  Code2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export interface SystemNode {
  id: string;
  label: string;
  category: 'Client' | 'Gateway' | 'Backend' | 'Storage' | 'AI Engine';
  role: string;
  icon: 'smartphone' | 'server' | 'database' | 'cpu' | 'layers' | 'shield';
  tradeoffRationale: string;
  alternativesConsidered: string[];
  schemaPreview?: string;
  resiliencePolicy: string;
}

const DEFAULT_NODES: SystemNode[] = [
  {
    id: 'flutter-client',
    label: 'Flutter Mobile App',
    category: 'Client',
    role: 'Cross-platform native presentation layer with 60fps UI',
    icon: 'smartphone',
    tradeoffRationale:
      'Single codebase for iOS and Android with compile-time type safety via Riverpod. Bypasses JavaScript bridge limitations present in React Native, delivering silky-smooth 60/120fps hardware-accelerated animations.',
    alternativesConsidered: ['React Native (Bridge latency)', 'Native Swift/Kotlin (2x dev cost)'],
    schemaPreview: `{
  "device_id": "uuid-v4-client-hash",
  "geo_point": { "lat": 19.0760, "lng": 72.8777 },
  "auth_token": "bearer eyJhbGciOi...",
  "timestamp": 1729314000
}`,
    resiliencePolicy:
      'Offline-first Hive local storage cache. If network drops, actions are queued and auto-synced upon reconnection.',
  },
  {
    id: 'api-gateway',
    label: 'Edge API Gateway',
    category: 'Gateway',
    role: 'Rate limiting, JWT token validation & CORS proxy',
    icon: 'shield',
    tradeoffRationale:
      'Validates all client requests at edge nodes before hitting internal services, reducing latency by 45ms and protecting backend workers from DDoS traffic.',
    alternativesConsidered: ['Direct backend exposure (Security risk)', 'Kong Gateway (Overhead)'],
    schemaPreview: `{
  "status": 200,
  "client_ip": "103.21.244.0",
  "rate_limit_remaining": 98,
  "verified": true
}`,
    resiliencePolicy:
      'Global CDN edge fallback with automatic circuit breaking if backend latency exceeds 2.5s.',
  },
  {
    id: 'fastapi-backend',
    label: 'FastAPI Async Worker',
    category: 'Backend',
    role: 'High-throughput async Python service handling RAG & domain logic',
    icon: 'server',
    tradeoffRationale:
      'Native async/await architecture built on Starlette and Pydantic. Delivers sub-15ms parsing latency with automatic OpenAPI docs generation.',
    alternativesConsidered: ['Express.js (Slow ML bindings)', 'Django (Too monolithic for micro-services)'],
    schemaPreview: `{
  "route": "/api/v1/process-query",
  "worker_pid": 4810,
  "async_task_id": "task-uuid-882",
  "execution_pool": "uvloop"
}`,
    resiliencePolicy:
      'Horizontal autoscaling with graceful shutdown and worker queue failover via Redis.',
  },
  {
    id: 'chromadb-vectors',
    label: 'ChromaDB Vector Store',
    category: 'Storage',
    role: 'Embedding index for semantic chunk matching and retrieval',
    icon: 'database',
    tradeoffRationale:
      'Lightweight, open-source vector store allowing local persistence without external cloud API dependencies during evaluation.',
    alternativesConsidered: ['Pinecone (Expensive cloud lock-in)', 'FAISS (Lacks native document metadata filters)'],
    schemaPreview: `{
  "query_embedding": [0.0124, -0.0481, 0.0891, ...],
  "top_k": 3,
  "similarity_metric": "cosine",
  "matched_count": 3
}`,
    resiliencePolicy:
      'Dual-replica persistence with automated background snapshots to cloud object storage.',
  },
  {
    id: 'groq-ai',
    label: 'Groq LPU LLM Engine',
    category: 'AI Engine',
    role: 'Ultra-fast language model inference at 150+ tokens/sec',
    icon: 'cpu',
    tradeoffRationale:
      'Language Processing Unit (LPU) architecture eliminates memory bandwidth bottlenecks, delivering near-instant generation with Llama 3.3 70B.',
    alternativesConsidered: ['Standard OpenAI API (2-4x higher latency)', 'Self-hosted Ollama (High GPU cost)'],
    schemaPreview: `{
  "model": "llama-3.3-70b-versatile",
  "stream": true,
  "tokens_generated": 248,
  "finish_reason": "stop"
}`,
    resiliencePolicy:
      'Automatic fallback to Claude 3.5 Sonnet or Gemini 2.5 Flash if Groq service experiences downtime.',
  },
];

export default function InteractiveArchGraph({
  nodes = DEFAULT_NODES,
}: {
  nodes?: SystemNode[];
}) {
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(null);

  const getNodeIcon = (type: SystemNode['icon']) => {
    switch (type) {
      case 'smartphone':
        return <Smartphone className="w-5 h-5 text-sky-400" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-rose-400" />;
      default:
        return <Layers className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="w-full my-8 select-none font-sans">
      {/* Visual Canvas Container */}
      <div className="relative w-full rounded-2xl bg-[#0a0d14]/90 border border-white/15 p-6 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Subtle Engineering Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-white/10 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                System Topology &amp; Architecture Pipeline
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click any node to inspect trade-off rationales, schemas, and resilience policies
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-emerald-400">● 60 FPS</span>
            <span>Packet Flow Active</span>
          </div>
        </div>

        {/* Node Pipeline Chain */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-between gap-3">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNode(node)}
                className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedNode?.id === node.id
                    ? 'bg-white/15 border-white/40 shadow-lg shadow-white/5 ring-1 ring-white/30'
                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                    {getNodeIcon(node.icon)}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/5">
                    {node.category}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1 tracking-tight">
                  {node.label}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {node.role}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Inspect Spec</span>
                  <Info className="w-3 h-3 text-neutral-400" />
                </div>
              </motion.div>

              {/* Animated Connecting Edge Arrow */}
              {index < nodes.length - 1 && (
                <div className="hidden md:flex items-center justify-center shrink-0 px-1 text-neutral-600 relative">
                  <ArrowRight className="w-4 h-4 text-neutral-500" />
                  <motion.div
                    animate={{ x: [-12, 12] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Architectural Trade-off Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-[#0e121a] border border-white/20 rounded-2xl shadow-2xl p-6 text-neutral-200 z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    {getNodeIcon(selectedNode.icon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {selectedNode.label}
                    </h3>
                    <span className="text-xs font-mono text-emerald-400">
                      Layer: {selectedNode.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rationale Section */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-mono text-neutral-400 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Engineering Trade-Off Rationale
                  </h4>
                  <p className="text-neutral-300 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/10 text-xs">
                    {selectedNode.tradeoffRationale}
                  </p>
                </div>

                {/* Alternatives Considered */}
                <div>
                  <h4 className="font-mono text-neutral-400 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Alternatives Evaluated &amp; Discarded
                  </h4>
                  <ul className="space-y-1 text-neutral-300 font-mono text-[11px]">
                    {selectedNode.alternativesConsidered.map((alt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Schema Preview */}
                {selectedNode.schemaPreview && (
                  <div>
                    <h4 className="font-mono text-neutral-400 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-sky-400" />
                      Payload Contract / Interface
                    </h4>
                    <pre className="bg-black/60 border border-white/10 p-3 rounded-xl font-mono text-[11px] text-sky-300/90 overflow-x-auto">
                      {selectedNode.schemaPreview}
                    </pre>
                  </div>
                )}

                {/* Resilience Policy */}
                <div>
                  <h4 className="font-mono text-neutral-400 text-[11px] uppercase tracking-wider mb-1">
                    Fault Tolerance &amp; Recovery
                  </h4>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    {selectedNode.resiliencePolicy}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  Close Specification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
