import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getAdminClient } from './shared';

const supabase = getAdminClient();
const backupDir = resolve('backups');
const output = resolve(backupDir, `content-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);

const { data, error } = await supabase
  .from('songs')
  .select(
    'id,title,slug,album,release_year,cover_url,youtube_music_url,spotify_url,apple_music_url,soundcloud_url,short_description,is_featured,published,lyrics_lines(id,line_number,section,original_text,translated_text,annotations(phrase,explanation))',
  )
  .order('title', { ascending: true })
  .order('line_number', { referencedTable: 'lyrics_lines', ascending: true });

if (error) throw new Error(error.message);

await mkdir(backupDir, { recursive: true });
await writeFile(output, JSON.stringify({ songs: data ?? [] }, null, 2));
console.log(`Exported content to ${output}`);
