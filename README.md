# ACE SELECT

ACE SELECT is a Next.js website with a Supabase-backed admin CMS. The admin
Page Content editor lets an authorized administrator edit registered text
fields, upload or replace page images/videos, hide fields, and preview each
public page.

## Requirements

- Node.js `20.19.0` (see `.nvmrc`)
- npm (the repository lockfile is authoritative)
- A Supabase project for production authentication, storage, and CMS persistence

## Setup

```bash
npm ci
cp .env.example .env.local
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of
`cp`. Fill in the Supabase values in `.env.local`.

For a new Supabase project, apply these SQL files in order in the Supabase SQL
Editor:

1. `supabase/migrations/20261002_ace_select_cms.sql`
2. `supabase/migrations/20261016_page_content.sql`
3. `supabase/migrations/20261017_page_content_hardening.sql`
4. `supabase/migrations/20261019_hero_media_bridge.sql`
5. `supabase/migrations/20261021_hero_content_cleanup.sql`

The page-content migrations are idempotent. They seed editable fields for
Home, Who We Are, Services, Industries, Projects, and Contact, then add
production-safe key and media URL constraints. The hero media bridge adds the
columns required by the legacy Homepage → Hero editor. The hero cleanup
migration removes duplicate active hero records and adds a uniqueness guard.

If you want one file that includes the complete schema, seeds, RLS policies,
storage buckets, page-content editor table, and hardening constraints, run this
standalone master migration instead:

```text
supabase/migrations/20261018_ace_select_full_cms.sql
```

Run the master file once; do not run the three incremental files afterward.
It is safe to run the master file again if a previous setup was partial or if
you see a duplicate-policy error.

## Development

```bash
npm run dev
```

Open <http://localhost:3000>. Sign in at `/admin/login`, then open **Page
Content**. Choose a page, edit the field label/key/value or media, and select
**Save All**. Uploaded media is stored through `/api/admin/upload`; content
rows are persisted to Supabase and the local cache fallback.

## Checks

```bash
npm test       # offline typecheck + CMS cache validation
npm run lint:cms # CMS-specific lint
npm run lint   # repository lint
npm run build
```

`make test` runs the same offline test command. The Dockerfile provides a
reproducible Node 20 production image:

```bash
docker build -t aceselect .
docker run --env-file .env.local -p 3000:3000 aceselect
```

## Database SQL

The page-level customization schema and seed data are in
`supabase/migrations/20261016_page_content.sql`. It creates the
`cms_page_content` table, public active-content reads, admin write policies,
indexes, and representative text/media rows. Administrators can add unlimited
content keys from `/admin/content` without changing the schema.
