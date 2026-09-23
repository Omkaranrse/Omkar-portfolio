'use client';

import Image from 'next/image';
import aboutPhoto from '@/images/portrait.jpg';

export default function About() {
  const processSteps = [
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
  ];

  const skillGroups = [
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
  ];

  return (
    <>
      {/* ── Section A: Identity + Portrait ──────── */}
      <section id="about" className="about-section">
        <div className="wrap">
          <div className="about-header-tag reveal">
            <span className="about-tag-text">ABOUT ME.</span>
          </div>

          <div className="about-container">
            {/* Left Column: Architecturally framed portrait */}
            <div className="about-visual reveal">
              <div className="about-arch-frame">
                <Image
                  src={aboutPhoto}
                  alt="Omkar Anarse — AI & Mobile Systems Engineer"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  priority
                  style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                  className="about-arch-img"
                />
                <div className="about-frame-badge">
                  <span className="about-frame-location">MUMBAI, INDIA</span>
                  <div className="about-frame-status">
                    <span className="status-dot" />
                    <span>AVAILABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bio & Philosophy */}
            <div className="about-content reveal">
              <h2 className="about-title">
                <span className="about-title-line1">AI &amp; MOBILE</span>
                <span className="about-title-line2">SYSTEMS.</span>
              </h2>

              <div className="about-description">
                <p>
                  I work across the full depth of an AI product — <strong>RAG pipelines</strong>,{' '}
                  <strong>LangGraph agents</strong>, and the <strong>FastAPI backends</strong> that
                  serve them — and across mobile, building <strong>Flutter</strong> and{' '}
                  <strong>Swift</strong> applications that put those systems in front of real users.
                </p>
                <p>
                  I&apos;m drawn to the seam where backend intelligence meets the experience layer:
                  making AI-powered products feel reliable, fast, and natural to use.
                </p>
                <div className="about-meta-tags">
                  <span className="mono-tag">Mumbai, India</span>
                  <span className="mono-tag">AI Systems</span>
                  <span className="mono-tag">Mobile Engineering</span>
                  <span className="mono-tag">Product Development</span>
                </div>
              </div>
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
            {processSteps.map((step) => (
              <div key={step.num} className="process-step reveal">
                <span className="process-step-num">{step.num}</span>
                <h3 className="process-step-heading">{step.heading}</h3>
                <p className="process-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section C: Technical Expertise ───────── */}
      <section className="skills-section">
        <div className="wrap">
          <header className="skills-header reveal">
            <span className="skills-eyebrow">Expertise</span>
            <h2 className="skills-title">Technical expertise.</h2>
          </header>

          <div className="skills-grid reveal">
            {skillGroups.map((group) => (
              <div key={group.area} className="skills-group">
                <h3 className="skills-group-heading">{group.area}</h3>
                <ul className="skills-list">
                  {group.items.map((item) => (
                    <li key={item} className="skills-item">
                      {item}
                    </li>
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
