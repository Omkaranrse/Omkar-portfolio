'use client';

import * as React from 'react';
import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  startTransition,
} from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Project } from '@/data/projects';

// ── Math & Projection Engine (Framer Carousel Algorithm) ──
const easeInOut = [0.65, 0, 0.35, 1] as const;
const ratio = 9 / 16;
const degrees = 180 / Math.PI;

const shapeDirection = {
  convex: -1,
  concave: 1,
  flat: 0,
} as const;

function project(
  u: number,
  half: number,
  radius: number,
  limit: number,
  direction: number
) {
  if (direction === 0 || limit < 1e-4 || radius <= 0) return { x: u, z: 0 };
  const side = u < 0 ? -1 : 1;
  const magnitude = Math.abs(u);
  let x: number;
  let depth: number;

  if (magnitude <= half) {
    const angle = magnitude / radius;
    x = radius * Math.sin(angle);
    depth = radius * (1 - Math.cos(angle));
  } else {
    const overshoot = magnitude - half;
    x = radius * Math.sin(limit) + overshoot * Math.cos(limit);
    depth = radius * (1 - Math.cos(limit)) + overshoot * Math.sin(limit);
  }

  return {
    x: side * x,
    z: direction * Math.min(depth, half),
  };
}

interface StripProps {
  slide: CarouselSlideItem;
  slot: number;
  segments: number;
  slideIndex: number;
  heroIndex: number;
  step: number;
  width: number;
  height: number;
  half: number;
  limit: number;
  direction: number;
  borderRadius: number;
  x: any;
  heroWidth: any;
  heroHeight: any;
  flatten: any;
  onSelectProject?: (id: string) => void;
}

function Strip({
  slide,
  slot,
  segments,
  slideIndex,
  heroIndex,
  step,
  width,
  height,
  half,
  limit,
  direction,
  borderRadius,
  x,
  heroWidth,
  heroHeight,
  flatten,
  onSelectProject,
}: StripProps) {
  const isHero = slideIndex === heroIndex;
  const slideHeight = useTransform(heroHeight, (main: number) =>
    isHero ? main : height
  );

  const solve = (offset: number, main: number, curl: number) => {
    const curSlideWidth = isHero ? main : width;
    const before =
      slideIndex <= heroIndex
        ? slideIndex * step
        : slideIndex * step + (main - width);
    const strip = curSlideWidth / segments;
    const originLeft = offset + before - half;
    const uLeft = originLeft + slot * strip;
    const uRight = uLeft + strip;
    const angle = Math.max(limit * curl, 0);
    const radius = angle > 1e-4 ? half / angle : 0;
    const left = project(uLeft, half, radius, angle, direction);
    const right = project(uRight, half, radius, angle, direction);
    const dx = right.x - left.x;
    const dz = right.z - left.z;
    const chord = Math.max(Math.hypot(dx, dz), 0.001);

    return {
      midX: (left.x + right.x) / 2,
      midZ: (left.z + right.z) / 2,
      rotate: Math.atan2(-dz, dx) * degrees,
      chord,
      strip,
      curSlideWidth,
      scale: chord / strip,
    };
  };

  const transform = useTransform(
    [x, heroWidth, flatten],
    ([offset, main, curl]: number[]) => {
      const s = solve(offset, main, curl);
      return `translate(-50%, -50%) translateX(${s.midX}px) translateZ(${s.midZ}px) rotateY(${s.rotate}deg)`;
    }
  );

  const paintedWidth = useTransform(
    [x, heroWidth, flatten],
    ([offset, main, curl]: number[]) => solve(offset, main, curl).chord + 1
  );

  const imgWidth = useTransform(
    [x, heroWidth, flatten],
    ([offset, main, curl]: number[]) => {
      const s = solve(offset, main, curl);
      return s.curSlideWidth * s.scale;
    }
  );

  const imgLeft = useTransform(
    [x, heroWidth, flatten],
    ([offset, main, curl]: number[]) => {
      const s = solve(offset, main, curl);
      return -slot * s.strip * s.scale - 0.5;
    }
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: paintedWidth,
        height: slideHeight,
        overflow: 'hidden',
        transform,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        cursor: slide.projectId ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (slide.projectId && onSelectProject) {
          onSelectProject(slide.projectId);
        }
      }}
    >
      <motion.img
        src={slide.src}
        alt={slide.alt || ''}
        draggable={false}
        style={{
          position: 'absolute',
          top: 0,
          left: imgLeft,
          width: imgWidth,
          height: slideHeight,
          maxWidth: 'none',
          objectFit: 'cover',
          borderRadius,
        }}
      />
    </motion.div>
  );
}

export interface CarouselSlideItem {
  src: string;
  alt?: string;
  title?: string;
  category?: string;
  projectId?: string;
  tagline?: string;
}

export interface CarouselPreloaderProps {
  slides?: CarouselSlideItem[];
  mainImage?: number; // 1-indexed hero slide
  slideWidth?: number;
  gap?: number;
  shape?: 'convex' | 'concave' | 'flat';
  amount?: number; // curvature in degrees (default 38)
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

export default function CarouselPreloader({
  slides = DEFAULT_PROJECT_SLIDES,
  mainImage = 1,
  slideWidth = 620,
  gap = 28,
  shape = 'convex',
  amount = 36,
  direction = 'leftToRight',
  expandStyle = 'flow',
  slideDuration = 1.8,
  pauseDuration = 1.2,
  expandDuration = 1.1,
  backgroundColor = 'transparent',
  borderRadius = 16,
  loop = false,
  autoPlay = true,
  mode = 'showcase',
  onComplete,
  onProjectClick,
  scrollProgress,
  onNavigateToSlide,
  style,
  className = '',
}: CarouselPreloaderProps) {
  const router = useRouter();
  const initialHeroIndex = Math.min(
    Math.max(Math.round(mainImage) - 1, 0),
    slides.length - 1
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 580 });
  const [phase, setPhase] = useState<'slide' | 'expand'>('slide');
  const [activeSlideIdx, setActiveSlideIdx] = useState(initialHeroIndex);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const element = containerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height });
      }
    }

    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        startTransition(() => setSize({ width, height }));
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Fit 16:9 slide inside the container without edge collision
  const width = Math.max(
    1,
    Math.min(slideWidth, size.width * 0.88, (size.height * 0.88) / ratio)
  );
  const height = width * ratio;
  const step = width + gap;
  const trackWidth = slides.length * width + (slides.length - 1) * gap;

  const currentRestX = size.width / 2 - (activeSlideIdx * step + width / 2);
  const expandedX = -activeSlideIdx * step;
  const startX = direction === 'leftToRight' ? -trackWidth : size.width;

  const surface = shapeDirection[shape] ?? 0;
  const limit = (Math.max(amount, 0) * Math.PI) / 180;
  const segments =
    surface === 0 || limit < 1e-4
      ? 1
      : Math.max(8, Math.min(24, Math.round(amount / 2.5)));

  const x = useMotionValue(currentRestX);
  const heroWidth = useMotionValue(width);
  const heroHeight = useMotionValue(height);
  const flatten = useMotionValue(1);

  const isScrollDriven = Boolean(scrollProgress && slides.length > 1);
  const minX = size.width / 2 - (0 * step + width / 2);
  const maxX = size.width / 2 - ((slides.length - 1) * step + width / 2);

  // Synchronize carousel position with vertical page scroll
  useEffect(() => {
    if (!isScrollDriven || !scrollProgress) return;

    const handleProgress = (latest: number) => {
      const p = Math.max(0, Math.min(1, latest));
      const targetX = minX + p * (maxX - minX);
      x.set(targetX);

      const computedIdx = Math.min(
        slides.length - 1,
        Math.max(0, Math.round(p * (slides.length - 1)))
      );
      setActiveSlideIdx(computedIdx);
    };

    const unsub = scrollProgress.on('change', handleProgress);
    handleProgress(scrollProgress.get() || 0);

    return () => unsub();
  }, [isScrollDriven, scrollProgress, minX, maxX, slides.length, x]);

  // Initial entrance animation (only if not scroll driven)
  useEffect(() => {
    if (!isClient || isScrollDriven) return;

    x.set(startX);
    heroWidth.set(width);
    heroHeight.set(height);
    flatten.set(1);
    startTransition(() => setPhase('slide'));

    const timers: NodeJS.Timeout[] = [];

    const expand = () => {
      startTransition(() => setPhase('expand'));
      const transition = { duration: expandDuration, ease: easeInOut };
      animate(x, expandedX, transition);
      animate(heroWidth, size.width, transition);
      animate(heroHeight, size.height, transition);
      animate(flatten, 0, transition);

      timers.push(
        setTimeout(() => {
          onComplete?.();
        }, expandDuration * 1000)
      );
    };

    if (autoPlay && mode === 'preloader') {
      const slideAnim = animate(x, currentRestX, {
        duration: slideDuration,
        ease: easeInOut,
        onComplete: () => {
          timers.push(setTimeout(expand, pauseDuration * 1000));
        },
      });

      return () => {
        slideAnim.stop();
        timers.forEach(clearTimeout);
      };
    } else {
      // Smooth slide to centered project and stay in 3D Curved Showcase!
      animate(x, currentRestX, { duration: slideDuration, ease: easeInOut });
    }
  }, [isClient, isScrollDriven, mode]);

  // Navigate to slide (delegates to onNavigateToSlide to keep page scroll in sync)
  const navigateToSlide = (idx: number) => {
    const targetIdx = Math.max(0, Math.min(slides.length - 1, idx));
    setActiveSlideIdx(targetIdx);
    if (onNavigateToSlide) {
      onNavigateToSlide(targetIdx);
    } else {
      const targetX = size.width / 2 - (targetIdx * step + width / 2);
      animate(x, targetX, { duration: 0.7, ease: easeInOut });
    }
  };

  const handleSelect = (id: string, index?: number) => {
    if (typeof index === 'number' && index !== activeSlideIdx) {
      navigateToSlide(index);
    } else {
      if (onProjectClick) {
        onProjectClick(id);
      } else if (id) {
        router.push(`/projects/${id}`);
      }
    }
  };

  const currentProject = slides[activeSlideIdx] || slides[0];
  const fading = expandStyle === 'fade' && phase === 'expand';

  return (
    <div
      ref={containerRef}
      className={`carousel-preloader-container ${className}`}
      onWheel={(e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
          window.scrollBy({ top: e.deltaX * 0.8 });
        }
      }}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor,
        perspective: size.width || 1200,
        perspectiveOrigin: '50% 50%',
        minHeight: 380,
        height: 'clamp(380px, 52vh, 560px)',
        borderRadius: 20,
      }}
      role="region"
      aria-label="3D Project Carousel Showcase"
    >
      {/* Left edge depth-of-field fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '12%',
          height: '100%',
          background: 'linear-gradient(to right, var(--bg-warm, #f5f0e8) 0%, rgba(245,240,232,0.7) 40%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
      {/* Right edge depth-of-field fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '12%',
          height: '100%',
          background: 'linear-gradient(to left, var(--bg-warm, #f5f0e8) 0%, rgba(245,240,232,0.7) 40%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {slides.map((slide, slideIndex) => (
          <motion.div
            key={slide.projectId || `slide-${slideIndex}`}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              opacity: fading && slideIndex !== activeSlideIdx ? 0 : 1,
            }}
            transition={{
              duration: expandDuration * 0.6,
              ease: 'easeOut',
            }}
          >
            {Array.from({ length: segments }, (_, slot) => (
              <Strip
                key={slot}
                slide={slide}
                slot={slot}
                segments={segments}
                slideIndex={slideIndex}
                heroIndex={activeSlideIdx}
                step={step}
                width={width}
                height={height}
                half={size.width / 2}
                limit={limit}
                direction={surface}
                borderRadius={borderRadius}
                x={x}
                heroWidth={heroWidth}
                heroHeight={heroHeight}
                flatten={flatten}
                onSelectProject={(id) => handleSelect(id, slideIndex)}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Floating Interactive Controls overlay */}
      <div
        className="carousel-glass-controls"
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 9999,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.14)',
          maxWidth: '94%',
        }}
      >
        {/* Prev Arrow */}
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => navigateToSlide(activeSlideIdx - 1)}
          disabled={activeSlideIdx === 0}
          style={{
            background: activeSlideIdx === 0 ? 'rgba(0,0,0,0.04)' : '#f3f4f6',
            color: activeSlideIdx === 0 ? '#9ca3af' : '#111827',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: activeSlideIdx === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Project Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {slides.map((s, idx) => {
            const isActive = idx === activeSlideIdx;
            return (
              <button
                key={s.projectId || idx}
                type="button"
                onClick={() => navigateToSlide(idx)}
                style={{
                  background: isActive ? '#111827' : 'transparent',
                  color: isActive ? '#ffffff' : '#4b5563',
                  border: isActive ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 9999,
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono), monospace',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          aria-label="Next project"
          onClick={() => navigateToSlide(activeSlideIdx + 1)}
          disabled={activeSlideIdx === slides.length - 1}
          style={{
            background: activeSlideIdx === slides.length - 1 ? 'rgba(0,0,0,0.04)' : '#f3f4f6',
            color: activeSlideIdx === slides.length - 1 ? '#9ca3af' : '#111827',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: activeSlideIdx === slides.length - 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.12)', margin: '0 4px' }} />

        {/* Active Project CTA */}
        {currentProject?.projectId && (
          <button
            type="button"
            onClick={() => handleSelect(currentProject.projectId!)}
            style={{
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: 9999,
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ whiteSpace: 'nowrap' }}>{currentProject.title}</span>
            <span aria-hidden="true" style={{ fontSize: '13px' }}>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
