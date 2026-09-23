# Omkar — Portfolio

Personal portfolio built with **Next.js 15 (App Router)**, React 19, TypeScript, and Tailwind CSS.

## Architecture

- **Framework**: Next.js 15 App Router with static prerendering and dynamic client components.
- **Styling**: Tailored CSS design system with custom fonts, glassmorphism, responsive editorial grid, and fine-tuned gradient masks.
- **Images**: Next.js Image optimization (`next/image`) with automatic WebP/AVIF generation.

## Project Structure

```
src/
  app/
    layout.tsx       HTML shell, fonts, SEO metadata, JSON-LD schema
    page.tsx         Homepage combining all sections
    globals.css      Design tokens, typography, animations, responsive rules
    robots.ts        Dynamic robots.txt generator
    sitemap.ts       Dynamic XML sitemap generator
  components/
    Nav.tsx          Adaptive fixed navigation with frosted glass scroll detection
    Hero.tsx         Full-bleed photographic hero with smooth dissolve mask
    About.tsx        Editorial About section with filled arch portrait and orbital badge
    Overview.tsx     Highlights & capability cards
    Work.tsx         Featured engineering projects
    SideDots.tsx     Scoped project number indicators (01–04) with smooth scrolling
    Contact.tsx      Contact links & footer CTA
    Footer.tsx       Colophon & status
    Interactions.tsx Scroll-reveal observer & side-dot section tracker
  data/
    projects.ts      Single source of truth for portfolio projects
  images/            Optimized photography assets (hero.png, about.jpg)
public/              Background textures & static icons
```

## Development

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build

```bash
npm run build     # builds optimized production static bundle
npm run start     # starts the production server
```
anywhere that serves static files:

- **Vercel**: import the repo, framework preset "Astro" is auto-detected, no
  config needed
- **Netlify**: build command `npm run build`, publish directory `dist`
- **GitHub Pages / Cloudflare Pages**: same — build command `npm run build`,
  output directory `dist`

No environment variables or server required.
