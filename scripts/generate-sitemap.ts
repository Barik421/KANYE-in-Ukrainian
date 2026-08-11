import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getPublicClient } from './shared';

const siteUrl = (process.env.VITE_SITE_URL || 'https://barik421.github.io/KANYE-in-Ukrainian').replace(/\/$/, '');
const supabase = getPublicClient();
let slugs: string[] = [];

if (supabase) {
  const { data, error } = await supabase.from('songs').select('slug').eq('published', true).order('slug');
  if (error) throw new Error(error.message);
  slugs = (data ?? []).map((song) => song.slug as string);
}

const staticPaths = ['/', '/catalog', '/stats', '/about', '/donate', '/contact', '/policy'];
const urls = [...staticPaths, ...slugs.map((slug) => `/song/${slug}`)]
  .map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(resolve('public/sitemap.xml'), xml);
console.log(`Generated sitemap with ${slugs.length + staticPaths.length} URL(s).`);
