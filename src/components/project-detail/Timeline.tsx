'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TimelineProps {
  steps: string[];
}

export default function Timeline({ steps }: TimelineProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative pl-6 sm:pl-8">
      {/* Continuous vertical connecting stem line */}
      <div
        className="absolute left-3 sm:left-4 top-4 bottom-6 w-[2px] bg-gradient-to-b from-[#eb4c2a] via-[rgba(18,19,22,0.12)] to-[rgba(18,19,22,0.06)] -translate-x-1/2"
        aria-hidden="true"
      />

      <ol className="flex flex-col gap-6">
        {steps.map((step, idx) => {
          const numStr = String(idx + 1).padStart(2, '0');
          return (
            <motion.li
              key={idx}
              className="relative flex items-start gap-4 group"
              initial={reducedMotion ? false : { opacity: 0, x: -12 }}
              whileInView={reducedMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: reducedMotion ? 0 : idx * 0.06 }}
            >
              {/* Timeline Node Pill */}
              <div
                className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-[#eb4c2a] flex items-center justify-center -translate-x-1/2 shadow-xs group-hover:scale-110 transition-transform duration-200"
                aria-hidden="true"
              >
                <div className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
              </div>

              {/* Step Card Content */}
              <div className="flex-1 p-4 rounded-md bg-white border border-[rgba(18,19,22,0.08)] shadow-xs hover:border-[#eb4c2a]/40 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#eb4c2a]">
                    STEP {numStr}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#111215] font-sans leading-relaxed">
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

