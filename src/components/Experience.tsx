'use client';

import LanyardCard from './LanyardCard';
import avatarImg from '@/images/portrait.jpg';

export default function Experience() {
  const experiences = [
    {
      companyName: 'Metaphi',
      role: 'Flutter Developer',
      period: 'Current · 1+ Month',
      type: 'Current Role',
      description:
        'Building scalable mobile experiences and state architecture with Flutter and Dart, integrating backend APIs and modern UI workflows.',
      techStack: ['Flutter', 'Dart', 'Riverpod', 'Clean Arch', 'REST APIs'],
      backCardText: 'METAPHI',
      backCardColor: '#3b82f6',
      profileImage: avatarImg,
      tapeColor: '#ffffff',
      tapeRotation: -4,
    },
    {
      companyName: 'My Job Park',
      role: 'Flutter Developer',
      period: '3 Years · Part-time',
      type: 'Part-time',
      description:
        'Engineered cross-platform mobile apps for job seekers and recruiters, implementing responsive design token systems and real-time state management.',
      techStack: ['Flutter', 'Dart', 'Firebase', 'State Mgmt', 'UI/UX'],
      backCardText: 'MYJOBPARK',
      backCardColor: 'var(--accent)',
      profileImage: avatarImg,
      tapeColor: '#f3f4f6',
      tapeRotation: 5,
    },
  ];

  return (
    <section id="experience" className="exp-section">
      <div className="wrap">
        <header className="exp-header reveal">
          <div className="exp-header-top">
            <span className="exp-eyebrow">Work History</span>
            <span className="exp-count">02 ROLES</span>
          </div>
          <h2 className="exp-title">Professional Experience.</h2>
          <p className="exp-subtitle">
            Hover to inspect badge details or click any lanyard card to trigger swing physics.
          </p>
        </header>

        {/* ── Interactive Lanyard Drop Cards Grid ── */}
        <div className="lanyard-cards-grid reveal">
          {experiences.map((exp, i) => (
            <LanyardCard key={i} {...exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
