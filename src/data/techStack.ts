'use client';

// ─────────────────────────────────────────────────────────
// Shared technology data — single source of truth for both
// the 3D Stack Marquee and the Interactive Bubble Pit.
// ─────────────────────────────────────────────────────────

export interface TechItem {
  name: string;
  category: 'ai' | 'mobile' | 'backend' | 'tool';
  color: string;
  iconUrl: string;
  /** Set true for icons that are dark/black and need inversion on dark backgrounds (e.g. Next.js) */
  invertIcon?: boolean;
}

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

/** Helper to create a data URI from an inline SVG string */
const svgUri = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;

export const techStack: TechItem[] = [
  {
    name: 'Python',
    category: 'ai',
    color: '#3776AB',
    iconUrl: `${DEVICON}/python/python-original.svg`,
  },
  {
    name: 'Flutter',
    category: 'mobile',
    color: '#02569B',
    iconUrl: `${DEVICON}/flutter/flutter-original.svg`,
  },
  {
    name: 'Dart',
    category: 'mobile',
    color: '#0175C2',
    iconUrl: `${DEVICON}/dart/dart-original.svg`,
  },
  {
    name: 'React',
    category: 'backend',
    color: '#61DAFB',
    iconUrl: `${DEVICON}/react/react-original.svg`,
  },
  {
    name: 'Next.js',
    category: 'backend',
    color: '#ffffff',
    iconUrl: `${DEVICON}/nextjs/nextjs-original.svg`,
    invertIcon: true,
  },
  {
    name: 'TypeScript',
    category: 'backend',
    color: '#3178C6',
    iconUrl: `${DEVICON}/typescript/typescript-original.svg`,
  },
  {
    name: 'FastAPI',
    category: 'backend',
    color: '#009688',
    iconUrl: `${DEVICON}/fastapi/fastapi-original.svg`,
  },
  {
    name: 'PyTorch',
    category: 'ai',
    color: '#EE4C2C',
    iconUrl: `${DEVICON}/pytorch/pytorch-original.svg`,
  },
  {
    name: 'Firebase',
    category: 'mobile',
    color: '#FFCA28',
    iconUrl: `${DEVICON}/firebase/firebase-original.svg`,
  },
  {
    name: 'PostgreSQL',
    category: 'backend',
    color: '#336791',
    iconUrl: `${DEVICON}/postgresql/postgresql-original.svg`,
  },
  {
    name: 'Docker',
    category: 'tool',
    color: '#2496ED',
    iconUrl: `${DEVICON}/docker/docker-original.svg`,
  },
  {
    name: 'Swift',
    category: 'mobile',
    color: '#F05138',
    iconUrl: `${DEVICON}/swift/swift-original.svg`,
  },
  {
    name: 'LangChain',
    category: 'ai',
    color: '#1C3C3C',
    iconUrl: svgUri(`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`),
    invertIcon: false,
  },
  {
    name: 'LangGraph',
    category: 'ai',
    color: '#F97316',
    iconUrl: svgUri(`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="2.5" stroke="#F97316" stroke-width="1.5"/><circle cx="18" cy="6" r="2.5" stroke="#F97316" stroke-width="1.5"/><circle cx="12" cy="18" r="2.5" stroke="#F97316" stroke-width="1.5"/><line x1="8" y1="7.5" x2="10.5" y2="16" stroke="#F97316" stroke-width="1.5"/><line x1="16" y1="7.5" x2="13.5" y2="16" stroke="#F97316" stroke-width="1.5"/><line x1="8.5" y1="6" x2="15.5" y2="6" stroke="#F97316" stroke-width="1.5"/></svg>`),
  },
  {
    name: 'Groq',
    category: 'ai',
    color: '#F55036',
    iconUrl: svgUri(`<svg viewBox="0 0 24 24" fill="#F55036" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`),
  },
  {
    name: 'ChromaDB',
    category: 'ai',
    color: '#A855F7',
    iconUrl: svgUri(`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#A855F7" stroke-width="1.8"/><circle cx="12" cy="12" r="6" stroke="#EC4899" stroke-width="1.8"/><circle cx="12" cy="12" r="2.5" fill="#F59E0B"/></svg>`),
  },
  {
    name: 'Riverpod',
    category: 'mobile',
    color: '#0553B1',
    // Riverpod is Flutter ecosystem — use Flutter icon
    iconUrl: `${DEVICON}/flutter/flutter-original.svg`,
  },
];
