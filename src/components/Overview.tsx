'use client';

import * as React from 'react';
import { techStack } from '@/data/techStack';
import Logo3DCarousel from './Logo3DCarousel';
import GravityPills from './GravityPills';

export default function Overview() {
  return (
    <section id="skills" className="skills-section">
      <div className="wrap">
        {/* ── Header ── */}
        <header className="skills-header reveal-text">
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

        {/* ── Mobile Skills Flow (Clean, Compact, Zero Empty Space, Mobile Only) ── */}
        <div className="skills-mobile-view">
          <div className="skills-mobile-card">
            <div className="skills-mobile-category">
              <span className="skills-mobile-tag">AI &amp; Intelligent Systems</span>
              <div className="skills-mobile-chips">
                {['Python', 'LangChain', 'LangGraph', 'PyTorch', 'ChromaDB', 'Groq', 'Deep Learning'].map((s) => (
                  <span key={s} className="skills-mobile-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="skills-mobile-category">
              <span className="skills-mobile-tag">Mobile Engineering</span>
              <div className="skills-mobile-chips">
                {['Flutter', 'Dart', 'Swift', 'Riverpod', 'Clean Architecture', 'State Management'].map((s) => (
                  <span key={s} className="skills-mobile-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="skills-mobile-category">
              <span className="skills-mobile-tag">Web &amp; Backend Architecture</span>
              <div className="skills-mobile-chips">
                {['Next.js', 'React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Firebase', 'REST APIs'].map((s) => (
                  <span key={s} className="skills-mobile-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="skills-mobile-category">
              <span className="skills-mobile-tag">Cloud &amp; Tooling</span>
              <div className="skills-mobile-chips">
                {['Docker', 'Git &amp; GitHub'].map((s) => (
                  <span key={s} className="skills-mobile-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 01: 3D Stack Marquee (Full Screen Width, Desktop Only) ── */}
        <div className="skills-carousel-fullbleed reveal">
          <Logo3DCarousel
            items={techStack}
            itemHeight={52}
            speed={50}
            gap={20}
            maxScale={1.2}
            minScale={0.95}
            maxBlur={0}
            blurStart={75}
            blurEnd={92}
            maxFrameWidth={1140}
            pauseOnHover={false}
            enableDrag={false}
            direction="left"
          />
        </div>

        {/* ── Interactive Gravity Pills (Desktop Only) ── */}
        <div className="skills-bubblepit-block reveal">
          <div className="skills-block-header" style={{ justifyContent: 'center', marginBottom: 16 }}>
            <span className="skills-block-tag" style={{ fontSize: '0.8125rem', letterSpacing: '0.06em' }}>
              Skills
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
