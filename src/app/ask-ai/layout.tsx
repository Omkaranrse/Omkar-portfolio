import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask Omkar AI — Interactive 3D Workstation',
  description:
    'Chat directly with the interactive AI persona of Omkar Anarse to explore his Flutter engineering experience, full-stack architecture, and tech stack.',
  alternates: {
    canonical: '/ask-ai',
  },
  openGraph: {
    title: 'Ask Omkar AI — Interactive 3D Workstation | Omkar Anarse',
    description:
      'Chat directly with the interactive AI persona of Omkar Anarse to explore his Flutter engineering experience, full-stack architecture, and tech stack.',
    url: 'https://omkar-anarse.vercel.app/ask-ai',
  },
};

export default function AskAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
