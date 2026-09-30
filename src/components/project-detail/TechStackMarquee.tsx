'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';

interface TechStackMarqueeProps {
  stack: string[];
}

export function TechStackMarquee({ stack }: TechStackMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!stack || stack.length === 0) return null;

  // Duplicate for smooth seamless loop
  const marqueeItems = [...stack, ...stack, ...stack];

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      variants={prefersReducedMotion ? undefined : fadeUp}
      className="bg-white border border-[rgba(17,18,21,0.08)] rounded-2xl p-6 lg:p-8 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#eb4c2a]" />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#111215]">
            Built with
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8a8c98]">
          {stack.length} technologies
        </span>
      </div>

      {prefersReducedMotion ? (
        /* Static chip grid for users who prefer reduced motion */
        <div className="flex flex-wrap gap-2.5 pt-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#f8f8f5] border border-[rgba(17,18,21,0.08)] font-mono text-xs font-semibold text-[#111215]"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        /* Seamless marquee with pause on hover */
        <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <motion.div
            className="flex w-max gap-3 hover:[animation-play-state:paused]"
            animate={{
              x: ['0%', '-33.333%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 22,
                ease: 'linear',
              },
            }}
          >
            {marqueeItems.map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="inline-flex items-center px-4 py-2 rounded-full bg-[#f8f8f5] border border-[rgba(17,18,21,0.08)] font-mono text-xs font-medium text-[#111215] hover:border-[#eb4c2a] hover:bg-white hover:text-[#eb4c2a] transition-colors select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] mr-2 opacity-60" />
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default TechStackMarquee;
