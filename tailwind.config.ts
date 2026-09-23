import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f5f4f0',
        grid: '#dedcd2',
        ink: '#1f1e1a',
        muted: '#6b6a62',
        accent: '#ff4b3e',
        card: '#ffffff',
        charcoal: '#2b2b2b',
        'dark-bg': '#111111',
      },
      fontFamily: {
        unbounded: ['var(--font-unbounded)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        space: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'rotateBadge 24s linear infinite',
      },
      keyframes: {
        rotateBadge: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
