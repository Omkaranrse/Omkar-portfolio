'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { TechDecision } from '@/data/projects';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { fadeUp, viewportOnce } from '@/lib/motion';

interface DecisionAccordionProps {
  decisions: TechDecision[];
  variant?: 'light' | 'dark';
}

export default function DecisionAccordion({
  decisions,
  variant = 'light',
}: DecisionAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();
  const isDark = variant === 'dark';

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  if (!decisions || decisions.length === 0) return null;

  return (
    <motion.div
      initial={reducedMotion ? undefined : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      variants={reducedMotion ? undefined : fadeUp}
      className="space-y-3"
    >
      {decisions.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `decision-panel-${idx}`;
        const buttonId = `decision-button-${idx}`;
        const num = String(idx + 1).padStart(2, '0');

        const cardClass = isDark
          ? isOpen
            ? 'bg-white/[0.06] border-[#eb4c2a]/40 ring-1 ring-[#eb4c2a]/20'
            : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.05]'
          : isOpen
            ? 'bg-white border-[#eb4c2a]/30 shadow-[0_8px_30px_rgba(235,76,42,0.06)] ring-1 ring-[#eb4c2a]/15'
            : 'bg-white border-[rgba(17,18,21,0.08)] hover:border-[rgba(17,18,21,0.18)] hover:shadow-sm';

        const numBgClass = isDark
          ? isOpen
            ? 'bg-[#eb4c2a] text-white'
            : 'bg-white/[0.08] text-[#8a8c98]'
          : isOpen
            ? 'bg-[#eb4c2a] text-white'
            : 'bg-[#f8f8f5] text-[#565862]';

        const chevronClass = isDark
          ? isOpen
            ? 'rotate-180 bg-[#eb4c2a] text-white'
            : 'bg-white/[0.06] text-[#8a8c98]'
          : isOpen
            ? 'rotate-180 bg-[#111215] text-white'
            : 'bg-[#f8f8f5] text-[#8a8c98]';

        return (
          <div
            key={item.why}
            className={`rounded-xl border transition-all duration-300 overflow-hidden ${cardClass}`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a] rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold transition-colors ${numBgClass}`}
                  >
                    {num}
                  </span>
                  <span
                    className={`font-sans font-bold text-base sm:text-lg tracking-tight ${
                      isDark ? 'text-white' : 'text-[#111215]'
                    }`}
                  >
                    {item.why}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${chevronClass}`}
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
                  initial={
                    reducedMotion ? false : { height: 0, opacity: 0 }
                  }
                  animate={
                    reducedMotion
                      ? undefined
                      : { height: 'auto', opacity: 1 }
                  }
                  exit={
                    reducedMotion
                      ? undefined
                      : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="px-5 sm:px-6 pb-6 pt-2 space-y-3">
                    <div
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        isDark
                          ? 'bg-white/[0.04] border-white/[0.06]'
                          : 'bg-[#fafaf7] border-[rgba(17,18,21,0.06)]'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4 text-[#eb4c2a] flex-shrink-0 mt-0.5" />
                      <p
                        className={`font-sans text-sm sm:text-base leading-relaxed ${
                          isDark ? 'text-[#c4c7d0]' : 'text-[#374151]'
                        }`}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}

export { DecisionAccordion };
