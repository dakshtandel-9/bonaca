# Bonaca

Landing page for Bonaca, a private villa. The site is a digital visiting card:
visitors discover the property and then book on external platforms (Airbnb,
Booking.com, Agoda, Google Maps or WhatsApp). There is no booking engine,
payment, authentication or database.

## Stack

Next.js (App Router) · TypeScript · React Server Components · ESLint.
No CSS framework, UI kit, icon set or animation library.

## Getting started

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit
```

## Structure

- `src/app` — routes, metadata, robots and sitemap
- `src/components/layout` — Header, Footer, Container
- `src/components/sections` — the eight homepage sections
- `src/components/ui` — small shared components
- `src/data` — all editable static content
- `src/types` — content types
- `src/lib/site-config.ts` — site details and every external booking URL

## Current phase

Structure only. No visual design, theme, animation or decorative UI has been
introduced yet. Content across `src/data` and `src/lib/site-config.ts` is
placeholder text and `#` URLs awaiting real client information.
