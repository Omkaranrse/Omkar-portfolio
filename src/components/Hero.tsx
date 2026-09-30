'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import heroPhoto from '@/images/hero.png';
import FluidGlassButton from './FluidGlassButton';
import FlyingBirds from './FlyingBirds';

export default function Hero() {
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
      const day = now.getDate();
      const month = now.toLocaleDateString('en-US', { month: 'short' });
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setLiveTime(`${weekday} ${day} ${month}  ${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="hero-editorial-section">


      {/* ── Top-Right Live Date & Time ── */}
      {liveTime && (
        <div
          className="hero-live-clock"
          style={{
            position: 'absolute',
            top: 28,
            right: 'clamp(20px, 4vw, 48px)',
            zIndex: 20,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: '#000000',
            letterSpacing: '-0.01em',
            whiteSpace: 'pre',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-label="Current date and time"
        >
          {liveTime}
        </div>
      )}

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



      {/* ── Distant Black Birds Flying in Sky ── */}
      <FlyingBirds />

      {/* ── Main Hero Content (Shifted Left to Edge · Clean Space) ── */}
      <div className="hero-editorial-container">
        <div className="hero-editorial-content reveal in">

          {/* 01: Minimal Greeting */}
          <div className="hero-editorial-intro">
            <span className="hero-editorial-wave" aria-hidden="true">
              👋
            </span>

            <span
              className="hero-editorial-greeting"
              style={{
                fontSize: '1.25rem',
              }}
            >
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
              Full-stack developer building AI, web, and mobile apps that actually ship and solve real-world problems.
            </p>
          </div>

          {/* 04: Interactive Fluid Glass Shader CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
            <FluidGlassButton
              href="/ask-ai"
              text="Ask to AI"
              icon="arrow"
              baseColor="#2c140d"
              glassColor="#f1694a"
              padding="13px 26px"
              fontSize="15px"
              fontWeight={600}
            />

            <FluidGlassButton
              href="#contact"
              text="Get in Touch"
              icon="diagonal"
              baseColor="#111317"
              glassColor="#c4c4c8"
              padding="13px 26px"
              fontSize="15px"
              fontWeight={600}
            />
          </div>

        </div>
      </div>
    </section>
  );
}