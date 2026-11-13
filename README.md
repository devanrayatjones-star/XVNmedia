# XVN Media — website

A deliberately over-the-top, single-page site for XVN Media (website design, adverts & SEO),
built with Next.js (App Router) and TypeScript. No UI libraries, no images: every
visual is CSS, SVG or canvas.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## What's on the page

| Section | Component | The over-the-top bit |
| --- | --- | --- |
| Intro | `Loader` | Volt-green curtain, 000→100 counter (CSS exit, so it can never get stuck) |
| Hero | `Hero` + `ParticleGlobe` | The interactive particle globe, headline blended through it with `mix-blend-mode: difference`, spinning text badge |
| Tapes | `Marquee` | Two crossing tapes whose speed and skew react to scroll velocity |
| Manifesto | `Manifesto` | Words light up as you scroll, with live UI elements (toggle, sparkline, button) embedded mid-sentence |
| Anatomy | `Anatomy` | Pinned section that assembles a website element-by-element, devtools-style spotlight on each `<nav>`, `<h1>`, `<button>`… |
| Services | `Services` | Rows flood with colour, a floating preview card chases the cursor |
| Stats | `Stats` | Count-up numbers |
| Work | `Work` | Pinned horizontal-scroll gallery, 3D tilt + specular shine on hover |
| Ads & SEO | `Marketing` | Interactive dashboard — flip channel switches and every KPI/chart recalculates |
| Process | `Process` | Rail that fills as you scroll and lights up each step |
| Packages | `Packages` | Rotating neon conic-gradient border on the featured plan |
| Contact | `Contact` | Glitching giant headline, floating-label form, chip selectors |
| Footer | `Footer` | Full-bleed XVN wordmark that stretches on hover |

Plus a trailing cursor ring with contextual labels, magnetic buttons, scroll progress
bar, film grain, and a full-screen mobile menu.

`prefers-reduced-motion` is honoured throughout (the globe renders still and formed,
the loader is skipped, transitions are removed).

## SEO

- Title, meta description, canonical, Open Graph and Twitter cards are set in `app/layout.tsx` from `lib/site.ts`.
- JSON-LD (`ProfessionalService` + `WebSite`, with the three services) comes from `lib/schema.ts`.
- `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg` and a generated 1200×630 share image (`app/opengraph-image.tsx`).

## Things to replace before going live

- **`lib/site.ts`** — the site's real domain (`url`: drives canonical, sitemap and share cards), contact email and social links (real profile URLs are also added to the structured data automatically).
- **`components/Stats.tsx`** — the figures are placeholders.
- **`components/Work.tsx`** — the case studies are placeholder concepts.
- **`components/Packages.tsx`** — package contents.
- **Contact form** (`components/Contact.tsx`) — currently opens the visitor's email app
  pre-filled (no backend needed). Swap `onSubmit` for a POST to your CRM/form service.

## The globe

`components/ParticleGlobe.tsx` is the supplied component, unchanged apart from two
site-level tweaks: its wrapper is `position: absolute` (it fills the hero instead of the
whole viewport) and its animation loop pauses while the hero is scrolled out of view.
