import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flutter & Full Stack Projects',
  description:
    'Production Flutter cross-platform mobile apps, AI multi-agent pipelines, and full-stack software built by Omkar Anarse.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Flutter & Full Stack Projects — Omkar Anarse',
    description:
      'Explore mobile applications, AI systems, and full-stack software projects built by Omkar Anarse using Flutter, Next.js, and Python.',
    url: 'https://omkar-anarse.vercel.app/projects',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
