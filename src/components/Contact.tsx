'use client';

import { useState } from 'react';

export default function Contact() {
  const email = 'omkaranarse1906@gmail.com';
  const github = 'https://github.com/Omkaranrse';
  const linkedin = 'https://www.linkedin.com/in/omkar-anarse';
  const resume = '/Omkar.pdf';

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const links = [
    {
      label: 'GitHub',
      href: github,
      target: '_blank' as const,
      note: 'github.com/Omkaranrse',
      external: true,
      action: undefined,
    },
    {
      label: 'LinkedIn',
      href: linkedin,
      target: '_blank' as const,
      note: 'linkedin.com/in/omkar-anarse',
      external: true,
      action: undefined,
    },
    {
      label: 'Email',
      href: `mailto:${email}`,
      target: undefined as undefined,
      note: email,
      external: false,
      isEmail: true,
    },
    {
      label: 'Resume',
      href: resume,
      target: '_blank' as const,
      note: 'View / Download PDF (Updated 2024)',
      external: true,
      action: undefined,
    },
  ];

  return (
    <section id="contact" className="contact-section grid-bg">
      <div className="wrap">
        <div className="contact-inner">

          {/* Left: editorial headline */}
          <div className="contact-left reveal">
            <span className="contact-eyebrow">Contact</span>
            <h2 className="contact-title">
              Let&apos;s build<br />
              something<br />
              useful.
            </h2>
            <p className="contact-sub">
              Open to AI engineering roles, mobile systems projects, and product
              collaborations. If you&apos;re building something interesting, reach out.
            </p>

            {/* Quick Email Copy Button */}
            <div className="contact-quick-copy">
              <button
                type="button"
                className="copy-email-btn"
                onClick={handleCopyEmail}
                aria-label="Copy email address to clipboard"
              >
                <span className="copy-icon" aria-hidden="true">
                  {copied ? '✓' : '📋'}
                </span>
                <span>{copied ? 'Email Copied to Clipboard!' : 'Copy Email Address'}</span>
              </button>
            </div>
          </div>

          {/* Right: editorial link rows */}
          <nav className="contact-links reveal" aria-label="Contact links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.target}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="contact-link-row"
              >
                <div className="contact-link-inner">
                  <span className="contact-link-label">{link.label}</span>
                  <span className="contact-link-note">{link.note}</span>
                </div>
                <div className="contact-link-action">
                  {link.isEmail && copied && (
                    <span className="copied-pill">Copied!</span>
                  )}
                  <svg
                    className="contact-link-arrow"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M4 16L16 4M16 4H7M16 4V13" />
                  </svg>
                </div>
              </a>
            ))}
          </nav>

        </div>
      </div>
    </section>
  );
}
