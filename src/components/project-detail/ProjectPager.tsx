'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { ArrowLeft, ArrowRight, Grid, Compass } from 'lucide-react';

interface ProjectPagerProps {
  currentProject: Project;
  prevProject: Project;
  nextProject: Project;
  allProjects: Project[];
}

export function ProjectPager({
  currentProject,
  prevProject,
  nextProject,
  allProjects,
}: ProjectPagerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-10 mt-20 pt-14 border-t border-[rgba(17,18,21,0.1)]">
      {/* Section Eyebrow */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#eb4c2a] flex items-center gap-2">
          <Compass className="w-4 h-4" />
          CASE STUDY NAVIGATION
        </span>
        <span className="font-mono text-[10px] text-[#8a8c98]">
          {currentProject.number} OF 04
        </span>
      </div>

      {/* Prev / Next 2-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {/* Previous Project Card */}
        <Link
          href={`/projects/${prevProject.id}`}
          className="group relative flex flex-col justify-between bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-8 shadow-[0_2px_8px_rgba(17,18,21,0.03)] hover:shadow-[0_12px_32px_rgba(17,18,21,0.08)] hover:border-[#eb4c2a]/40 hover:-translate-y-1 transition-all duration-300"
        >
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#565862] group-hover:text-[#eb4c2a] transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                PREVIOUS CASE STUDY
              </span>
            </div>
            <div className="flex items-baseline gap-2.5 mb-2">
              <span className="font-mono text-sm font-bold text-[#eb4c2a]">{prevProject.number}</span>
              <h4 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111215] group-hover:text-[#eb4c2a] transition-colors">
                {prevProject.title}
              </h4>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#565862] line-clamp-2 leading-relaxed">
              {prevProject.shortDesc}
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[rgba(17,18,21,0.06)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#8a8c98] tracking-widest">
              {prevProject.category}
            </span>
            <span className="font-mono text-xs font-bold text-[#111215] group-hover:text-[#eb4c2a] flex items-center gap-1">
              Read Study →
            </span>
          </div>
        </Link>

        {/* Next Project Card */}
        <Link
          href={`/projects/${nextProject.id}`}
          className="group relative flex flex-col justify-between bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-8 shadow-[0_2px_8px_rgba(17,18,21,0.03)] hover:shadow-[0_12px_32px_rgba(17,18,21,0.08)] hover:border-[#eb4c2a]/40 hover:-translate-y-1 transition-all duration-300 text-right md:text-left"
        >
          <div>
            <div className="flex items-center justify-end md:justify-start gap-2 mb-3 text-[#565862] group-hover:text-[#eb4c2a] transition-colors">
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                NEXT CASE STUDY
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="flex items-baseline justify-end md:justify-start gap-2.5 mb-2">
              <span className="font-mono text-sm font-bold text-[#eb4c2a]">{nextProject.number}</span>
              <h4 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111215] group-hover:text-[#eb4c2a] transition-colors">
                {nextProject.title}
              </h4>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#565862] line-clamp-2 leading-relaxed">
              {nextProject.shortDesc}
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[rgba(17,18,21,0.06)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#8a8c98] tracking-widest">
              {nextProject.category}
            </span>
            <span className="font-mono text-xs font-bold text-[#111215] group-hover:text-[#eb4c2a] flex items-center gap-1">
              Read Study →
            </span>
          </div>
        </Link>
      </div>

      {/* "All Projects" Strip */}
      <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(17,18,21,0.03)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(17,18,21,0.06)]">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#eb4c2a]" />
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#111215]">
              ALL PORTFOLIO PROJECTS
            </span>
          </div>
          <Link
            href="/#work"
            className="font-mono text-xs text-[#565862] hover:text-[#eb4c2a] transition-colors"
          >
            Back to Overview Matrix →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {allProjects.map((p) => {
            const isCurrent = p.id === currentProject.id;
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`p-3.5 rounded-[2px] border transition-all duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#fdfcfb] border-[#eb4c2a] ring-1 ring-[#eb4c2a]/20 shadow-xs'
                    : 'bg-white border-[rgba(17,18,21,0.07)] hover:border-[rgba(17,18,21,0.2)] hover:bg-[#fafaf7]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-[#eb4c2a]">
                    {p.number}
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#eb4c2a] bg-[#eb4c2a]/10 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8a8c98]">{p.year}</span>
                  )}
                </div>
                <span className="font-sans text-xs font-bold text-[#111215] truncate">
                  {p.title}
                </span>
                <span className="font-mono text-[9px] text-[#8a8c98] truncate mt-1">
                  {p.category.split('·')[0].trim()}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProjectPager;
