# One World Trade Centre FZE — dynamic marketing site

Next.js (App Router) marketing site with **MongoDB + Mongoose**, **section-based pages**, **draft/publish**, **tag-based cache invalidation** (`revalidateTag`), **Auth.js credentials** admin, structured JSON APIs under `/api/v1/admin/*`, and optional **Resend** email for the contact form.

## Prerequisites

- Node.js 20+
- MongoDB 6+ (local or [Atlas](https://www.mongodb.com/atlas))

Local Mongo (Docker):

```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

## Setup

1. Copy environment file and fill values:

   ```bash
   cp .env.example .env.local
   ```

   - `MONGODB_URI` — e.g. `mongodb://127.0.0.1:27017/owtc`
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_URL` — e.g. `http://localhost:3000` (production: your public URL)
   - `PREVIEW_SECRET` — random string; used for draft preview (below)
   - Optional mail: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`

2. Install and seed:

   ```bash
   pnpm install
   pnpm seed
   ```

   Default admin: **`admin@owtc-fze.com`** / **`AdminChangeMe!`** (override with `ADMIN_PASSWORD` when seeding).

3. Run dev server:

   ```bash
   pnpm dev
   ```

- Public site: `/`, `/about`, `/services`, `/contact`
- Admin: `/admin` (sign in at `/admin/login`)

**Auth / `ClientFetchError: Failed to fetch`:** Use the same host as `AUTH_URL` (e.g. if `.env.local` has `AUTH_URL=http://localhost:3000`, open the app at `http://localhost:3000`, not `http://127.0.0.1:3000`). Disable ad blockers for localhost — some block `/api/auth/*`. After changing `AUTH_URL`, restart `next dev` so `next.config.mjs` can inline `NEXTAUTH_URL`.

## First visit / empty database

If MongoDB has no `Page` documents yet (before `pnpm seed`), the marketing routes **`/`, `/about`, `/services`, `/contact`** still render using built‑in **fallback content** from [`src/data/fallback-pages.ts`](src/data/fallback-pages.ts). After seeding, the database is the source of truth. In **development**, unpublished drafts are also shown (with the preview banner) so you are not stuck on 404 before the first publish.

To confirm a slug is served from MongoDB vs static fallback (dev only): `GET /api/dev/resolve-page?slug=home` — response field `source` is `"database"` or `"fallback"`. This route returns **404 in production**.

## Content model

- **`SiteGlobal`** — navigation, footer, logo path, `featureFlags` (e.g. hide client logos section), `seoDefaults`.
- **`Page`** — `slug` (`home`, `about`, `services`, `contact`), **draft** `sections[]`, **live** `publishedSections[]`, `status`, SEO fields (`seoTitle`, `seoDescription`, `ogImage`, `canonicalPath`).
- Each section: `{ id, type, order, data }` with `type` in `hero | intro | services | whyChoose | investment | clientLogos | cta | contact`.

Editors work on **draft** `sections`. Use **Publish** in the admin page editor to copy draft → `publishedSections` and set `status: published`. Visitors read published data unless **preview** is enabled.

## Preview (draft)

1. Set `PREVIEW_SECRET` in `.env.local`.
2. Visit:

   `/api/preview?secret=YOUR_SECRET&redirect=/`

Next.js **draft mode** is enabled; marketing routes then render **draft** sections. A small banner appears at the bottom.

## Caching

- Public reads use `unstable_cache` tagged with `page:{slug}` (and `site-global` for global doc).
- Admin PATCH/POST handlers call `revalidateTag` for `page:{slug}` and per-section `section:{id}` after writes.

## API shape

- Success: `{ data: T }`
- Error: `{ error: { code, message, details? } }` with 4xx/5xx status

Admin routes require a session cookie (sign in via `/admin/login`).

## Scripts

| Command          | Description                |
| ---------------- | -------------------------- |
| `pnpm dev`       | Development server         |
| `pnpm build`     | Production build           |
| `pnpm start`     | Start production server    |
| `pnpm lint`      | ESLint                     |
| `pnpm typecheck` | TypeScript (no emit)       |
| `pnpm seed`      | Seed MongoDB + admin user  |

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `typecheck`, and `build` with dummy `MONGODB_URI` / `SKIP_ENV_VALIDATION=1`.

## Production notes

- Set real `MONGODB_URI`, `AUTH_SECRET`, `AUTH_URL` on the host.
- Run `pnpm seed` once against production DB (or automate).
- Restrict MongoDB network access (Atlas IP allowlist / VPC).
- Change the default admin password immediately after first login.
