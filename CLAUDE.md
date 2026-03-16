# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required: Read Skills Before Starting Any Task

**Before starting any work**, read all skill files in `.claude/skills/`:
- `.claude/skills/skill-builder/SKILL.md` + `reference.md`
- `.claude/skills/frontend-design/SKILL.md`
- `.claude/skills/video-to-website/SKILL.md`

If a task matches a skill's domain, follow that skill's instructions exactly. If multiple skills apply, prefer the more specific one.

## Project Overview

**FLOW Performance Coffee** — a premium scroll-driven animated landing page for a nootropic coffee brand. Built with Next.js App Router, GSAP ScrollTrigger, and Lenis smooth scroll. Features Apple-style canvas frame scrubbing across 3 sequential frame sets (363 total frames), multiple distinct animation types per section, i18n support (English + Georgian), and a dark maroon/cream aesthetic.

## Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build (outputs to `.next/`)
- `npm run start` — serve the production build
- `npm run lint` — run ESLint (flat config, `eslint.config.mjs`)

No test framework is configured.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router), React 19.2.3, TypeScript 5.x (strict)
- **Animation:** GSAP 3.14.2 + ScrollTrigger
- **Smooth Scroll:** Lenis 1.3.18
- **Styling:** Global CSS (`app/globals.css`) + inline styles (no Tailwind, no styled-components)
- **Fonts:** Barlow Condensed (`--font-display`, 600–900) and Lora (`--font-body`, 400–600) via `next/font/google`
- **Linting:** ESLint 9.x flat config — `core-web-vitals` + `typescript` presets

## Architecture

### Core Files

- `app/layout.tsx` — Root layout: fonts, SVG grain filter, metadata
- `app/page.tsx` — Imports `FlowSite` component (the entire site)
- `app/globals.css` — CSS variables, typography scale, grain overlay, custom cursor, marquee, Lenis overrides
- `app/components/FlowSite.tsx` (~2500 lines) — Single `"use client"` component containing all sections, scroll logic, and animations
- `app/components/translations.ts` — i18n string map (`Lang = "en" | "ka"`), used via `t(key, lang)` helper

### Frame Sequences

Three directories under `public/`, 121 PNGs each (363 total), stitched as one continuous scroll animation:
- `frames/` — product animation
- `frames2/` — package explodes → ingredients into cup
- `frames3/` — turns into coffee

Frame paths: `public/frames/frame_0001.png` → served at `/frames/frame_0001.png`

### FlowSite Component

The monolithic component handles:
- **Frame loading:** Two-phase loader (10 parallel, rest sequential) across all 3 directories
- **Canvas renderer:** Padded cover mode (responsive `IMAGE_SCALE`: 0.72–0.86), retina-aware, auto-samples background color from frame corners
- **Lenis + GSAP integration:** Lenis smooth scroll connected to ScrollTrigger via `lenis.on("scroll", ScrollTrigger.update)` + GSAP ticker
- **i18n:** `lang` state toggles English/Georgian; all content strings come from `translations.ts` via `useMemo`
- **Hero entrance:** Radial rings, floating particles, SVG coffee beans with cursor-reactive magnetic repulsion, staggered letter reveal
- **9 scroll sections** with distinct GSAP animation types (3D tilt, scale-up, slide-right, horizontal pin, counter, clip-reveal, fade-in)
- **Custom cursor:** `mix-blend-mode: difference`, expands on hover, hidden on touch

### Sections (scroll order)

1. **Hero** — Circle-wipe clip-path reveal, frame scrubbing, animated entrance with coffee beans
2. **Marquee** — Stroke text, clip-path left-to-right reveal
3. **Ingredients** — 5 items with 3D perspective tilt, alternating L/R layout
4. **Science Behind Flow** — 4 pillars in 2×2 grid, scale-up entrance
5. **How to Make** — 4-step brew ritual, slide-right stagger
6. **Testimonials** — Horizontal scroll (pinned), 5 quote cards
7. **Stats** — Counter animations (3X, 94%, 12HR, 0), floating parallax shapes
8. **FAQ** — Accordion with rotating "+" indicator, solid black background zone
9. **Footer/CTA** — "FLOW" display text, ORDER NOW button

### CSS Variables

```css
--black: #0a0a0a    --maroon: #6B1F2A    --maroon-light: #8B2F3A
--cream: #F5F0E8    --white: #FFFFFF
```

Typography classes: `.display-xl` (clamp 4–12rem), `.display-lg`, `.display-md`, `.heading`, `.label`, `.body-lg`, `.body`

## Code Style

- TypeScript for all files, `@/*` path alias for imports
- Functional components only, PascalCase components, camelCase variables
- All translatable strings go in `translations.ts`, accessed via `t(key, lang)`
- ESLint must pass before committing

## Common Gotchas

- GSAP must be client-side only — all GSAP code lives in `"use client"` components inside `useEffect`
- `gsap.registerPlugin(ScrollTrigger)` must be called before any ScrollTrigger usage
- Lenis must be connected: `lenis.on("scroll", ScrollTrigger.update)` and added to GSAP ticker
- Canvas frame sequences need all images preloaded before hiding the loader
- The scroll container has no fixed height — ScrollTrigger measures it at runtime
- Text sections use dark overlay backgrounds (`rgba(10,10,10,0.85)`) for readability over the fixed canvas
- FAQ and footer are wrapped in a solid black `z-index: 4` div to fully cover the canvas
- When language changes, `ScrollTrigger.refresh()` must be called after React re-renders (already handled via `requestAnimationFrame` in a `useEffect`)
- The default Next.js SVG assets have been deleted from `public/`
