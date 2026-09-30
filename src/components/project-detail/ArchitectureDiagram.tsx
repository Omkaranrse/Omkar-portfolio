'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ArchNode, ProjectEdge } from '@/data/projects';
import {
  fadeUp,
  staggerContainer,
  scaleUp,
  viewportOnce,
} from '@/lib/motion';
import {
  ArrowRight,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface ArchitectureDiagramProps {
  nodes: ArchNode[];
  edges?: ProjectEdge[];
}

export default function ArchitectureDiagram({
  nodes,
  edges,
}: ArchitectureDiagramProps) {
  const reducedMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<number | null>(null);

  if (!nodes || nodes.length === 0) return null;

  return (
    <motion.div
      variants={reducedMotion ? undefined : staggerContainer(0.06)}
      initial={reducedMotion ? undefined : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      className="relative rounded-2xl bg-[#0e1015] text-white overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #eb4c2a 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <motion.div variants={reducedMotion ? undefined : fadeUp} className="space-y-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#eb4c2a]">
            System Architecture
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
            How the pieces connect
          </h3>
        </motion.div>

        {/* Flow diagram — horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-6 sm:-mx-8 lg:-mx-10 px-6 sm:px-8 lg:px-10 pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {nodes.map((node, idx) => {
              const isActive = activeNode === idx;

              return (
                <React.Fragment key={node.label}>
                  <motion.button
                    type="button"
                    variants={reducedMotion ? undefined : scaleUp}
                    onClick={() =>
                      setActiveNode(isActive ? null : idx)
                    }
                    className={`relative flex flex-col items-center gap-2 px-5 py-4 rounded-xl border cursor-pointer transition-all duration-300 min-w-[130px] text-center ${
                      isActive
                        ? 'bg-[#eb4c2a]/15 border-[#eb4c2a]/60 ring-1 ring-[#eb4c2a]/30 shadow-[0_0_20px_rgba(235,76,42,0.2)]'
                        : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.16]'
                    }`}
                  >
                    {/* Node index */}
                    <span className="font-mono text-[10px] font-bold text-[#eb4c2a] tracking-wider">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Node label */}
                    <span className="font-mono text-sm font-bold text-white leading-tight">
                      {node.label}
                    </span>

                    {/* Node note */}
                    {node.note && (
                      <span className="font-mono text-[10px] text-[#8a8c98] leading-tight">
                        {node.note}
                      </span>
                    )}
                  </motion.button>

                  {/* Connector arrow between nodes */}
                  {idx < nodes.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#eb4c2a]/50 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active node detail panel */}
        {activeNode !== null && nodes[activeNode] && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 rounded-xl bg-white/[0.05] border border-white/[0.1] space-y-2"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#eb4c2a]" />
              <span className="font-mono text-sm font-bold text-white">
                {nodes[activeNode].label}
              </span>
            </div>
            {nodes[activeNode].note && (
              <p className="text-sm text-[#9698a3] leading-relaxed pl-6">
                {nodes[activeNode].note}
              </p>
            )}
          </motion.div>
        )}

        {/* Data flow edges (if provided) */}
        {edges && edges.length > 0 && (
          <div className="pt-4 border-t border-white/[0.08]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8a8c98] block mb-3">
              Data Flow
            </span>
            <div className="flex flex-wrap gap-2">
              {edges.map((edge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono text-[#c4c7d0] bg-white/[0.04] border border-white/[0.06]"
                >
                  <span className="text-white font-semibold">{edge.from}</span>
                  <ArrowRight className="w-3 h-3 text-[#eb4c2a]" />
                  <span className="text-white font-semibold">{edge.to}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { ArchitectureDiagram };
