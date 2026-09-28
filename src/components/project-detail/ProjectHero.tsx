'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';

interface ProjectHeroProps {
  project: Project;
  prevProject: Project;
  nextProject: Project;
}

export default function ProjectHero({
  project,
  prevProject,
  nextProject,
}: ProjectHeroProps) {
  const reducedMotion = useReducedMotion();

  // Primary media if provided
  const primaryMedia = project.media && project.media.length > 0 ? project.media[0] : null;

  return (
    <header className="relative pt-24 pb-14 border-b border-[rgba(18,19,22,0.08)] bg-[#f3f2ec]/65 overflow-hidden">
      {/* Subtle crumpled paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply bg-repeat"
        style={{
          backgroundImage: "url('/textures/crumpled-paper.jpg')",
          backgroundSize: '800px 800px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb Navigation & Pagination Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-5 border-b border-[rgba(18,19,22,0.12)]">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-[#111215] bg-white border border-[rgba(18,19,22,0.12)] shadow-xs hover:border-[#eb4c2a] hover:text-[#eb4c2a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
          >
            <span
              className="text-[#eb4c2a] transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              ←
            </span>
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-[#565862]">
            <Link
              href={`/projects/${prevProject.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#111215] bg-white/80 border border-[rgba(18,19,22,0.12)] hover:border-[#eb4c2a] hover:text-[#eb4c2a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
              title={`Previous: ${prevProject.title}`}
            >
              <span>← Prev</span>
            </Link>

            <span className="text-[#8a8c98] px-1" aria-hidden="true">
              ·
            </span>

            <Link
              href={`/projects/${nextProject.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#111215] bg-white/80 border border-[rgba(18,19,22,0.12)] hover:border-[#eb4c2a] hover:text-[#eb4c2a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
              title={`Next: ${nextProject.title}`}
            >
              <span>Next →</span>
            </Link>
          </div>
        </div>

        {/* ── 12-Column Hero Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Project Info (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Monospace Eyebrow in vermilion/orange-red */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#8a8c98]">
              <span className="font-bold text-[#eb4c2a]">{project.number}</span>
              <span className="text-[#8a8c98]">/</span>
              <span className="text-[#111215] font-semibold">{project.category}</span>
              <span className="text-[#8a8c98]">·</span>
              <span>{project.year}</span>
            </div>

            {/* Title: Bold geometric sans, tight tracking */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111215] tracking-tight font-display leading-[1.08]">
              {project.title}
            </h1>

            {/* Short description */}
            <p className="text-base sm:text-lg text-[#565862] leading-relaxed max-w-2xl font-sans">
              {project.shortDesc}
            </p>

            {/* Role & Focus Points Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-mono font-medium bg-[#111215] text-[#f8f8f5] shadow-xs">
                Role: {project.role}
              </span>

              {project.focusPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono text-[#565862] bg-white border border-[rgba(18,19,22,0.1)]"
                >
                  {point}
                </span>
              ))}
            </div>

            {/* Links / GitHub Action Buttons */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-3">
                {project.links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#111215] text-white shadow-sm hover:bg-[#eb4c2a] hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
                    whileHover={reducedMotion ? {} : { scale: 1.02, translateY: -1 }}
                    whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  >
                    <span>View {link.label} Repository</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Device / Screenshot Frame (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg p-2.5 bg-gradient-to-b from-white to-[#eceae2] border border-[rgba(18,19,22,0.12)] shadow-md overflow-hidden group">
              {/* Browser/Device Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(18,19,22,0.08)]">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-[10px] font-mono text-[#8a8c98] truncate max-w-[160px]">
                  {project.id}.omkaranarse.dev
                </div>
                <div className="w-8" aria-hidden="true" />
              </div>

              {/* Screen Mockup Area */}
              <div className="relative w-full h-56 sm:h-64 rounded-md bg-[#111215] text-[#f8f8f5] flex flex-col justify-between p-5 overflow-hidden">
                {primaryMedia ? (
                  <Image
                    src={primaryMedia.src}
                    alt={primaryMedia.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    {/* Atmospheric ambient glow */}
                    <div
                      className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full opacity-30 blur-2xl pointer-events-none"
                      style={{ backgroundColor: project.thumbColor || '#eb4c2a' }}
                      aria-hidden="true"
                    />

                    {/* Top simulated status banner */}
                    <div className="relative flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#eb4c2a] bg-[#eb4c2a]/10 px-2 py-0.5 rounded border border-[#eb4c2a]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] animate-pulse" />
                        SYSTEM STAGE: {project.stage.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-[#8a8c98]">
                        {project.meta}
                      </span>
                    </div>

                    {/* Middle title and visual badge */}
                    <div className="relative z-10 my-auto">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center font-mono font-bold text-sm text-white mb-2 shadow-sm"
                        style={{ backgroundColor: project.thumbColor || '#2b6f6a' }}
                      >
                        {project.thumbLabel}
                      </div>
                      <h2 className="text-xl font-bold font-display text-white tracking-tight">
                        {project.title}
                      </h2>
                      <p className="text-xs text-[#9698a3] line-clamp-2 mt-1">
                        {project.shortDesc}
                      </p>
                    </div>

                    {/* Bottom active telemetry pills */}
                    <div className="relative z-10 flex items-center gap-2 pt-2 border-t border-white/10 text-[10px] font-mono text-[#8a8c98]">
                      <span>STATUS: DEPLOYED</span>
                      <span>·</span>
                      <span>{project.stack[0] || 'Clean Architecture'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { ProjectHero };

