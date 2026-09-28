'use client';

import { useState } from 'react';
import SocialDock from './SocialDock';
import GlowingBeamButton from './GlowingBeamButton';

export default function Contact() {
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrap">

        {/* ── Section Header (Centered Hero) ── */}
        <header className="contact-section-header reveal-text">
          <div className="contact-eyebrow-row">
            <span className="contact-eyebrow">CONTACT</span>
            <span className="contact-status-annotation" aria-label="Status: Open to selected opportunities">
              <span className="contact-status-dot" aria-hidden="true" />
              <span>OPEN TO SELECTED OPPORTUNITIES</span>
            </span>
          </div>

          <h2 className="contact-title velocity-heading">Let&apos;s build something useful.</h2>
          <p className="contact-sub">
            Open to AI engineering roles, mobile systems projects, and product collaborations.
            Have a question about my work, stack, or experience? Ask my AI persona on the live interactive workstation.
          </p>
        </header>

        {/* ── Main Composition Canvas ── */}
        <div className="contact-canvas-stage">

          {/* 1. Centered AI CTA Zone with "Curious?" annotation */}
          <div className="contact-cta-zone">
            {/* "Curious?" annotation with ample vertical breathing room from description text */}
            <div
              className={`cta-curious-annotation ${isCtaHovered ? 'is-cta-active' : ''}`}
              aria-hidden="true"
            >
              <span className="handwritten-curious">Curious?</span>
              <svg
                className="curious-arrow-svg"
                width="84"
                height="48"
                viewBox="0 0 84 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Start node */}
                <circle cx="6" cy="6" r="2.5" fill="#eb4c2a" />
                {/* Smooth Bézier arc pointing cleanly to the left shoulder of the CTA button */}
                <path
                  d="M 6 6 C 22 24, 48 34, 76 28"
                  stroke="#2b2d35"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="curious-arrow-path"
                />
                {/* Arrowhead */}
                <path
                  d="M 67 22 L 76 28 L 69 35"
                  stroke="#2b2d35"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* GlowingBeam Button Container - strictly centered */}
            <div
              className="contact-cta-anchor"
              onMouseEnter={() => setIsCtaHovered(true)}
              onMouseLeave={() => setIsCtaHovered(false)}
            >
              <GlowingBeamButton
                text="Ask AI About Omkar"
                href="/ask-ai"
                paddingX={34}
                paddingY={18}
                variant="Black"
              />
            </div>
          </div>

          {/* 2. Visual Bridge: "or let's talk" + Arrow leading down to CONNECT */}
          <div className="contact-bridge-zone" aria-hidden="true">
            <span className="handwritten-bridge">or let&apos;s talk</span>
            <svg
              className="bridge-arrow-svg"
              width="56"
              height="44"
              viewBox="0 0 56 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Subtle dashed orange curve leading from "talk" down toward CONNECT */}
              <path
                d="M 4 8 C 24 8, 42 16, 30 38"
                stroke="#eb4c2a"
                strokeWidth="1.6"
                strokeDasharray="3.5 3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bridge-arrow-path"
              />
              {/* Arrowhead pointing down to CONNECT */}
              <path
                d="M 22 31 L 30 38 L 38 31"
                stroke="#eb4c2a"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 3. CONNECT Stage: Header + Clean Centered Social Dock */}
          <div className="contact-connect-stage">
            <div className="contact-connect-header">
              <span className="contact-connect-eyebrow">CONNECT</span>
              <p className="contact-connect-sub">
                Continue the conversation on your preferred platform.
              </p>
            </div>

            <div className="contact-dock-shelf">
              <SocialDock />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
