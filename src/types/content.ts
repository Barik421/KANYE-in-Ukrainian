export interface SongSummary {
  id: string;
  title: string;
  slug: string;
  album: string | null;
  release_year: number | null;
  cover_url: string | null;
  short_description?: string | null;
  is_featured?: boolean;
  published?: boolean;
}

export interface Annotation {
  id: string;
  line_id: string;
  phrase: string;
  explanation: string;
}

export interface LyricsLine {
  id: string;
  song_id: string;
  line_number: number;
  section: string | null;
  original_text: string;
  translated_text: string;
  annotations: Annotation[];
}

export interface SongDetail extends SongSummary {
  short_description: string | null;
  lyrics_lines: LyricsLine[];
}

export type SuggestionType = 'song' | 'mistake' | 'better_translation' | 'contact';

export interface SuggestionInput {
  type: SuggestionType;
  name?: string;
  email?: string;
  song_reference?: string;
  message: string;
}
