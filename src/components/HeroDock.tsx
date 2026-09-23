'use client';

import * as React from 'react';
import { useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────
// Vertical macOS Dock for Hero Section
// Displays developer tools: VS Code, Cursor, Xcode, Docker,
// PostgreSQL, Figma, Flutter, Next.js with smooth magnification,
// glassmorphism styling, and tooltips on the left.
// ─────────────────────────────────────────────────────────

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  invertDark?: boolean;
  inlineSvg?: React.ReactNode;
}

const TOOLS: ToolItem[] = [
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'Code Editor',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI Code Editor',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cursor/cursor-original.svg',
    inlineSvg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <path d="M12 2.5L3.5 7.4V16.6L12 21.5L20.5 16.6V7.4L12 2.5Z" fill="#141416" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        <path d="M12 2.5L20.5 7.4L12 12.2L3.5 7.4L12 2.5Z" fill="#2E2E34" />
        <path d="M12 12.2V21.5L20.5 16.6V7.4L12 12.2Z" fill="#3B82F6" />
        <path d="M12 12.2V21.5L3.5 16.6V7.4L12 12.2Z" fill="#1D4ED8" />
        <path d="M12 4L18.5 7.6L12 11.2L5.5 7.6L12 4Z" fill="#60A5FA" />
      </svg>
    ),
  },
  {
    id: 'xcode',
    name: 'Xcode',
    category: 'iOS / macOS IDE',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/xcode/xcode-original.svg',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'Multiplatform UI',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Full-Stack React',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    invertDark: true,
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Containers & DevOps',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Relational Database',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Interface Design',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
  },
];

const BASE_SIZE = 42; // px base icon button size
const MAX_SCALE = 1.62; // peak magnification scale
const REACH = 110; // distance in px over which magnification takes effect

export default function HeroDock() {
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const dockRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    setMouseY(relY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseY(null);
    setHoveredIdx(null);
  }, []);

  return (
    <aside
      className="hero-vertical-dock-container"
      aria-label="Developer tools dock"
    >
      <div
        ref={dockRef}
        className="hero-vertical-dock-pill"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {TOOLS.map((tool, idx) => {
          // Calculate item center Y inside the dock
          // padding: 12px, gap: 10px, item height: BASE_SIZE
          const itemCenterY = 12 + idx * (BASE_SIZE + 10) + BASE_SIZE / 2;

          let scale = 1;
          if (mouseY !== null) {
            const dist = Math.abs(mouseY - itemCenterY);
            if (dist < REACH) {
              const t = dist / REACH;
              // Smooth cosine bell curve
              const factor = Math.cos(t * Math.PI * 0.5);
              scale = 1 + (MAX_SCALE - 1) * Math.pow(factor, 1.4);
            }
          }

          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={tool.id}
              className="hero-dock-item-wrapper"
              style={{
                width: BASE_SIZE,
                height: BASE_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => {
                if (hoveredIdx === idx) setHoveredIdx(null);
              }}
            >
              {/* Tooltip to the left of the item */}
              {isHovered && (
                <div className="hero-dock-tooltip" role="tooltip">
                  <span className="hero-dock-tooltip-name">{tool.name}</span>
                  <span className="hero-dock-tooltip-category">
                    {tool.category}
                  </span>
                  <div className="hero-dock-tooltip-arrow" aria-hidden="true" />
                </div>
              )}

              {/* Magnifying Icon Button */}
              <div
                className={`hero-dock-icon-btn ${isHovered ? 'is-active' : ''}`}
                style={{
                  width: BASE_SIZE,
                  height: BASE_SIZE,
                  transform: `scale(${scale})`,
                  transformOrigin: 'right center',
                  transition:
                    mouseY === null
                      ? 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      : 'transform 0.08s ease-out',
                }}
              >
                {tool.inlineSvg && (imgErrors[tool.id] || !tool.iconUrl) ? (
                  <div className="hero-dock-icon-svg">{tool.inlineSvg}</div>
                ) : (
                  <img
                    src={tool.iconUrl}
                    alt={tool.name}
                    width={26}
                    height={26}
                    draggable={false}
                    className={`hero-dock-icon-img ${
                      tool.invertDark ? 'is-inverted' : ''
                    }`}
                    onError={() => {
                      setImgErrors((prev) => ({ ...prev, [tool.id]: true }));
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
