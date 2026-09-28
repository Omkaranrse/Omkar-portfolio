import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Contact from '@/components/Contact';
import Interactions from '@/components/Interactions';
import LanyardCard from '@/components/LanyardCard';
import { experiences } from '@/data/experience';

export const metadata: Metadata = {
  title: 'Professional Experience — Omkar Anarse',
  description:
    'Work history and engineering roles of Omkar Anarse — Flutter Developer at Metaphi and My Job Park, building scalable mobile and AI client architectures.',
  openGraph: {
    title: 'Professional Experience — Omkar Anarse',
    description:
      'Work history and engineering roles of Omkar Anarse — Flutter Developer at Metaphi and My Job Park.',
  },
};

export default function ExperiencePage() {
  return (
    <>
      <Nav />

      <main id="main" className="project-detail-page">
        {/* ── Editorial Header ── */}
        <div className="project-detail-hero">
          <div className="pd-wrap">
            {/* Breadcrumb Navigation */}
            <div className="pd-breadcrumbs">
              <Link href="/" className="pd-back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </Link>
              <div className="pd-category-badge">02 ROLES · WORK HISTORY</div>
            </div>

            <div className="exp-header" style={{ marginBottom: 0 }}>
              <div className="exp-header-top">
                <span className="exp-eyebrow">Work History</span>
                <span className="exp-count">02 POSITIONS</span>
              </div>
              <h1 className="exp-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
                Professional Experience.
              </h1>
              <p className="exp-subtitle" style={{ maxWidth: 680, marginTop: 12 }}>
                Hover to inspect badge details or click any lanyard card to trigger swing physics.
                Below each badge is a comprehensive breakdown of responsibilities and technical accomplishments.
              </p>
            </div>
          </div>
        </div>

        {/* ── Interactive Lanyard Cards Section ── */}
        <section className="exp-section" style={{ borderBottom: 'none' }}>
          <div className="wrap">
            <div className="lanyard-cards-grid reveal in">
              {experiences.map((exp, i) => (
                <LanyardCard key={i} {...exp} />
              ))}
            </div>

            {/* ── In-Depth Timeline & Responsibilities Breakdown ── */}
            <div className="pd-content" style={{ marginTop: 64 }}>
              <h2 className="pd-section-title" style={{ marginBottom: 32 }}>
                Detailed Role Breakdown
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="pd-content-card"
                    style={{
                      padding: '32px 36px',
                      borderRadius: 20,
                      background: 'var(--card-bg, #ffffff)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      <div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.75rem',
                            color: 'var(--accent)',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {exp.type}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0 2px', color: 'var(--ink)' }}>
                          {exp.role} <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>at {exp.companyName}</span>
                        </h3>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono), monospace',
                          fontSize: '0.8125rem',
                          color: 'var(--ink-faint)',
                          background: 'rgba(0,0,0,0.04)',
                          padding: '4px 10px',
                          borderRadius: 8,
                        }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                      {exp.description}
                    </p>

                    {exp.responsibilities && (
                      <div style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: 'var(--ink)',
                            marginBottom: 10,
                          }}
                        >
                          Key Engineering Contributions:
                        </div>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                          {exp.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.75rem', color: 'var(--ink-faint)', marginRight: 4 }}>
                        Technologies:
                      </span>
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontFamily: 'var(--font-mono), monospace',
                            fontSize: '0.75rem',
                            padding: '3px 10px',
                            borderRadius: 6,
                            background: 'var(--bg-warm, #f7f6f2)',
                            border: '1px solid var(--border)',
                            color: 'var(--ink)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact & Social Dock Area ── */}
        <Contact />
      </main>

      <Interactions />
    </>
  );
}
