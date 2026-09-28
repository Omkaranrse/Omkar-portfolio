import avatarImg from '@/images/portrait.jpg';
import { StaticImageData } from 'next/image';

export interface ExperienceItem {
  id: string;
  companyName: string;
  role: string;
  period: string;
  type: string;
  description: string;
  responsibilities?: string[];
  techStack: string[];
  backCardText: string;
  backCardColor: string;
  profileImage: StaticImageData | string;
  tapeColor: string;
  tapeRotation: number;
}

export const experiences: ExperienceItem[] = [
  {
    id: 'metaphi',
    companyName: 'Metaphi',
    role: 'Flutter Developer',
    period: 'Current · 1+ Month',
    type: 'Current Role',
    description:
      'Building scalable mobile experiences and state architecture with Flutter and Dart, integrating backend APIs and modern UI workflows.',
    responsibilities: [
      'Architecting modular mobile interfaces with Clean Architecture and Riverpod state management.',
      'Integrating asynchronous REST APIs and handling complex real-time data flows.',
      'Crafting fluid micro-animations and production-ready design token systems.',
    ],
    techStack: ['Flutter', 'Dart', 'Riverpod', 'Clean Arch', 'REST APIs'],
    backCardText: 'METAPHI',
    backCardColor: '#3b82f6',
    profileImage: avatarImg,
    tapeColor: '#ffffff',
    tapeRotation: -4,
  },
  {
    id: 'my-job-park',
    companyName: 'My Job Park',
    role: 'Flutter Developer',
    period: '3 Years · Part-time',
    type: 'Part-time',
    description:
      'Engineered cross-platform mobile apps for job seekers and recruiters, implementing responsive design token systems and real-time state management.',
    responsibilities: [
      'Built and maintained cross-platform recruitment apps serving thousands of active users.',
      'Implemented real-time messaging, notifications, and job search filtering with Firebase.',
      'Designed responsive UI/UX token systems for cohesive multi-device experience across iOS and Android.',
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'State Mgmt', 'UI/UX'],
    backCardText: 'MYJOBPARK',
    backCardColor: 'var(--accent)',
    profileImage: avatarImg,
    tapeColor: '#f3f4f6',
    tapeRotation: 5,
  },
];
