'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import avatarImg from '@/images/portrait.jpg';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const heroEl = document.getElementById('hero');
      const heroBottom = heroEl ? heroEl.offsetHeight : window.innerHeight;

      setScrolled(y > 30);
      setIsLight(y > heroBottom - 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`floating-nav-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav
        className={`floating-nav-pill ${isLight ? 'is-light' : ''}`}
        aria-label="Main Navigation"
      >
        {/* Brand with avatar */}
        <a href="#hero" className="floating-nav-brand">
          <div className="floating-nav-avatar">
            <Image
              src={avatarImg}
              alt="Omkar Anarse"
              width={34}
              height={34}
              className="floating-nav-avatar-img"
            />
          </div>
          <span className="floating-nav-name">OMKAR</span>
        </a>

        {/* Mobile menu toggle */}
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* Navigation links */}
        <ul className={`floating-nav-links ${open ? 'is-open' : ''}`}>
          <li>
            <a
              href="#work"
              className="floating-nav-link"
              onClick={() => setOpen(false)}
            >
              Work
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="floating-nav-link"
              onClick={() => setOpen(false)}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#experience"
              className="floating-nav-link"
              onClick={() => setOpen(false)}
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="/Omkar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="floating-nav-link floating-nav-link--action"
              onClick={() => setOpen(false)}
            >
              Resume
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="floating-nav-link"
              onClick={() => setOpen(false)}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
