export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer-inner">

        {/* Left: name + tagline */}
        <div className="footer-brand">
          <span className="footer-name">Omkar Anarse</span>
          <span className="footer-tagline">AI × Mobile × Product</span>
        </div>

        {/* Center: social links */}
        <nav className="footer-links" aria-label="Footer links">
          <a
            href="https://github.com/Omkaranrse"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/omkar-anarse"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn ↗
          </a>
          <a
            href="mailto:omkaranarse1906@gmail.com"
            className="footer-link"
          >
            Email ↗
          </a>
        </nav>

        {/* Right: copyright */}
        <p className="footer-copy">© {currentYear} Omkar Anarse</p>

      </div>
    </footer>
  );
}

