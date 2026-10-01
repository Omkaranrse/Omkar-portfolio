'use client';

import SocialDock from './SocialDock';
import GlowingBeamButton from './GlowingBeamButton';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrap">

        {/* ── Section Header (Centered Hero) ── */}
        <header className="contact-section-header reveal-text">
          <div className="contact-eyebrow-row">
            <span className="contact-eyebrow">CONTACT</span>
          </div>

          <h2 className="contact-title velocity-heading">Let&apos;s build something useful.</h2>
          <p className="contact-sub">
            Open to AI engineering roles, mobile systems projects, and product collaborations.
            Have a question about my work, stack, or experience? Ask my AI persona on the live interactive workstation.
          </p>
        </header>

        {/* ── Main Composition Canvas ── */}
        <div className="contact-canvas-stage">

          {/* Centered AI CTA Zone */}
          <div className="contact-cta-zone">
            <div className="contact-cta-anchor">
              <GlowingBeamButton
                text="Ask AI About Omkar"
                href="/ask-ai"
                paddingX={34}
                paddingY={18}
                variant="Black"
              />
            </div>
          </div>

          {/* CONNECT Stage: Header + Clean Centered Social Dock */}
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
