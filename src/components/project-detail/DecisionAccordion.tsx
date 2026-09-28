'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { TechDecision } from '@/data/projects';
import { ChevronDown, HelpCircle, Lightbulb } from 'lucide-react';

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
        const adrNumber = String(idx + 1).padStart(2, '0');

        return (
          <div
            key={item.why}
            className={`rounded-[2px] border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white border-[rgba(17,18,21,0.14)] shadow-[0_4px_16px_rgba(17,18,21,0.05)]'
                : 'bg-white/80 border-[rgba(17,18,21,0.08)] hover:border-[rgba(17,18,21,0.16)] hover:bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
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
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className="font-mono text-[11px] font-bold text-[#eb4c2a] bg-[#eb4c2a]/10 px-2 py-0.5 rounded-[2px] flex-shrink-0 mt-0.5 sm:mt-0">
                    ADR {adrNumber}
                  </span>
                  <span className="font-sans font-bold text-base sm:text-lg text-[#111215] tracking-tight">
                    {item.why}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 border ${
                    isOpen
                      ? 'rotate-180 bg-[#111215] text-white border-[#111215]'
                      : 'bg-[#f8f8f5] text-[#565862] border-[rgba(17,18,21,0.08)]'
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
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[rgba(17,18,21,0.06)] bg-[#fafaf7]">
                    <div className="flex items-center gap-1.5 my-3 text-[#eb4c2a] font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-[#eb4c2a]" />
                      <span>RATIONALE & ARCHITECTURAL TRADE-OFF</span>
                    </div>
                    <p className="font-sans text-sm sm:text-base text-[#565862] leading-relaxed">
                      {item.answer}
                    </p>
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
