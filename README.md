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
npm run check:seo
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

## SEO and launch state

The production build validates the title, description, canonical URL, Open
Graph and X cards, JSON-LD, manifest, sitemap, robots directives, document
language, main landmark and heading structure.

The site automatically stays `noindex` while placeholder business details or
seeded testimonials remain. To enable indexing, replace every value marked
`REPLACE` in `src/lib/site-config.ts` and replace every `placeholder-*` review
in `src/data/reviews.ts`. The next build then enables indexing and adds the page
and property photography to the sitemap automatically.

Set `NEXT_PUBLIC_SITE_URL` during the build if the deployment uses a custom
domain; otherwise the configured Sites URL is the canonical origin.
