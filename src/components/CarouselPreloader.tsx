'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMotionValue, useSpring } from 'framer-motion';
import LiquidGlassButton from './LiquidGlassButton';
import { triggerRouteLoading } from '@/lib/routeLoading';

export interface CarouselSlideItem {
  src: string;
  alt?: string;
  title?: string;
  category?: string;
  projectId?: string;
  tagline?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface CarouselPreloaderProps {
  slides?: CarouselSlideItem[];
  mainImage?: number; // 1-indexed hero slide
  slideWidth?: number;
  gap?: number;
  shape?: 'convex' | 'concave' | 'flat';
  amount?: number; // curvature in degrees
  direction?: 'leftToRight' | 'rightToLeft';
  expandStyle?: 'flow' | 'fade';
  slideDuration?: number;
  pauseDuration?: number;
  expandDuration?: number;
  backgroundColor?: string;
  borderRadius?: number;
  loop?: boolean;
  autoPlay?: boolean;
  mode?: 'showcase' | 'preloader';
  onComplete?: () => void;
  onProjectClick?: (id: string) => void;
  scrollProgress?: any;
  onNavigateToSlide?: (index: number) => void;
  style?: React.CSSProperties;
  className?: string;
}

// ── Default Visual Artwork for Omkar's Projects ──
const DEFAULT_PROJECT_SLIDES: CarouselSlideItem[] = [
  {
    projectId: 'p1',
    title: 'DataMind AI',
    category: 'AI ENGINEERING · MULTI-AGENT',
    tagline: 'Conversational Data Query Engine with LangGraph & RAG',
    src: '/images/projects/datamind.svg',
    alt: 'DataMind AI - Autonomous Conversational Data Query Engine',
  },
  {
    projectId: 'p2',
    title: 'Attendephi',
    category: 'MOBILE ENGINEERING · FLUTTER',
    tagline: 'Production Mobile Attendance with QR & Face Verification',
    src: '/images/projects/attendephi.svg',
    alt: 'Attendephi - Enterprise Mobile Attendance Platform',
  },
  {
    projectId: 'p3',
    title: 'Blog Research Agent',
    category: 'AI SYSTEMS · MULTI-AGENT',
    tagline: 'Autonomous LangGraph Multi-Agent Research & Fact-Checked Drafting',
    src: '/images/projects/blog-agent.svg',
    alt: 'Blog Research Agent - Autonomous LangGraph Multi-Agent System',
  },
  {
    projectId: 'p4',
    title: 'Hospital & Clinic Platform',
    category: 'PRODUCT ENGINEERING · HEALTHCARE',
    tagline: '3-App Flutter Ecosystem (Patient, Doctor, Admin) with Design Tokens',
    src: '/images/projects/hospital-clinic.svg',
    alt: 'Hospital & Clinic Platform - Triple Flutter App Ecosystem',
  },
];

interface Card3DComputedState {
  transform: string;
  zIndex: number;
  opacity: number;
  brightness: number;
  pointerEvents: 'auto' | 'none';
}

/**
 * Computes smooth, continuous 3D cylindrical projection coordinates
 * for any floating-point offset `diff = slideIndex - floatPosition`.
 * Completely eliminates discrete jumping and delivers 120fps fluid gliding.
 */
function computeCard3DState(
  diff: number,
  cardWidth: number,
  viewportWidth: number
): Card3DComputedState {
  const isTablet = viewportWidth < 960;
  const isMobile = viewportWidth < 640;

  // Responsive step between card centers along the horizontal arc
  const stepX = isMobile
    ? cardWidth * 0.85
    : isTablet
    ? cardWidth * 0.76
    : cardWidth * 0.72;

  const absDiff = Math.abs(diff);
  const sign = diff >= 0 ? 1 : -1;

  // 1. Horizontal arc projection with gentle non-linear depth compression
  const tx = sign * stepX * Math.min(2.45, Math.pow(absDiff, 0.9));

  // 2. Continuous angular rotation around Y-axis (curving inward towards center)
  const maxRot = isMobile ? 18 : isTablet ? 22 : 26;
  const rotRate = isMobile ? 10 : isTablet ? 13 : 15;
  const rotY = -sign * Math.min(maxRot, Math.pow(absDiff, 0.94) * rotRate);

  // 3. Z-depth displacement: active card (diff=0) comes forward, flanking cards curve backward
  const frontZ = isMobile ? 35 : isTablet ? 75 : 110;
  const backDepth = isMobile ? 70 : isTablet ? 110 : 155;
  const z = frontZ - Math.min(backDepth * 1.5, Math.pow(absDiff, 1.08) * backDepth);

  // 4. Subtle scale diminution in distance
  const scale = Math.max(0.72, 1 - absDiff * 0.082);

  // 5. Continuous natural opacity curve
  const maxVisibleDiff = isMobile ? 1.6 : 2.5;
  const opacity =
    absDiff > maxVisibleDiff
      ? 0
      : Math.max(0, Math.min(1, 1 - Math.pow(absDiff / maxVisibleDiff, 1.85)));

  // 6. Natural spatial brightness attenuation
  const brightness = Math.max(0.65, Math.min(1, 1 - absDiff * 0.14));

  // 7. Interactive pointer events: only clickable when adequately visible
  const pointerEvents: 'auto' | 'none' = opacity > 0.35 ? 'auto' : 'none';

  // 8. Dynamic z-index layering based on closeness to center
  const zIndex = Math.max(1, Math.round(100 - absDiff * 20));

  return {
    transform: `translate3d(calc(-50% + ${tx.toFixed(1)}px), -50%, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
    zIndex,
    opacity: Number(opacity.toFixed(3)),
    brightness: Number(brightness.toFixed(3)),
    pointerEvents,
  };
}

export default function CarouselPreloader({
  slides = DEFAULT_PROJECT_SLIDES,
  mainImage = 1,
  slideWidth = 620,
  borderRadius = 16,
  onProjectClick,
  scrollProgress,
  onNavigateToSlide,
  style,
  className = '',
}: CarouselPreloaderProps) {
  const router = useRouter();
  const initialIndex = Math.min(
    Math.max(Math.round(mainImage) - 1, 0),
    slides.length - 1
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [size, setSize] = useState({ width: 1200, height: 500 });
  const [activeSlideIdx, setActiveSlideIdx] = useState(initialIndex);

  // ── Framer Motion Smooth Spring Physics ──
  // Continuous target position (float from 0 to slides.length - 1)
  const targetPosition = useMotionValue(initialIndex);
  // Damped spring: immediate responsiveness (<16ms) with zero overshoot jitter
  const smoothPosition = useSpring(targetPosition, {
    stiffness: 160,
    damping: 24,
    mass: 0.4,
  });

  // Touch and pointer swipe tracking refs
  const pointerStartXRef = useRef(0);
  const pointerStartPosRef = useRef(0);
  const isPointerDownRef = useRef(false);

  // Measure container dimensions
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height });
      }
    }

    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setSize({ width, height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Derived dimensions
  const isTablet = size.width < 960;
  const isMobile = size.width < 640;

  const cardWidth = Math.round(
    Math.min(
      slideWidth,
      isMobile
        ? size.width * 0.86
        : isTablet
        ? size.width * 0.68
        : size.width * 0.54
    )
  );
  const cardHeight = Math.round(cardWidth * (9 / 16));

  // ── Direct 120fps GPU Transform Application ──
  // Updates the card DOM elements directly without triggering React re-renders on every scroll tick
  const applyTransforms = useCallback(
    (pos: number) => {
      slides.forEach((_, idx) => {
        const el = cardRefs.current[idx];
        if (!el) return;
        const diff = idx - pos;
        const state = computeCard3DState(diff, cardWidth, size.width);
        el.style.transform = state.transform;
        el.style.zIndex = String(state.zIndex);
        el.style.opacity = String(state.opacity);
        el.style.pointerEvents = state.pointerEvents;

        const overlay = overlayRefs.current[idx];
        if (overlay) {
          overlay.style.opacity = String(Math.max(0, 1 - state.brightness));
        }
      });
    },
    [slides, cardWidth, size.width]
  );

  // Subscribe to continuous spring motion value to drive DOM transforms
  useEffect(() => {
    const unsub = smoothPosition.on('change', (pos) => {
      applyTransforms(pos);
      const newActive = Math.min(
        slides.length - 1,
        Math.max(0, Math.round(pos))
      );
      setActiveSlideIdx((prev) => (prev !== newActive ? newActive : prev));
    });

    // Initial paint
    applyTransforms(smoothPosition.get());
    return () => unsub();
  }, [smoothPosition, applyTransforms, slides.length]);

  // Re-apply on container resize
  useEffect(() => {
    applyTransforms(smoothPosition.get());
  }, [size, cardWidth, applyTransforms, smoothPosition]);

  // Synchronize smoothly with vertical page scroll (if connected to Work scroll track)
  useEffect(() => {
    if (!scrollProgress) return;

    const unsub = scrollProgress.on('change', (latest: number) => {
      // If user is actively dragging the carousel, don't override with page scroll
      if (isPointerDownRef.current) return;
      const p = Math.max(0, Math.min(1, latest));
      const target = p * (slides.length - 1);
      targetPosition.set(target);
    });

    return () => unsub();
  }, [scrollProgress, slides.length, targetPosition]);

  // Navigate to slide (updates continuous position and synchronizes vertical scroll)
  const navigateToSlide = useCallback(
    (idx: number) => {
      const targetIdx = Math.max(0, Math.min(slides.length - 1, idx));
      targetPosition.set(targetIdx);
      if (onNavigateToSlide) {
        onNavigateToSlide(targetIdx);
      }
    },
    [slides.length, targetPosition, onNavigateToSlide]
  );

  // Direct card select / navigation handler
  const handleSelect = useCallback(
    (projectId: string, index?: number) => {
      if (typeof index === 'number' && index !== activeSlideIdx) {
        navigateToSlide(index);
      } else {
        if (projectId === 'all-projects') {
          triggerRouteLoading('/projects', 'Loading engineering directory...');
          router.push('/projects');
          return;
        }
        if (onProjectClick) {
          triggerRouteLoading(`/projects/${projectId}`, 'Loading case study...');
          onProjectClick(projectId);
        } else {
          triggerRouteLoading(`/projects/${projectId}`, 'Loading case study...');
          router.push(`/projects/${projectId}`);
        }
      }
    },
    [activeSlideIdx, navigateToSlide, onProjectClick, router]
  );

  // Pointer drag swipe interactions with real-time continuous 1:1 tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    pointerStartXRef.current = e.clientX;
    pointerStartPosRef.current = smoothPosition.get();
    isPointerDownRef.current = true;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - pointerStartXRef.current;
    const dragDelta = -dx / (cardWidth * 0.72);
    const clampedPos = Math.max(
      -0.25,
      Math.min(slides.length - 0.75, pointerStartPosRef.current + dragDelta)
    );
    targetPosition.set(clampedPos);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
    const current = smoothPosition.get();
    const nearest = Math.min(
      slides.length - 1,
      Math.max(0, Math.round(current))
    );
    navigateToSlide(nearest);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.closest('.carousel-preloader-container')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          navigateToSlide(activeSlideIdx + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          navigateToSlide(activeSlideIdx - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIdx, navigateToSlide]);

  return (
    <div
      ref={containerRef}
      className={`carousel-preloader-container ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        minHeight: 380,
        height: 'clamp(380px, 48vh, 520px)',
        touchAction: 'pan-y',
        cursor: 'grab',
      }}
      role="region"
      aria-label="3D Project Carousel Showcase"
    >
      {/* ── 3D Curved Cards Spatial Stage ── */}
      <div
        className="carousel-3d-stage"
        style={{
          position: 'absolute',
          inset: 0,
          perspective: isMobile ? 1200 : 1600,
          perspectiveOrigin: '50% 48%',
          transformStyle: 'preserve-3d',
          pointerEvents: 'auto',
        }}
      >
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === activeSlideIdx;
          const initial3D = computeCard3DState(
            slideIndex - initialIndex,
            cardWidth,
            size.width
          );

          return (
            <div
              key={slide.projectId || `slide-${slideIndex}`}
              ref={(el) => {
                cardRefs.current[slideIndex] = el;
              }}
              className={`carousel-3d-card ${isActive ? 'is-active' : ''}`}
              data-route-href={
                slide.projectId === 'all-projects' ? '/projects' : `/projects/${slide.projectId}`
              }
              onClick={() => handleSelect(slide.projectId!, slideIndex)}
              style={{
                position: 'absolute',
                top: '46%',
                left: '50%',
                width: cardWidth,
                height: cardHeight,
                transform: initial3D.transform,
                zIndex: initial3D.zIndex,
                opacity: initial3D.opacity,
                pointerEvents: initial3D.pointerEvents,
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                // Instant hardware transform response (no CSS lag fighting with spring physics)
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              tabIndex={isActive ? 0 : -1}
              role="button"
              aria-label={`${slide.title || 'Project'} ${
                isActive ? '(Active — click to view case study)' : '(Click to center)'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSelect(slide.projectId!, slideIndex);
              }}
            >
              {/* Card Artwork Graphic */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius,
                  overflow: 'hidden',
                  background: '#0d1117',
                  border: isActive
                    ? '1.5px solid rgba(255, 255, 255, 0.22)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive
                    ? '0 24px 64px -12px rgba(0, 0, 0, 0.55), 0 0 24px rgba(235, 76, 42, 0.12)'
                    : '0 16px 36px -10px rgba(0, 0, 0, 0.42)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt || slide.title || 'Project preview'}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />

                {/* Hardware-composited black overlay for smooth depth lighting attenuation */}
                <div
                  ref={(el) => {
                    overlayRefs.current[slideIndex] = el;
                  }}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#000000',
                    opacity: 0,
                    pointerEvents: 'none',
                    willChange: 'opacity',
                  }}
                />

                {/* Subtle glass specular highlight along top edge */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '28%',
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Subtle Organic Left & Right Edge Blur Overlays ── */}
      <div
        aria-hidden="true"
        className="carousel-edge-blur carousel-edge-blur-left"
      />
      <div
        aria-hidden="true"
        className="carousel-edge-blur carousel-edge-blur-right"
      />

      {/* ── View All Projects CTA Button ── */}
      <div
        className="carousel-glass-controls"
        style={{
          position: 'absolute',
          bottom: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        }}
      >
        <LiquidGlassButton
          href="/projects"
          size="sm"
          surface="accent"
          material="frosted"
          radius="9999px"
          padding="8px 22px"
          onClick={() => {
            triggerRouteLoading('/projects', 'Loading engineering directory...');
          }}
          style={{
            boxShadow:
              '0 4px 20px rgba(234, 88, 12, 0.42), 0 0 14px rgba(235, 76, 42, 0.28)',
            flexShrink: 0,
          }}
          aria-label="View all projects"
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: '13px',
              color: '#ffffff',
            }}
          >
            <span>View All Projects</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ display: 'inline-block', flexShrink: 0 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </LiquidGlassButton>
      </div>
    </div>
  );
}
