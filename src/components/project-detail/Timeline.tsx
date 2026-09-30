'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface TimelineProps {
  steps: string[];
}

export default function Timeline({ steps }: TimelineProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={reducedMotion ? undefined : staggerContainer(0.07)}
      initial={reducedMotion ? undefined : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      className="relative pl-8 sm:pl-10 py-2"
    >
      {/* Continuous vertical stem */}
      <div
        className="absolute left-[13px] sm:left-[17px] top-6 bottom-8 w-[2px] bg-gradient-to-b from-[#eb4c2a] via-[rgba(17,18,21,0.12)] to-transparent"
        aria-hidden="true"
      />

      <ol className="flex flex-col gap-5">
        {steps.map((step, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          return (
            <motion.li
              key={idx}
              className="relative flex items-start group"
              variants={reducedMotion ? undefined : fadeUp}
            >
              {/* Node pin */}
              <div
                className="absolute -left-[27px] sm:-left-[35px] top-3 w-5 h-5 rounded-full bg-white border-2 border-[#eb4c2a] flex items-center justify-center shadow-sm group-hover:bg-[#eb4c2a] transition-all duration-300 z-10"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] group-hover:bg-white transition-colors" />
              </div>

              {/* Step content */}
              <div className="w-full bg-white border border-[rgba(17,18,21,0.07)] rounded-xl p-4 sm:p-5 shadow-sm group-hover:shadow-md group-hover:border-[rgba(17,18,21,0.14)] group-hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-[#eb4c2a]">
                    Step {num}
                  </span>
                  <span className="font-mono text-[10px] text-[#10b981] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Done
                  </span>
                </div>
                <p className="font-sans text-sm sm:text-base text-[#111215] leading-relaxed">
                  {step}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export { Timeline };
