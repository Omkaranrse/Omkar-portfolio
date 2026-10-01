'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import { projects, type Project } from '@/data/projects';

import dynamic from 'next/dynamic';
import ApertureCard from './ApertureCard';
import LiquidGlassButton from './LiquidGlassButton';
import { triggerRouteLoading } from '@/lib/routeLoading';
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
  p6: '/images/projects/hrms.svg',
  p7: '/images/projects/sahayak.svg',
  p8: '/images/projects/realtime-chat.svg',
  p9: '/images/projects/protector.svg',
  p10: '/images/projects/blog-agent.svg',
  p11: '/images/projects/attendephi.svg',
  p12: '/images/projects/datamind.svg',
  p13: '/images/projects/hospital-clinic.svg',
  p14: '/images/projects/taskify.svg',
};

const getProjectArtwork = (project: Project): string => {
  if (PROJECT_ARTWORK_MAP[project.id]) return PROJECT_ARTWORK_MAP[project.id];
  if (project.media && project.media.length > 0 && project.media[0].src) {
    return project.media[0].src;
  }
  return '/images/projects/datamind.svg';
};

export default function Work() {
  const [totalProjectsCount, setTotalProjectsCount] = useState<number>(projects.length);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');

  // Background fetch only to discover total count for the "All Projects (N)" badge and banner
  useEffect(() => {
    let isMounted = true;
    async function loadProjectCount() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) return;
        const data = await res.json();
        if (
          isMounted &&
          data.projects &&
          Array.isArray(data.projects) &&
          data.projects.length > 0
        ) {
          setTotalProjectsCount(data.projects.length);
        }
      } catch {
        // Silently use cached/static fallback dataset
      }
    }
    loadProjectCount();
    return () => {
      isMounted = false;
    };
  }, []);

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
  // Core curated flagship case studies
  const curatedFeatured = projects.slice(0, 5);
  const top4Projects = curatedFeatured.slice(0, FEATURED_LIMIT);

  const filteredProjects =
    activeFilter === 'All'
      ? top4Projects
      : curatedFeatured.filter((project) => getDomain(project) === activeFilter);

  const allProjectsSlide: CarouselSlideItem = {
    projectId: 'all-projects',
    title: 'View All Projects',
    category: 'ENGINEERING DIRECTORY',
    tagline: `Explore complete directory of ${totalProjectsCount} projects & systems`,
    src: '/images/projects/all-projects-card.svg',
    alt: `Explore all ${totalProjectsCount} projects and systems`,
    liveUrl: '/projects',
  };

  const projectSlides: CarouselSlideItem[] = filteredProjects.map((project) => ({
    projectId: project.id,
    title: project.title,
    category: project.category,
    tagline: project.shortDesc,
    src: getProjectArtwork(project),
    alt: `${project.title} - ${project.shortDesc}`,
    liveUrl: project.links.find((l) => l.label.toLowerCase().includes('live'))?.href,
    githubUrl: project.links.find((l) => l.label.toLowerCase().includes('github'))?.href,
  }));

  const activeSlides: CarouselSlideItem[] = [...projectSlides, allProjectsSlide];

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
                <span className="work-count">
                  0{top4Projects.length} CASE STUDIES
                </span>
              </div>
              <div className="work-title-row">
                <h2 className="work-title">Engineering projects &amp; systems.</h2>
                <p className="work-subtitle desktop-only-text">
                  {isCarousel
                    ? 'Scroll down to rotate through projects in 3D curved depth, or switch to Grid view to browse all cards.'
                    : 'Hover over cards for 3D depth and click to read the complete technical case study and architecture breakdown.'}
                </p>
                <p className="work-subtitle mobile-only-text">
                  Browse AI pipelines, mobile systems, and full-stack architecture case studies.
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
                        ? top4Projects.length
                        : curatedFeatured.filter((p) => getDomain(p) === filter).length;
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
                <div className="work-actions-cluster" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
                    onClick={() => {
                      triggerRouteLoading('/projects', 'Loading engineering directory...');
                    }}
                  >
                    <span>All Projects ({totalProjectsCount})</span>
                  </LiquidGlassButton>
                </div>
              </div>
            </header>

            {/* ── MOBILE VIEW: Normal Static Project Cards List (Zero 3D transforms, No carousel trap) ── */}
            <div className="work-mobile-view">
              {filteredProjects.map((project) => {
                const primaryGithub = project.links.find((l) =>
                  l.label.toLowerCase().includes('github')
                );
                return (
                  <article key={`mobile-${project.id}`} className="work-mobile-card">
                    <Link
                      href={`/projects/${project.id}`}
                      className="work-mobile-card-link"
                      onClick={() => {
                        triggerRouteLoading(`/projects/${project.id}`, 'Loading case study...');
                      }}
                      aria-label={`View ${project.title} technical case study`}
                    >
                      {/* Project Image Preview */}
                      <div className="work-mobile-card-media">
                        <Image
                          src={
                            PROJECT_ARTWORK_MAP[project.id] ||
                            project.media?.[0]?.src ||
                            '/images/projects/datamind.svg'
                          }
                          alt={`${project.title} preview`}
                          width={600}
                          height={330}
                          className="work-mobile-card-img"
                        />
                        <div className="work-mobile-card-badge">
                          <span className="work-mobile-card-num">{project.number}</span>
                          <span className="work-mobile-card-cat">{project.category}</span>
                        </div>
                      </div>

                      {/* Project Card Body */}
                      <div className="work-mobile-card-body">
                        <div className="work-mobile-card-meta">
                          <span className="work-mobile-card-year">{project.year}</span>
                          <span className="work-mobile-card-role">{project.role}</span>
                        </div>

                        <h3 className="work-mobile-card-title">{project.title}</h3>
                        <p className="work-mobile-card-desc">{project.shortDesc}</p>

                        {/* Technology Tags */}
                        <div className="work-mobile-card-tags">
                          {project.focusPoints.slice(0, 4).map((tag) => (
                            <span key={tag} className="work-mobile-card-tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Card Action Row */}
                        <div className="work-mobile-card-footer">
                          {primaryGithub ? (
                            <span
                              className="work-mobile-card-code"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(primaryGithub.href, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              Code ↗
                            </span>
                          ) : (
                            <span className="work-mobile-card-indicator">
                              Case Study
                            </span>
                          )}

                          <span className="work-mobile-card-cta">
                            Case Study <span>→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}

              {/* Mobile See All Archive Banner */}
              <div className="work-mobile-see-all">
                <div className="work-mobile-see-all-info">
                  <span className="work-see-all-eyebrow">ENGINEERING REPOSITORY</span>
                  <h3 className="work-see-all-title">Explore all {totalProjectsCount} projects &amp; systems</h3>
                  <p className="work-see-all-desc">
                    Browse the complete searchable archive of AI multi-agent pipelines and Flutter cross-platform applications.
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
                  padding="10px 22px"
                >
                  See All Projects ({totalProjectsCount})
                </LiquidGlassButton>
              </div>
            </div>

            {/* ── DESKTOP VIEW: Preserved 100% untouched (3D Curved Showcase & Cards Grid) ── */}
            <div className="work-desktop-view">
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
                        <h3 className="work-see-all-title">Explore all {totalProjectsCount} projects &amp; systems</h3>
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
                        See All Projects ({totalProjectsCount})
                      </LiquidGlassButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
