'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { Project } from '@/data/projects';
import LiquidGlassButton from './LiquidGlassButton';

const Z_TRANSITION = { duration: 0.35, ease: 'easeOut' } as const;
const FILL_TRANSITION = { duration: 0.25, ease: 'easeOut' } as const;
const Z_REST = 0.01;
const ANTI_FLICKER_STYLE: React.CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

interface ApertureCardProps {
  project: Project;
}

export default function ApertureCard({ project }: ApertureCardProps) {
  const router = useRouter();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [cardHovered, setCardHovered] = React.useState(false);
  const [ctaHovered, setCtaHovered] = React.useState(false);

  const delayTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const trackingActiveRef = React.useRef(false);

  const tiltStrength = 14;
  const trackingSmoothing = 140; // ms
  const restoreDuration = 400; // ms
  const perspectiveDistance = 750;
  const translateAmount = 40;

  // Derived layer depths
  const metaHoverZ = translateAmount * 0.6;
  const titleHoverZ = translateAmount * 0.9;
  const descHoverZ = translateAmount * 1.1;
  const tagsHoverZ = translateAmount * 0.7;
  const ctaBaseZ = translateAmount * 0.5;
  const ctaCardLift = translateAmount * 0.35;
  const ctaButtonLift = translateAmount * 0.35;

  // Tilt-shift focus blur
  function makeFocusBlur(anchorX: number, anchorY: number, amount: number) {
    return useTransform([pointerX, pointerY], (values: number[]) => {
      if (!cardHovered) return 'blur(0px)';
      const px = values[0] ?? 0;
      const py = values[1] ?? 0;
      const dx = px - anchorX;
      const dy = py - anchorY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const raw = Math.max(0, distance - 0.2) * 12;
      const blur = Math.min(5, raw) * amount;
      return `blur(${blur.toFixed(2)}px)`;
    });
  }

  const metaBlur = makeFocusBlur(0, -0.35, 0.5);
  const titleBlur = makeFocusBlur(0, -0.1, 0.6);
  const descBlur = makeFocusBlur(0, 0.15, 0.6);
  const ctaBlur = makeFocusBlur(0.35, 0.4, 0.8);

  function handleMouseEnter() {
    setCardHovered(true);
    router.prefetch(`/projects/${project.id}`);
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    delayTimeoutRef.current = setTimeout(() => {
      trackingActiveRef.current = true;
    }, 0);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    animate(pointerX, px, { duration: trackingSmoothing / 1000, ease: 'easeOut' });
    animate(pointerY, py, { duration: trackingSmoothing / 1000, ease: 'easeOut' });

    if (!trackingActiveRef.current) return;

    animate(rotateY, px * 2 * tiltStrength, { duration: trackingSmoothing / 1000, ease: 'easeOut' });
    animate(rotateX, -py * 2 * tiltStrength, { duration: trackingSmoothing / 1000, ease: 'easeOut' });
  }

  function handleMouseLeave() {
    setCardHovered(false);
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    trackingActiveRef.current = false;
    animate(rotateX, 0, { duration: restoreDuration / 1000, ease: 'easeOut' });
    animate(rotateY, 0, { duration: restoreDuration / 1000, ease: 'easeOut' });
    animate(pointerX, 0, { duration: restoreDuration / 1000, ease: 'easeOut' });
    animate(pointerY, 0, { duration: restoreDuration / 1000, ease: 'easeOut' });
  }

  React.useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, []);

  const ctaZ = ctaBaseZ + (cardHovered ? ctaCardLift : 0) + (ctaHovered ? ctaButtonLift : 0);

  const primaryGithubLink = project.links.find((l) => l.label.toLowerCase().includes('github'));

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking an interactive button/link (like the Code button), let it handle its own action
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      return;
    }

    const url = `/projects/${project.id}`;
    if (e.metaKey || e.ctrlKey) {
      window.open(url, '_blank');
      return;
    }

    router.push(url);
  };

  const handleAuxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) return;
      window.open(`/projects/${project.id}`, '_blank');
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: perspectiveDistance,
        width: '100%',
        height: '100%',
      }}
      className="aperture-card-wrapper"
    >
      <motion.div
        onClick={handleCardClick}
        onAuxClick={handleAuxClick}
        tabIndex={0}
        role="link"
        aria-label={`View ${project.title} case study`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            router.push(`/projects/${project.id}`);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 20,
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
          cursor: 'pointer',
        }}
        className="aperture-3d-card"
      >
        {/* Card Background & Glow Border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            background: 'rgba(20, 22, 28, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: cardHovered
              ? '0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 24px 1px rgba(235, 76, 42, 0.15)'
              : '0 8px 30px rgba(0, 0, 0, 0.35)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            zIndex: 0,
          }}
        />

        {/* Ambient Top Glow / Radial Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: 120,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(235, 76, 42, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: cardHovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* 3D Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            padding: '28px 26px',
            boxSizing: 'border-box',
            transformStyle: 'preserve-3d',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Top Row: Number & Category */}
          <motion.div
            animate={{ z: cardHovered ? metaHoverZ : Z_REST }}
            transition={Z_TRANSITION}
            style={{
              ...ANTI_FLICKER_STYLE,
              filter: metaBlur,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 16,
              transformStyle: 'preserve-3d',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '0.05em',
                }}
              >
                {project.number}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.65)',
                  textTransform: 'uppercase',
                }}
              >
                {project.category}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.45)',
              }}
            >
              {project.year}
            </span>
          </motion.div>

          {/* Middle: Title & Description */}
          <div style={{ transformStyle: 'preserve-3d', marginBottom: 20 }}>
            <motion.h3
              animate={{ z: cardHovered ? titleHoverZ : Z_REST }}
              transition={Z_TRANSITION}
              style={{
                ...ANTI_FLICKER_STYLE,
                filter: titleBlur,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                margin: '0 0 10px 0',
              }}
            >
              {project.title}
            </motion.h3>

            <motion.p
              animate={{ z: cardHovered ? descHoverZ : Z_REST }}
              transition={Z_TRANSITION}
              style={{
                ...ANTI_FLICKER_STYLE,
                filter: descBlur,
                fontSize: '0.875rem',
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.72)',
                margin: 0,
              }}
            >
              {project.shortDesc}
            </motion.p>
          </div>

          {/* Focus Points & Tech Stack Tags */}
          <motion.div
            animate={{ z: cardHovered ? tagsHoverZ : Z_REST }}
            transition={Z_TRANSITION}
            style={{
              ...ANTI_FLICKER_STYLE,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 24,
              transformStyle: 'preserve-3d',
            }}
          >
            {project.focusPoints.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono), monospace',
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Bottom Actions Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Secondary CTA: GitHub or Details */}
            {primaryGithubLink ? (
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
            ) : (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {project.role}
              </span>
            )}

            {/* Primary CTA (Liquid Glass 3D Button) */}
            <LiquidGlassButton
              href={`/projects/${project.id}`}
              size="sm"
              icon="arrow"
              tint="rgba(235, 76, 42, 0.35)"
              textColor="#ffffff"
              padding="7px 16px"
              onClick={(e) => e.stopPropagation()}
            >
              Case Study
            </LiquidGlassButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
