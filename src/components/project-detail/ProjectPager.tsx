'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { ArrowLeft, ArrowRight, Grid } from 'lucide-react';

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
    <div className="space-y-8 mt-16 pt-12 border-t border-[rgba(17,18,21,0.12)]">
      {/* Prev / Next 2-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Previous Project Card */}
        <Link
          href={`/projects/${prevProject.id}`}
          className="group relative flex flex-col justify-between bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 lg:p-8 shadow-[0_2px_8px_rgba(17,18,21,0.03)] hover:shadow-[0_8px_24px_rgba(17,18,21,0.07)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#565862] group-hover:text-[#eb4c2a] transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
                PREVIOUS PROJECT
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-mono text-xs text-[#8a8c98]">{prevProject.number}</span>
              <h4 className="font-sans text-xl lg:text-2xl font-bold tracking-tight text-[#111215] group-hover:text-[#eb4c2a] transition-colors">
                {prevProject.title}
              </h4>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#565862] line-clamp-2">
              {prevProject.shortDesc}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(17,18,21,0.06)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#8a8c98] tracking-widest">
              {prevProject.category}
            </span>
            <span className="font-mono text-xs font-semibold text-[#111215] group-hover:text-[#eb4c2a]">
              Read Case Study →
            </span>
          </div>
        </Link>

        {/* Next Project Card */}
        <Link
          href={`/projects/${nextProject.id}`}
          className="group relative flex flex-col justify-between bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 lg:p-8 shadow-[0_2px_8px_rgba(17,18,21,0.03)] hover:shadow-[0_8px_24px_rgba(17,18,21,0.07)] hover:-translate-y-0.5 transition-all duration-300 text-right md:text-left"
        >
          <div>
            <div className="flex items-center justify-end md:justify-start gap-2 mb-3 text-[#565862] group-hover:text-[#eb4c2a] transition-colors">
              <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
                NEXT PROJECT
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="flex items-baseline justify-end md:justify-start gap-2 mb-2">
              <span className="font-mono text-xs text-[#8a8c98]">{nextProject.number}</span>
              <h4 className="font-sans text-xl lg:text-2xl font-bold tracking-tight text-[#111215] group-hover:text-[#eb4c2a] transition-colors">
                {nextProject.title}
              </h4>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#565862] line-clamp-2">
              {nextProject.shortDesc}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(17,18,21,0.06)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#8a8c98] tracking-widest">
              {nextProject.category}
            </span>
            <span className="font-mono text-xs font-semibold text-[#111215] group-hover:text-[#eb4c2a]">
              Read Case Study →
            </span>
          </div>
        </Link>
      </div>

      {/* "All Projects" Strip */}
      <div className="bg-white border border-[rgba(17,18,21,0.08)] rounded-[2px] p-6 shadow-[0_2px_8px_rgba(17,18,21,0.03)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(17,18,21,0.06)]">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#eb4c2a]" />
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-[#111215]">
              ALL PROJECTS INDEX
            </span>
          </div>
          <Link
            href="/#projects"
            className="font-mono text-xs text-[#565862] hover:text-[#eb4c2a] transition-colors"
          >
            Back to Portfolio Overview →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allProjects.map((p) => {
            const isCurrent = p.id === currentProject.id;
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`p-3 rounded-[2px] border transition-all duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#f8f8f5] border-[#eb4c2a] ring-1 ring-[#eb4c2a]/20 shadow-xs'
                    : 'bg-white border-[rgba(17,18,21,0.06)] hover:border-[rgba(17,18,21,0.18)] hover:bg-[#fafaf7]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-bold text-[#eb4c2a]">
                    {p.number}
                  </span>
                  {isCurrent && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#eb4c2a]" />
                  )}
                </div>
                <span className="font-sans text-xs font-semibold text-[#111215] truncate">
                  {p.title}
                </span>
                <span className="font-mono text-[9px] text-[#8a8c98] truncate mt-0.5">
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
