'use client';

import * as React from 'react';
import type { TechItem } from '@/data/techStack';

// ─────────────────────────────────────────────────────────
// Logo3DCarousel — DOM-based fisheye marquee
//
// Each pill is a real inline-flex DOM element that auto-sizes
// to its content (icon + text). This eliminates ALL text-
// clipping issues that the old canvas approach caused.
//
// The magnification math is identical to the original canvas
// version — items near the viewport center scale up and
// spread apart; items at the edges shrink and compress.
// ─────────────────────────────────────────────────────────

export interface Logo3DCarouselProps {
  items: TechItem[];
  itemHeight?: number;
  gap?: number;
  speed?: number;
  direction?: 'left' | 'right';
  maxBlur?: number;
  blurStart?: number;
  blurEnd?: number;
  pauseOnHover?: boolean;
  easingResponsiveness?: number;
  enableDrag?: boolean;
  minScale?: number;
  maxScale?: number;
  maxFrameWidth?: number;
  style?: React.CSSProperties;
}

/* ── Magnification (fisheye) math ─────────────────── */

const calculateMagnification = (
  distanceFromCenter: number,
  screenCenter: number,
  avgScale: number,
  scaleConstant: number,
  piDivCenter: number,
  centerDivPi: number,
  minScale: number,
) => {
  let warpedX: number;
  let finalScale: number;
  if (Math.abs(distanceFromCenter) <= screenCenter) {
    warpedX =
      avgScale * distanceFromCenter +
      scaleConstant * centerDivPi * Math.sin(distanceFromCenter * piDivCenter);
    finalScale =
      avgScale + scaleConstant * Math.cos(distanceFromCenter * piDivCenter);
  } else {
    const sign = Math.sign(distanceFromCenter);
    warpedX =
      sign * (avgScale * screenCenter) +
      minScale * (distanceFromCenter - sign * screenCenter);
    finalScale = minScale;
  }
  return { warpedX, finalScale };
};

/* ── Component ────────────────────────────────────── */

export default function Logo3DCarousel({
  items = [],
  itemHeight = 42,
  gap = 28,
  speed = 30,
  direction = 'left',
  maxBlur = 2,
  blurStart = 72,
  blurEnd = 92,
  pauseOnHover = false,
  easingResponsiveness = 5,
  enableDrag = false,
  minScale = 0.35,
  maxScale = 1.5,
  maxFrameWidth = 1140,
  style,
}: Logo3DCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pillRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const globalOffsetRef = React.useRef(0);
  const isHoveredRef = React.useRef(false);
  const isDraggingRef = React.useRef(false);
  const lastDragXRef = React.useRef(0);

  // Cached pill widths & pre-computed strip positions
  const cachedWidthsRef = React.useRef<number[]>([]);
  const positionsRef = React.useRef<Float64Array>(new Float64Array(0));
  const wrapLengthRef = React.useRef(0);
  const widthsMeasuredRef = React.useRef(false);

  const [containerWidth, setContainerWidth] = React.useState(0);

  const SETS_COUNT = 4; // enough copies for seamless wrapping
  const renderCount = items.length > 0 ? SETS_COUNT * items.length : 0;
  const containerHeight = itemHeight * 2.5;

  /* ── Measure container ── */
  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* ── Measure pill widths → compute positions ── */
  React.useEffect(() => {
    if (items.length === 0 || renderCount === 0) return;

    const measure = () => {
      const widths: number[] = [];
      for (let i = 0; i < items.length; i++) {
        const pill = pillRefs.current[i];
        const w = pill ? Math.max(pill.getBoundingClientRect().width, pill.offsetWidth, 40) : 60;
        widths.push(w);
      }
      cachedWidthsRef.current = widths;

      const positions = new Float64Array(renderCount);
      let accum = 0;
      for (let i = 0; i < renderCount; i++) {
        positions[i] = accum;
        accum += widths[i % items.length] + gap;
      }
      positionsRef.current = positions;
      wrapLengthRef.current = accum;
      widthsMeasuredRef.current = true;
    };

    // Wait for fonts to load so text width is accurate
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(measure));
    } else {
      requestAnimationFrame(measure);
    }
  }, [items, renderCount, gap]);

  /* ── Animation loop ── */
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || containerWidth === 0 || items.length === 0) return;

    let animationId = 0;
    let lastTime = performance.now();
    let isVisible = false;
    let currentSpeed = speed;

    const render = (now: number) => {
      if (!isVisible || !widthsMeasuredRef.current) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const screenCenter = containerWidth / 2;
      const piDivCenter = Math.PI / screenCenter;
      const centerDivPi = screenCenter / Math.PI;
      const scaleConst = (maxScale - minScale) / 2;
      const avgScale = minScale + scaleConst;
      const scaleRange = maxScale - minScale;
      const blurStartRadius = screenCenter * (blurStart / 100);
      const blurEndRadius = screenCenter * (blurEnd / 100);
      const dirMul = direction === 'right' ? -1 : 1;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const target =
        (pauseOnHover && isHoveredRef.current) || isDraggingRef.current
          ? 0
          : speed;
      currentSpeed += (target - currentSpeed) * easingResponsiveness * dt;
      globalOffsetRef.current += currentSpeed * dt * dirMul;

      const widths = cachedWidthsRef.current;
      const positions = positionsRef.current;
      const wrapLen = wrapLengthRef.current;
      const maxW = Math.max(...widths) * 2;
      const minXBound = -maxW;

      const frameRadius = maxFrameWidth ? maxFrameWidth / 2 : 570;
      const visibleRadius = Math.min(screenCenter * (blurStart / 100), frameRadius);
      const fadeDistance = Math.min(70, visibleRadius * 0.25);
      const fadeStartRadius = visibleRadius - fadeDistance;

      for (let i = 0; i < renderCount; i++) {
        const pill = pillRefs.current[i];
        if (!pill) continue;

        const idx = i % items.length;
        const w = widths[idx];

        let rel =
          (positions[i] - globalOffsetRef.current - minXBound) % wrapLen;
        if (rel < 0) rel += wrapLen;
        const currentX = rel + minXBound;
        const dist = currentX + w / 2 - screenCenter;

        const { warpedX, finalScale } = calculateMagnification(
          dist,
          screenCenter,
          avgScale,
          scaleConst,
          piDivCenter,
          centerDivPi,
          minScale,
        );

        const screenDist = Math.abs(warpedX);

        // Do not display logos where they blur and start to shrink (keep content strictly in frame)
        if (screenDist >= visibleRadius) {
          pill.style.display = 'none';
          pill.style.opacity = '0';
          continue;
        }

        const centerX = screenCenter + warpedX;

        // Smooth cosine fade as it approaches the frame edge
        let opacity = 1;
        if (screenDist > fadeStartRadius) {
          const fadeProgress = (screenDist - fadeStartRadius) / fadeDistance;
          opacity = Math.max(0, 0.5 * (1 + Math.cos(fadeProgress * Math.PI)));
        }

        pill.style.display = '';
        pill.style.transform = `translate(${centerX - w / 2}px, -50%) scale(${finalScale})`;
        pill.style.opacity = opacity.toFixed(3);
        pill.style.filter = 'none';
      }

      animationId = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true;
          lastTime = performance.now();
          if (!animationId) animationId = requestAnimationFrame(render);
        } else {
          isVisible = false;
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
          }
        }
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [
    containerWidth,
    items,
    renderCount,
    speed,
    direction,
    maxBlur,
    blurStart,
    blurEnd,
    pauseOnHover,
    easingResponsiveness,
    minScale,
    maxScale,
    maxFrameWidth,
    gap,
  ]);

  /* ── Pointer / drag handlers ── */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag || items.length === 0) return;
    isDraggingRef.current = true;
    lastDragXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag || !isDraggingRef.current) return;
    globalOffsetRef.current -= (e.clientX - lastDragXRef.current) * 1.2;
    lastDragXRef.current = e.clientX;
  };

  const onUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
  };

  /* ── Render ── */
  return (
    <div
      ref={containerRef}
      aria-label="Technology stack marquee"
      role="marquee"
      onPointerEnter={() => (isHoveredRef.current = true)}
      onPointerLeave={() => (isHoveredRef.current = false)}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUpOrCancel}
      onPointerCancel={onUpOrCancel}
      style={{
        width: '100%',
        height: containerHeight,
        position: 'relative',
        overflow: 'hidden',
        cursor: enableDrag ? 'grab' : 'default',
        touchAction: enableDrag ? 'pan-y' : 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        ...style,
      }}
    >
      {Array.from({ length: renderCount }, (_, i) => {
        const idx = i % items.length;
        const item = items[idx];
        return (
          <div
            key={i}
            ref={(el) => {
              pillRefs.current[i] = el;
            }}
            aria-label={item.name}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              width: 'auto',
              minWidth: 'max-content',
              gap: 10,
              height: itemHeight,
              padding: '0 6px',
              borderRadius: 9999,
              boxSizing: 'border-box',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              overflow: 'visible',
              willChange: 'transform, opacity, filter',
              pointerEvents: 'none',
              transformOrigin: 'center center',
              opacity: 0, // hidden until animation positions it
            }}
          >
            {/* Real technology icon */}
            <img
              src={item.iconUrl}
              alt=""
              width={28}
              height={28}
              draggable={false}
              style={{
                width: 28,
                height: 28,
                minWidth: 28,
                minHeight: 28,
                objectFit: 'contain',
                flexShrink: 0,
                display: 'inline-block',
              }}
              onError={(e) => {
                // Hide broken icon gracefully
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Technology name — never clipped, never stacked */}
            <span
              style={{
                fontFamily:
                  "var(--font-poppins), 'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 17,
                lineHeight: 1,
                color: '#000000',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                flexShrink: 0,
                display: 'inline-block',
              }}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
