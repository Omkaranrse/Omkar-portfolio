'use client';

import * as React from 'react';
import { techStack } from '@/data/techStack';
import Logo3DCarousel from './Logo3DCarousel';
import GravityPills from './GravityPills';

export default function Overview() {
  return (
    <section id="skills" className="skills-section grid-bg">
      <div className="wrap">
        {/* ── Header ── */}
        <header className="skills-header reveal">
          <div className="skills-header-top">
            <span className="skills-eyebrow">Stack &amp; Expertise</span>
            <span className="skills-count">
              {techStack.length}+ TECHNOLOGIES
            </span>
          </div>
          <h2 className="skills-title">Technical Skills &amp; Systems.</h2>
          <p className="skills-subtitle">
            Tools, frameworks, and architecture primitives I use to build
            scalable AI pipelines and mobile applications.
          </p>
        </header>

        {/* ── 01: 3D Stack Marquee Header ── */}
        <div className="skills-block-header reveal" style={{ marginBottom: 16 }}>
          <span className="skills-block-tag">01 · 3D Stack Marquee</span>
          <span className="skills-block-hint">
            Drag or hover to inspect magnification
          </span>
        </div>

        {/* ── 01: 3D Stack Marquee (Full Screen Width, NO Background) ── */}
        <div className="skills-carousel-fullbleed reveal" style={{ marginBottom: 52 }}>
          <Logo3DCarousel
            items={techStack}
            itemHeight={46}
            speed={26}
            gap={28}
            maxScale={1.5}
            minScale={0.38}
            maxBlur={2.5}
            direction="left"
          />
        </div>

        {/* ── 02: Interactive Gravity Pills (MONO) ── */}
        <div className="skills-bubblepit-block reveal">
          <div className="skills-block-header">
            <span className="skills-block-tag">
              02 · Interactive Gravity Pills
            </span>
            <span className="skills-block-hint">
              Drag &amp; fling pills · 2D physics with real-time squish &amp; inertia
            </span>
          </div>
          <GravityPills
            badgesList={[
              'Flutter',
              'Python',
              'FastAPI',
              'Dart',
              'React',
              'Next.js',
              'TypeScript',
              'PyTorch',
              'LangChain',
              'LangGraph',
              'Groq',
              'ChromaDB',
              'PostgreSQL',
              'Firebase',
              'Docker',
              'Swift',
              'Riverpod',
              'Clean Architecture',
              'REST APIs',
              'State Management',
              'Deep Learning',
              'Git & GitHub',
            ]}
          />
        </div>
      </div>
    </section>
  );
}
