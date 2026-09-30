'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type Project } from '@/data/projects';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LiquidGlassButton from '@/components/LiquidGlassButton';

type FilterCategory = 'All' | 'AI Systems' | 'Mobile' | 'System Design';

export default function AllProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');

  const getDomain = (project: Project): FilterCategory => {
    if (project.category.includes('AI')) return 'AI Systems';
    if (project.category.includes('MOBILE')) return 'Mobile';
    return 'System Design';
  };

  const filterOptions: FilterCategory[] = ['All', 'AI Systems', 'Mobile', 'System Design'];

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      // 1. Category check
      if (activeCategory !== 'All' && getDomain(project) !== activeCategory) {
        return false;
      }

      // 2. Search query check
      if (!q) return true;

      const titleMatch = project.title.toLowerCase().includes(q);
      const descMatch = project.shortDesc.toLowerCase().includes(q);
      const categoryMatch = project.category.toLowerCase().includes(q);
      const roleMatch = project.role.toLowerCase().includes(q);
      const stackMatch = project.stack.some((s) => s.toLowerCase().includes(q));
      const focusMatch = project.focusPoints.some((f) => f.toLowerCase().includes(q));

      return titleMatch || descMatch || categoryMatch || roleMatch || stackMatch || focusMatch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <>
      <Nav />

      <main className="all-projects-page grid-bg">
        <div className="wrap" style={{ paddingTop: 110, paddingBottom: 80 }}>
          {/* Breadcrumbs / Back Navigation */}
          <div className="archive-back-row">
            <Link href="/#work" className="archive-back-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back to Portfolio</span>
            </Link>
          </div>

          {/* Page Header */}
          <header className="archive-header">
            <div className="archive-header-eyebrow-row">
              <span className="archive-eyebrow">ENGINEERING DIRECTORY</span>
              <span className="archive-count">0{projects.length} REPOSITORIES &amp; SYSTEMS</span>
            </div>
            <h1 className="archive-title">All Projects &amp; Systems.</h1>
            <p className="archive-subtitle">
              A comprehensive technical archive of production systems, multi-agent AI pipelines, and mobile architectures built by Omkar Anarse.
            </p>
          </header>

          {/* Interactive Filter & Search Bar */}
          <div className="archive-toolbar">
            {/* Search Input Box */}
            <div className="archive-search-box">
              <svg
                className="archive-search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, stack (FastAPI, LangGraph, Flutter), or keywords..."
                className="archive-search-input"
                aria-label="Search projects"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="archive-search-clear"
                  aria-label="Clear search query"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="archive-filter-pills" role="tablist" aria-label="Filter projects by domain">
              {filterOptions.map((filter) => {
                const isActive = activeCategory === filter;
                const count =
                  filter === 'All'
                    ? projects.length
                    : projects.filter((p) => getDomain(p) === filter).length;

                return (
                  <LiquidGlassButton
                    key={filter}
                    size="sm"
                    surface="light"
                    material={isActive ? 'frosted' : 'clear'}
                    tint={isActive ? 'rgba(235, 76, 42, 0.16)' : 'rgba(255, 255, 255, 0.7)'}
                    textColor="#111827"
                    onClick={() => setActiveCategory(filter)}
                    style={{
                      boxShadow: isActive ? '0 0 16px rgba(235, 76, 42, 0.25)' : undefined,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600 }}>{filter}</span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono), monospace',
                          fontWeight: 600,
                          color: isActive ? '#c2410c' : '#374151',
                          background: isActive
                            ? 'rgba(235, 76, 42, 0.14)'
                            : 'rgba(0, 0, 0, 0.07)',
                          padding: '1px 6px',
                          borderRadius: 9999,
                        }}
                      >
                        {count}
                      </span>
                    </span>
                  </LiquidGlassButton>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="archive-status-row">
            <span className="archive-status-text">
              Showing <strong style={{ color: 'var(--accent, #ea580c)' }}>{filteredProjects.length}</strong> of {projects.length} projects
              {searchQuery && (
                <span>
                  {' '}matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
              )}
            </span>
            {(searchQuery || activeCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="archive-reset-btn"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Project List View */}
          <div className="archive-list-wrap">
            {filteredProjects.length === 0 ? (
              <div className="archive-empty-state">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ opacity: 0.4, marginBottom: 12 }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: 'var(--ink)' }}>
                  No matching projects
                </h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
                  Try adjusting your search terms or selecting another category.
                </p>
                <LiquidGlassButton
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  size="sm"
                  surface="light"
                  tint="rgba(235, 76, 42, 0.15)"
                  textColor="#111827"
                >
                  Clear search &amp; filters
                </LiquidGlassButton>
              </div>
            ) : (
              <div className="archive-list" role="list">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, idx) => {
                    const primaryGithubLink = project.links.find((l) =>
                      l.label.toLowerCase().includes('github')
                    );
                    const topMetric = project.metrics?.[0];

                    return (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                        className="archive-item-card"
                        role="listitem"
                      >
                        <Link
                          href={`/projects/${project.id}`}
                          className="archive-item-link-layer"
                          aria-label={`View ${project.title} Case Study`}
                        />

                        {/* Left: Index & Meta */}
                        <div className="archive-item-left">
                          <span className="archive-item-number">{project.number}</span>
                          <span className="archive-item-year">{project.year}</span>
                          <span className="archive-item-stage-pill">
                            {project.stage || 'Production'}
                          </span>
                        </div>

                        {/* Middle: Title, Description, & Stack */}
                        <div className="archive-item-center">
                          <div className="archive-item-title-row">
                            <h2 className="archive-item-title">{project.title}</h2>
                            <span className="archive-item-category">{project.category}</span>
                          </div>
                          <p className="archive-item-desc">{project.shortDesc}</p>
                          <div className="archive-item-stack-row">
                            {project.stack.slice(0, 5).map((tech) => (
                              <span key={tech} className="archive-tech-tag">
                                {tech}
                              </span>
                            ))}
                            {project.stack.length > 5 && (
                              <span className="archive-tech-more">
                                +{project.stack.length - 5}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Metric Highlight (if available) */}
                        {topMetric && (
                          <div className="archive-item-metric-col">
                            <span className="archive-metric-label">{topMetric.label}</span>
                            <span className="archive-metric-val">{topMetric.value}</span>
                          </div>
                        )}

                        {/* Right: Actions */}
                        <div className="archive-item-actions">
                          {primaryGithubLink && (
                            <LiquidGlassButton
                              href={primaryGithubLink.href}
                              newTab
                              size="sm"
                              icon="diagonal"
                              material="clear"
                              surface="dark"
                              textColor="rgba(255, 255, 255, 0.75)"
                              padding="6px 12px"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Code
                            </LiquidGlassButton>
                          )}
                          <LiquidGlassButton
                            href={`/projects/${project.id}`}
                            size="sm"
                            icon="arrow"
                            tint="rgba(235, 76, 42, 0.35)"
                            textColor="#ffffff"
                            padding="7px 18px"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Case Study
                          </LiquidGlassButton>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
