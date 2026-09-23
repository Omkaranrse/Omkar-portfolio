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
        paper: '#f8f8f5',
        'paper-warm': '#f3f2ec',
        'paper-card': '#ffffff',
        ink: '#121316',
        'ink-muted': '#5c5d64',
        'ink-faint': '#8f9099',
        border: 'rgba(18, 19, 22, 0.08)',
        'border-strong': 'rgba(18, 19, 22, 0.16)',
        accent: '#eb4c2a',
        'accent-subtle': 'rgba(235, 76, 42, 0.08)',
        dark: {
          bg: '#0e0f12',
          surface: '#16171b',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': 'rgba(255, 255, 255, 0.16)',
          ink: '#f4f4f6',
          muted: '#9a9ba4',
        },
      },
      fontFamily: {
        display: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
