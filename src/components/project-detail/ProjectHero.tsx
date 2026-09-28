'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles, Terminal } from 'lucide-react';

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
  const primaryMedia = project.media && project.media.length > 0 ? project.media[0] : null;

  return (
    <header className="relative pt-24 pb-16 sm:pb-20 border-b border-[rgba(17,18,21,0.08)] bg-[#f7f6f0] overflow-hidden">
      {/* Editorial ambient spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 pointer-events-none opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(235, 76, 42, 0.08) 0%, rgba(247, 246, 240, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle crumpled paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply bg-repeat"
        style={{
          backgroundImage: "url('/textures/crumpled-paper.jpg')",
          backgroundSize: '800px 800px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb Navigation & Pagination Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-[rgba(17,18,21,0.08)]">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono font-medium text-[#111215] bg-white border border-[rgba(17,18,21,0.12)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#eb4c2a] hover:text-[#eb4c2a] hover:shadow-[0_4px_12px_rgba(235,76,42,0.1)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#eb4c2a] transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${prevProject.id}`}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs text-[#111215] bg-white border border-[rgba(17,18,21,0.1)] hover:border-[#eb4c2a] hover:text-[#eb4c2a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
              title={`Previous: ${prevProject.title}`}
            >
              <span className="text-[#8a8c98] group-hover:text-[#eb4c2a] transition-colors">←</span>
              <span>Prev</span>
            </Link>

            <span className="text-[#8a8c98] px-0.5 text-xs font-mono" aria-hidden="true">
              /
            </span>

            <Link
              href={`/projects/${nextProject.id}`}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs text-[#111215] bg-white border border-[rgba(17,18,21,0.1)] hover:border-[#eb4c2a] hover:text-[#eb4c2a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
              title={`Next: ${nextProject.title}`}
            >
              <span>Next</span>
              <span className="text-[#8a8c98] group-hover:text-[#eb4c2a] transition-colors">→</span>
            </Link>
          </div>
        </div>

        {/* ── 12-Column Hero Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Project Info (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Monospace Eyebrow in vermilion/orange-red */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#eb4c2a]/10 border border-[#eb4c2a]/20 font-mono text-[11px] font-bold uppercase tracking-wider text-[#eb4c2a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] animate-pulse" />
                {project.number}
              </span>

              <div className="flex items-center gap-2 font-mono text-xs text-[#565862]">
                <span className="font-semibold text-[#111215] uppercase tracking-wide">
                  {project.category}
                </span>
                <span className="text-[#8a8c98]">·</span>
                <span>{project.year}</span>
              </div>
            </div>

            {/* Title: Bold geometric sans, tight tracking */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[52px] font-black text-[#111215] tracking-[-0.035em] font-display leading-[1.06]">
              {project.title}
            </h1>

            {/* Short description */}
            <p className="text-base sm:text-lg text-[#565862] leading-relaxed max-w-2xl font-sans">
              {project.shortDesc}
            </p>

            {/* Role & Focus Points Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-mono font-medium bg-[#111215] text-[#f8f8f5] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a]" />
                Role: {project.role}
              </span>

              {project.focusPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-[2px] text-xs font-mono text-[#565862] bg-white border border-[rgba(17,18,21,0.08)] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {point}
                </span>
              ))}
            </div>

            {/* Links / GitHub Action Buttons with magnetic hover feel */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-3">
                {project.links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold bg-[#111215] text-white shadow-[0_4px_16px_rgba(17,18,21,0.18)] hover:bg-[#eb4c2a] hover:shadow-[0_8px_24px_rgba(235,76,42,0.3)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eb4c2a]"
                    whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                  >
                    <span>View {link.label} Repository</span>
                    <ExternalLink className="w-4 h-4 opacity-80" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Device Frame (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[6px] p-3 bg-gradient-to-b from-white via-[#fcfbfa] to-[#edece4] border border-[rgba(17,18,21,0.12)] shadow-[0_16px_40px_-8px_rgba(17,18,21,0.12),0_1px_3px_rgba(17,18,21,0.06)] overflow-hidden group">
              {/* Browser/Device Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[rgba(17,18,21,0.08)]">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/60" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 text-[10px] font-mono text-[#565862] truncate max-w-[200px]">
                  <span className="text-[#8a8c98]">https://</span>
                  <span>{project.id}.omkaranarse.dev</span>
                </div>
                <div className="w-8" aria-hidden="true" />
              </div>

              {/* Screen Mockup Canvas Area */}
              <div className="relative w-full h-64 sm:h-72 rounded-[4px] bg-[#111215] text-[#f8f8f5] flex flex-col justify-between p-5 overflow-hidden border border-black/20 shadow-inner">
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
                    {/* Background subtle grid pattern */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                      aria-hidden="true"
                    />

                    {/* Atmospheric ambient glow */}
                    <div
                      className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full opacity-35 blur-2xl pointer-events-none"
                      style={{ backgroundColor: project.thumbColor || '#eb4c2a' }}
                      aria-hidden="true"
                    />

                    {/* Top simulated status banner */}
                    <div className="relative flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-[#eb4c2a] bg-[#eb4c2a]/15 px-2 py-0.5 rounded border border-[#eb4c2a]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#eb4c2a] animate-ping" />
                        STAGE: {project.stage.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-[#8a8c98] flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-[#eb4c2a]" />
                        {project.meta}
                      </span>
                    </div>

                    {/* Middle title and visual badge */}
                    <div className="relative z-10 my-auto py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-[4px] flex items-center justify-center font-mono font-bold text-sm text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/20"
                          style={{ backgroundColor: project.thumbColor || '#2b6f6a' }}
                        >
                          {project.thumbLabel}
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-[#8a8c98] uppercase tracking-wider block">
                            PROJECT IDENTIFIER
                          </span>
                          <span className="font-mono text-xs font-bold text-[#eb4c2a]">
                            {project.tagLabel || project.title}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold font-display text-white tracking-tight leading-snug">
                        {project.title}
                      </h2>
                      <p className="text-xs text-[#9698a3] line-clamp-2 mt-1">
                        {project.shortDesc}
                      </p>
                    </div>

                    {/* Bottom telemetry pills */}
                    <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-white/10 text-[10px] font-mono text-[#8a8c98]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        <span className="text-white/80">CORE STATUS: LIVE</span>
                      </div>
                      <span className="text-[#8a8c98] truncate max-w-[140px]">
                        {project.stack[0] || 'Clean Architecture'}
                      </span>
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
