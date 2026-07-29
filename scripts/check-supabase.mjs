import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

async function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const file = await readFile(path, 'utf8');

  for (const rawLine of file.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

await loadEnvFile(resolve('.env'));
await loadEnvFile(resolve('.env.local'));

const publicUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const adminUrl = process.env.SUPABASE_URL || publicUrl;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!publicUrl || !anonKey) {
  throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local first.');
}

const publicClient = createClient(publicUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { count: publishedCount, error: publicError } = await publicClient
  .from('songs')
  .select('id', { count: 'exact', head: true })
  .eq('published', true);

if (publicError) {
  throw new Error(`Public Supabase check failed: ${publicError.message}`);
}

console.log(`Public connection OK. Published songs visible to visitors: ${publishedCount ?? 0}`);

if (!adminUrl || !serviceRoleKey) {
  console.log('Admin check skipped. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to verify import/export access.');
  process.exit(0);
}

const adminClient = createClient(adminUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { count: allSongsCount, error: adminError } = await adminClient
  .from('songs')
  .select('id', { count: 'exact', head: true });

if (adminError) {
  throw new Error(`Admin Supabase check failed: ${adminError.message}`);
}

console.log(`Admin connection OK. Total songs in database: ${allSongsCount ?? 0}`);
