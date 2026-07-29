import type { SongDetail, SongSummary } from '../types/content';

const mockSong: SongDetail = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'Runaway',
  slug: 'runaway',
  album: 'My Beautiful Dark Twisted Fantasy',
  release_year: 2010,
  cover_url: null,
  short_description:
    'Демо-запис для локальної розробки: приклад того, як виглядають переклад, рядки та пояснення без підключеного Supabase.',
  is_featured: true,
  published: true,
  lyrics_lines: [
    {
      id: '00000000-0000-4000-8000-000000000101',
      song_id: '00000000-0000-4000-8000-000000000001',
      line_number: 1,
      section: 'Intro',
      original_text: "And I always find, yeah, I always find somethin' wrong",
      translated_text: 'І я завжди знаходжу, так, я завжди знаходжу щось не так',
      annotations: [
        {
          id: '00000000-0000-4000-8000-000000001001',
          line_id: '00000000-0000-4000-8000-000000000101',
          phrase: "somethin' wrong",
          explanation: 'Розмовне скорочення підтримує сповідальний, майже недбалий тон рядка.',
        },
      ],
    },
    {
      id: '00000000-0000-4000-8000-000000000102',
      song_id: '00000000-0000-4000-8000-000000000001',
      line_number: 2,
      section: null,
      original_text: 'You been puttin’ up with my shit just way too long',
      translated_text: 'Ти терпиш мої викиди вже надто довго',
      annotations: [
        {
          id: '00000000-0000-4000-8000-000000001002',
          line_id: '00000000-0000-4000-8000-000000000102',
          phrase: 'puttin’ up with',
          explanation: 'Фразове дієслово означає не просто “мати справу”, а довго терпіти щось неприємне.',
        },
      ],
    },
  ],
};

export const mockFeaturedSongs: SongSummary[] = [mockSong];
export const mockSongs: SongDetail[] = [mockSong];
