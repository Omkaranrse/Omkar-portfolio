import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Work from '@/components/Work';
import Contact from '@/components/Contact';
import Interactions from '@/components/Interactions';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Engineering Projects & Systems — Omkar Anarse',
  description:
    'Featured projects and technical systems built by Omkar Anarse — RAG pipelines, LangGraph multi-agent systems, Flutter cross-platform mobile apps, and full-stack software.',
  openGraph: {
    title: 'Engineering Projects & Systems — Omkar Anarse',
    description:
      'Featured projects and technical systems built by Omkar Anarse — AI systems, Flutter mobile apps, and distributed platforms.',
  },
};

export default function WorkPage() {
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
              <div className="pd-category-badge">0{projects.length} CASE STUDIES · PORTFOLIO</div>
            </div>

            <div className="work-header" style={{ marginBottom: 0 }}>
              <div className="work-header-top">
                <span className="work-eyebrow">All Projects</span>
                <span className="work-count">0{projects.length} CASE STUDIES</span>
              </div>
              <h1 className="work-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
                Engineering projects &amp; systems.
              </h1>
              <p className="work-subtitle" style={{ maxWidth: 680, marginTop: 12 }}>
                Explore production systems spanning LLM agentic pipelines, RAG retrieval engines, cross-platform
                Flutter applications, and resilient software architectures. Click any card to inspect full technical case studies.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Work Component with Liquid Glass Filters & 3D Cards ── */}
        <Work />

        {/* ── Contact & Social Dock Area ── */}
        <Contact />
      </main>

      <Interactions />
    </>
  );
}
