export default function Experience() {
  const entries = [
    {
      period: '2024 — Present',
      role: 'MCA Student',
      org: 'K.J. Somaiya Institute of Management',
      description: 'Pursuing a Master of Computer Applications with a focus on AI systems, machine learning, and mobile engineering. Building production-grade projects across the AI and mobile stack.',
    },
    {
      period: '2021 — 2024',
      role: 'B.Sc. Computer Science',
      org: 'University of Mumbai',
      description: 'Graduated with a Bachelor of Science in Computer Science. Developed foundational skills in algorithms, data structures, databases, and software engineering.',
    },
  ];

  return (
    <section id="experience" className="exp-section">
      <div className="wrap">
        <header className="exp-header reveal">
          <span className="exp-eyebrow">Background</span>
          <h2 className="exp-title">Experience.</h2>
        </header>

        <div className="exp-list">
          {entries.map((entry, i) => (
            <div key={i} className="exp-entry reveal">
              <div className="exp-entry-left">
                <span className="exp-period">{entry.period}</span>
              </div>
              <div className="exp-entry-right">
                <div className="exp-entry-header">
                  <h3 className="exp-role">{entry.role}</h3>
                  <span className="exp-org">{entry.org}</span>
                </div>
                <p className="exp-desc">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
