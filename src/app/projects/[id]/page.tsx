import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, type Project } from '@/data/projects';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LiquidGlassButton from '@/components/LiquidGlassButton';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found — Omkar Anarse',
    };
  }

  return {
    title: `${project.title} — Case Study | Omkar Anarse`,
    description: project.shortDesc,
    openGraph: {
      title: `${project.title} — Case Study | Omkar Anarse`,
      description: project.shortDesc,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    notFound();
  }

  const project: Project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];

  return (
    <>
      <Nav />

      <main id="main" className="project-detail-page">
        {/* ── Top Header Navigation Bar ── */}
        <div className="project-detail-hero">
          <div className="wrap">
            <div className="pd-breadcrumbs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <LiquidGlassButton
                href="/#work"
                size="sm"
                icon="arrow"
                iconPosition="left"
                material="frosted"
                surface="dark"
                textColor="#ffffff"
              >
                Back to All Projects
              </LiquidGlassButton>

              <div className="pd-pagination-pills" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <LiquidGlassButton
                  href={`/projects/${prevProject.id}`}
                  size="sm"
                  surface="dark"
                  material="clear"
                  textColor="rgba(255, 255, 255, 0.8)"
                >
                  ← Previous
                </LiquidGlassButton>

                <LiquidGlassButton
                  href={`/projects/${nextProject.id}`}
                  size="sm"
                  surface="dark"
                  material="clear"
                  textColor="rgba(255, 255, 255, 0.8)"
                >
                  Next →
                </LiquidGlassButton>
              </div>
            </div>

            {/* ── Case Study Header ── */}
            <div className="pd-header-content">
              <div className="pd-header-meta">
                <span className="pd-number">{project.number}</span>
                <span className="pd-category">{project.category}</span>
                <span className="pd-sep">·</span>
                <span className="pd-year">{project.year}</span>
              </div>

              <h1 className="pd-title">{project.title}</h1>
              <p className="pd-lead">{project.shortDesc}</p>

              <div className="pd-role-tag">
                <span>Role: {project.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-Column Case Study Deep Dive Body ── */}
        <section className="pd-body-section">
          <div className="wrap">
            <div className="pd-grid">

              {/* Left Column */}
              <div className="pd-col-left">

                {/* Problem */}
                <div className="pd-block">
                  <h2 className="pd-block-label">01. The Problem</h2>
                  <p className="pd-text">{project.problem}</p>
                </div>

                {/* Approach */}
                <div className="pd-block">
                  <h2 className="pd-block-label">02. Engineering Approach</h2>
                  <ol className="pd-approach-list">
                    {project.approach.map((step, i) => (
                      <li key={i} className="pd-approach-item">
                        <span className="pd-approach-num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="pd-approach-text">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Result */}
                <div className="pd-block">
                  <h2 className="pd-block-label">03. Result &amp; Impact</h2>
                  <p className="pd-text">{project.result}</p>
                </div>

                {/* Stack */}
                <div className="pd-block">
                  <h2 className="pd-block-label">04. Technology Stack</h2>
                  <div className="pd-stack">
                    {project.stack.map((s) => (
                      <span key={s} className="pd-tag">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {project.links.length > 0 && (
                  <div className="pd-links" style={{ marginTop: 24 }}>
                    {project.links.map((link) => (
                      <LiquidGlassButton
                        key={link.label}
                        href={link.href}
                        newTab
                        size="md"
                        icon="diagonal"
                        tint="rgba(235, 76, 42, 0.3)"
                        textColor="#ffffff"
                      >
                        View {link.label} Repository
                      </LiquidGlassButton>
                    ))}
                  </div>
                )}

              </div>

              {/* Right Column */}
              <div className="pd-col-right">

                {/* Architecture Flow */}
                <div className="pd-block">
                  <h2 className="pd-block-label">Architecture &amp; Data Flow</h2>
                  <div className="pd-arch">
                    {project.architecture.map((node, i) => (
                      <div key={i} className="pd-arch-row">
                        <div className="pd-arch-node">
                          <span className="pd-arch-label">{node.label}</span>
                          {node.note && <span className="pd-arch-note">{node.note}</span>}
                        </div>
                        {i < project.architecture.length - 1 && (
                          <div className="pd-arch-arrow" aria-hidden="true">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical decisions */}
                <div className="pd-block">
                  <h2 className="pd-block-label">Key Technical Decisions</h2>
                  <div className="pd-decisions">
                    {project.techDecisions.map((td, i) => (
                      <div key={i} className="pd-decision">
                        <span className="pd-decision-why">{td.why}</span>
                        <p className="pd-decision-answer">{td.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="pd-block">
                  <h2 className="pd-block-label">The Hard Part &amp; Challenges</h2>
                  <div className="pd-challenges">
                    {project.challenges.map((c, i) => (
                      <div key={i} className="pd-challenge">
                        <span className="pd-challenge-title">{c.title}</span>
                        <p className="pd-challenge-detail">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* ── Bottom Project Switcher & Pagination ── */}
            <div className="pd-bottom-nav">
              <div className="pd-bottom-label">All Projects</div>
              <div className="pd-bottom-grid">
                {projects.map((p) => {
                  const isCurrent = p.id === project.id;
                  return (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className={`pd-bottom-card ${isCurrent ? 'is-current' : ''}`}
                    >
                      <span className="pd-bc-num">{p.number}</span>
                      <span className="pd-bc-title">{p.title}</span>
                      <span className="pd-bc-role">{p.category.split('·')[0].trim()}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
