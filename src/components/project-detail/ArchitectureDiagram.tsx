'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ArchNode, ProjectEdge } from '@/data/projects';
import { Cpu, ArrowRight, Network, Layers, Database } from 'lucide-react';

interface ArchitectureDiagramProps {
  nodes: ArchNode[];
  edges?: ProjectEdge[];
}

export default function ArchitectureDiagram({
  nodes,
  edges,
}: ArchitectureDiagramProps) {
  const reducedMotion = useReducedMotion();
  const hasEdges = edges && edges.length > 0;

  return (
    <div className="relative rounded-[4px] bg-[#fafaf7] border border-[rgba(17,18,21,0.1)] p-6 sm:p-8 shadow-[0_4px_20px_rgba(17,18,21,0.03)] overflow-hidden">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(17,18,21,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Blueprint Top Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[rgba(17,18,21,0.08)]">
        <div className="flex items-center gap-2.5">
          <Network className="w-4 h-4 text-[#eb4c2a]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111215]">
            SYSTEM TOPOLOGY & DATA PIPELINE
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#8a8c98]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[rgba(17,18,21,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            {nodes.length} NODES
          </span>
          {hasEdges && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[rgba(17,18,21,0.08)]">
              {edges.length} DIRECTED EDGES
            </span>
          )}
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8">
        {nodes.map((node, i) => {
          const nodeNumber = String(i + 1).padStart(2, '0');
          return (
            <motion.div
              key={node.label}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: reducedMotion ? 0 : i * 0.05 }}
              className="group relative bg-white border border-[rgba(17,18,21,0.09)] rounded-[2px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#eb4c2a] hover:shadow-[0_4px_16px_rgba(235,76,42,0.08)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] font-bold text-[#eb4c2a]">
                  N{nodeNumber}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[rgba(17,18,21,0.2)] group-hover:bg-[#eb4c2a] transition-colors" />
              </div>

              <div className="font-mono text-sm font-bold text-[#111215] tracking-tight mb-1 group-hover:text-[#eb4c2a] transition-colors">
                {node.label}
              </div>

              {node.note && (
                <div className="font-mono text-[11px] text-[#565862] flex items-center gap-1.5 pt-1.5 border-t border-[rgba(17,18,21,0.05)]">
                  <Layers className="w-3 h-3 text-[#8a8c98] flex-shrink-0" />
                  <span className="truncate">{node.note}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Directed Pipeline / Edges Stream */}
      {hasEdges ? (
        <div className="relative z-10 pt-5 border-t border-[rgba(17,18,21,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#565862]">
              DIRECTED DATA FLOW PATHS
            </span>
            <span className="font-mono text-[10px] text-[#8a8c98]">
              Upstream → Downstream
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {edges.map((edge, idx) => (
              <motion.div
                key={`${edge.from}-${edge.to}-${idx}`}
                initial={reducedMotion ? false : { opacity: 0 }}
                whileInView={reducedMotion ? {} : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: reducedMotion ? 0 : idx * 0.04 }}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-[2px] bg-white border border-[rgba(17,18,21,0.06)] font-mono text-xs text-[#111215] shadow-2xs hover:border-[#eb4c2a]/40 transition-colors"
              >
                <span className="truncate font-medium max-w-[42%] text-[#111215]">
                  {edge.from}
                </span>
                <span className="text-[#eb4c2a] flex items-center justify-center font-bold px-1" aria-hidden="true">
                  →
                </span>
                <span className="truncate text-[#565862] max-w-[42%] text-right">
                  {edge.to}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Linear Fallback Pipeline */
        <div className="relative z-10 pt-4 border-t border-[rgba(17,18,21,0.08)] flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-[#8a8c98] text-[11px] uppercase mr-2 font-bold">
            Execution Flow:
          </span>
          {nodes.map((node, i) => (
            <React.Fragment key={node.label}>
              <span className="px-2.5 py-1 rounded-[2px] bg-white border border-[rgba(17,18,21,0.08)] font-semibold text-[#111215]">
                {node.label}
              </span>
              {i < nodes.length - 1 && (
                <span className="text-[#eb4c2a] font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export { ArchitectureDiagram };
