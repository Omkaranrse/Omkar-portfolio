'use client';

import * as React from 'react';
import Matter from 'matter-js';
import type { TechItem } from '@/data/techStack';

// ─────────────────────────────────────────────────────────
// BubblePit — Interactive Matter.js glass technology orbs
//
// • Real SVG technology logos
// • No text inside bubbles
// • Premium 3D glass sphere appearance
// • Realistic highlights / reflections
// • Responsive sphere sizing
// • Matter.js physics interaction
// • Mouse / touch interaction
// ─────────────────────────────────────────────────────────

export interface BubblePitProps {
  items?: TechItem[];
  bubbleCount?: number;
  gravity?: number;
  restitution?: number;
  baseMinRadius?: number;
  baseMaxRadius?: number;
  spawnDuration?: number;
  spawnOnClick?: boolean;
  spawnCount?: number;
  airPressure?: number;
  className?: string;
  style?: React.CSSProperties;
}

/* ─────────────────────────────────────────────────────── */
/* Logo preloading                                        */
/* ─────────────────────────────────────────────────────── */

const logoImageCache = new Map<string, HTMLImageElement>();
const textureCache = new Map<string, string>();

async function preloadLogos(items: TechItem[]): Promise<void> {
  const urls = new Set(
    items
      .map((item) => item.iconUrl)
      .filter((url): url is string => Boolean(url)),
  );

  await Promise.all(
    Array.from(urls).map(
      (url) =>
        new Promise<void>((resolve) => {
          if (logoImageCache.has(url)) {
            resolve();
            return;
          }

          const img = new Image();

          img.crossOrigin = 'anonymous';

          img.onload = () => {
            logoImageCache.set(url, img);
            resolve();
          };

          img.onerror = () => {
            resolve();
          };

          img.src = url;
        }),
    ),
  );
}

/* ─────────────────────────────────────────────────────── */
/* Glass sphere texture                                  */
/* ─────────────────────────────────────────────────────── */

function createGlassSphereTexture(
  item: TechItem,
  size: number,
): string {
  const key = `glass-${item.name}-${item.iconUrl}-${size}-${item.invertIcon ? 'invert' : 'normal'}`;

  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  const cx = size / 2;
  const cy = size / 2;

  // Leave a tiny amount of space around the sphere.
  const r = size / 2 - Math.max(2, size * 0.025);

  /* ──────────────────────────────────────────────────── */
  /* Sphere clipping                                     */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  /* ──────────────────────────────────────────────────── */
  /* 1. Transparent glass base                          */
  /* ──────────────────────────────────────────────────── */

  const glassBase = ctx.createRadialGradient(
    cx - r * 0.28,
    cy - r * 0.35,
    r * 0.05,
    cx,
    cy,
    r,
  );

  glassBase.addColorStop(
    0,
    'rgba(255,255,255,0.18)',
  );

  glassBase.addColorStop(
    0.35,
    'rgba(210,225,240,0.08)',
  );

  glassBase.addColorStop(
    0.7,
    'rgba(110,130,150,0.045)',
  );

  glassBase.addColorStop(
    1,
    'rgba(10,15,22,0.32)',
  );

  ctx.fillStyle = glassBase;
  ctx.fillRect(0, 0, size, size);

  /* ──────────────────────────────────────────────────── */
  /* 2. Subtle internal glass depth                     */
  /* ──────────────────────────────────────────────────── */

  const depthGradient = ctx.createRadialGradient(
    cx,
    cy,
    r * 0.15,
    cx,
    cy,
    r,
  );

  depthGradient.addColorStop(
    0,
    'rgba(255,255,255,0.025)',
  );

  depthGradient.addColorStop(
    0.55,
    'rgba(120,140,165,0.02)',
  );

  depthGradient.addColorStop(
    0.82,
    'rgba(0,0,0,0.16)',
  );

  depthGradient.addColorStop(
    1,
    'rgba(0,0,0,0.48)',
  );

  ctx.fillStyle = depthGradient;
  ctx.fillRect(0, 0, size, size);

  /* ──────────────────────────────────────────────────── */
  /* 3. Soft inner glow                                 */
  /* ──────────────────────────────────────────────────── */

  const innerGlow = ctx.createRadialGradient(
    cx - r * 0.28,
    cy - r * 0.38,
    0,
    cx - r * 0.28,
    cy - r * 0.38,
    r * 0.72,
  );

  innerGlow.addColorStop(
    0,
    'rgba(255,255,255,0.13)',
  );

  innerGlow.addColorStop(
    0.35,
    'rgba(255,255,255,0.045)',
  );

  innerGlow.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  ctx.fillStyle = innerGlow;
  ctx.fillRect(0, 0, size, size);

  /* ──────────────────────────────────────────────────── */
  /* 4. Real technology logo                            */
  /* ──────────────────────────────────────────────────── */

  const logoImg = logoImageCache.get(item.iconUrl);

  if (logoImg) {
    ctx.save();

    ctx.globalAlpha = 0.98;

    if (item.invertIcon) {
      ctx.filter = 'invert(1)';
    }

    /*
     * Keep the real logo's aspect ratio.
     * Never stretch the technology logo.
     */
    const sourceWidth =
      logoImg.naturalWidth ||
      logoImg.width ||
      1;

    const sourceHeight =
      logoImg.naturalHeight ||
      logoImg.height ||
      1;

    const aspectRatio = sourceWidth / sourceHeight;

    const maxLogoSize = r * 0.92;

    let logoWidth = maxLogoSize;
    let logoHeight = maxLogoSize;

    if (aspectRatio > 1) {
      logoHeight = maxLogoSize / aspectRatio;
    } else {
      logoWidth = maxLogoSize * aspectRatio;
    }

    const logoX = cx - logoWidth / 2;
    const logoY = cy - logoHeight / 2;

    /*
     * Very subtle shadow behind the logo.
     * This gives the logo some depth without
     * making the sphere look like plastic.
     */
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = Math.max(2, size * 0.025);
    ctx.shadowOffsetY = Math.max(1, size * 0.01);

    ctx.drawImage(
      logoImg,
      logoX,
      logoY,
      logoWidth,
      logoHeight,
    );

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.filter = 'none';
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  /* ──────────────────────────────────────────────────── */
  /* 5. Glass reflection streak                         */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  const reflectionGradient = ctx.createLinearGradient(
    cx - r * 0.8,
    cy - r * 0.9,
    cx + r * 0.15,
    cy - r * 0.1,
  );

  reflectionGradient.addColorStop(
    0,
    'rgba(255,255,255,0)',
  );

  reflectionGradient.addColorStop(
    0.3,
    'rgba(255,255,255,0.18)',
  );

  reflectionGradient.addColorStop(
    0.5,
    'rgba(255,255,255,0.05)',
  );

  reflectionGradient.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  ctx.beginPath();

  ctx.ellipse(
    cx - r * 0.22,
    cy - r * 0.48,
    r * 0.46,
    r * 0.13,
    -Math.PI * 0.18,
    0,
    Math.PI * 2,
  );

  ctx.fillStyle = reflectionGradient;
  ctx.fill();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* 6. Large curved glass reflection                   */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  const curvedReflection = ctx.createRadialGradient(
    cx - r * 0.38,
    cy - r * 0.48,
    0,
    cx - r * 0.38,
    cy - r * 0.48,
    r * 0.52,
  );

  curvedReflection.addColorStop(
    0,
    'rgba(255,255,255,0.26)',
  );

  curvedReflection.addColorStop(
    0.2,
    'rgba(255,255,255,0.11)',
  );

  curvedReflection.addColorStop(
    0.55,
    'rgba(255,255,255,0.025)',
  );

  curvedReflection.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  ctx.beginPath();

  ctx.ellipse(
    cx - r * 0.3,
    cy - r * 0.32,
    r * 0.42,
    r * 0.24,
    -Math.PI * 0.35,
    0,
    Math.PI * 2,
  );

  ctx.fillStyle = curvedReflection;
  ctx.fill();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* 7. Bottom glass reflection                         */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  const bottomGlow = ctx.createLinearGradient(
    0,
    cy + r * 0.35,
    0,
    cy + r,
  );

  bottomGlow.addColorStop(
    0,
    'rgba(255,255,255,0)',
  );

  bottomGlow.addColorStop(
    0.65,
    'rgba(255,255,255,0.035)',
  );

  bottomGlow.addColorStop(
    1,
    'rgba(255,255,255,0.11)',
  );

  ctx.fillStyle = bottomGlow;
  ctx.fillRect(
    0,
    cy + r * 0.25,
    size,
    r,
  );

  ctx.restore();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* 8. Outer glass rim                                 */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r - 1,
    0,
    Math.PI * 2,
  );

  const rimGradient = ctx.createLinearGradient(
    cx - r * 0.8,
    cy - r * 0.8,
    cx + r * 0.75,
    cy + r * 0.8,
  );

  rimGradient.addColorStop(
    0,
    'rgba(255,255,255,0.78)',
  );

  rimGradient.addColorStop(
    0.16,
    'rgba(255,255,255,0.35)',
  );

  rimGradient.addColorStop(
    0.4,
    'rgba(255,255,255,0.07)',
  );

  rimGradient.addColorStop(
    0.7,
    'rgba(255,255,255,0.025)',
  );

  rimGradient.addColorStop(
    1,
    'rgba(255,255,255,0.3)',
  );

  ctx.strokeStyle = rimGradient;

  ctx.lineWidth = Math.max(
    1.25,
    size * 0.018,
  );

  ctx.stroke();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* 9. Inner rim / refraction edge                     */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    r * 0.92,
    0,
    Math.PI * 2,
  );

  const innerRim = ctx.createRadialGradient(
    cx,
    cy,
    r * 0.62,
    cx,
    cy,
    r,
  );

  innerRim.addColorStop(
    0,
    'rgba(255,255,255,0)',
  );

  innerRim.addColorStop(
    0.78,
    'rgba(255,255,255,0)',
  );

  innerRim.addColorStop(
    0.94,
    'rgba(255,255,255,0.055)',
  );

  innerRim.addColorStop(
    1,
    'rgba(255,255,255,0.18)',
  );

  ctx.strokeStyle = innerRim;

  ctx.lineWidth = Math.max(
    1,
    size * 0.012,
  );

  ctx.stroke();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* 10. Specular highlight                             */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  const highlightX = cx - r * 0.34;
  const highlightY = cy - r * 0.47;
  const highlightRadius = r * 0.075;

  const specular = ctx.createRadialGradient(
    highlightX,
    highlightY,
    0,
    highlightX,
    highlightY,
    highlightRadius,
  );

  specular.addColorStop(
    0,
    'rgba(255,255,255,0.98)',
  );

  specular.addColorStop(
    0.25,
    'rgba(255,255,255,0.65)',
  );

  specular.addColorStop(
    0.65,
    'rgba(255,255,255,0.16)',
  );

  specular.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  ctx.beginPath();

  ctx.arc(
    highlightX,
    highlightY,
    highlightRadius,
    0,
    Math.PI * 2,
  );

  ctx.fillStyle = specular;
  ctx.fill();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* 11. Small secondary highlight                     */
  /* ──────────────────────────────────────────────────── */

  ctx.save();

  const smallHighlightX = cx - r * 0.15;
  const smallHighlightY = cy - r * 0.62;
  const smallHighlightRadius = r * 0.025;

  const smallSpecular = ctx.createRadialGradient(
    smallHighlightX,
    smallHighlightY,
    0,
    smallHighlightX,
    smallHighlightY,
    smallHighlightRadius,
  );

  smallSpecular.addColorStop(
    0,
    'rgba(255,255,255,0.85)',
  );

  smallSpecular.addColorStop(
    1,
    'rgba(255,255,255,0)',
  );

  ctx.beginPath();

  ctx.arc(
    smallHighlightX,
    smallHighlightY,
    smallHighlightRadius,
    0,
    Math.PI * 2,
  );

  ctx.fillStyle = smallSpecular;
  ctx.fill();

  ctx.restore();

  /* ──────────────────────────────────────────────────── */
  /* Export texture                                      */
  /* ──────────────────────────────────────────────────── */

  const url = canvas.toDataURL(
    'image/png',
  );

  textureCache.set(key, url);

  return url;
}

/* ─────────────────────────────────────────────────────── */
/* Component                                             */
/* ─────────────────────────────────────────────────────── */

export default function BubblePit({
  items,
  bubbleCount = 20,
  gravity = 0.85,
  restitution = 0.82,
  baseMinRadius = 42,
  baseMaxRadius = 58,
  spawnDuration = 3200,
  spawnOnClick = true,
  spawnCount = 2,
  airPressure = 0.018,
  className = '',
  style,
}: BubblePitProps) {
  const sceneRef =
    React.useRef<HTMLDivElement>(null);

  const engineRef =
    React.useRef<Matter.Engine | null>(null);

  const renderRef =
    React.useRef<Matter.Render | null>(null);

  const runnerRef =
    React.useRef<Matter.Runner | null>(null);

  const timersRef =
    React.useRef<NodeJS.Timeout[]>([]);

  const [dims, setDims] =
    React.useState({
      width: 0,
      height: 0,
    });

  const [engineReady, setEngineReady] =
    React.useState(false);

  const [isVisible, setIsVisible] =
    React.useState(false);

  const [logosReady, setLogosReady] =
    React.useState(false);

  const techItems = items ?? [];

  /* ──────────────────────────────────────────────────── */
  /* Preload logos                                      */
  /* ──────────────────────────────────────────────────── */

  React.useEffect(() => {
    if (techItems.length === 0) {
      return;
    }

    let cancelled = false;

    textureCache.clear();

    setLogosReady(false);

    preloadLogos(techItems).then(() => {
      if (!cancelled) {
        setLogosReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [techItems]);

  /* ──────────────────────────────────────────────────── */
  /* Responsive sizing                                  */
  /* ──────────────────────────────────────────────────── */

  const {
    minRadius,
    maxRadius,
    effectiveBubbleCount,
  } = React.useMemo(() => {
    const width = dims.width;

    if (width < 480) {
      return {
        minRadius: baseMinRadius * 0.72,
        maxRadius: baseMaxRadius * 0.72,
        effectiveBubbleCount: Math.min(
          bubbleCount,
          12,
        ),
      };
    }

    if (width < 768) {
      return {
        minRadius: baseMinRadius * 0.85,
        maxRadius: baseMaxRadius * 0.85,
        effectiveBubbleCount: Math.min(
          bubbleCount,
          16,
        ),
      };
    }

    return {
      minRadius: baseMinRadius,
      maxRadius: baseMaxRadius,
      effectiveBubbleCount: bubbleCount,
    };
  }, [
    dims.width,
    baseMinRadius,
    baseMaxRadius,
    bubbleCount,
  ]);

  /* ──────────────────────────────────────────────────── */
  /* Resize observer                                    */
  /* ──────────────────────────────────────────────────── */

  React.useEffect(() => {
    const element = sceneRef.current;

    if (!element) {
      return;
    }

    const resizeObserver =
      new ResizeObserver(() => {
        setDims({
          width: element.clientWidth,
          height: element.clientHeight,
        });
      });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /* ──────────────────────────────────────────────────── */
  /* Viewport visibility                                */
  /* ──────────────────────────────────────────────────── */

  React.useEffect(() => {
    const element = sceneRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ──────────────────────────────────────────────────── */
  /* Matter.js engine                                   */
  /* ──────────────────────────────────────────────────── */

  React.useEffect(() => {
    if (
      dims.width === 0 ||
      dims.height === 0 ||
      !sceneRef.current
    ) {
      return;
    }

    const engine =
      Matter.Engine.create({
        gravity: {
          x: 0,
          y: gravity,
        },
      });

    engineRef.current = engine;

    const render =
      Matter.Render.create({
        element: sceneRef.current,
        engine,
        options: {
          width: dims.width,
          height: dims.height,
          wireframes: false,
          background: 'transparent',
        },
      });

    renderRef.current = render;

    render.canvas.style.position =
      'absolute';

    render.canvas.style.top = '0';
    render.canvas.style.left = '0';
    render.canvas.style.pointerEvents =
      'auto';

    /* ──────────────────────────────────────────────── */
    /* Bounding walls                                  */
    /* ──────────────────────────────────────────────── */

    const wallThickness = 80;

    const walls = [
      Matter.Bodies.rectangle(
        dims.width / 2,
        dims.height +
        wallThickness / 2,
        dims.width * 2,
        wallThickness,
        {
          isStatic: true,
          render: {
            visible: false,
          },
        },
      ),

      Matter.Bodies.rectangle(
        -wallThickness / 2,
        dims.height / 2,
        wallThickness,
        dims.height * 2,
        {
          isStatic: true,
          render: {
            visible: false,
          },
        },
      ),

      Matter.Bodies.rectangle(
        dims.width +
        wallThickness / 2,
        dims.height / 2,
        wallThickness,
        dims.height * 2,
        {
          isStatic: true,
          render: {
            visible: false,
          },
        },
      ),
    ];

    Matter.Composite.add(
      engine.world,
      walls,
    );

    /* ──────────────────────────────────────────────── */
    /* Mouse interaction                               */
    /* ──────────────────────────────────────────────── */

    const mouse =
      Matter.Mouse.create(render.canvas);

    const mouseConstraint =
      Matter.MouseConstraint.create(
        engine,
        {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false,
            },
          },
        },
      );

    Matter.Composite.add(
      engine.world,
      mouseConstraint,
    );

    /* ──────────────────────────────────────────────── */
    /* Gentle rotation damping                         */
    /* ──────────────────────────────────────────────── */

    const afterUpdateHandler = () => {
      const bodies =
        Matter.Composite.allBodies(
          engine.world,
        ).filter(
          (body) => !body.isStatic,
        );

      for (const body of bodies) {
        const angularVelocity =
          body.angularVelocity;

        if (
          Math.abs(angularVelocity) >
          0.012
        ) {
          Matter.Body.setAngularVelocity(
            body,
            Math.sign(
              angularVelocity,
            ) *
            Math.min(
              Math.abs(
                angularVelocity,
              ),
              0.012,
            ),
          );
        }
      }
    };

    Matter.Events.on(
      engine,
      'afterUpdate',
      afterUpdateHandler,
    );

    /* ──────────────────────────────────────────────── */
    /* Runner                                          */
    /* ──────────────────────────────────────────────── */

    const runner =
      Matter.Runner.create();

    runnerRef.current = runner;

    Matter.Runner.run(
      runner,
      engine,
    );

    Matter.Render.run(render);

    setEngineReady(true);

    /* ──────────────────────────────────────────────── */
    /* Spawn bubble                                   */
    /* ──────────────────────────────────────────────── */

    const spawnAt = (
      originX: number,
      originY: number,
    ) => {
      if (
        !engineRef.current ||
        techItems.length === 0
      ) {
        return;
      }

      for (
        let i = 0;
        i < spawnCount;
        i++
      ) {
        const tech =
          techItems[
          Math.floor(
            Math.random() *
            techItems.length,
          )
          ];

        /*
         * Bubbles no longer need to resize
         * according to the technology name.
         * They now have consistent glass-orb sizing.
         */
        const radius =
          minRadius +
          Math.random() *
          (maxRadius - minRadius);

        const texture =
          createGlassSphereTexture(
            tech,
            Math.round(radius * 2),
          );

        const body =
          Matter.Bodies.circle(
            originX +
            (Math.random() - 0.5) *
            30,
            originY +
            (Math.random() - 0.5) *
            30,
            radius,
            {
              restitution,
              friction: 0.04,
              frictionAir: 0.015,
              density: 0.001,
              render: {
                sprite: {
                  texture,
                  xScale: 1,
                  yScale: 1,
                },
              },
            },
          );

        Matter.Body.setVelocity(
          body,
          {
            x:
              (Math.random() - 0.5) *
              10,
            y:
              -(Math.random() * 10 +
                6),
          },
        );

        Matter.Composite.add(
          engine.world,
          body,
        );
      }
    };

    /* ──────────────────────────────────────────────── */
    /* Mouse / touch spawn                             */
    /* ──────────────────────────────────────────────── */

    const onMouseDown = (
      event: MouseEvent,
    ) => {
      spawnAt(
        event.offsetX,
        event.offsetY,
      );
    };

    const onTouchStart = (
      event: TouchEvent,
    ) => {
      const rect =
        render.canvas.getBoundingClientRect();

      const touch =
        event.touches[0];

      if (!touch) {
        return;
      }

      spawnAt(
        touch.clientX - rect.left,
        touch.clientY - rect.top,
      );
    };

    if (spawnOnClick) {
      render.canvas.addEventListener(
        'mousedown',
        onMouseDown,
      );

      render.canvas.addEventListener(
        'touchstart',
        onTouchStart,
        {
          passive: true,
        },
      );
    }

    /* ──────────────────────────────────────────────── */
    /* Cursor air pressure                            */
    /* ──────────────────────────────────────────────── */

    const onMouseMove = (
      event: MouseEvent,
    ) => {
      const rect =
        render.canvas.getBoundingClientRect();

      const mouseX =
        event.clientX - rect.left;

      const mouseY =
        event.clientY - rect.top;

      const bodies =
        Matter.Composite.allBodies(
          engine.world,
        ).filter(
          (body) => !body.isStatic,
        );

      for (const body of bodies) {
        const dx =
          body.position.x - mouseX;

        const dy =
          body.position.y - mouseY;

        const distance =
          Math.sqrt(
            dx * dx + dy * dy,
          );

        const bubbleRadius =
          Math.sqrt(
            body.area / Math.PI,
          );

        const influence =
          bubbleRadius * 3.2;

        if (
          distance < influence &&
          distance > 1
        ) {
          const proximity =
            1 -
            distance /
            influence;

          const smooth =
            proximity * proximity;

          const force =
            smooth *
            airPressure *
            body.mass;

          Matter.Body.applyForce(
            body,
            body.position,
            {
              x:
                (dx / distance) *
                force,
              y:
                (dy / distance) *
                force,
            },
          );
        }
      }
    };

    render.canvas.addEventListener(
      'mousemove',
      onMouseMove,
    );

    /* ──────────────────────────────────────────────── */
    /* Cleanup                                         */
    /* ──────────────────────────────────────────────── */

    return () => {
      setEngineReady(false);

      timersRef.current.forEach(
        clearTimeout,
      );

      timersRef.current = [];

      if (spawnOnClick) {
        render.canvas.removeEventListener(
          'mousedown',
          onMouseDown,
        );

        render.canvas.removeEventListener(
          'touchstart',
          onTouchStart,
        );
      }

      render.canvas.removeEventListener(
        'mousemove',
        onMouseMove,
      );

      Matter.Events.off(
        engine,
        'afterUpdate',
        afterUpdateHandler,
      );

      Matter.Runner.stop(
        runner,
      );

      Matter.Render.stop(
        render,
      );

      Matter.Engine.clear(
        engine,
      );

      render.canvas.remove();
    };
  }, [
    dims,
    gravity,
    restitution,
    minRadius,
    maxRadius,
    spawnOnClick,
    spawnCount,
    airPressure,
    techItems,
  ]);

  /* ─────────────────────────────────────────────────────── */
  /* Spawn initial bubbles                                 */
  /* ─────────────────────────────────────────────────────── */

  React.useEffect(() => {
    if (
      !engineReady ||
      !isVisible ||
      !logosReady ||
      !engineRef.current ||
      techItems.length === 0
    ) {
      return;
    }

    const engine =
      engineRef.current;

    timersRef.current.forEach(
      clearTimeout,
    );

    timersRef.current = [];

    /* Remove existing dynamic bodies */
    const oldBodies =
      Matter.Composite.allBodies(
        engine.world,
      ).filter(
        (body) => !body.isStatic,
      );

    Matter.Composite.remove(
      engine.world,
      oldBodies,
    );

    const count =
      effectiveBubbleCount;

    const stagger =
      count > 1
        ? spawnDuration / count
        : 0;

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const timeoutId =
        setTimeout(() => {
          if (
            !engineRef.current
          ) {
            return;
          }

          const tech =
            techItems[
            i %
            techItems.length
            ];

          /*
           * Slight natural size variation,
           * but no text-based sizing.
           */
          const radius =
            minRadius +
            Math.random() *
            (maxRadius - minRadius);

          const texture =
            createGlassSphereTexture(
              tech,
              Math.round(radius * 2),
            );

          const body =
            Matter.Bodies.circle(
              Math.random() *
              (dims.width -
                radius * 2) +
              radius,
              -radius * 2,
              radius,
              {
                restitution,
                friction: 0.04,
                frictionAir: 0.015,
                density: 0.001,

                render: {
                  sprite: {
                    texture,
                    xScale: 1,
                    yScale: 1,
                  },
                },
              },
            );

          Matter.Body.setVelocity(
            body,
            {
              x:
                (Math.random() -
                  0.5) *
                6,

              y:
                Math.random() *
                2 +
                1,
            },
          );

          Matter.Composite.add(
            engineRef.current.world,
            body,
          );
        },
          i * stagger,
        );

      timersRef.current.push(
        timeoutId,
      );
    }

    return () => {
      timersRef.current.forEach(
        clearTimeout,
      );

      timersRef.current = [];
    };
  }, [
    engineReady,
    isVisible,
    logosReady,
    effectiveBubbleCount,
    minRadius,
    maxRadius,
    restitution,
    spawnDuration,
    techItems,
    dims.width,
  ]);

  /* ─────────────────────────────────────────────────────── */
  /* Render                                                 */
  /* ─────────────────────────────────────────────────────── */

  return (
    <div
      ref={sceneRef}
      className={`bubblepit-container ${className}`}
      aria-label="Interactive technology skills bubble pit"
      style={{
        width: '100%',
        height: 420,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,

        /*
         * Deep premium background so the
         * transparent glass spheres stand out.
         */
        background:
          'radial-gradient(ellipse at 50% 35%, rgba(30,36,48,0.96) 0%, rgba(12,15,21,0.98) 48%, rgba(5,7,11,1) 100%)',

        border:
          '1px solid rgba(255,255,255,0.10)',

        boxShadow:
          '0 24px 60px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(255,255,255,0.035)',

        ...style,
      }}
    >
      {/* ────────────────────────────────────────────── */}
      {/* Interaction prompt                            */}
      {/* ────────────────────────────────────────────── */}

      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 18,
          zIndex: 5,
          pointerEvents: 'none',

          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background:
              'var(--accent, #eb4c2a)',
            boxShadow:
              '0 0 8px var(--accent, #eb4c2a)',
          }}
        />

        <span
          style={{
            fontFamily:
              'var(--font-mono, monospace)',
            fontSize: '0.6875rem',
            letterSpacing: '0.06em',
            color:
              'rgba(255,255,255,0.52)',
            textTransform: 'uppercase',
          }}
        >
          Interactive Physics · Click to
          drop / Push with cursor
        </span>
      </div>

      {/* ────────────────────────────────────────────── */}
      {/* Category legend                              */}
      {/* ────────────────────────────────────────────── */}

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 18,
          zIndex: 5,
          pointerEvents: 'none',

          fontFamily:
            'var(--font-mono, monospace)',

          fontSize: '0.6875rem',

          color:
            'rgba(255,255,255,0.30)',
        }}
      >
        ● AI · Mobile · Backend · Systems
      </div>
    </div>
  );
}