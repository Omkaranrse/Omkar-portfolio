'use client';

import Image from 'next/image';
import heroPhoto from '@/images/hero.png';

export default function Hero() {
  return (
    <section id="hero" className="hero-editorial-section">
      {/* ── Background Base Image (Crisp & Natural) ── */}
      <div className="hero-bg-wrapper">
        <Image
          src={heroPhoto}
          alt="Portrait of Omkar Anarse"
          fill
          sizes="100vw"
          priority
          unoptimized
          className="hero-bg-img"
        />
      </div>

      {/* ── Main Hero Content (Shifted Left to Edge · Clean Space) ── */}
      <div className="hero-editorial-container">
        <div className="hero-editorial-content reveal in">

          {/* 01: Minimal Greeting */}
          <div className="hero-editorial-intro">
            <span className="hero-editorial-wave" aria-hidden="true">👋</span>
            <span className="hero-editorial-greeting">
              Hey, I&apos;m <strong>Omkar Anarse</strong>
            </span>
          </div>

          {/* 02: Main Headline */}
          <h1 className="hero-editorial-headline">
            AI, WEB &amp; MOBILE SYSTEMS.
          </h1>

          {/* 03: Supporting Statement */}
          <div className="hero-editorial-copy">
            <p className="hero-editorial-lead">
              I build AI systems and digital products that solve real-world problems.
            </p>
            <p className="hero-editorial-subtext">
              From AI-powered backends and RAG pipelines to modern web and mobile experiences.
            </p>
          </div>

          {/* 04: Interactive CTAs & Metadata */}
          <div className="hero-actions-row">
            <div className="hero-cta-group">
              <a href="#work" className="hero-btn hero-btn--primary">
                <span>View Selected Work</span>
                <span className="hero-btn-arrow" aria-hidden="true">↓</span>
              </a>
              <a href="#contact" className="hero-btn hero-btn--ghost">
                <span>Get in Touch</span>
                <span className="hero-btn-arrow" aria-hidden="true">→</span>
              </a>
            </div>

            <div className="hero-editorial-meta-tag">
              <span>AI</span>
              <span className="hero-meta-dot" aria-hidden="true">·</span>
              <span>WEB</span>
              <span className="hero-meta-dot" aria-hidden="true">·</span>
              <span>MOBILE</span>
              <span className="hero-meta-dot" aria-hidden="true">·</span>
              <span>PRODUCT ENGINEERING</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

