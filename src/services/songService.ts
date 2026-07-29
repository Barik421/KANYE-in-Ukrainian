import { supabase } from '../lib/supabaseClient';
import { mockFeaturedSongs, mockSongs } from '../data/mockContent';
import type { Annotation, LyricsLine, SongDetail, SongSummary } from '../types/content';

const songSummaryFields =
  'id,title,slug,album,release_year,cover_url,youtube_music_url,spotify_url,apple_music_url,soundcloud_url,short_description,is_featured,published';

type LyricsLineRow = Omit<LyricsLine, 'annotations'> & {
  annotations: Annotation[] | null;
};

export async function getFeaturedSongs(): Promise<SongSummary[]> {
  if (!supabase) return mockFeaturedSongs;

  const { data, error } = await supabase
    .from('songs')
    .select('id,title,slug,album,release_year,cover_url')
    .eq('published', true)
    .eq('is_featured', true)
    .order('title', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function searchSongs(query: string): Promise<SongSummary[]> {
  const value = query.trim();
  if (value.length < 2) return [];
  if (!supabase) {
    const needle = value.toLocaleLowerCase('uk');
    return mockFeaturedSongs.filter((song) => {
      const haystack = `${song.title} ${song.album ?? ''}`.toLocaleLowerCase('uk');
      return haystack.includes(needle);
    });
  }

  const escaped = value.replaceAll('%', '\\%').replaceAll('_', '\\_');
  const { data, error } = await supabase
    .from('songs')
    .select('id,title,slug,album,release_year,cover_url')
    .eq('published', true)
    .or(`title.ilike.%${escaped}%,album.ilike.%${escaped}%`)
    .limit(8);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCatalogSongs(): Promise<SongSummary[]> {
  if (!supabase) return mockFeaturedSongs;

  const { data, error } = await supabase
    .from('songs')
    .select('id,title,slug,album,release_year,cover_url')
    .eq('published', true)
    .order('release_year', { ascending: true, nullsFirst: false })
    .order('album', { ascending: true, nullsFirst: false })
    .order('title', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPublishedSongBySlug(slug: string): Promise<SongDetail | null> {
  if (!supabase) return mockSongs.find((song) => song.slug === slug) ?? null;

  const { data, error } = await supabase
    .from('songs')
    .select(
      `${songSummaryFields},lyrics_lines(id,song_id,line_number,section,original_text,translated_text,annotations(id,line_id,phrase,explanation))`,
    )
    .eq('published', true)
    .eq('slug', slug)
    .order('line_number', { referencedTable: 'lyrics_lines', ascending: true })
    .maybeSingle();

  if (error) throw new Error(error.message);
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
