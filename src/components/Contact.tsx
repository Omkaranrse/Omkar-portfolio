export default function Contact() {
  const email = 'omkaranarse1906@gmail.com';
  const github = 'https://github.com/Omkaranrse';
  const linkedin = 'https://www.linkedin.com/in/omkar-anarse';
  const resume = '/Omkar.pdf';

  const links = [
    {
      label: 'GitHub',
      href: github,
      target: '_blank' as const,
      note: 'See my work',
      external: true,
    },
    {
      label: 'LinkedIn',
      href: linkedin,
      target: '_blank' as const,
      note: 'Connect',
      external: true,
    },
    {
      label: 'Email',
      href: `mailto:${email}`,
      target: undefined as undefined,
      note: email,
      external: false,
    },
    {
      label: 'Resume',
      href: resume,
      target: '_blank' as const,
      note: 'View / Download PDF',
      external: true,
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
              Open to AI engineering roles, mobile projects, and product
              collaborations. If you&apos;re building something interesting, reach out.
            </p>
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
              </a>
            ))}
          </nav>

        </div>
      </div>
    </section>
  );
}

