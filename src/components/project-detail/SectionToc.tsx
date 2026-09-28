'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { ArrowRight, Compass } from 'lucide-react';

interface TocItem {
  id: string;
  label: string;
  number: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'problem', label: 'Problem Statement', number: '01' },
  { id: 'approach', label: 'Engineering Approach', number: '02' },
  { id: 'architecture', label: 'System Topology', number: '03' },
  { id: 'decisions', label: 'Key Decisions', number: '04' },
  { id: 'challenges', label: 'Hard Challenges', number: '05' },
  { id: 'result', label: 'Impact & Results', number: '06' },
  { id: 'stack', label: 'Tech Stack', number: '07' },
];

export default function SectionToc() {
  const [activeId, setActiveId] = useState<string>('problem');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

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
      const offsetTop = el.offsetTop - 110;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <aside className="w-full sticky top-28">
      <div className="p-5 rounded-[4px] bg-white/95 backdrop-blur-md border border-[rgba(17,18,21,0.08)] shadow-[0_4px_24px_rgba(17,18,21,0.03),0_1px_3px_rgba(17,18,21,0.02)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(17,18,21,0.08)]">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#eb4c2a]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111215]">
              TABLE OF CONTENTS
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#8a8c98] px-1.5 py-0.5 rounded bg-[#f8f8f5] border border-[rgba(17,18,21,0.06)]">
            7 SECTIONS
          </span>
        </div>

        {/* Navigation list */}
        <nav aria-label="Table of contents">
          <ul className="flex flex-col gap-1 relative">
            {TOC_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollTo(e, item.id)}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-[2px] text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-[#eb4c2a]/8 text-[#eb4c2a] font-semibold border-l-2 border-[#eb4c2a] pl-2.5'
                        : 'text-[#565862] hover:text-[#111215] hover:bg-[#f8f8f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`font-mono text-[10px] transition-colors ${
                          isActive
                            ? 'text-[#eb4c2a] font-bold'
                            : 'text-[#8a8c98] group-hover:text-[#565862]'
                        }`}
                      >
                        {item.number}
                      </span>
                      <span className="truncate tracking-tight">{item.label}</span>
                    </div>

                    <ArrowRight
                      className={`w-3 h-3 transition-all duration-200 flex-shrink-0 ${
                        isActive
                          ? 'opacity-100 text-[#eb4c2a] translate-x-0'
                          : 'opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick jump note */}
        <div className="mt-4 pt-3 border-t border-[rgba(17,18,21,0.06)] flex items-center justify-between font-mono text-[10px] text-[#8a8c98]">
          <span>INTERACTIVE JUMP</span>
          <span className="text-[#10b981] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            SYNCED
          </span>
        </div>
      </div>
    </aside>
  );
}

export { SectionToc };
