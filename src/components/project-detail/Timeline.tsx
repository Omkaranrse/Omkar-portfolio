'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

interface TimelineProps {
  steps: string[];
}

export default function Timeline({ steps }: TimelineProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative pl-6 sm:pl-10 py-2">
      {/* Continuous vertical connecting stem line */}
      <div
        className="absolute left-[15px] sm:left-[21px] top-6 bottom-8 w-[2px] bg-gradient-to-b from-[#eb4c2a] via-[rgba(17,18,21,0.15)] to-[rgba(17,18,21,0.06)]"
        aria-hidden="true"
      />

      <ol className="flex flex-col gap-6 sm:gap-7">
        {steps.map((step, idx) => {
          const numStr = String(idx + 1).padStart(2, '0');
          return (
            <motion.li
              key={idx}
              className="relative flex items-start group"
              initial={reducedMotion ? false : { opacity: 0, x: -12 }}
              whileInView={reducedMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: reducedMotion ? 0 : idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Timeline Node Pin */}
              <div
                className="absolute -left-[27px] sm:-left-[39px] top-3.5 w-6 h-6 rounded-full bg-white border-2 border-[#eb4c2a] flex items-center justify-center shadow-[0_2px_8px_rgba(235,76,42,0.2)] group-hover:scale-110 group-hover:bg-[#eb4c2a] transition-all duration-300 z-10"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] group-hover:bg-white transition-colors" />
              </div>

              {/* Step Card */}
              <div className="w-full bg-[#fdfdfc] border border-[rgba(17,18,21,0.07)] rounded-[2px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] group-hover:shadow-[0_6px_20px_rgba(17,18,21,0.05)] group-hover:border-[rgba(17,18,21,0.14)] group-hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[rgba(17,18,21,0.05)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#eb4c2a] bg-[#eb4c2a]/10 px-2 py-0.5 rounded-[2px]">
                      STAGE {numStr}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#8a8c98]">
                      EXECUTION PHASE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#10b981] flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3 text-[#10b981]" />
                    COMPLETE
                  </span>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#111215] font-medium leading-relaxed">
                  {step}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export { Timeline };
