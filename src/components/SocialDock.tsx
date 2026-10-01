'use client';

import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import avatarImg from '@/images/portrait-avatar.webp';

// ─────────────────────────────────────────────────────────
// SocialDock — macOS Big Sur / Sonoma Authentic Dock
// • Base size: 68px, Gap: 22px
// • Exact official Google Workspace Gmail M vector
// • Running app indicator dots (•) underneath active icons
// • Translucent frosted glass shelf with luminous hairline border
// • Pinned profile item after vertical glass divider
// • Smooth continuous cosine bell-curve magnification on hover
// ─────────────────────────────────────────────────────────

export interface DockSocialItem {
  id: string;
  name: string;
  category?: string;
  href: string;
  external?: boolean;
  tileBg: string;
  tileBorder: string;
  tileShadow: string;
  innerGlow?: string;
  icon: React.ReactNode;
}

const SOCIAL_ITEMS: DockSocialItem[] = [
  {
    id: 'github',
    name: 'GitHub',
    href: 'https://github.com/Omkaranrse',
    external: true,
    tileBg: 'linear-gradient(180deg, #343944 0%, #1e2129 100%)',
    tileBorder: 'rgba(255, 255, 255, 0.22)',
    tileShadow: '0 8px 20px rgba(0, 0, 0, 0.28), 0 1px 3px rgba(0, 0, 0, 0.2)',
    innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(0, 0, 0, 0.4)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4))' }}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/omkar-anarse',
    external: true,
    tileBg: 'linear-gradient(180deg, #0A7CE5 0%, #005BB3 100%)',
    tileBorder: 'rgba(255, 255, 255, 0.35)',
    tileShadow: '0 8px 20px rgba(10, 124, 229, 0.38), 0 1px 3px rgba(0, 0, 0, 0.15)',
    innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.25)',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25))' }}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    href: 'https://wa.me/918356011246?text=Hi%20Omkar,%20saw%20your%20portfolio!',
    external: true,
    tileBg: 'linear-gradient(180deg, #32D96B 0%, #1BB352 100%)',
    tileBorder: 'rgba(255, 255, 255, 0.38)',
    tileShadow: '0 8px 20px rgba(27, 179, 82, 0.42), 0 1px 3px rgba(0, 0, 0, 0.15)',
    innerGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.22)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.22))' }}>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
      </svg>
    ),
  },
  {
    id: 'email',
    name: 'Email me',
    category: 'omkaranarse1906@gmail.com',
    href: 'mailto:omkaranarse1906@gmail.com',
    external: false,
    tileBg: 'linear-gradient(180deg, #FFFFFF 0%, #EFF2F6 100%)',
    tileBorder: 'rgba(0, 0, 0, 0.08)',
    tileShadow: '0 8px 20px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
    innerGlow: 'inset 0 1px 0 #FFFFFF, inset 0 -1px 0 rgba(0, 0, 0, 0.06)',
    icon: (
      // Official Google Workspace Gmail 2020 M Vector
      <svg width="37" height="37" viewBox="0 0 512 512" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.14))' }}>
        {/* Left Blue Pillar */}
        <path d="M34.9 448h81.5V250.2L0 163v250.2C0 432.5 15.7 448 34.9 448" fill="#4285f4" />
        {/* Right Green Pillar */}
        <path d="M395.6 448h81.5c19.3 0 34.9-15.7 34.9-34.9V163l-116.4 87.3" fill="#34a853" />
        {/* Top Left Yellow Shoulder */}
        <path d="M0 116.4V163l116.4 87.3V99L83.8 74.5C49.2 48.6 0 73.2 0 116.4" fill="#fbbc04" />
        {/* Top Right Dark Red Shoulder */}
        <path d="M395.6 99v151.3L512 163v-46.5c0-43.2-49.3-67.8-83.8-41.9" fill="#c5221f" />
        {/* Center Red V Chevron */}
        <path d="M116.4 250.2V99L256 203.7 395.6 99v151.3L256 355" fill="#ea4335" />
      </svg>
    ),
  },
  {
    id: 'resume',
    name: 'Resume',
    category: 'Download Resume',
    href: '/Omkar.pdf',
    external: true,
    tileBg: 'linear-gradient(180deg, #FFFFFF 0%, #EFF2F6 100%)',
    tileBorder: 'rgba(0, 0, 0, 0.08)',
    tileShadow: '0 8px 20px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
    innerGlow: 'inset 0 1px 0 #FFFFFF, inset 0 -1px 0 rgba(0, 0, 0, 0.06)',
    icon: (
      <div style={{ position: 'relative', width: 38, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Document Body */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)',
            borderRadius: '6px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Red Header explicitly labeled RESUME with download arrow */}
          <div
            style={{
              width: '100%',
              height: 14,
              background: 'linear-gradient(180deg, #FF3B30 0%, #D32018 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: '#ffffff',
              fontSize: '7.5px',
              fontWeight: 800,
              letterSpacing: '0.4px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span>RESUME</span>
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v13M18 11l-6 6-6-6" />
            </svg>
          </div>
          {/* Document Content Lines */}
          <div style={{ padding: '5px 5px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 2.2, background: 'rgba(0,0,0,0.4)', borderRadius: 1, width: '85%' }} />
            <div style={{ height: 2.2, background: 'rgba(0,0,0,0.22)', borderRadius: 1, width: '100%' }} />
            <div style={{ height: 2.2, background: 'rgba(0,0,0,0.22)', borderRadius: 1, width: '70%' }} />
            <div style={{ height: 2.2, background: 'rgba(0,0,0,0.22)', borderRadius: 1, width: '90%' }} />
          </div>
        </div>
      </div>
    ),
  },
];

const BASE_SIZE = 68; // Increased base squircle icon size
const GAP = 22; // Increased space between icons
const PADDING_X = 24; // Dock shelf horizontal padding
const MAX_SCALE = 1.38; // Peak magnification scale (~94px on hover)
const REACH = 135; // Distance in px over which bell-curve magnification applies

export default function SocialDock() {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const dockRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    setMouseX(relX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setHoveredIdx(null);
  }, []);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: DockSocialItem) => {
    setFocusedIdx(null);
    if (item.id === 'email') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('omkaranarse1906@gmail.com').then(() => {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2400);
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="social-dock-wrapper" aria-label="Social and professional links dock">
      <div
        ref={dockRef}
        className="social-dock-tray"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {SOCIAL_ITEMS.map((item, idx) => {
          // Calculate item center X inside tray
          const itemCenterX = PADDING_X + idx * (BASE_SIZE + GAP) + BASE_SIZE / 2;

          let scale = 1;
          if (mouseX !== null) {
            const dist = Math.abs(mouseX - itemCenterX);
            if (dist < REACH) {
              const t = dist / REACH;
              const factor = Math.cos(t * Math.PI * 0.5);
              scale = 1 + (MAX_SCALE - 1) * Math.pow(factor, 1.4);
            }
          }

          const isHovered = hoveredIdx === idx || focusedIdx === idx;
          const isEmail = item.id === 'email';
          const tooltipName = isEmail && copiedEmail ? '✓ Email copied!' : item.name;
          const tooltipCat = isEmail
            ? (copiedEmail ? 'Copied to clipboard' : 'Click to copy & mail ↗')
            : item.category;

          return (
            <div key={item.id} className="social-dock-item-col">
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="social-dock-item-link"
                style={{
                  width: BASE_SIZE,
                  height: BASE_SIZE,
                }}
                onClick={(e) => handleItemClick(e, item)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setFocusedIdx(idx)}
                onBlur={() => setFocusedIdx(null)}
                aria-label={`${item.name} — ${item.category || ''}`}
              >
                {/* Tooltip above the icon - ONLY on hover/focus */}
                {isHovered && (
                  <div className="social-dock-tooltip" role="tooltip">
                    <span className="social-dock-tooltip-name">{tooltipName}</span>
                    {tooltipCat && <span className="social-dock-tooltip-cat">{tooltipCat}</span>}
                    <div className="social-dock-tooltip-arrow" aria-hidden="true" />
                  </div>
                )}

                {/* macOS 3D Squircle App Icon Tile */}
                <div
                  className={`social-dock-icon-btn is-${item.id} ${isHovered ? 'is-active' : ''}`}
                  style={{
                    width: BASE_SIZE,
                    height: BASE_SIZE,
                    background: item.tileBg,
                    borderColor: item.tileBorder,
                    boxShadow: item.tileShadow,
                    transform: `scale(${scale}) translateY(${isHovered ? '-4px' : '0px'})`,
                    transformOrigin: 'bottom center',
                    transition:
                      mouseX === null
                        ? 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        : 'transform 0.08s ease-out',
                  }}
                >
                  {/* Subtle top specular sheen */}
                  <div className="social-dock-tile-sheen" style={{ boxShadow: item.innerGlow }} />
                  <div className="social-dock-icon-svg">{item.icon}</div>
                </div>
              </a>
            </div>
          );
        })}

        {/* Vertical Translucent Glass Divider */}
        <div className="social-dock-divider" aria-hidden="true" />

        {/* Pinned Profile Avatar (macOS Contacts style) */}
        <div className="social-dock-item-col">
          <button
            type="button"
            className="social-dock-profile-btn"
            style={{ width: BASE_SIZE, height: BASE_SIZE }}
            onMouseEnter={() => setHoveredIdx(99)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setFocusedIdx(99)}
            onBlur={() => setFocusedIdx(null)}
            onClick={() => {
              setFocusedIdx(null);
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            aria-label="Omkar Anarse — Scroll to top"
          >
            {(hoveredIdx === 99 || focusedIdx === 99) && (
              <div className="social-dock-tooltip" role="tooltip">
                <span className="social-dock-tooltip-name">Omkar Anarse</span>
                <span className="social-dock-tooltip-cat">Back to top ↑</span>
                <div className="social-dock-tooltip-arrow" aria-hidden="true" />
              </div>
            )}

            <div
              className="social-dock-avatar-frame"
              style={{
                width: BASE_SIZE,
                height: BASE_SIZE,
                transform: (hoveredIdx === 99 || focusedIdx === 99) ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Image
                src={avatarImg}
                alt="Omkar Anarse"
                width={68}
                height={68}
                style={{ objectFit: 'cover', borderRadius: 'inherit', width: '100%', height: '100%' }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
