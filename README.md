# Bonaca

Landing site for Bonaca, a private villa, with a built-in CRM at `/admin` for
editing every page. Visitors discover the property and book on external
platforms (Airbnb, Booking.com, Agoda, Google Maps or WhatsApp) — there is no
booking engine or payment flow.

## Stack

Next.js (App Router) · TypeScript · React Server Components · ESLint.
Firebase Firestore for content · Cloudflare R2 for images.
No CSS framework, UI kit, icon set or animation library.

## Getting started

```bash
cp .env.example .env    # then set ADMIN_PASSWORD at minimum
npm run dev             # http://localhost:3000  ·  CRM at /admin
npm run build           # production build
npm run lint            # eslint
npx tsc --noEmit        # typecheck
```

The CRM works immediately with nothing but `ADMIN_PASSWORD` set. Content falls
back to `.data/content.json` and uploads to `public/uploads/` until Firebase and
R2 are configured — both are git-ignored and local to one machine, so connect
them before relying on the CRM in production.

## The CRM

`/admin` — sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`.

Every page, every section within it, and every field within those sections is
editable: headings, body copy, list items, photographs, rates, policies, FAQs,
menu links, booking URLs and search metadata. Lists can be added to, reordered
and deleted. Images can be uploaded, picked from the library, or pointed at a
URL. Publishing writes the document and the public pages update immediately.

The CRM has no hand-written forms. `src/lib/cms/schema.ts` describes every
editable field and the admin renders controls from it, so extending the site is:
add the field to `types.ts`, give it a default in `defaults.ts`, describe it in
`schema.ts`, read it in the component.

### Environment

| Key | Purpose |
| --- | --- |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | CRM sign-in. Required. |
| `ADMIN_SESSION_SECRET` | Signs the session cookie. Set it in production, or sessions drop on every restart. |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Firestore service account. Unset → `.data/content.json`. |
| `FIREBASE_CONTENT_COLLECTION` / `FIREBASE_CONTENT_DOCUMENT` | Where the content document lives. |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_BASE_URL` | Cloudflare R2. Unset → `public/uploads/`. |
| `R2_PREFIX` | Folder inside the bucket. Defaults to `bonaca`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and robots. |

`R2_PUBLIC_BASE_URL` must be the bucket's public URL — its `r2.dev` subdomain or
a custom domain — because that is what gets written into the content as an image
`src`. Enable public access on the bucket, or the site renders broken images.

## Structure

- `src/app/(site)` — the public pages
- `src/app/admin` — the CRM
- `src/app/api/admin` — sign-in, content and media endpoints
- `src/lib/cms` — content types, defaults, schema, store and read layer
- `src/lib/server` — Firebase, R2, auth
- `src/components/sections` — the nine homepage bands
- `src/data` — the shipped content, used as the CRM's defaults

## How content reaches a page

`getSiteContent()` reads the Firestore document once per deployment, cached
under the `site-content` tag with a one-minute ceiling, and merges it over
`DEFAULT_CONTENT`. Publishing invalidates the tag, so edits appear immediately;
the ceiling is a backstop if an invalidation is ever missed. A field the owner
has never touched, or a Firestore outage, falls through to the shipped content
rather than rendering blank.

## SEO and launch state

The site stays `noindex` while placeholder business details or seeded reviews
remain — fill in the contact details, the booking links and real guest reviews
in the CRM and indexing, `robots.txt` and the sitemap switch on by themselves.
Site & brand → Search engines overrides this either way. `/admin` is excluded
from indexing unconditionally.

## Deployment

The site is server-rendered and needs a Node runtime (Vercel or any Node host).
It is no longer a static export — the CRM needs route handlers, a session cookie
and a live read of the content, none of which survive `output: "export"`. The
older static-export pipeline in `scripts/` is left in place but unwired.
