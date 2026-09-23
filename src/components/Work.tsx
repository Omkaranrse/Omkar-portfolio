'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects, type Project } from '@/data/projects';

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
        <header className="work-header reveal">
          <div className="work-header-top">
            <span className="work-eyebrow">Featured Work</span>
            <span className="work-count">0{projects.length} CASE STUDIES</span>
          </div>
          <div className="work-title-row">
            <h2 className="work-title">Engineering projects &amp; systems.</h2>
            <p className="work-subtitle">
              Click any project below to read the complete technical case study, architecture flow, and engineering decisions.
            </p>
          </div>

          {/* ── Filter Pills ── */}
          <div className="work-filters" role="tablist" aria-label="Filter projects by domain">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter}
                className={`filter-pill ${activeFilter === filter ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                <span>{filter}</span>
                {filter === 'All' ? (
                  <span className="filter-count">{projects.length}</span>
                ) : (
                  <span className="filter-count">
                    {projects.filter((p) => getDomain(p) === filter).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* ── Summary Project Cards Grid ── */}
        <div className="work-cards-grid reveal">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="project-summary-card"
              aria-label={`Open case study for ${project.title}`}
            >
              <div className="psc-top">
                <span className="psc-number">{project.number}</span>
                <span className="psc-year">{project.year}</span>
              </div>

              <div className="psc-main">
                <span className="psc-category">{project.category}</span>
                <h3 className="psc-title">{project.title}</h3>
                <p className="psc-desc">{project.shortDesc}</p>
              </div>

              <div className="psc-footer">
                <div className="psc-tags">
                  {project.focusPoints.slice(0, 2).map((tag) => (
                    <span key={tag} className="psc-tag">{tag}</span>
                  ))}
                </div>

                <span className="psc-action">
                  <span>View Case Study</span>
                  <span className="psc-arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
