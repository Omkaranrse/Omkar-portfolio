'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects, type Project } from '@/data/projects';

import ApertureCard from './ApertureCard';
import LiquidGlassButton from './LiquidGlassButton';

type FilterCategory = 'All' | 'AI Systems' | 'Mobile' | 'System Design';

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const getDomain = (project: Project): FilterCategory => {
    if (project.category.includes('AI')) return 'AI Systems';
    if (project.category.includes('MOBILE')) return 'Mobile';
    return 'System Design';
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return getDomain(project) === activeFilter;
  });

  const filterOptions: FilterCategory[] = ['All', 'AI Systems', 'Mobile', 'System Design'];

  return (
    <section id="work" className="work-section grid-bg">
      <div className="wrap">

        {/* ── Section Header ── */}
        <header className="work-header reveal-text">
          <div className="work-header-top">
            <span className="work-eyebrow">Featured Work</span>
            <span className="work-count">0{projects.length} CASE STUDIES</span>
          </div>
          <div className="work-title-row">
            <h2 className="work-title">Engineering projects &amp; systems.</h2>
            <p className="work-subtitle">
              Hover over cards for 3D depth and click to read the complete technical case study and architecture breakdown.
            </p>
          </div>

          {/* ── Liquid Glass Filter Pills ── */}
          <div className="work-filters" role="tablist" aria-label="Filter projects by domain">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              const count = filter === 'All' ? projects.length : projects.filter((p) => getDomain(p) === filter).length;
              return (
                <LiquidGlassButton
                  key={filter}
                  size="sm"
                  surface={isActive ? 'dark' : 'dark'}
                  material={isActive ? 'frosted' : 'clear'}
                  tint={isActive ? 'rgba(235, 76, 42, 0.35)' : 'rgba(255, 255, 255, 0.08)'}
                  textColor={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    boxShadow: isActive ? '0 0 16px rgba(235, 76, 42, 0.3)' : undefined,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span>{filter}</span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono), monospace',
                        opacity: 0.75,
                        background: 'rgba(255, 255, 255, 0.12)',
                        padding: '1px 6px',
                        borderRadius: 9999,
                      }}
                    >
                      {count}
                    </span>
                  </span>
                </LiquidGlassButton>
              );
            })}
          </div>
        </header>

        {/* ── Aperture 3D Project Cards Grid with Choreographed Stagger ── */}
        <div className="work-cards-grid reveal-stagger">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="stagger-item"
              style={{ '--stagger-index': Math.min(idx, 4) } as React.CSSProperties}
            >
              <ApertureCard project={project} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
