import { supabase } from '../lib/supabaseClient';
import { mockFeaturedSongs, mockSongs } from '../data/mockContent';
import { supabaseConfig } from '../lib/config';
import type { Annotation, LyricsLine, SongDetail, SongSummary } from '../types/content';

const songSummaryFields =
  'id,title,slug,album,release_year,cover_url,youtube_music_url,spotify_url,apple_music_url,soundcloud_url,short_description,is_featured,published';

type LyricsLineRow = Omit<LyricsLine, 'annotations'> & {
  annotations: Annotation[] | null;
};

const devFallbackTimeoutMs = 1200;

function isNetworkError(error: { message?: string } | null) {
  return Boolean(error?.message && /fetch failed|failed to fetch|networkerror/i.test(error.message));
}

function shouldUseLocalFallback(error: { message?: string } | null) {
  return supabaseConfig.enableMockFallback && isNetworkError(error);
}

async function withDevTimeout<TRequest, TFallback>(
  request: PromiseLike<TRequest>,
  fallback: () => TFallback,
): Promise<TRequest | TFallback> {
  if (!supabaseConfig.enableMockFallback) return request;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      request,
      new Promise<TFallback>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback()), devFallbackTimeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function searchMockSongs(query: string) {
  const needle = query.toLocaleLowerCase('uk');
  return mockFeaturedSongs.filter((song) => {
    const haystack = `${song.title} ${song.album ?? ''}`.toLocaleLowerCase('uk');
    return haystack.includes(needle);
  });
}

export async function getFeaturedSongs(): Promise<SongSummary[]> {
  if (!supabase) return mockFeaturedSongs;

  const { data, error } = await withDevTimeout(
    supabase
      .from('songs')
      .select('id,title,slug,album,release_year,cover_url')
      .eq('published', true)
      .eq('is_featured', true)
      .order('title', { ascending: true }),
    () => ({ data: mockFeaturedSongs, error: null }),
  );

  if (error) {
    if (shouldUseLocalFallback(error)) return mockFeaturedSongs;
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function searchSongs(query: string): Promise<SongSummary[]> {
  const value = query.trim();
  if (value.length < 2) return [];
  if (!supabase) return searchMockSongs(value);

  const escaped = value.replaceAll('%', '\\%').replaceAll('_', '\\_');
  const { data, error } = await withDevTimeout(
    supabase
      .from('songs')
      .select('id,title,slug,album,release_year,cover_url')
      .eq('published', true)
      .or(`title.ilike.%${escaped}%,album.ilike.%${escaped}%`)
      .limit(8),
    () => ({ data: searchMockSongs(value), error: null }),
  );

  if (error) {
    if (shouldUseLocalFallback(error)) return searchMockSongs(value);
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getCatalogSongs(): Promise<SongSummary[]> {
  if (!supabase) return mockFeaturedSongs;

  const { data, error } = await withDevTimeout(
    supabase
      .from('songs')
      .select('id,title,slug,album,release_year,cover_url')
      .eq('published', true)
      .order('release_year', { ascending: true, nullsFirst: false })
      .order('album', { ascending: true, nullsFirst: false })
      .order('title', { ascending: true }),
    () => ({ data: mockFeaturedSongs, error: null }),
  );

  if (error) {
    if (shouldUseLocalFallback(error)) return mockFeaturedSongs;
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPublishedSongBySlug(slug: string): Promise<SongDetail | null> {
  if (!supabase) return mockSongs.find((song) => song.slug === slug) ?? null;

  const { data, error } = await withDevTimeout(
    supabase
      .from('songs')
      .select(
        `${songSummaryFields},lyrics_lines(id,song_id,line_number,section,original_text,translated_text,annotations(id,line_id,phrase,explanation))`,
      )
      .eq('published', true)
      .eq('slug', slug)
      .order('line_number', { referencedTable: 'lyrics_lines', ascending: true })
      .maybeSingle(),
    () => ({ data: mockSongs.find((song) => song.slug === slug) ?? null, error: null }),
  );

  if (error) {
    if (shouldUseLocalFallback(error)) return mockSongs.find((song) => song.slug === slug) ?? null;
    throw new Error(error.message);
  }

  if (!data) return null;

  const lines = ((data.lyrics_lines ?? []) as LyricsLineRow[]).map((line) => ({
    ...line,
    annotations: line.annotations ?? [],
  }));

  return {
    ...data,
    lyrics_lines: lines,
  };
}
