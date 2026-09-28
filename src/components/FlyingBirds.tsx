'use client';

import * as React from 'react';

// ─────────────────────────────────────────────────────────
// FlyingBirds — Cinematic distant black birds flying in sky
// • Authentic wing flapping with aerodynamic gliding pauses
// • Natural flock formation with varied speeds, depths & scales
// • Negative animation delays for instant lifelike presence
// • Layered behind foreground elements, directly in the sky
// ─────────────────────────────────────────────────────────

interface BirdConfig {
  id: string;
  size: number; // width in px
  topPercent: number; // vertical position in sky %
  duration: number; // flight speed across screen (seconds)
  delay: number; // negative start offset (seconds)
  flapDuration: number; // wing stroke cycle time (seconds)
  glideRatio: number; // flapping vs gliding rhythm
  opacity: number;
}

const BIRDS: BirdConfig[] = [
  {
    id: 'bird-1',
    size: 24,
    topPercent: 13,
    duration: 25,
    delay: -7,
    flapDuration: 2.1,
    glideRatio: 1,
    opacity: 0.88,
  },
  {
    id: 'bird-2',
    size: 18,
    topPercent: 9,
    duration: 28,
    delay: -15,
    flapDuration: 2.4,
    glideRatio: 0.95,
    opacity: 0.76,
  },
  {
    id: 'bird-3',
    size: 21,
    topPercent: 18,
    duration: 26,
    delay: -3,
    flapDuration: 2.2,
    glideRatio: 1.05,
    opacity: 0.82,
  },
  {
    id: 'bird-4',
    size: 13,
    topPercent: 7,
    duration: 34,
    delay: -21,
    flapDuration: 2.7,
    glideRatio: 0.9,
    opacity: 0.65,
  },
  {
    id: 'bird-5',
    size: 16,
    topPercent: 23,
    duration: 30,
    delay: -11,
    flapDuration: 2.3,
    glideRatio: 1.1,
    opacity: 0.72,
  },
  {
    id: 'bird-6',
    size: 15,
    topPercent: 15,
    duration: 32,
    delay: -27,
    flapDuration: 2.5,
    glideRatio: 1.0,
    opacity: 0.68,
  },
];

export default function FlyingBirds() {
  return (
    <div
      className="hero-birds-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 3,
      }}
    >
      {BIRDS.map((bird) => (
        <div
          key={bird.id}
          className={`hero-bird-track ${bird.id}`}
          style={{
            position: 'absolute',
            top: `${bird.topPercent}%`,
            left: 0,
            opacity: bird.opacity,
            animation: `bird-flight ${bird.duration}s linear infinite`,
            animationDelay: `${bird.delay}s`,
            willChange: 'transform',
          }}
        >
          {/* Subtle vertical sine wave gliding motion */}
          <div
            className="hero-bird-soar"
            style={{
              animation: `bird-soar ${bird.duration * 0.3}s ease-in-out infinite alternate`,
            }}
          >
            <svg
              viewBox="0 0 36 18"
              width={bird.size}
              height={bird.size * 0.5}
              style={{
                display: 'block',
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25))',
                transform: 'rotate(-4deg)', // slight natural upward flight angle
              }}
            >
              {/* Central small bird torso */}
              <ellipse cx="18" cy="9" rx="1.8" ry="1.2" fill="#000000" />

              {/* Left Wing (Articulated flapping from joint cx=18, cy=9) */}
              <path
                className="bird-wing-left"
                d="M 18 9 Q 10 2 1 7 Q 10 9 18 9 Z"
                fill="#000000"
                style={{
                  transformOrigin: '18px 9px',
                  animation: `bird-flap-left ${bird.flapDuration}s ease-in-out infinite`,
                }}
              />

              {/* Right Wing (Articulated flapping from joint cx=18, cy=9) */}
              <path
                className="bird-wing-right"
                d="M 18 9 Q 26 2 35 7 Q 26 9 18 9 Z"
                fill="#000000"
                style={{
                  transformOrigin: '18px 9px',
                  animation: `bird-flap-right ${bird.flapDuration}s ease-in-out infinite`,
                }}
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
