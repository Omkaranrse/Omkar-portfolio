'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { TechDecision } from '@/data/projects';

interface DecisionAccordionProps {
  decisions: TechDecision[];
}

export default function DecisionAccordion({ decisions }: DecisionAccordionProps) {
  // Only one open at a time; first one open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="flex flex-col gap-3">
      {decisions.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `decision-panel-${idx}`;
        const buttonId = `decision-button-${idx}`;

        return (
          <div
            key={item.why}
            className={`rounded-md bg-white border transition-all duration-200 shadow-xs ${
              isOpen
                ? 'border-[#eb4c2a]/60 shadow-sm ring-1 ring-[#eb4c2a]/15'
                : 'border-[rgba(18,19,22,0.08)] hover:border-[rgba(18,19,22,0.2)]'
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left font-display font-bold text-sm sm:text-base text-[#111215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a] rounded-md transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#eb4c2a]" aria-hidden="true">
                    0{idx + 1}.
                  </span>
                  <span>{item.why}</span>
                </span>

                <motion.span
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f8f8f5] flex items-center justify-center text-xs font-mono text-[#eb4c2a] border border-[rgba(18,19,22,0.08)]"
                  animate={reducedMotion ? {} : { rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  aria-hidden="true"
                >
                  ↓
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={reducedMotion ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reducedMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 text-sm sm:text-base text-[#565862] leading-relaxed border-t border-[rgba(18,19,22,0.06)] font-sans">
                    {item.answer}
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

