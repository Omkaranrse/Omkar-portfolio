'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { ExternalLink, Calendar, User, Tag } from 'lucide-react';
import {
  fadeUp,
  staggerContainer,
  slideInLeft,
  slideInRight,
  viewportOnce,
} from '@/lib/motion';

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <header className="relative pt-28 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
      {/* Gradient background derived from project thumbColor */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${project.thumbColor} 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, ${project.thumbColor} 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #111215 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={reducedMotion ? undefined : staggerContainer(0.1)}
          initial={reducedMotion ? undefined : 'hidden'}
          animate={reducedMotion ? undefined : 'visible'}
          className="space-y-6"
        >
          {/* Eyebrow row */}
          <motion.div
            variants={reducedMotion ? undefined : fadeUp}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eb4c2a]/10 border border-[#eb4c2a]/20 font-mono text-[11px] font-bold uppercase tracking-wider text-[#eb4c2a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] animate-pulse" />
              {project.number}
            </span>
            <span className="font-mono text-xs text-[#565862] uppercase tracking-wide font-medium">
              {project.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={reducedMotion ? undefined : fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111215] tracking-[-0.03em] font-display leading-[1.05] max-w-3xl"
          >
            {project.title}
          </motion.h1>

          {/* Short description */}
          <motion.p
            variants={reducedMotion ? undefined : fadeUp}
            className="text-lg sm:text-xl text-[#565862] leading-relaxed max-w-2xl font-sans"
          >
            {project.shortDesc}
          </motion.p>

          {/* Meta pills row */}
          <motion.div
            variants={reducedMotion ? undefined : fadeUp}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#111215] text-[#f8f8f5]">
              <User className="w-3 h-3 opacity-70" />
              {project.role}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#565862] bg-white border border-[rgba(17,18,21,0.1)]">
              <Calendar className="w-3 h-3 opacity-60" />
              {project.year}
            </span>
            {project.focusPoints.map((point) => (
              <span
                key={point}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#565862] bg-white border border-[rgba(17,18,21,0.1)]"
              >
                <Tag className="w-3 h-3 opacity-50" />
                {point}
              </span>
            ))}
          </motion.div>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <motion.div
              variants={reducedMotion ? undefined : fadeUp}
              className="flex flex-wrap gap-3 pt-3"
            >
              {project.links.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#111215] text-white shadow-[0_4px_16px_rgba(17,18,21,0.18)] hover:bg-[#eb4c2a] hover:shadow-[0_8px_24px_rgba(235,76,42,0.3)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
                  whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                >
                  <span>View {link.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </motion.a>
              ))}
            </motion.div>
          )}

          {/* Metrics strip — quick impact numbers */}
          {project.metrics && project.metrics.length > 0 && (
            <motion.div
              variants={reducedMotion ? undefined : fadeUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-4 border-t border-[rgba(17,18,21,0.08)]"
            >
              {project.metrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  variants={reducedMotion ? undefined : fadeUp}
                  className="group"
                >
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[#8a8c98] block mb-1 group-hover:text-[#eb4c2a] transition-colors">
                    {metric.label}
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#111215] tracking-tight">
                    {metric.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
}

export { ProjectHero };
