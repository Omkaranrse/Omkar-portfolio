'use client';

import type { Variants, Transition } from 'framer-motion';

// ─── Shared spring config ────────────────────────────────────────
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
};

export const smoothTransition: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

// ─── Fade up (default section reveal) ────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Fade in only (no movement) ──────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ─── Stagger container ───────────────────────────────────────────
export const staggerContainer = (staggerDelay = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

// ─── Scale up (for cards / metric tiles) ─────────────────────────
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Slide in from left ──────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Slide in from right ─────────────────────────────────────────
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Reduced motion check helper ─────────────────────────────────
export const getVariants = (
  variants: Variants,
  prefersReduced: boolean | null,
): Variants | undefined => {
  if (prefersReduced) return undefined;
  return variants;
};

// ─── Viewport trigger defaults ───────────────────────────────────
export const viewportOnce = { once: true, margin: '-60px' as const };
