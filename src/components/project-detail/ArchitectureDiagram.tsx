'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ArchNode, ProjectEdge } from '@/data/projects';

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

  // Linear flow fallback if no edges specified
  if (!hasEdges) {
    return (
      <div className="relative p-6 sm:p-8 rounded-md bg-[#fdfdfc] border border-[rgba(18,19,22,0.08)] shadow-xs overflow-x-auto">
        <div className="flex flex-col items-center gap-3 min-w-[280px] max-w-lg mx-auto">
          {nodes.map((node, i) => (
            <React.Fragment key={node.label}>
              <motion.div
                className="w-full p-3.5 rounded bg-white border border-[rgba(18,19,22,0.12)] shadow-xs flex items-center justify-between gap-3 hover:border-[#eb4c2a] hover:shadow-sm transition-all"
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: reducedMotion ? 0 : i * 0.05 }}
              >
                <span className="font-mono text-xs sm:text-sm font-semibold text-[#111215]">
                  {node.label}
                </span>
                {node.note && (
                  <span className="font-mono text-[11px] text-[#565862] bg-[#f2f1ea] px-2 py-0.5 rounded border border-[rgba(18,19,22,0.06)]">
                    {node.note}
                  </span>
                )}
              </motion.div>

              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center my-0.5 text-[#eb4c2a]" aria-hidden="true">
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                    <line x1="8" y1="0" x2="8" y2="14" stroke="#eb4c2a" strokeWidth="2" strokeDasharray="3 3" />
                    <polygon points="4,13 8,19 12,13" fill="#eb4c2a" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Branching / Graph Architecture with SVG Connectors
  return (
    <div className="relative p-6 sm:p-8 rounded-md bg-[#fdfdfc] border border-[rgba(18,19,22,0.08)] shadow-xs overflow-hidden">
      {/* Visual background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #111215 1px, transparent 1px), linear-gradient(to bottom, #111215 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Nodes Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {nodes.map((node, i) => (
            <motion.div
              key={node.label}
              className="p-3.5 rounded bg-white border border-[rgba(18,19,22,0.12)] shadow-xs hover:border-[#eb4c2a] hover:shadow-sm transition-all duration-200"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={reducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: reducedMotion ? 0 : i * 0.05 }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#111215]">
                  {node.label}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a]" aria-hidden="true" />
              </div>
              {node.note && (
                <div className="font-mono text-[11px] text-[#565862] bg-[#f8f8f5] px-2 py-0.5 rounded border border-[rgba(18,19,22,0.06)] truncate">
                  {node.note}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Directed Data Flows & Branching Edges List */}
        <div className="p-4 rounded bg-[#f5f4f0]/80 border border-[rgba(18,19,22,0.08)]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8a8c98] mb-3 flex items-center justify-between">
            <span>Inter-Node Routing &amp; Data Pipeline</span>
            <span className="text-[10px] text-[#eb4c2a] lowercase">
              {edges.length} directed links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {edges.map((edge, idx) => (
              <motion.div
                key={`${edge.from}-${edge.to}-${idx}`}
                className="flex items-center gap-2 p-2 rounded bg-white border border-[rgba(18,19,22,0.06)] text-xs font-mono"
                initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                whileInView={reducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: reducedMotion ? 0 : idx * 0.04 }}
              >
                <span className="font-medium text-[#111215] truncate max-w-[45%]">
                  {edge.from}
                </span>
                <span className="text-[#eb4c2a] flex-shrink-0" aria-hidden="true">
                  →
                </span>
                <span className="text-[#565862] truncate max-w-[45%]">
                  {edge.to}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ArchitectureDiagram };

