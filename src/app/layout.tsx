import type { Metadata } from 'next';
import Image from 'next/image';
import ucImg from '@/images/UC.png';
import './globals.css';

export const metadata: Metadata = {
  title: 'Omkar — AI & Mobile Systems',
  description:
    'MCA student building toward AI/ML engineering — RAG pipelines, LangGraph agents, and Flutter/Swift mobile apps.',
  openGraph: {
    title: 'Omkar — AI & Mobile Systems',
    description:
      'MCA student building toward AI/ML engineering — RAG pipelines, LangGraph agents, and Flutter/Swift mobile apps.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>",
  },
  other: {
    'theme-color': '#f5f4f0',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Omkar Anarse',
  jobTitle: 'AI & Mobile Systems Engineer',
  description:
    'MCA student building toward AI/ML engineering — RAG pipelines, LangGraph agents, and Flutter/Swift mobile apps.',
  url: 'https://omkaranarse.dev',
  sameAs: [
    'https://github.com/Omkaranrse',
    'https://linkedin.com/in/omkar-anarse',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Flutter',
    'iOS Development',
    'FastAPI',
    'Next.js',
    'LangGraph',
    'RAG',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <div className="under-construction-badge" aria-hidden="true">
          <Image
            src={ucImg}
            alt="Under Construction"
            width={200}
            height={300}
            className="under-construction-img"
            priority
          />
        </div>
      </body>
    </html>
  );
}
