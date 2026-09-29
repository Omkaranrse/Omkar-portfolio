'use client';

import * as React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';

// ─────────────────────────────────────────────────────────
// GravityPills Component (MONO Edition)
// Physics-based interactive badges powered by Matter.js.
// Features dynamic squish deformation, drag & throw inertia,
// smooth 60fps canvas rendering, and sleek monochromatic styling.
// ─────────────────────────────────────────────────────────

export interface CustomBadgeStyle {
  name?: string;
  bg: string;
  color: string;
  border: string;
}

export interface GravityPillsProps {
  badgesList?: string[];
  useCustomColors?: boolean;
  customBadges?: CustomBadgeStyle[];
  badgeBg?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  paddingX?: number;
  paddingY?: number;
  gravity?: number;
  restitution?: number;
  friction?: number;
  throwSensitivity?: number;
  dragTightness?: number;
  squishiness?: number;
  triggerMode?: 'scroll' | 'immediate';
  fontSize?: number;
  borderRadius?: number;
  containerBg?: string;
  enableBoundaries?: boolean;
  enableTopCollision?: boolean;
  fontFamily?: string;
  style?: React.CSSProperties;
}

const DEFAULT_BADGES = [
  'Flutter',
  'Python',
  'FastAPI',
  'Dart',
  'React',
  'Next.js',
  'TypeScript',
  'PyTorch',
  'LangChain',
  'LangGraph',
  'Groq',
  'ChromaDB',
  'PostgreSQL',
  'Firebase',
  'Docker',
  'Swift',
  'Riverpod',
  'Clean Architecture',
  'REST APIs',
  'State Management',
  'Deep Learning',
  'Git & GitHub',
];

// Curated MONO palette: deep blacks, subtle graphite, cool zinc, and crisp white accents
const MONO_PALETTE: CustomBadgeStyle[] = [
  // Standout hero pills (Inverted crisp white badge with dark text)
  { bg: '#FFFFFF', color: '#000000', border: 'rgba(255, 255, 255, 0.95)' }, // Flutter
  { bg: '#18181B', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.22)' }, // Python
  { bg: '#27272A', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.26)' }, // FastAPI
  { bg: '#121215', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.18)' },
  { bg: '#1E1E24', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.20)' },
  { bg: '#141417', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.18)' },
  { bg: '#232328', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.22)' },
  { bg: '#FFFFFF', color: '#000000', border: '#FFFFFF' }, // Standout pill
  { bg: '#18181B', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.20)' },
  { bg: '#111114', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.18)' },
  { bg: '#27272A', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.25)' },
  { bg: '#16161A', color: '#FFFFFF', border: 'rgba(255, 255, 255, 0.20)' },
];

export default function GravityPills({
  badgesList = DEFAULT_BADGES,
  useCustomColors = true,
  customBadges = MONO_PALETTE,
  badgeBg = '#18181B',
  badgeTextColor = '#FFFFFF',
  badgeBorderColor = 'rgba(255, 255, 255, 0.18)',
  paddingX = 24,
  paddingY = 14,
  gravity = 0.032,
  restitution = 0.82,
  friction = 0.948,
  throwSensitivity = 0.72,
  dragTightness = 0.44,
  squishiness = 0.9,
  triggerMode = 'scroll',
  fontSize = 26,
  borderRadius = 999,
  containerBg = 'transparent',
  enableBoundaries = true,
  enableTopCollision = true,
  fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  style,
}: GravityPillsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderReqRef = useRef<number | null>(null);
  const isTriggeredRef = useRef<boolean>(triggerMode === 'immediate');

  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const previousMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const currentMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const releaseVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseVelocityBufferRef = useRef<Array<{ x: number; y: number }>>([]);

  const gravityRef = useRef(gravity);
  const squishinessRef = useRef(squishiness);

  const endDragHandlerRef = useRef<((event: any) => void) | null>(null);
  const startDragHandlerRef = useRef<(() => void) | null>(null);
  const mouseMoveHandlerRef = useRef<((event: any) => void) | null>(null);

  // Update live refs
  useEffect(() => {
    gravityRef.current = gravity;
  }, [gravity]);

  useEffect(() => {
    squishinessRef.current = squishiness;
  }, [squishiness]);

  // Trigger on scroll into viewport
  useEffect(() => {
    if (triggerMode === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            isTriggeredRef.current = true;
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [triggerMode]);

  // Touch event handler to enable dragging on mobile without unintended scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stopPageScroll = (event: TouchEvent) => {
      // Prevent default scrolling when interacting with canvas
      if (event.touches.length === 1) {
        event.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', stopPageScroll, { passive: false });
    canvas.addEventListener('touchmove', stopPageScroll, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', stopPageScroll);
      canvas.removeEventListener('touchmove', stopPageScroll);
    };
  }, []);

  const initPhysics = React.useCallback(
    (width: number, height: number, dpr: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clean up previous event listeners & engine
      if (mouseConstraintRef.current && mouseConstraintRef.current.mouse) {
        if (mouseMoveHandlerRef.current) {
          Matter.Events.off(
            mouseConstraintRef.current,
            'mousemove',
            mouseMoveHandlerRef.current
          );
        }
        if (endDragHandlerRef.current) {
          Matter.Events.off(
            mouseConstraintRef.current,
            'enddrag',
            endDragHandlerRef.current
          );
        }
        if (startDragHandlerRef.current) {
          Matter.Events.off(
            mouseConstraintRef.current,
            'startdrag',
            startDragHandlerRef.current
          );
        }
        Matter.Mouse.clearSourceEvents(mouseConstraintRef.current.mouse);
      }

      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        Matter.World.clear(engineRef.current.world, false);
      }

      // Responsive font size adjustment based on viewport width
      const activeFontSize =
        width < 480
          ? Math.max(16, fontSize - 10)
          : width < 768
          ? Math.max(21, fontSize - 5)
          : fontSize;
      const activePaddingX =
        width < 480
          ? Math.max(14, paddingX - 10)
          : width < 768
          ? Math.max(18, paddingX - 6)
          : paddingX;
      const activePaddingY =
        width < 480
          ? Math.max(9, paddingY - 5)
          : width < 768
          ? Math.max(11, paddingY - 3)
          : paddingY;

      const engine = Matter.Engine.create({ enableSleeping: false });
      engine.world.gravity.y = gravity * 3;
      engine.world.gravity.x = 0;
      engineRef.current = engine;

      ctx.font = `700 ${activeFontSize}px ${fontFamily}`;

      const bodies: Matter.Body[] = [];

      badgesList.forEach((textItem, idx) => {
        const text = textItem.trim();
        const metrics = ctx.measureText(text);
        const pillWidth = Math.max(metrics.width + activePaddingX * 2, 54);
        const pillHeight = activeFontSize + activePaddingY * 2;

        const x = Math.random() * (width - pillWidth - 40) + 20 + pillWidth / 2;
        const y = enableTopCollision
          ? 10 + (idx % 6) * 36 + Math.random() * 20
          : -80 - idx * 60;
        const angle = (Math.random() - 0.5) * 0.4;

        const colorTheme =
          useCustomColors && customBadges.length > 0
            ? customBadges[idx % customBadges.length]
            : null;

        const finalBg = colorTheme ? colorTheme.bg : badgeBg;
        const finalColor = colorTheme ? colorTheme.color : badgeTextColor;
        const finalBorder = colorTheme ? colorTheme.border : badgeBorderColor;

        const radius = Math.min(borderRadius, pillHeight / 2);

        const body = Matter.Bodies.rectangle(x, y, pillWidth, pillHeight, {
          chamfer: { radius },
          restitution,
          friction,
          frictionAir: 0.005,
          angle,
          isStatic: false,
          render: {
            fillStyle: finalBg,
            strokeStyle: finalBorder,
          },
        });

        // Store custom badge data inside body.plugin
        (body as any).plugin = {
          text,
          color: finalColor,
          pillWidth,
          pillHeight,
          squishX: 1,
          squishY: 1,
          targetSquishX: 1,
          targetSquishY: 1,
          prevSpeed: 0,
        };

        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2,
          y: Math.random() * 1.5,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

        bodies.push(body);
      });

      // Boundaries (floor, ceiling, walls)
      const wallOptions = {
        isStatic: true,
        restitution: restitution * 0.4,
        friction,
      };

      const floor = Matter.Bodies.rectangle(
        width / 2,
        height + 40,
        width * 3,
        80,
        wallOptions
      );
      const ceiling = Matter.Bodies.rectangle(
        width / 2,
        enableTopCollision ? -990 : -5000,
        width * 3,
        2000,
        wallOptions
      );

      const worldBodies = [...bodies, floor, ceiling];

      if (enableBoundaries) {
        const leftWall = Matter.Bodies.rectangle(
          -40,
          height / 2,
          80,
          height * 3,
          wallOptions
        );
        const rightWall = Matter.Bodies.rectangle(
          width + 40,
          height / 2,
          80,
          height * 3,
          wallOptions
        );
        worldBodies.push(leftWall, rightWall);
      }

      Matter.Composite.add(engine.world, worldBodies);

      // Interactive mouse constraint
      const mouse = Matter.Mouse.create(canvas);
      Matter.Mouse.setScale(mouse, { x: 1 / dpr, y: 1 / dpr });

      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: dragTightness,
          render: { visible: false },
        },
      });

      mouseConstraintRef.current = mouseConstraint;
      previousMousePosRef.current = null;
      currentMousePosRef.current = null;
      releaseVelocityRef.current = { x: 0, y: 0 };
      mouseVelocityBufferRef.current = [];

      const handleStartDrag = () => {
        mouseVelocityBufferRef.current = [];
        releaseVelocityRef.current = { x: 0, y: 0 };
      };

      const handleEndDrag = (event: any) => {
        const body = event.body;
        if (!body || body.isStatic) return;

        const sampled = releaseVelocityRef.current;
        const throwScale = throwSensitivity * 0.12;
        const maxThrow = 2.0;

        const boostX = Math.max(-maxThrow, Math.min(maxThrow, sampled.x * throwScale));
        const boostY = Math.max(-maxThrow, Math.min(maxThrow, sampled.y * throwScale));

        Matter.Body.setVelocity(body, {
          x: body.velocity.x + boostX,
          y: body.velocity.y + boostY,
        });
      };

      const handleMouseMove = (event: any) => {
        const pos = event.mouse?.position;
        if (!pos) return;
        const nextPos = { x: pos.x, y: pos.y };
        const previousPos = currentMousePosRef.current || previousMousePosRef.current;

        if (previousPos) {
          const buffer = mouseVelocityBufferRef.current;
          buffer.push({
            x: nextPos.x - previousPos.x,
            y: nextPos.y - previousPos.y,
          });
          if (buffer.length > 5) buffer.shift();

          const summed = buffer.reduce(
            (acc: { x: number; y: number }, v: { x: number; y: number }) => ({
              x: acc.x + v.x,
              y: acc.y + v.y,
            }),
            { x: 0, y: 0 }
          );
          releaseVelocityRef.current = {
            x: summed.x / buffer.length,
            y: summed.y / buffer.length,
          };
        }

        previousMousePosRef.current = currentMousePosRef.current;
        currentMousePosRef.current = nextPos;
      };

      mouseMoveHandlerRef.current = handleMouseMove;
      Matter.Events.on(mouseConstraint, 'mousemove', handleMouseMove);

      endDragHandlerRef.current = handleEndDrag;
      Matter.Events.on(mouseConstraint, 'enddrag', handleEndDrag);

      startDragHandlerRef.current = handleStartDrag;
      Matter.Events.on(mouseConstraint, 'startdrag', handleStartDrag);

      Matter.Composite.add(engine.world, mouseConstraint);
    },
    [
      badgesList,
      useCustomColors,
      customBadges,
      badgeBg,
      badgeTextColor,
      badgeBorderColor,
      paddingX,
      paddingY,
      gravity,
      restitution,
      friction,
      throwSensitivity,
      dragTightness,
      fontSize,
      borderRadius,
      enableBoundaries,
      enableTopCollision,
      fontFamily,
    ]
  );

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    initPhysics(width, height, dpr);
  }, [initPhysics]);

  // Main 60fps render loop
  const renderLoop = React.useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // If triggerMode is scroll and not yet triggered, wait before running physics
    if (!isTriggeredRef.current) {
      renderReqRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    Matter.Engine.update(engine, 1000 / 60);

    const bodies = Matter.Composite.allBodies(engine.world);
    const draggedBody = mouseConstraintRef.current?.body;
    const currentSquish = squishinessRef.current;

    const activeFontSize =
      width < 480
        ? Math.max(16, fontSize - 10)
        : width < 768
        ? Math.max(21, fontSize - 5)
        : fontSize;
    ctx.font = `700 ${activeFontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    bodies.forEach((b: any) => {
      // Skip out-of-bounds static boundary walls
      if (b.isStatic && b.position.y > height) return;
      if (b.isStatic && b.position.y < 0) return;
      if (
        b.isStatic &&
        (b.position.x < 0 || b.position.x > width) &&
        !b.plugin?.text
      ) {
        return;
      }

      const { x, y } = b.position;
      const angle = b.angle;
      const isDragged = b === draggedBody;
      const speed = b.speed;
      let isImpact = false;

      // Squish & stretch calculations
      if (b.plugin && b.plugin.squishX !== undefined) {
        const prevSpeed = b.plugin.prevSpeed ?? speed;
        const deceleration = prevSpeed - speed;
        isImpact = !b.isStatic && !isDragged && deceleration > 2;

        if (isDragged) {
          b.plugin.targetSquishX = 1 + 0.08 * currentSquish;
          b.plugin.targetSquishY = 1 - 0.06 * currentSquish;
        } else if (isImpact) {
          const squash = Math.min(deceleration * 0.045, 0.28) * currentSquish;
          b.plugin.targetSquishX = 1 + squash;
          b.plugin.targetSquishY = 1 - squash * 0.85;
        } else if (!b.isStatic) {
          const t = Math.min(Math.max((speed - 1) / 6, 0), 1) * currentSquish;
          b.plugin.targetSquishX = 1 + t * 0.18;
          b.plugin.targetSquishY = 1 - t * 0.14;
        } else {
          b.plugin.targetSquishX = 1;
          b.plugin.targetSquishY = 1;
        }

        const responsiveness = isImpact ? 0.38 : 0.18;
        b.plugin.squishX +=
          (b.plugin.targetSquishX - b.plugin.squishX) * responsiveness;
        b.plugin.squishY +=
          (b.plugin.targetSquishY - b.plugin.squishY) * responsiveness;
        b.plugin.prevSpeed = speed;
      }

      const pillWidth = b.plugin?.pillWidth || 0;
      const pillHeight = b.plugin?.pillHeight || 0;
      const rad = Math.min(borderRadius, pillHeight / 2);

      ctx.save();
      ctx.translate(x, y);

      // Symmetrical capsules look identical at theta and theta + PI;
      // normalizing angle keeps the text always upright and readable
      let displayAngle = angle % (Math.PI * 2);
      if (displayAngle > Math.PI) displayAngle -= Math.PI * 2;
      if (displayAngle < -Math.PI) displayAngle += Math.PI * 2;
      if (displayAngle > Math.PI / 2) {
        displayAngle -= Math.PI;
      } else if (displayAngle < -Math.PI / 2) {
        displayAngle += Math.PI;
      }
      ctx.rotate(displayAngle);

      if (b.plugin && b.plugin.squishX !== undefined) {
        ctx.scale(b.plugin.squishX, b.plugin.squishY);
      }

      // Soft dynamic shadow
      const lift = b.isStatic ? 0 : Math.min(speed / 9, 1);
      ctx.shadowColor = isDragged
        ? 'rgba(0, 0, 0, 0.45)'
        : `rgba(0, 0, 0, ${(0.14 + lift * 0.18).toFixed(3)})`;
      ctx.shadowBlur = isDragged ? 22 : 6 + lift * 12;
      ctx.shadowOffsetY = isDragged ? 10 : 3 + lift * 8;

      // Draw pill body
      ctx.fillStyle = b.render.fillStyle || '#18181B';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, rad);
      } else {
        const px = -pillWidth / 2;
        const py = -pillHeight / 2;
        ctx.moveTo(px + rad, py);
        ctx.arcTo(px + pillWidth, py, px + pillWidth, py + pillHeight, rad);
        ctx.arcTo(px + pillWidth, py + pillHeight, px, py + pillHeight, rad);
        ctx.arcTo(px, py + pillHeight, px, py, rad);
        ctx.arcTo(px, py, px + pillWidth, py, rad);
        ctx.closePath();
      }
      ctx.fill();

      // Border outline
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = b.render.strokeStyle || 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pill label text
      if (b.plugin && b.plugin.text) {
        ctx.fillStyle = b.plugin.color || '#FFFFFF';
        ctx.fillText(b.plugin.text, 0, 1);
      }

      ctx.restore();
    });

    renderReqRef.current = requestAnimationFrame(renderLoop);
  }, [fontSize, borderRadius, fontFamily]);

  // Setup resize observer and render loop
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (typeof window !== 'undefined') {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      if ('ResizeObserver' in window && containerRef.current) {
        resizeObserver = new ResizeObserver(() => resizeCanvas());
        resizeObserver.observe(containerRef.current);
      }

      renderReqRef.current = requestAnimationFrame(renderLoop);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (renderReqRef.current) {
        cancelAnimationFrame(renderReqRef.current);
      }
      if (mouseConstraintRef.current && mouseConstraintRef.current.mouse) {
        if (mouseMoveHandlerRef.current) {
          Matter.Events.off(
            mouseConstraintRef.current,
            'mousemove',
            mouseMoveHandlerRef.current
          );
        }
        if (endDragHandlerRef.current) {
          Matter.Events.off(
            mouseConstraintRef.current,
            'enddrag',
            endDragHandlerRef.current
          );
        }
        if (startDragHandlerRef.current) {
          Matter.Events.off(
            mouseConstraintRef.current,
            'startdrag',
            startDragHandlerRef.current
          );
        }
        Matter.Mouse.clearSourceEvents(mouseConstraintRef.current.mouse);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [resizeCanvas, renderLoop]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: style?.width || '100%',
        height: style?.height || '540px',
        minWidth: '200px',
        minHeight: '280px',
        backgroundColor: containerBg,
        overflow: 'hidden',
        borderRadius: '16px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'pan-y',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
      />
      {/* Subtle indicator hint at bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 18,
          zIndex: 5,
          pointerEvents: 'none',
          fontFamily: "'Geist Mono', var(--font-mono, monospace), monospace",
          fontSize: '0.6875rem',
          color: 'rgba(255, 255, 255, 0.28)',
          letterSpacing: '0.04em',
        }}
      >
        ✦ 2D Physics · Drag &amp; Throw
      </div>
    </div>
  );
}
