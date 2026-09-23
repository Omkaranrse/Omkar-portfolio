'use client';

import { useState, useCallback } from 'react';

/* ─────────────────────────────────────────
   Dock item configuration
   ───────────────────────────────────────── */
interface DockItem {
  id: string;
  label: string;
  href: string;
  newTab?: boolean;
  download?: string;
  color: string;
  icon: React.ReactNode;
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const ResumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const PortfolioIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const DOCK_ITEMS: DockItem[] = [
  { id: 'linkedin',  label: 'LinkedIn',  href: 'https://www.linkedin.com/in/omkar-anarse', newTab: true,  color: '#5EAEFF', icon: <LinkedInIcon /> },
  { id: 'github',    label: 'GitHub',    href: 'https://github.com/Omkaranrse',            newTab: true,  color: '#e2e8f0', icon: <GitHubIcon /> },
  { id: 'email',     label: 'Email Me',  href: 'mailto:omkaranarse1906@gmail.com',          newTab: false, color: '#ff8a8a', icon: <MailIcon /> },
  { id: 'resume',    label: 'Resume',    href: '/Omkar.pdf',  newTab: true, download: 'Omkar_Anarse_Resume.pdf', color: '#6EE7B7', icon: <ResumeIcon /> },
  { id: 'portfolio', label: 'Portfolio', href: '#hero',                                     newTab: false, color: '#c4b5fd', icon: <PortfolioIcon /> },
];

/* ─────────────────────────────────────────
   Magnification — cosine proximity falloff
   Reproduces the Framer Dock magnification behaviour
   ───────────────────────────────────────── */
const BASE_PX    = 52;   // resting icon container px
const HOVERED_PX = 88;   // fully hovered icon container px
const REACH      = 2;    // how many neighbours are influenced

function calcSize(hovIdx: number | null, myIdx: number): number {
  if (hovIdx === null) return BASE_PX;
  const d = Math.abs(hovIdx - myIdx);
  if (d === 0) return HOVERED_PX;
  if (d <= REACH) {
    const t = d / (REACH + 1);
    return BASE_PX + (HOVERED_PX - BASE_PX) * Math.cos(t * Math.PI * 0.5);
  }
  return BASE_PX;
}

/* ─────────────────────────────────────────
   HeroDock
   ───────────────────────────────────────── */
export default function HeroDock() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const leave = useCallback(() => setHovIdx(null), []);

  return (
    <nav className="hdock" aria-label="Quick links">
      <div className="hdock__wrap" onMouseLeave={leave}>
        {/* Frosted pill background – sits behind icons via z-index */}
        <div className="hdock__bg" aria-hidden="true" />

        {DOCK_ITEMS.map((item, i) => {
          const sz  = calcSize(hovIdx, i);
          const hov = hovIdx === i;

          return (
            <div
              key={item.id}
              className="hdock__slot"
              style={{ width: sz, height: sz }}
              onMouseEnter={() => setHovIdx(i)}
            >
              {/* Label bubble */}
              <span className={`hdock__label${hov ? ' hdock__label--on' : ''}`} aria-hidden="true">
                {item.label}
              </span>

              {/* Icon anchor */}
              <a
                href={item.href}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                download={item.download}
                aria-label={item.label}
                className="hdock__icon"
                style={{
                  width:     sz,
                  height:    sz,
                  color:     hov ? item.color : 'rgba(255,255,255,0.80)',
                  transform: hov ? 'translateY(-8px)' : 'translateY(0px)',
                }}
              >
                {item.icon}
              </a>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
