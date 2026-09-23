import { projects, type Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  onSelectProject?: (id: string) => void;
}

export default function ProjectCard({ project, onSelectProject }: ProjectCardProps) {
  return (
    <article className="cs-card" id={project.id} aria-label={`Project deep dive: ${project.title}`}>

      {/* ── Header ─────────────────────────────── */}
      <div className="cs-header">
        <div className="cs-header-top">
          <div className="cs-header-badge-group">
            <span className="cs-number" aria-hidden="true">{project.number}</span>
            <span className="cs-active-badge">Active Case Study</span>
          </div>
          <div className="cs-meta-row">
            <span className="cs-category">{project.category}</span>
            <span className="cs-sep" aria-hidden="true">·</span>
            <span className="cs-year">{project.year}</span>
          </div>
        </div>
        <h3 className="cs-title">{project.title}</h3>
        <p className="cs-short-desc">{project.shortDesc}</p>
        <div className="cs-role-tag">
          <span>{project.role}</span>
        </div>
      </div>

      {/* ── Two-column content ─────────────────── */}
      <div className="cs-body">

        {/* Left column */}
        <div className="cs-col-left">

          {/* Problem */}
          <div className="cs-section">
            <h4 className="cs-section-label">The Problem</h4>
            <p className="cs-text">{project.problem}</p>
          </div>

          {/* Approach */}
          <div className="cs-section">
            <h4 className="cs-section-label">Approach</h4>
            <ol className="cs-approach-list">
              {project.approach.map((step, i) => (
                <li key={i} className="cs-approach-item">
                  <span className="cs-approach-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cs-approach-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Result */}
          <div className="cs-section">
            <h4 className="cs-section-label">Result</h4>
            <p className="cs-text">{project.result}</p>
          </div>

          {/* Stack */}
          <div className="cs-section">
            <h4 className="cs-section-label">Stack</h4>
            <div className="cs-stack">
              {project.stack.map((s) => (
                <span key={s} className="cs-tag">{s}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          {project.links.length > 0 && (
            <div className="cs-links">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-link"
                >
                  <span>{link.label} Repository</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M2 10L10 2M10 2H4M10 2V8" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="cs-col-right">

          {/* Architecture */}
          <div className="cs-section">
            <h4 className="cs-section-label">Architecture</h4>
            <div className="cs-arch">
              {project.architecture.map((node, i) => (
                <div key={i} className="cs-arch-row">
                  <div className="cs-arch-node">
                    <span className="cs-arch-label">{node.label}</span>
                    {node.note && <span className="cs-arch-note">{node.note}</span>}
                  </div>
                  {i < project.architecture.length - 1 && (
                    <div className="cs-arch-arrow" aria-hidden="true">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical decisions */}
          <div className="cs-section">
            <h4 className="cs-section-label">Technical Decisions</h4>
            <div className="cs-decisions">
              {project.techDecisions.map((td, i) => (
                <div key={i} className="cs-decision">
                  <span className="cs-decision-why">{td.why}</span>
                  <p className="cs-decision-answer">{td.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="cs-section">
            <h4 className="cs-section-label">The Hard Part</h4>
            <div className="cs-challenges">
              {project.challenges.map((c, i) => (
                <div key={i} className="cs-challenge">
                  <span className="cs-challenge-title">{c.title}</span>
                  <p className="cs-challenge-detail">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer project switcher ─────────────────── */}
      <footer className="cs-footer-nav" aria-label="Switch project case study">
        {projects.map((p) => {
          const isActive = p.id === project.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProject?.(p.id)}
              className={`cs-footer-link ${isActive ? 'cs-footer-link--active' : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="cs-footer-num">{p.number.replace('.', '')}</span>
              <span className="cs-footer-title">{p.tagLabel}</span>
            </button>
          );
        })}
      </footer>

    </article>
  );
}
