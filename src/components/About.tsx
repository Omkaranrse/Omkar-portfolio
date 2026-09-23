'use client';

import Image from 'next/image';
import aboutPhoto from '@/images/portrait.jpg';

export default function About() {
  return (
    <>
      {/* ── Section A: Identity + Portrait ──────── */}
      <section id="about" className="about-section">
        {/* Top right label */}
        <div className="about-header-tag" aria-hidden="true">
          <div className="about-arrow-down">
            <svg width="24" height="120" viewBox="0 0 37 180" fill="none">
              <path
                d="M17.5 0 L17.5 165 M5 152 L17.5 167 L30 152"
                stroke="rgba(43, 43, 43, 0.45)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="about-tag-text">ABOUT ME.</span>
        </div>

        <div className="about-container">
          {/* Left Column: arch portrait + orbital halo */}
          <div className="about-visual">
            <div className="about-grid-backdrop" aria-hidden="true" />

            {/* Back of orbital halo */}
            <svg className="about-halo-back" viewBox="0 0 560 560" fill="none" aria-hidden="true">
              <path
                d="M 524.3 221.1 A 260 82 -20 0 0 35.7 398.9"
                stroke="rgba(43, 43, 43, 0.45)"
                strokeWidth="1.2"
              />
            </svg>

            {/* Arch-shaped portrait */}
            <div className="about-arch-frame">
              <Image
                src={aboutPhoto}
                alt="Omkar Anarse — AI & Mobile Systems Engineer"
                fill
                sizes="(max-width: 768px) 90vw, 440px"
                priority
                style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
                className="about-arch-img"
              />
            </div>

            {/* Front of orbital halo */}
            <svg className="about-halo-front" viewBox="0 0 560 560" fill="none" aria-hidden="true">
              <path
                d="M 35.7 398.9 A 260 82 -20 0 0 524.3 221.1"
                stroke="rgba(43, 43, 43, 0.45)"
                strokeWidth="1.2"
              />
              <path
                d="M 68 377 L 71.5 390.5 L 85 388 L 73.5 397 L 82 409 L 69 401.5 L 65 415 L 63 401.5 L 50 409 L 58.5 397 L 47 388 L 60.5 390.5 Z"
                fill="#f45a3d"
              />
              <circle cx="42" cy="402" r="2.8" fill="rgba(80, 80, 80, 0.75)" />
              <circle cx="33" cy="405" r="1.8" fill="rgba(80, 80, 80, 0.6)" />
              <circle cx="495" cy="235" r="2.8" fill="rgba(80, 80, 80, 0.75)" />
            </svg>
          </div>

          {/* Center: bio */}
          <div className="about-content">
            <h2 className="about-title">
              <span className="about-title-line1">AI &amp; MOBILE</span>
              <span className="about-title-line2">SYSTEMS.</span>
            </h2>

            <div className="about-description">
              <p>
                I work across the full depth of an AI product — RAG pipelines,
                LangGraph agents, and the FastAPI backends that serve them —
                and across mobile, building Flutter and Swift applications that
                put those systems in front of real users.
              </p>
              <p>
                I'm drawn to the seam where backend intelligence meets the
                experience layer: making AI-powered products feel reliable,
                fast, and natural to use.
              </p>
              <div className="about-meta-tags">
                <span>Mumbai, India</span>
                <span>AI Systems</span>
                <span>Mobile Engineering</span>
                <span>Product Development</span>
              </div>
            </div>
          </div>

          {/* Right: rotating badge */}
          <div className="about-badge-col" aria-hidden="true">
            <div className="about-badge-rotator">
              <svg className="about-badge-svg" viewBox="0 0 160 160" width="130" height="130">
                <defs>
                  <path
                    id="aboutCircleTextPath"
                    d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                  />
                </defs>
                <text fontSize="9" letterSpacing="3" fill="rgba(43, 43, 43, 0.85)" className="about-badge-text">
                  <textPath href="#aboutCircleTextPath">
                    AI/ML SYSTEMS • MOBILE DEV • PROBLEM SOLVER •
                  </textPath>
                </text>
                <g stroke="rgba(43, 43, 43, 0.85)" strokeWidth="1.6" strokeLinecap="round">
                  <line x1="80" y1="67" x2="80" y2="93" />
                  <line x1="67" y1="80" x2="93" y2="80" />
                  <line x1="71" y1="71" x2="89" y2="89" />
                  <line x1="71" y1="89" x2="89" y2="71" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section B: How I Build ───────────────── */}
      <section className="process-section grid-bg">
        <div className="wrap">
          <header className="process-header reveal">
            <span className="process-eyebrow">Process</span>
            <h2 className="process-title">How I build.</h2>
          </header>

          <div className="process-grid">
            {[
              {
                num: '01',
                heading: 'UNDERSTAND',
                body: 'Define the problem, users and constraints before writing code.',
              },
              {
                num: '02',
                heading: 'DESIGN',
                body: 'Shape the experience and system architecture simultaneously.',
              },
              {
                num: '03',
                heading: 'BUILD',
                body: 'Implement the product and integrate the systems iteratively.',
              },
              {
                num: '04',
                heading: 'ITERATE',
                body: 'Test, improve and refine with real-world feedback.',
              },
            ].map((step) => (
              <div key={step.num} className="process-step reveal">
                <span className="process-step-num" aria-hidden="true">{step.num}</span>
                <h3 className="process-step-heading">{step.heading}</h3>
                <p className="process-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section C: Skills taxonomy ───────────── */}
      <section className="skills-section">
        <div className="wrap">
          <header className="skills-header reveal">
            <span className="skills-eyebrow">Expertise</span>
            <h2 className="skills-title">Technical expertise.</h2>
          </header>

          <div className="skills-grid reveal">
            {[
              {
                area: 'AI & Backend',
                items: ['Python', 'FastAPI', 'LangChain', 'LangGraph', 'RAG', 'LLM APIs', 'PostgreSQL', 'Redis'],
              },
              {
                area: 'Mobile',
                items: ['Flutter', 'Dart', 'Swift', 'SwiftUI', 'UIKit', 'Firebase', 'Riverpod'],
              },
              {
                area: 'Web',
                items: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS'],
              },
              {
                area: 'Tools & Infrastructure',
                items: ['Git', 'GitHub', 'Docker', 'Firebase', 'Supabase', 'REST APIs', 'ChromaDB'],
              },
            ].map((group) => (
              <div key={group.area} className="skills-group">
                <h3 className="skills-group-heading">{group.area}</h3>
                <ul className="skills-list">
                  {group.items.map((item) => (
                    <li key={item} className="skills-item">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
