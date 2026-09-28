'use client';

import { useEffect } from 'react';

export default function Interactions() {
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    /* ─────────────────────────────────────────────────────────────
       1. Unified IntersectionObserver for Scroll Entrances
       Runs ONCE per element: unobserves upon reveal to prevent replaying
       ───────────────────────────────────────────────────────────── */
    const revealTargets = document.querySelectorAll(
      '.reveal, .reveal-text, .reveal-stagger, .reveal-flow-left, .reveal-flow-settle'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('in'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;

              // If staggered container, assign index if missing
              if (target.classList.contains('reveal-stagger')) {
                const children = target.children;
                for (let i = 0; i < children.length; i++) {
                  const child = children[i] as HTMLElement;
                  if (!child.style.getPropertyValue('--stagger-index')) {
                    child.style.setProperty('--stagger-index', Math.min(i, 4).toString());
                  }
                }
              }

              target.classList.add('in');
              revealObserver.unobserve(target); // Never replay
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -70px 0px',
        }
      );

      revealTargets.forEach((el) => revealObserver.observe(el));
    }

    /* ─────────────────────────────────────────────────────────────
       2. Centralized Passive Scroll Engine (Zero React State Thrashing)
       - Hairline reading progress bar
       - Hero cinematic camera advance exit
       - Featured Work card depth & "Focus Zone" tracking
       - Experience pinned storytelling timeline step tracking
       - Scroll velocity micro-inertia on editorial headings
       - Active section navigation indicator
       ───────────────────────────────────────────────────────────── */
    const progressBar = document.getElementById('scroll-progress-bar');
    const heroSection = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg-img') as HTMLElement | null;
    const heroHeadline = document.querySelector('.hero-title-scroll') as HTMLElement | null;
    const heroCopy = document.querySelector('.hero-copy-scroll') as HTMLElement | null;

    const workSection = document.getElementById('work');
    const workCards = document.querySelectorAll('.work-card-wrapper');
    const workGrid = document.querySelector('.work-cards-grid');

    const expSection = document.getElementById('experience');

    const sections = ['experience', 'work', 'skills', 'contact'].map((id) => ({
      id,
      el: document.getElementById(id),
      link: document.querySelector(`a[href="/#${id}"], a[href="#${id}"], a[href="/${id}"]`),
    }));

    let lastScrollY = window.scrollY || window.pageYOffset;
    let smoothVelocity = 0;
    let lastActiveExpIndex = -1;
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const scrollY = window.scrollY || window.pageYOffset;
        const winHeight = window.innerHeight;
        const isDesktop = window.innerWidth > 768;
        const docHeight = document.documentElement.scrollHeight;
        const maxScroll = docHeight - winHeight;

        // A. Hairline Reading Progress (Smooth scaleX)
        if (progressBar && maxScroll > 0) {
          const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
          progressBar.style.transform = `scaleX(${progress})`;
        }

        // B. Hero Cinematic Camera Advance Exit (Desktop / Normal Motion)
        if (!prefersReducedMotion && heroSection) {
          const heroHeight = heroSection.offsetHeight;
          if (scrollY < heroHeight * 1.1) {
            const exitProgress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.85)));
            document.documentElement.style.setProperty('--hero-exit-progress', exitProgress.toFixed(3));

            if (heroHeadline) {
              const titleScale = (1 - exitProgress * 0.12).toFixed(3);
              const titleY = (exitProgress * -40).toFixed(1);
              const titleOpacity = (1 - exitProgress * 0.65).toFixed(3);
              heroHeadline.style.transform = `translate3d(0, ${titleY}px, 0) scale(${titleScale})`;
              heroHeadline.style.opacity = titleOpacity;
            }

            if (heroCopy) {
              const copyY = (exitProgress * -24).toFixed(1);
              const copyOpacity = Math.max(0, 1 - exitProgress * 1.3).toFixed(3);
              heroCopy.style.transform = `translate3d(0, ${copyY}px, 0)`;
              heroCopy.style.opacity = copyOpacity;
            }

            if (heroBg && isDesktop) {
              const bgY = (exitProgress * -30 + scrollY * 0.08).toFixed(1);
              const bgScale = (1 + exitProgress * 0.04).toFixed(3);
              heroBg.style.transform = `translate3d(0, ${bgY}px, 0) scale(${bgScale})`;
            }
          } else {
            document.documentElement.style.setProperty('--hero-exit-progress', '1');
            if (heroHeadline) {
              heroHeadline.style.opacity = '0.35';
              heroHeadline.style.transform = 'translate3d(0, -40px, 0) scale(0.88)';
            }
            if (heroCopy) {
              heroCopy.style.opacity = '0';
              heroCopy.style.transform = 'translate3d(0, -24px, 0)';
            }
          }
        }

        // C. Scroll Velocity Micro-Inertia (Subtle ±5px drift on major headings)
        if (!prefersReducedMotion && isDesktop) {
          const deltaY = scrollY - lastScrollY;
          const targetVelocity = Math.max(-5, Math.min(5, deltaY * 0.07));
          smoothVelocity = smoothVelocity * 0.82 + targetVelocity * 0.18;

          if (Math.abs(smoothVelocity) > 0.05) {
            document.documentElement.style.setProperty(
              '--scroll-velocity-y',
              `${smoothVelocity.toFixed(1)}px`
            );
          } else {
            document.documentElement.style.setProperty('--scroll-velocity-y', '0px');
          }
        }
        lastScrollY = scrollY;

        // D. Featured Work Card Depth & "Focus Zone"
        if (!prefersReducedMotion && workSection && workCards.length > 0) {
          const workRect = workSection.getBoundingClientRect();
          if (workRect.top < winHeight && workRect.bottom > 0) {
            const viewportCenter = winHeight * 0.5;
            let hasActiveFocus = false;

            workCards.forEach((cardEl) => {
              const rect = cardEl.getBoundingClientRect();
              const cardCenter = rect.top + rect.height * 0.5;
              const delta = (cardCenter - viewportCenter) / (winHeight * 0.5); // -1 to 1
              const proximity = 1 - Math.min(1, Math.abs(delta));

              // If near center on desktop, mark focus zone
              if (isDesktop && proximity > 0.68) {
                cardEl.classList.add('is-in-focus-zone');
                hasActiveFocus = true;
              } else {
                cardEl.classList.remove('is-in-focus-zone');
              }

              // Subtle internal thumbnail parallax
              if (isDesktop && rect.top < winHeight && rect.bottom > 0) {
                const imgY = Math.max(-14, Math.min(14, delta * -16)).toFixed(1);
                (cardEl as HTMLElement).style.setProperty('--card-img-y', `${imgY}px`);
              }
            });

            if (workGrid) {
              if (hasActiveFocus) {
                workGrid.classList.add('has-focus-active');
              } else {
                workGrid.classList.remove('has-focus-active');
              }
            }
          }
        }

        // E. Experience Pinned Storytelling Step Tracking (Desktop only)
        if (expSection && isDesktop) {
          const expRect = expSection.getBoundingClientRect();
          if (expRect.top <= winHeight * 0.55 && expRect.bottom >= winHeight * 0.25) {
            const expTotal = expRect.height - winHeight * 0.4;
            const expPassed = winHeight * 0.5 - expRect.top;
            const progress = Math.min(1, Math.max(0, expPassed / expTotal));

            const activeIndex = progress >= 0.48 ? 1 : 0;
            if (activeIndex !== lastActiveExpIndex) {
              lastActiveExpIndex = activeIndex;
              window.dispatchEvent(
                new CustomEvent('experience-step', { detail: { activeIndex, step: activeIndex } })
              );
            }
          }
        }

        // F. Active Section Navigation Indicator (Subtle Contrast)
        const navViewportAnchor = scrollY + winHeight * 0.38;
        let currentActiveId: string | null = null;

        for (const sec of sections) {
          if (sec.el) {
            const top = sec.el.offsetTop;
            const bottom = top + sec.el.offsetHeight;
            if (navViewportAnchor >= top && navViewportAnchor < bottom) {
              currentActiveId = sec.id;
              break;
            }
          }
        }

        sections.forEach((sec) => {
          if (sec.link) {
            if (sec.id === currentActiveId) {
              sec.link.classList.add('is-active');
            } else {
              sec.link.classList.remove('is-active');
            }
          }
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run initial check

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
