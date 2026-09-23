'use client';

import Image from 'next/image';
import heroPhoto from '@/images/hero.png';

export default function Hero() {
  return (
    <section id="hero" className="hero-editorial-section">
      {/* ── Background Base Image ── */}
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
        <div className="hero-editorial-gradient" aria-hidden="true" />
      </div>

      {/* ── Main Hero Content ── */}
      <div className="wrap hero-editorial-container">
        <div className="hero-editorial-content reveal">

          {/* 01: Small Introduction */}
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

          {/* 04: Metadata Tag */}
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
    </section>
  );
}
