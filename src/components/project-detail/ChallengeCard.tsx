'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Challenge } from '@/data/projects';
import { ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ChallengeCardsProps {
  challenges: Challenge[];
}

export function ChallengeCards({ challenges }: ChallengeCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!challenges || challenges.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
      {challenges.map((item, index) => {
        const itemNumber = String(index + 1).padStart(2, '0');

        return (
          <motion.article
            key={item.title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative flex flex-col justify-between bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(17,18,21,0.03)] hover:shadow-[0_10px_30px_rgba(17,18,21,0.07)] hover:border-[rgba(17,18,21,0.16)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Top Eyebrow row */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[rgba(17,18,21,0.06)]">
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#eb4c2a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a]" />
                  CHALLENGE {itemNumber}
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#565862] px-2 py-0.5 rounded-[2px] bg-[#f8f8f5] border border-[rgba(17,18,21,0.06)]">
                  COMPLEXITY
                </span>
              </div>

              {/* Challenge Title in accent color */}
              <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#111215] group-hover:text-[#eb4c2a] transition-colors mb-4">
                {item.title}
              </h3>
            </div>

            {/* How I solved it description */}
            <div className="mt-4 pt-4 border-t border-dashed border-[rgba(17,18,21,0.1)] bg-[#fafaf7] -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-5 sm:p-6 rounded-b-[2px]">
              <div className="flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" aria-hidden="true" />
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[#111215]">
                  How I Solved It
                </span>
              </div>
              <p className="font-sans text-sm text-[#565862] leading-relaxed">
                {item.detail}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

export { ChallengeCards as ChallengeCard };
export default ChallengeCards;
