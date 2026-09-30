'use client';

import { useState, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { projects, type Project } from '@/data/projects';

import dynamic from 'next/dynamic';
import ApertureCard from './ApertureCard';
import LiquidGlassButton from './LiquidGlassButton';
import type { CarouselSlideItem } from './CarouselPreloader';

const CarouselPreloader = dynamic(() => import('./CarouselPreloader'), {
  ssr: false,
});

type FilterCategory = 'All' | 'AI Systems' | 'Mobile' | 'System Design';
type ViewMode = 'carousel' | 'grid';

const PROJECT_ARTWORK_MAP: Record<string, string> = {
  p1: '/images/projects/datamind.svg',
  p2: '/images/projects/attendephi.svg',
  p3: '/images/projects/blog-agent.svg',
  p4: '/images/projects/hospital-clinic.svg',
  p5: '/images/projects/taskify.svg',
};

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ['start 76px', 'end end'],
  });

  const getDomain = (project: Project): FilterCategory => {
    if (project.category.includes('AI')) return 'AI Systems';
    if (project.category.includes('MOBILE')) return 'Mobile';
    return 'System Design';
  };

  const FEATURED_LIMIT = 4;
  const featuredBase = projects.slice(0, FEATURED_LIMIT);

  const filteredProjects =
    activeFilter === 'All'
      ? featuredBase
      : projects.filter((project) => getDomain(project) === activeFilter);

  const activeSlides: CarouselSlideItem[] = filteredProjects.map((project) => ({
    projectId: project.id,
    title: project.title,
    category: project.category,
    tagline: project.shortDesc,
    src:
      PROJECT_ARTWORK_MAP[project.id] ||
      project.media?.[0]?.src ||
      '/images/projects/datamind.svg',
    alt: `${project.title} - ${project.shortDesc}`,
  }));

  const filterOptions: FilterCategory[] = ['All', 'AI Systems', 'Mobile', 'System Design'];

  const handleNavigateToSlide = (targetIdx: number) => {
    if (!scrollTrackRef.current || activeSlides.length <= 1) return;
    const trackEl = scrollTrackRef.current;
    const trackRect = trackEl.getBoundingClientRect();
    const trackTop = window.scrollY + trackRect.top;
    const scrollableDistance = trackEl.offsetHeight - window.innerHeight;
    const progress = targetIdx / (activeSlides.length - 1);
    const targetY = trackTop - 76 + progress * scrollableDistance;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === viewMode) return;
    setViewMode(mode);
    setTimeout(() => {
      const workEl = document.getElementById('work');
      if (workEl) {
        const top = workEl.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }, 50);
  };

  const isCarousel = viewMode === 'carousel';
  const trackHeight =
    isCarousel && activeSlides.length > 1
      ? `${Math.max(2, activeSlides.length) * 75}vh`
      : 'auto';

  return (
    <section id="work" className={`work-section grid-bg ${isCarousel ? 'has-sticky-scroll' : ''}`}>
      <div
        ref={scrollTrackRef}
        className="work-scroll-container"
        style={{ height: trackHeight }}
      >
        {isCarousel && <div className="work-sticky-backdrop" aria-hidden="true" />}
        <div className={isCarousel ? 'work-sticky-viewport' : 'work-static-viewport'}>
          <div className="wrap">
            {/* ── Section Header ── */}
            <header className="work-header reveal-text">
              <div className="work-header-top">
                <span className="work-eyebrow">Featured Work</span>
                <span className="work-count">0{FEATURED_LIMIT} CASE STUDIES</span>
              </div>
              <div className="work-title-row">
                <h2 className="work-title">Engineering projects &amp; systems.</h2>
                <p className="work-subtitle">
                  {isCarousel
                    ? 'Scroll down to rotate through projects in 3D curved depth, or switch to Grid view to browse all cards.'
                    : 'Hover over cards for 3D depth and click to read the complete technical case study and architecture breakdown.'}
                </p>
              </div>

              {/* ── Controls Bar: Category Filter Pills + View Switcher + All Projects Link ── */}
              <div className="work-controls-bar">
                {/* Liquid Glass Filter Pills */}
                <div className="work-filters" role="tablist" aria-label="Filter projects by domain">
                  {filterOptions.map((filter) => {
                    const isActive = activeFilter === filter;
                    const count =
                      filter === 'All'
                        ? FEATURED_LIMIT
                        : projects.filter((p) => getDomain(p) === filter).length;
                    return (
                      <LiquidGlassButton
                        key={filter}
                        size="sm"
                        surface="light"
                        material={isActive ? 'frosted' : 'clear'}
                        tint={isActive ? 'rgba(235, 76, 42, 0.16)' : 'rgba(255, 255, 255, 0.7)'}
                        textColor="#111827"
                        onClick={() => setActiveFilter(filter)}
                        style={{
                          boxShadow: isActive ? '0 0 16px rgba(235, 76, 42, 0.25)' : undefined,
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#111827', fontWeight: 600 }}>{filter}</span>
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

                {/* View Mode Switcher Toggle + All Projects Link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div className="work-view-toggle" role="group" aria-label="Project presentation mode">
                    <button
                      type="button"
                      className={`view-mode-pill ${viewMode === 'carousel' ? 'is-active' : ''}`}
                      onClick={() => handleViewModeChange('carousel')}
                      aria-pressed={viewMode === 'carousel'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="10" rx="2" />
                        <path d="M12 7v10" />
                      </svg>
                      <span>3D Curved Showcase</span>
                    </button>
                    <button
                      type="button"
                      className={`view-mode-pill ${viewMode === 'grid' ? 'is-active' : ''}`}
                      onClick={() => handleViewModeChange('grid')}
                      aria-pressed={viewMode === 'grid'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                      </svg>
                      <span>Cards Grid</span>
                    </button>
                  </div>

                  <LiquidGlassButton
                    href="/projects"
                    size="sm"
                    surface="light"
                    material="clear"
                    tint="rgba(235, 76, 42, 0.12)"
                    textColor="#111827"
                    icon="arrow"
                  >
                    <span>All Projects ({projects.length})</span>
                  </LiquidGlassButton>
                </div>
              </div>
            </header>

            {/* ── View 1: 3D Curved Carousel with Scroll Animation ── */}
            {isCarousel && (
              <div className="work-carousel-wrap">
                <CarouselPreloader
                  key={`carousel-${activeFilter}`}
                  slides={activeSlides}
                  mainImage={1}
                  shape="convex"
                  amount={38}
                  borderRadius={16}
                  loop={false}
                  scrollProgress={scrollYProgress}
                  onNavigateToSlide={handleNavigateToSlide}
                />
              </div>
            )}

            {/* ── View 2: Aperture 3D Project Cards Grid ── */}
            {viewMode === 'grid' && (
              <>
                <motion.div
                  key={`grid-${activeFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="work-cards-grid reveal-stagger in"
                >
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      className="stagger-item in"
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: idx * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        '--stagger-index': Math.min(idx, 4),
                        display: 'flex',
                        flexDirection: 'column',
                      } as React.CSSProperties}
                    >
                      <ApertureCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* ── See All Projects Section Banner ── */}
                <div className="work-see-all-section">
                  <div className="work-see-all-card">
                    <div className="work-see-all-info">
                      <span className="work-see-all-eyebrow">ENGINEERING REPOSITORY</span>
                      <h3 className="work-see-all-title">Explore all {projects.length} projects &amp; systems</h3>
                      <p className="work-see-all-desc">
                        Browse the complete searchable archive of AI multi-agent pipelines, Flutter cross-platform applications, and system design specifications.
                      </p>
                    </div>
                    <LiquidGlassButton
                      href="/projects"
                      size="md"
                      surface="dark"
                      material="frosted"
                      tint="rgba(235, 76, 42, 0.28)"
                      icon="arrow"
                      textColor="#ffffff"
                      padding="12px 28px"
                    >
                      See All Projects ({projects.length})
                    </LiquidGlassButton>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
