import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f5f4f0',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://omkar-anarse.vercel.app'),
  title: {
    default: 'Omkar Anarse — Flutter Developer & Full Stack Engineer',
    template: '%s | Omkar Anarse',
  },
  description:
    'Omkar Anarse is a Flutter Developer and Full Stack Engineer building high-performance cross-platform mobile apps (Flutter, Dart), AI systems (LangGraph, RAG), and modern web platforms (Next.js, React).',
  keywords: [
    'Omkar Anarse',
    'Flutter Developer',
    'Full Stack Engineer',
    'Full Stack Developer',
    'Flutter Developer India',
    'Flutter Developer Mumbai',
    'Mobile Application Developer',
    'Cross-Platform App Developer',
    'Dart Developer',
    'Next.js Developer',
    'React Developer',
    'AI Systems Engineer',
    'FastAPI Developer',
    'Software Engineer Portfolio',
    'Omkaranrse',
  ],
  authors: [{ name: 'Omkar Anarse', url: 'https://omkar-anarse.vercel.app' }],
  creator: 'Omkar Anarse',
  publisher: 'Omkar Anarse',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Omkar Anarse — Flutter Developer & Full Stack Engineer',
    description:
      'Portfolio of Omkar Anarse: Flutter Developer and Full Stack Engineer building high-performance mobile apps, AI pipelines, and modern web platforms.',
    url: 'https://omkar-anarse.vercel.app',
    siteName: 'Omkar Anarse Portfolio',
    locale: 'en_US',
    type: 'profile',
    images: [
      {
        url: '/images/avatar.png',
        width: 800,
        height: 800,
        alt: 'Omkar Anarse — Flutter Developer & Full Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omkar Anarse — Flutter Developer & Full Stack Engineer',
    description:
      'Portfolio of Omkar Anarse: Flutter Developer and Full Stack Engineer.',
    images: ['/images/avatar.png'],
    creator: '@Omkaranrse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌿</text></svg>",
  },
  verification: {
    google: 'google315fc3da510a1113',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://omkar-anarse.vercel.app/#website',
      url: 'https://omkar-anarse.vercel.app',
      name: 'Omkar Anarse — Flutter Developer & Full Stack Engineer',
      description:
        'Official portfolio of Omkar Anarse: Flutter Developer and Full Stack Engineer.',
      inLanguage: 'en-US',
      publisher: {
        '@id': 'https://omkar-anarse.vercel.app/#person',
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://omkar-anarse.vercel.app/#profilepage',
      url: 'https://omkar-anarse.vercel.app',
      name: 'Omkar Anarse — Flutter Developer & Full Stack Engineer Portfolio',
      isPartOf: {
        '@id': 'https://omkar-anarse.vercel.app/#website',
      },
      mainEntity: {
        '@id': 'https://omkar-anarse.vercel.app/#person',
      },
      description:
        'Official developer portfolio and case studies of Omkar Anarse, specializing in Flutter mobile app engineering, full-stack web development, and AI agent systems.',
    },
    {
      '@type': 'Person',
      '@id': 'https://omkar-anarse.vercel.app/#person',
      name: 'Omkar Anarse',
      alternateName: ['Omkar', 'Omkaranrse', 'Omkar Anarse Developer'],
      url: 'https://omkar-anarse.vercel.app',
      image: 'https://omkar-anarse.vercel.app/images/avatar.png',
      jobTitle: [
        'Flutter Developer',
        'Full Stack Engineer',
        'Mobile Application Developer',
        'AI Systems Engineer',
      ],
      description:
        'Omkar Anarse is a Flutter Developer and Full Stack Engineer building high-performance cross-platform mobile apps (Flutter, Dart), AI systems (LangGraph, RAG, FastAPI), and modern web platforms (Next.js, React).',
      sameAs: [
        'https://github.com/Omkaranrse',
        'https://www.linkedin.com/in/omkar-anarse',
      ],
      knowsAbout: [
        'Flutter',
        'Dart',
        'Full Stack Development',
        'Mobile Application Development',
        'Clean Architecture',
        'Riverpod',
        'BLoC',
        'Next.js',
        'React',
        'TypeScript',
        'FastAPI',
        'Python',
        'Firebase',
        'REST APIs',
        'Artificial Intelligence',
        'LangGraph',
        'RAG',
      ],
      worksFor: [
        {
          '@type': 'Organization',
          name: 'Metaphi',
        },
      ],
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'University of Mumbai',
      },
    },
  ],
};

import FloatingAvatarChatWidget from '@/components/FloatingAvatarChatWidget';
import RouteLoadingHandler from '@/components/RouteLoadingHandler';
import CommandPalette from '@/components/CommandPalette';
import EngineeringTelemetryHud from '@/components/EngineeringTelemetryHud';
import AiExecutionTraceDrawer from '@/components/AiExecutionTraceDrawer';
import MobileDeviceEmulator from '@/components/MobileDeviceEmulator';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
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
      <body className={poppins.className}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <FloatingAvatarChatWidget />
        <RouteLoadingHandler />
        <CommandPalette />
        <EngineeringTelemetryHud />
        <AiExecutionTraceDrawer />
        <MobileDeviceEmulator isModal />
      </body>
    </html>
  );
}
