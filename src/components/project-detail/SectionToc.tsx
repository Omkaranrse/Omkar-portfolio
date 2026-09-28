'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  label: string;
  number: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'problem', label: 'Problem', number: '01' },
  { id: 'approach', label: 'Approach', number: '02' },
  { id: 'architecture', label: 'Architecture', number: '03' },
  { id: 'decisions', label: 'Decisions', number: '04' },
  { id: 'challenges', label: 'Challenges', number: '05' },
  { id: 'result', label: 'Result', number: '06' },
  { id: 'stack', label: 'Stack', number: '07' },
];

export default function SectionToc() {
  const [activeId, setActiveId] = useState<string>('problem');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const item = TOC_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <aside
      className="hidden md:block sticky top-28 self-start w-full pr-6"
      aria-label="Table of Contents"
    >
      <div className="p-4 rounded-md bg-white border border-[rgba(18,19,22,0.08)] shadow-xs">
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8a8c98] mb-3 pb-2 border-b border-[rgba(18,19,22,0.08)]">
          Table of Contents
        </div>

        <nav>
          <ul className="flex flex-col gap-1">
            {TOC_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollTo(e, item.id)}
                    className={`group flex items-center justify-between py-1.5 px-2.5 rounded text-xs transition-all duration-150 ${
                      isActive
                        ? 'bg-[#eb4c2a]/10 text-[#eb4c2a] font-semibold'
                        : 'text-[#565862] hover:text-[#111215] hover:bg-[#f8f8f5]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-transform duration-150 ${
                          isActive
                            ? 'bg-[#eb4c2a] scale-125'
                            : 'bg-[#8a8c98]/40 group-hover:bg-[#8a8c98]'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </span>
                    <span
                      className={`font-mono text-[10px] ${
                        isActive ? 'text-[#eb4c2a]' : 'text-[#8a8c98]'
                      }`}
                    >
                      {item.number}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export { SectionToc };

