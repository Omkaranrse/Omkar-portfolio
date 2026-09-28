'use client';

import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

// ---- Style & Animation Constants ----
const ANGLE_VAR = '--rb-angle';
const RING_WIDTH = 1.5;
const ROTATION_SECONDS_BASE = 5;
const INNER_GLOW_BLUR_MAX = 80;
const INNER_GLOW_BLUR_MIN = 12;
const INNER_GLOW_OPACITY_BASE = 0.8;
const INNER_GLOW_OPACITY_MULTIPLIER = 0.8;
const OUTER_GLOW_BLUR_BASE = 10;
const OUTER_GLOW_BLUR_MULTIPLIER = 28;
const OUTER_GLOW_OPACITY_BASE = 0.25;
const OUTER_GLOW_OPACITY_MULTIPLIER = 0.85;
const BEAM_WIDTH_DEFAULT = 200;

// Framer Motion Config
const ICON_SHIFT = 6;
const ICON_VARIANTS = { rest: { x: 0 }, hover: { x: ICON_SHIFT } };
const ICON_TRANSITION = { type: 'spring' as const, stiffness: 600, damping: 40, mass: 0.2 };
const WRAPPER_VARIANTS = {
  rest: { y: 0 },
  hover: { y: -3, transition: { type: 'spring' as const, stiffness: 450, damping: 26 } },
};

function parseColor(color: string) {
  if (typeof color !== 'string') return null;
  const hex = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hex) return { r: parseInt(hex[1], 16), g: parseInt(hex[2], 16), b: parseInt(hex[3], 16) };
  const shortHex = color.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
  if (shortHex)
    return {
      r: parseInt(shortHex[1] + shortHex[1], 16),
      g: parseInt(shortHex[2] + shortHex[2], 16),
      b: parseInt(shortHex[3] + shortHex[3], 16),
    };
  const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (rgb) return { r: parseInt(rgb[1], 10), g: parseInt(rgb[2], 10), b: parseInt(rgb[3], 10) };
  return null;
}

function toRgbaString(color: string, alpha: number) {
  const parsed = parseColor(color);
  if (!parsed) return `rgba(235, 76, 42, ${alpha.toFixed(3)})`;
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha.toFixed(3)})`;
}

function interpolateColors(colors: string[], steps = 10) {
  if (colors.length <= 1) return colors;
  const interpolated: string[] = [colors[0]];
  for (let i = 0; i < colors.length - 1; i++) {
    const start = parseColor(colors[i]);
    const end = parseColor(colors[i + 1]);
    if (!start || !end) continue;
    for (let j = 1; j <= steps; j++) {
      const t = j / steps;
      const r = Math.round(start.r * (1 - t) + end.r * t);
      const g = Math.round(start.g * (1 - t) + end.g * t);
      const b = Math.round(start.b * (1 - t) + end.b * t);
      interpolated.push(`rgb(${r}, ${g}, ${b})`);
    }
  }
  return interpolated;
}

function beamRainbow(colors: string[], angleVar = ANGLE_VAR) {
  if (!colors || colors.length === 0) {
    return `conic-gradient(from var(${angleVar}), transparent 0deg, transparent 360deg)`;
  }
  const gapDeg = 24;
  const fadeDeg = 50;
  const widthDeg = BEAM_WIDTH_DEFAULT;
  const overlapDeg = 0;
  if (colors.length === 1) {
    const color = colors[0];
    const transparent = toRgbaString(color, 0);
    const opaque = toRgbaString(color, 0.95);
    return `conic-gradient(from var(${angleVar}),
      transparent ${gapDeg}deg,
      ${transparent} ${gapDeg}deg,
      ${opaque} ${gapDeg + fadeDeg}deg,
      ${opaque} ${widthDeg - fadeDeg}deg,
      ${transparent} ${widthDeg + overlapDeg}deg,
      transparent ${widthDeg + overlapDeg}deg
    )`;
  }
  const segs = colors.length > 1 ? colors.length - 1 : 1;
  const bodyStartDeg = gapDeg + fadeDeg;
  const bodyEndDeg = widthDeg - fadeDeg;
  const bodyWidth = bodyEndDeg - bodyStartDeg;
  const opaqueStops = colors
    .map((color, i) => {
      const t = i / segs;
      const deg = bodyStartDeg + t * bodyWidth;
      return `${toRgbaString(color, 0.95)} ${deg}deg`;
    })
    .join(', ');
  return `conic-gradient(from var(${angleVar}),
    transparent ${gapDeg}deg,
    ${toRgbaString(colors[0], 0)} ${gapDeg}deg,
    ${opaqueStops},
    ${toRgbaString(colors[colors.length - 1], 0)} ${widthDeg + overlapDeg}deg,
    transparent ${widthDeg + overlapDeg}deg
  )`;
}

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMin === inMax) return (outMin + outMax) / 2;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

// ── Particles Sub-Component ──
function MovingStarField({
  count = 32,
  borderRadius = 999,
  speed = 1,
  colors,
  minSize = 1.5,
  maxSize = 3.5,
  minBlur = 0.2,
  maxBlur = 1.5,
}: {
  count?: number;
  borderRadius?: number;
  speed?: number;
  colors: string[];
  minSize?: number;
  maxSize?: number;
  minBlur?: number;
  maxBlur?: number;
}) {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDims({ w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) });
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      left: rnd(4, 96),
      top: rnd(8, 92),
      size: rnd(minSize, maxSize),
      blur: rnd(minBlur, maxBlur),
      ampX: rnd(3, 8) * (Math.random() < 0.5 ? -1 : 1),
      ampY: rnd(3, 8) * (Math.random() < 0.5 ? -1 : 1),
      durX: rnd(12, 22),
      durY: rnd(12, 22),
      delayX: rnd(0, 3),
      delayY: rnd(0, 3),
    }));
  }, [count, minSize, maxSize, minBlur, maxBlur]);

  const particleGradient = beamRainbow;

  if (prefersReduced || dims.w === 0) {
    return (
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          pointerEvents: 'none',
          zIndex: 2,
          overflow: 'hidden',
        }}
      />
    );
  }

  const maskStyles: React.CSSProperties = {
    WebkitMaskImage: particleGradient(colors),
    maskImage: particleGradient(colors),
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
  };

  const sp = Math.max(0.1, speed);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
        ...maskStyles,
      }}
    >
      {stars.map((s, idx) => {
        const initBgX = -(dims.w * s.left) / 100;
        const initBgY = -(dims.h * s.top) / 100;
        const commonStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${s.left}%`,
          top: `${s.top}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          backgroundImage: particleGradient(colors),
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${dims.w}px ${dims.h}px`,
          filter: `blur(${s.blur}px)`,
          borderRadius: 999,
          pointerEvents: 'none',
          transform: 'translateZ(0)',
        };

        const bgXFrames = [initBgX, initBgX - s.ampX, initBgX + s.ampX, initBgX].map((n) => `${n}px`);
        const bgYFrames = [initBgY, initBgY - s.ampY, initBgY + s.ampY, initBgY].map((n) => `${n}px`);

        return (
          <motion.div
            key={idx}
            initial={{ backgroundPositionX: `${initBgX}px`, backgroundPositionY: `${initBgY}px` }}
            animate={{
              x: [0, s.ampX, -s.ampX, 0],
              y: [0, s.ampY, -s.ampY, 0],
              backgroundPositionX: bgXFrames,
              backgroundPositionY: bgYFrames,
            }}
            transition={{
              x: { duration: s.durX / sp, delay: s.delayX / sp, repeat: Infinity, ease: 'linear' },
              y: { duration: s.durY / sp, delay: s.delayY / sp, repeat: Infinity, ease: 'linear' },
              backgroundPositionX: { duration: s.durX / sp, delay: s.delayX / sp, repeat: Infinity, ease: 'linear' },
              backgroundPositionY: { duration: s.durY / sp, delay: s.delayY / sp, repeat: Infinity, ease: 'linear' },
            }}
            style={commonStyle}
          />
        );
      })}
    </div>
  );
}

// ── Main GlowingBeam Button ──
export interface GlowingBeamButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'Black' | 'White' | 'Transparent';
  customColors?: string[];
  paddingX?: number;
  paddingY?: number;
  radius?: number;
  speed?: number;
  className?: string;
}

export default function GlowingBeamButton({
  text = 'Ask Omkar AI',
  href,
  onClick,
  variant = 'Black',
  customColors = ['#EB4C2A', '#FF7A00', '#FFB800', '#EB4C2A'],
  paddingX = 28,
  paddingY = 16,
  radius = 999,
  speed = 1.1,
  className = '',
}: GlowingBeamButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const glareRef = useRef<HTMLDivElement>(null);

  const finalRainbowColors = useMemo(() => {
    return interpolateColors(customColors);
  }, [customColors]);

  const animateGlareIn = () => {
    if (prefersReducedMotion || !glareRef.current) return;
    const el = glareRef.current;
    el.style.transition = 'none';
    el.style.transform = 'translateX(-100%)';
    requestAnimationFrame(() => {
      el.style.transition = 'transform 650ms ease-in-out';
      el.style.transform = 'translateX(100%)';
    });
  };

  const animateGlareOut = () => {
    if (prefersReducedMotion || !glareRef.current) return;
    const el = glareRef.current;
    el.style.transition = 'transform 650ms ease-in-out';
    el.style.transform = 'translateX(-100%)';
  };

  const surfaceBg = variant === 'White' ? '#FFFFFF' : '#111215';
  const labelColor = variant === 'White' ? '#111215' : '#FFFFFF';
  const rimColor = '#303030';
  const innerRadius = Math.max(0, radius - RING_WIDTH);

  // Controlled glow staying close to the button rim (no large cloud)
  const baseGlowOpacity = 0.35;
  const baseGlowBlur = 12;

  const outerGlowVariants = {
    rest: { opacity: baseGlowOpacity, filter: `blur(${baseGlowBlur}px)` },
    hover: { opacity: 0.52, filter: `blur(${baseGlowBlur + 4}px)` },
  };

  const rotationDuration = ROTATION_SECONDS_BASE / Math.max(0.1, speed);

  const content = (
    <div
      className="rb-ring"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: RING_WIDTH,
        borderRadius: radius,
        background: `${beamRainbow(finalRainbowColors, ANGLE_VAR)}, conic-gradient(${rimColor} 0turn, ${rimColor} 1turn)`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: `${paddingY}px ${paddingX}px`,
          borderRadius: innerRadius,
          background: surfaceBg,
          overflow: 'hidden',
          zIndex: 1,
          backdropFilter: 'saturate(120%) blur(4px)',
          WebkitBackdropFilter: 'saturate(120%) blur(4px)',
        }}
      >
        {/* Inner ambient glow - subdued */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: innerRadius,
            background: beamRainbow(finalRainbowColors, ANGLE_VAR),
            opacity: 0.48,
            filter: `blur(${mapRange(0.45, 0, 2, INNER_GLOW_BLUR_MAX, INNER_GLOW_BLUR_MIN)}px)`,
            pointerEvents: 'none',
            zIndex: 1,
            transform: 'translateZ(0)',
          }}
        />

        {/* Floating star particles */}
        <MovingStarField
          count={26}
          borderRadius={innerRadius}
          speed={speed}
          colors={finalRainbowColors}
          minSize={1.5}
          maxSize={3.5}
        />

        {/* Glare sheen */}
        <div
          ref={glareRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(-45deg, transparent 20%, rgba(255, 255, 255, 0.16) 50%, transparent 80%)',
            transform: 'translateX(-100%)',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />

        {/* Button Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '1rem',
            fontWeight: 650,
            letterSpacing: '0.04em',
            color: labelColor,
          }}
        >
          <span
            style={{
              transform: 'translateZ(0)',
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0.65) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 75%, rgba(0,0,0,0.65) 100%)',
            }}
          >
            {text}
          </span>

          <motion.span
            variants={ICON_VARIANTS}
            transition={ICON_TRANSITION}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              color: '#EB4C2A',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.span>
        </div>
      </div>
    </div>
  );

  const wrapperAnimStyle = {
    [ANGLE_VAR as string]: '0deg',
    animation: prefersReducedMotion ? 'none' : `rb-spin ${rotationDuration}s linear infinite`,
  };

  const WrapperComponent = motion.div;

  const innerElement = (
    <WrapperComponent
      className={`rb-stop-anim rb-wrap ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: radius,
        cursor: 'pointer',
        ...wrapperAnimStyle,
      }}
      variants={WRAPPER_VARIANTS}
      initial="rest"
      animate="rest"
      whileHover={prefersReducedMotion ? undefined : "hover"}
      onHoverStart={animateGlareIn}
      onHoverEnd={animateGlareOut}
      onClick={onClick}
    >
      {/* Outer ambient blur shadow */}
      <motion.div
        aria-hidden="true"
        variants={outerGlowVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          background: beamRainbow(finalRainbowColors, ANGLE_VAR),
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateZ(0)',
        }}
      />
      {content}
    </WrapperComponent>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={{ display: 'inline-block', textDecoration: 'none' }}
        aria-label={text}
      >
        {innerElement}
      </Link>
    );
  }

  return innerElement;
}
