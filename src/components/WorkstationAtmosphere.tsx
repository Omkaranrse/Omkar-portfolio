'use client';

import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// WorkstationAtmosphere
// Lively ambient atmosphere for the desk scene:
// 1. Twinkling golden fairy lights on the top-left plant shelf
// 2. Soft breathing warm amber glow on the desk orb lamp
// 3. Volumetric window sunbeams / god rays with natural atmospheric drift
// 4. Subtle dappled leaf shadows / sunlight shimmer on the room wall
// 5. Floating golden dust motes that catch the sunlight and react to cursor air-drift
// 6. Interactive 3D mouse parallax giving tangible depth to the room
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  wobbleRadius: number;
  inSunbeam: boolean;
}

// Hand-tuned coordinates mapping the fairy lights on the shelf plant
const FAIRY_LIGHTS = [
  { x: 9.8, y: 18.2, size: 7, delay: 0.1, dur: 2.8, color: '#ffe699' },
  { x: 12.0, y: 19.6, size: 4.5, delay: 1.2, dur: 3.4, color: '#ffd166' },
  { x: 14.5, y: 17.2, size: 5, delay: 2.1, dur: 2.6, color: '#fff0b3' },
  { x: 17.2, y: 21.8, size: 4, delay: 0.5, dur: 3.8, color: '#ffb703' },
  { x: 18.6, y: 18.4, size: 5.5, delay: 2.9, dur: 3.1, color: '#ffe49e' },
  { x: 20.4, y: 24.2, size: 4, delay: 1.7, dur: 2.5, color: '#ffd166' },
  { x: 22.1, y: 19.8, size: 5, delay: 3.3, dur: 3.6, color: '#ffebad' },
  { x: 23.6, y: 27.2, size: 4.5, delay: 0.8, dur: 2.9, color: '#ffc857' },
  { x: 25.0, y: 31.2, size: 5, delay: 2.4, dur: 3.3, color: '#ffe394' },
  { x: 22.3, y: 34.5, size: 4, delay: 1.5, dur: 2.7, color: '#ffd166' },
  { x: 19.2, y: 31.0, size: 5, delay: 3.1, dur: 3.5, color: '#ffea9f' },
  { x: 16.2, y: 26.8, size: 4.5, delay: 0.3, dur: 3.0, color: '#ffbe0b' },
  { x: 13.8, y: 24.5, size: 5, delay: 2.0, dur: 3.2, color: '#ffdf85' },
  { x: 15.2, y: 33.2, size: 4, delay: 1.1, dur: 2.8, color: '#ffd166' },
  { x: 11.2, y: 22.5, size: 4.5, delay: 2.7, dur: 3.4, color: '#fff2b8' },
];

export default function WorkstationAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, rawX: -1000, rawY: -1000, moving: false });
  const animFrameRef = useRef<number | null>(null);
  const lastMouseTimeRef = useRef(0);

  // Subtle interactive parallax offset
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Handle subtle mouse movements across the scene
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    mouseRef.current = {
      x: normX,
      y: normY,
      rawX: e.clientX - rect.left,
      rawY: e.clientY - rect.top,
      moving: true,
    };
    lastMouseTimeRef.current = performance.now();

    // Smooth subtle parallax (max ~6px)
    const px = (normX - 0.5) * 8;
    const py = (normY - 0.5) * 5;
    setParallax({ x: px, y: py });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // ── Canvas: Floating Golden Dust Motes Catching Sunlight ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize 45 motes
    const particleCount = 45;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.8 + Math.random() * 1.8,
        baseAlpha: 0.15 + Math.random() * 0.45,
        alpha: 0.3,
        vx: (Math.random() - 0.5) * 0.00015,
        vy: -0.00018 - Math.random() * 0.00028, // gentle upward drift
        wobbleSpeed: 0.5 + Math.random() * 1.5,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleRadius: 0.0006 + Math.random() * 0.001,
        inSunbeam: false,
      });
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.rawX;
      const my = mouseRef.current.rawY;
      const isMouseActive = now - lastMouseTimeRef.current < 2000;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Wobble & float
        p.wobbleOffset += p.wobbleSpeed * dt;
        const wx = Math.sin(p.wobbleOffset) * p.wobbleRadius;
        const wy = Math.cos(p.wobbleOffset * 0.7) * (p.wobbleRadius * 0.5);

        p.x += (p.vx + wx) * (dt * 60);
        p.y += (p.vy + wy) * (dt * 60);

        // Wrap edges seamlessly
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = Math.random();
        }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const px = p.x * width;
        const py = p.y * height;

        // Interactive mouse air-drift displacement
        if (isMouseActive) {
          const dx = px - mx;
          const dy = py - my;
          const distSq = dx * dx + dy * dy;
          const pushRadius = 110;
          if (distSq < pushRadius * pushRadius && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / pushRadius) * 28 * dt;
            p.x += (dx / dist) * (force / width);
            p.y += (dy / dist) * (force / height);
          }
        }

        // Check if inside sunbeam zone (right side, angled)
        // Sunbeam roughly covers x: 0.65 to 1.0, y: 0 to 0.8
        const inSunbeam = p.x > 0.62 && p.y > 0.05 && p.y < 0.85;
        const targetAlpha = inSunbeam ? p.baseAlpha * 1.8 : p.baseAlpha;
        p.alpha += (targetAlpha - p.alpha) * 0.05;

        // Render delicate glowing motes
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);

        if (inSunbeam) {
          // Warm golden sunlit mote with soft halo
          ctx.fillStyle = `rgba(255, 240, 195, ${Math.min(p.alpha, 0.95)})`;
          ctx.shadowColor = 'rgba(255, 210, 120, 0.8)';
          ctx.shadowBlur = 6;
        } else {
          // Ambient soft mote
          ctx.fillStyle = `rgba(255, 225, 175, ${Math.min(p.alpha, 0.55)})`;
          ctx.shadowColor = 'rgba(255, 190, 100, 0.4)';
          ctx.shadowBlur = 3;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="workstation-atmosphere"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1, // Directly above home.png base image, behind mac-screen and keyboard
        overflow: 'hidden',
      }}
    >
      {/* ── 01. Volumetric Window Sunbeams (God Rays) ── */}
      <div
        className="sunbeams-layer"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${parallax.x * 0.3}px, ${parallax.y * 0.2}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Primary Sunbeam Shaft */}
        <div className="sunbeam-shaft sunbeam-shaft-1" />
        {/* Secondary Warm Beam */}
        <div className="sunbeam-shaft sunbeam-shaft-2" />
        {/* Soft Ambient Window Glare */}
        <div className="sunbeam-window-glow" />
      </div>

      {/* ── 02. Dappled Tree Leaf Shadows / Ambient Sun Ripple on Wall ── */}
      <div
        className="dappled-sunlight-wall"
        style={{
          transform: `translate3d(${parallax.x * 0.15}px, ${parallax.y * 0.1}px, 0)`,
        }}
      />

      {/* ── 03. Twinkling Golden Fairy Lights on Plant Shelf ── */}
      <div
        className="fairy-lights-group"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.3}px, 0)`,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Soft ambient shelf warmth */}
        <div className="shelf-warmth-glow" />

        {/* Individual Fairy Lights */}
        {FAIRY_LIGHTS.map((light, idx) => (
          <div
            key={idx}
            className="fairy-light-spark"
            style={{
              left: `${light.x}%`,
              top: `${light.y}%`,
              width: `${light.size}px`,
              height: `${light.size}px`,
              animationDelay: `${light.delay}s`,
              animationDuration: `${light.dur}s`,
              backgroundColor: light.color,
              boxShadow: `0 0 ${light.size * 2}px ${light.size}px rgba(255, 195, 75, 0.7), 0 0 ${light.size * 4}px ${light.size * 2}px rgba(255, 140, 25, 0.3)`,
            }}
          />
        ))}
      </div>

      {/* ── 04. Warm Breathing Glow on Desk Orb Lamp ── */}
      <div
        className="orb-lamp-aura"
        style={{
          transform: `translate3d(${parallax.x * 0.5}px, ${parallax.y * 0.35}px, 0)`,
        }}
      />

      {/* ── 05. Monstera Plant Gentle Sway Ripple (Left Edge) ── */}
      <div className="plant-breeze-shimmer" />

      {/* ── 06. Floating Golden Dust Motes Canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
