# KANYE in Ukrainian

Ukrainian-language editorial website for manually written Kanye West song translations with explanations of slang, wordplay, references, and cultural context.

## Stack

- React + Vite
- TypeScript strict mode
- React Router
- Supabase PostgreSQL
- Plain CSS
- `react-helmet-async` for route metadata

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Frontend environment variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SITE_URL=
VITE_GA_MEASUREMENT_ID=
```

Local content scripts use server-side variables only:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in Vite or browser code.

## Google Analytics

Create a GA4 property and set its measurement id in Vercel and `.env.local`:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The app loads Google Analytics only when this variable is present. React Router route changes send `page_view` events, so song page traffic appears by URL, for example `/song/runaway`.

## Database Connection

Supabase is used for content, not analytics. The browser reads public published content with:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

These values are safe to expose because Row Level Security controls what visitors can do. The schema allows public reads only for published songs, lyrics, and annotations. Suggestions can be inserted publicly, but cannot be read publicly.

Content import/export scripts use elevated local-only variables:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Keep `SUPABASE_SERVICE_ROLE_KEY` only on your machine or trusted CI. Do not add it to Vercel frontend variables.

## Supabase Schema

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- `songs`
- `lyrics_lines`
- `annotations`
- `suggestions`

Row Level Security is enabled. Public visitors can read only published songs and related lines/annotations. Public visitors can insert suggestions, but cannot read, update, or delete them.

## Content Workflow

Use `data/content.example.json` as the JSON shape for songs, lyrics lines, and annotations.

Import content:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run import-content -- data/content.example.json
```

Export a backup:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run export-content
```

Backups are written to `backups/`.

To add a new song, add a song object with `title`, `slug`, published metadata, ordered `lyrics_lines`, and optional line-level `annotations`, then run the import script.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
npm run generate-sitemap
```

## SEO And Sitemap

Routes set title, description, canonical URL, Open Graph, Twitter metadata, and structured data through `react-helmet-async`.

Generate `public/sitemap.xml` before deployment:

```bash
VITE_SITE_URL=https://your-domain.com VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run generate-sitemap
```

Because this is a Vite client-side SPA, crawlers that do not execute JavaScript may see less route-specific metadata than a server-rendered app would provide. The project keeps clean URLs, semantic HTML, sitemap generation, and Vercel SPA rewrites without migrating to Next.js.

## Vercel Deployment

Set the Vite Supabase variables in Vercel project settings. `vercel.json` rewrites all direct route visits to `index.html`, so `/song/runaway` works on refresh and direct navigation.
