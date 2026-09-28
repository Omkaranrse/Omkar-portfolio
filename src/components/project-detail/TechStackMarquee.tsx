'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TechStackMarqueeProps {
  stack: string[];
}

export function TechStackMarquee({ stack }: TechStackMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!stack || stack.length === 0) return null;

  // Duplicate for smooth seamless loop
  const marqueeItems = [...stack, ...stack, ...stack];

  return (
    <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 lg:p-8 shadow-[0_2px_8px_rgba(17,18,21,0.03)] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#111215]">
            TECHNOLOGY STACK & TOOLS
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8a8c98]">
          {stack.length} core technologies
        </span>
      </div>

      {prefersReducedMotion ? (
        /* Static chip grid for users who prefer reduced motion */
        <div className="flex flex-wrap gap-2.5 pt-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-3.5 py-1.5 rounded-[2px] bg-[#f8f8f5] border border-[rgba(17,18,21,0.08)] font-mono text-xs font-semibold text-[#111215] shadow-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        /* Seamless marquee with pause on hover */
        <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex w-max gap-3 hover:[animation-play-state:paused]"
            animate={{
              x: ['0%', '-33.333%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 20,
                ease: 'linear',
              },
            }}
          >
            {marqueeItems.map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="inline-flex items-center px-4 py-2 rounded-[2px] bg-[#f8f8f5] border border-[rgba(17,18,21,0.08)] font-mono text-xs font-medium text-[#111215] hover:border-[#eb4c2a] hover:bg-white hover:text-[#eb4c2a] transition-colors shadow-xs select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] mr-2 opacity-80" />
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TechStackMarquee;

