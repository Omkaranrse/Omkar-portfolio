'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Challenge } from '@/data/projects';
import { CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface ChallengeCardsProps {
  challenges: Challenge[];
}

export function ChallengeCards({ challenges }: ChallengeCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!challenges || challenges.length === 0) return null;

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : staggerContainer(0.08)}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {challenges.map((item, index) => {
        const num = String(index + 1).padStart(2, '0');

        return (
          <motion.article
            key={item.title}
            variants={prefersReducedMotion ? undefined : fadeUp}
            className="group relative flex flex-col bg-white border border-[rgba(17,18,21,0.08)] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[rgba(17,18,21,0.14)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 rounded-lg bg-[#eb4c2a]/10 flex items-center justify-center font-mono text-[11px] font-bold text-[#eb4c2a]">
                  {num}
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#8a8c98]">
                  Challenge
                </span>
              </div>

              <h3 className="font-sans text-lg font-bold tracking-tight text-[#111215] group-hover:text-[#eb4c2a] transition-colors">
                {item.title}
              </h3>
            </div>

            {/* Solution */}
            <div className="bg-[#fafaf7] border-t border-[rgba(17,18,21,0.06)] p-5 sm:p-6">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[#111215]">
                  How I solved it
                </span>
              </div>
              <p className="font-sans text-sm text-[#565862] leading-relaxed">
                {item.detail}
              </p>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}

export { ChallengeCards as ChallengeCard };
export default ChallengeCards;
