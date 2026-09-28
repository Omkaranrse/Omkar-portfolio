'use client';

import LanyardCard from './LanyardCard';
import { experiences } from '@/data/experience';

export default function Experience() {

  return (
    <section id="experience" className="exp-section">
      <div className="wrap">
        <header className="exp-header reveal-text">
          <div className="exp-header-top">
            <span className="exp-eyebrow">Work History</span>
            <span className="exp-count">02 ROLES</span>
          </div>
          <h2 className="exp-title">Professional Experience.</h2>
          <p className="exp-subtitle">
            Hover to inspect badge details or click any lanyard card to trigger swing physics.
          </p>
        </header>

        {/* ── Interactive Lanyard Drop Cards Grid with Choreographed Stagger ── */}
        <div className="lanyard-cards-grid reveal-stagger">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="stagger-item"
              style={{ '--stagger-index': Math.min(i, 4) } as React.CSSProperties}
            >
              <LanyardCard {...exp} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
