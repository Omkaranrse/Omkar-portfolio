'use client';

import { useEffect } from 'react';

export default function Interactions() {
  useEffect(() => {
    /* ── Reveal-on-scroll ── */
    if (!('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.reveal')
        .forEach((el) => el.classList.add('in'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      document
        .querySelectorAll('.reveal')
        .forEach((el) => revealObserver.observe(el));

      return () => {
        revealObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    /* ── Dock visibility: hide after hero ── */
    const dock = document.querySelector('.hdock') as HTMLElement | null;
    if (!dock) return;

    const hero = document.getElementById('hero');

    const updateDock = () => {
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight;
      const pastHero = window.scrollY > heroBottom - 80;
      dock.classList.toggle('hdock--hidden', pastHero);
    };

    window.addEventListener('scroll', updateDock, { passive: true });
    updateDock();
    return () => window.removeEventListener('scroll', updateDock);
  }, []);

  return null;
}

