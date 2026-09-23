import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
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
      </body>
    </html>
  );
}
