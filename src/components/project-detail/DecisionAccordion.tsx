'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { TechDecision } from '@/data/projects';
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Code2,
  GitBranch,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DecisionAccordionProps {
  decisions: TechDecision[];
}

const DECISION_METADATA: Record<
  number,
  {
    category: string;
    chosen: string;
    rejected: string[];
    tradeoffSummary: string;
    codePreview?: string;
  }
> = {
  0: {
    category: 'STATE MACHINE ORCHESTRATION',
    chosen: 'LangGraph StateGraph with conditional edges',
    rejected: ['Fixed Linear Chains', 'Legacy AgentExecutor', 'CrewAI'],
    tradeoffSummary: 'Allowed dynamic conditional branching: query re-writing, conditional vector search, and validation loops.',
    codePreview: `workflow = StateGraph(AgentState)
workflow.add_node("rewrite", rewrite_query)
workflow.add_node("retrieve", chroma_retrieval)
workflow.add_node("evaluate", evaluate_groundedness)
workflow.add_conditional_edges("evaluate", route_or_retry)`,
  },
  1: {
    category: 'BACKEND ARCHITECTURE',
    chosen: 'FastAPI with Async ASGI',
    rejected: ['Django REST Framework', 'Node.js Express', 'Flask'],
    tradeoffSummary: 'Asynchronous event loops for non-blocking ChromaDB and Groq streaming with native Pydantic validation.',
    codePreview: `@app.post("/api/v1/query")
async def stream_query(req: QueryRequest):
    return EventSourceResponse(
        agent.astream_events(req.prompt),
        media_type="text/event-stream"
    )`,
  },
  2: {
    category: 'VECTOR STORE & INDEXING',
    chosen: 'ChromaDB Local IPC Vector Index',
    rejected: ['Pinecone Cloud', 'Weaviate', 'pgvector (standalone)'],
    tradeoffSummary: 'Local-first embedded execution with zero network latency overhead during local dev, easy swap to managed vector clusters.',
    codePreview: `collection = chroma_client.get_or_create_collection(
    name=f"tenant_{tenant_id}",
    metadata={"hnsw:space": "cosine"}
)
results = collection.query(query_embeddings, n_results=5)`,
  },
  3: {
    category: 'MODEL GROUNDING STRATEGY',
    chosen: 'Dynamic RAG with Sliding-Window Chunking',
    rejected: ['LoRA Fine-Tuning', 'Full Model Retraining', 'Prompt Inlining'],
    tradeoffSummary: 'Guaranteed tenant data isolation and zero training lag; instant querying of newly uploaded CSVs without parameter updates.',
    codePreview: `text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", " ", ""]
)`,
  },
};

export default function DecisionAccordion({ decisions }: DecisionAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {decisions.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `decision-panel-${idx}`;
        const buttonId = `decision-button-${idx}`;
        const adrNumber = String(idx + 1).padStart(2, '0');
        const meta = DECISION_METADATA[idx];

        return (
          <div
            key={item.why}
            className={`rounded-[6px] border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#eb4c2a]/40 shadow-[0_8px_30px_rgba(235,76,42,0.08)] ring-1 ring-[#eb4c2a]/20'
                : 'bg-white border-[rgba(17,18,21,0.08)] hover:border-[rgba(17,18,21,0.2)] hover:bg-[#fafaf7] shadow-xs'
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#eb4c2a] bg-[#eb4c2a]/10 px-2.5 py-1 rounded-[3px] flex-shrink-0">
                      ADR {adrNumber}
                    </span>
                    {meta && (
                      <span className="font-mono text-[10px] text-[#565862] uppercase tracking-wider hidden md:inline">
                        {meta.category}
                      </span>
                    )}
                  </div>
                  <span className="font-sans font-bold text-base sm:text-lg text-[#111215] tracking-tight">
                    {item.why}
                  </span>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 border ${
                    isOpen
                      ? 'rotate-180 bg-[#111215] text-white border-[#111215]'
                      : 'bg-[#f8f8f5] text-[#565862] border-[rgba(17,18,21,0.1)]'
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={reducedMotion ? undefined : { height: 'auto', opacity: 1 }}
                  exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[rgba(17,18,21,0.06)] bg-[#fafaf7] space-y-4">
                    {/* Rationale description */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 text-[#eb4c2a] font-mono text-[10px] font-bold uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5 text-[#eb4c2a]" />
                        <span>ARCHITECTURAL RATIONALE</span>
                      </div>
                      <p className="font-sans text-sm sm:text-base text-[#374151] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>

                    {/* Trade-off Matrix & Alternatives Evaluated */}
                    {meta && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-3.5 rounded bg-white border border-[rgba(17,18,21,0.08)] space-y-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#10b981] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            CHOSEN APPROACH
                          </span>
                          <p className="font-mono text-xs font-semibold text-[#111215]">
                            {meta.chosen}
                          </p>
                          <p className="text-xs text-[#565862] leading-relaxed">
                            {meta.tradeoffSummary}
                          </p>
                        </div>

                        <div className="p-3.5 rounded bg-white border border-[rgba(17,18,21,0.08)] space-y-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ef4444] flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" />
                            ALTERNATIVES EVALUATED
                          </span>
                          <ul className="text-xs font-mono text-[#565862] space-y-1">
                            {meta.rejected.map((alt) => (
                              <li key={alt} className="flex items-center gap-1.5">
                                <span className="text-[#8a8c98]">✕</span>
                                <span>{alt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Code Implementation Snippet */}
                    {meta?.codePreview && (
                      <div className="p-3.5 rounded bg-[#101217] text-white border border-[rgba(255,255,255,0.08)] space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8c98]">
                          <span className="flex items-center gap-1 text-[#00ffcc]">
                            <Code2 className="w-3 h-3" />
                            Production Implementation Reference
                          </span>
                          <span>Python / Async</span>
                        </div>
                        <pre className="font-mono text-[11px] text-[#e5e7eb] overflow-x-auto p-2 bg-[#0a0c10] rounded">
                          <code>{meta.codePreview}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export { DecisionAccordion };
