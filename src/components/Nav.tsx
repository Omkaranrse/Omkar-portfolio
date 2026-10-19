'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import avatarImg from '@/images/portrait-avatar.webp';
import LiquidGlassButton from './LiquidGlassButton';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkHero, setIsDarkHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroBottom = heroEl.offsetHeight;
        setScrolled(y > 60);
        setIsDarkHero(y < heroBottom - 80);
      } else {
        setScrolled(y > 60);
        setIsDarkHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const navLinks = [
    { label: 'Experience', href: '/#experience', index: '01' },
    { label: 'Work', href: '/#work', index: '02' },
    { label: 'Skills', href: '/#skills', index: '03' },
    { label: 'Contact', href: '/#contact', index: '04' },
  ];

  return (
    <>
      {/* ── Hairline Scroll Progress Bar (Top Edge) ── */}
      <div id="scroll-progress-bar" className="scroll-progress-bar" aria-hidden="true" />

      <header className={`floating-nav-header ${scrolled ? 'is-scrolled' : ''}`}>
        <nav
          className={`floating-nav-pill ${isDarkHero ? 'is-dark-context' : ''} ${scrolled ? 'is-scrolled' : ''}`}
          aria-label="Main Navigation"
        >
          {/* Brand with avatar */}
          <a href="/" className="floating-nav-brand">
            <div className="floating-nav-avatar">
              <Image
                src={avatarImg}
                alt="Omkar Anarse"
                width={32}
                height={32}
                className="floating-nav-avatar-img"
              />
            </div>
            <span className="floating-nav-name">OMKAR</span>
          </a>

          {/* Desktop Navigation links */}
          <ul className="floating-nav-links desktop-only">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="floating-nav-link">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <LiquidGlassButton
                href="/Omkar.pdf"
                newTab
                size="sm"
                icon="none"
                tint="rgba(235, 76, 42, 0.2)"
                textColor="var(--accent)"
                style={{ marginLeft: 4 }}
              >
                Resume
              </LiquidGlassButton>
            </li>
          </ul>

          {/* Mobile menu toggle */}
          <button
            className="nav-toggle"
            id="navToggle"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span
              className="toggle-bar"
              style={
                open
                  ? { transform: 'rotate(45deg) translate(4.5px, 4.5px)', backgroundColor: '#f5f5f7' }
                  : undefined
              }
            />
            <span
              className="toggle-bar"
              style={
                open
                  ? { transform: 'rotate(-45deg) translate(4.5px, -4.5px)', backgroundColor: '#f5f5f7' }
                  : undefined
              }
            />
          </button>
        </nav>
      </header>

      {/* Considered Minimal Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <nav className="mobile-menu-nav" aria-label="Mobile Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu-item"
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu-label">{link.label}</span>
              <span className="mobile-menu-index">{link.index}</span>
            </a>
          ))}
          <a
            href="/Omkar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-item"
            onClick={() => setOpen(false)}
          >
            <span className="mobile-menu-label" style={{ color: 'var(--accent)' }}>
              Resume
            </span>
          </a>
        </nav>

        <div className="mobile-menu-footer">
          <span className="mobile-menu-sub">Omkar Anarse — AI &amp; Mobile Systems</span>
          <span className="mobile-menu-sub">Mumbai, India</span>
        </div>
      </div>
    </>
  );
}
