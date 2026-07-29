import './load-env';
import { createClient } from '@supabase/supabase-js';

export interface ContentFile {
  songs: ContentSong[];
}

export interface ContentSong {
  id?: string;
  title: string;
  slug: string;
  album?: string | null;
  release_year?: number | null;
  cover_url?: string | null;
  short_description?: string | null;
  is_featured?: boolean;
  published?: boolean;
  lyrics_lines?: ContentLine[];
}

export interface ContentLine {
  id?: string;
  line_number: number;
  section?: string | null;
  original_text: string;
  translated_text: string;
  annotations?: ContentAnnotation[];
}

export interface ContentAnnotation {
  phrase: string;
  explanation: string;
}

export function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for local content scripts.');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getPublicClient() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
