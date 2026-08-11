import type { SongDetail, SongSummary } from '../types/content';

const mockRunawaySong: SongDetail = {
  id: '00000000-0000-4000-8000-000000000001',
  title: 'Runaway',
  slug: 'runaway',
  album: 'My Beautiful Dark Twisted Fantasy',
  release_year: 2010,
  cover_url: null,
  youtube_music_url: 'https://music.youtube.com/search?q=Kanye%20West%20Runaway',
  spotify_url: 'https://open.spotify.com/search/Runaway%20Kanye%20West',
  apple_music_url: 'https://music.apple.com/search?term=Kanye%20West%20Runaway',
  soundcloud_url: null,
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

const mockTrialSong: SongDetail = {
  id: '00000000-0000-4000-8000-000000000002',
  title: 'All Falls Down',
  slug: 'all-falls-down',
  album: 'The College Dropout',
  release_year: 2004,
  cover_url: null,
  youtube_music_url: 'https://music.youtube.com/search?q=Kanye%20West%20All%20Falls%20Down',
  spotify_url: 'https://open.spotify.com/search/All%20Falls%20Down%20Kanye%20West',
  apple_music_url: 'https://music.apple.com/search?term=Kanye%20West%20All%20Falls%20Down',
  soundcloud_url: null,
  short_description:
    'Пробна локальна сторінка для перевірки додавання тексту, українського перекладу й пояснень.',
  is_featured: true,
  published: true,
  lyrics_lines: [
    {
      id: '00000000-0000-4000-8000-000000000201',
      song_id: '00000000-0000-4000-8000-000000000002',
      line_number: 1,
      section: 'Intro',
      original_text: '[original line 1 goes here]',
      translated_text: 'Тут буде український переклад першого рядка.',
      annotations: [
        {
          id: '00000000-0000-4000-8000-000000002001',
          line_id: '00000000-0000-4000-8000-000000000201',
          phrase: 'original line',
          explanation:
            'Тестове пояснення: тут можна розібрати сленг, гру слів або культурний контекст конкретної фрази.',
        },
      ],
    },
    {
      id: '00000000-0000-4000-8000-000000000202',
      song_id: '00000000-0000-4000-8000-000000000002',
      line_number: 2,
      section: 'Verse 1',
      original_text: '[original line 2 goes here]',
      translated_text: 'Тут буде український переклад другого рядка.',
      annotations: [],
    },
    {
      id: '00000000-0000-4000-8000-000000000203',
      song_id: '00000000-0000-4000-8000-000000000002',
      line_number: 3,
      section: 'Verse 1',
      original_text: '[original line 3 goes here]',
      translated_text: 'Тут буде український переклад третього рядка.',
      annotations: [
        {
          id: '00000000-0000-4000-8000-000000002003',
          line_id: '00000000-0000-4000-8000-000000000203',
          phrase: 'line 3',
          explanation:
            'Приклад другої анотації до іншого рядка. Фраза має точно збігатися з частиною original_text.',
        },
      ],
    },
  ],
};

export const mockSongs: SongDetail[] = [mockTrialSong, mockRunawaySong];
export const mockFeaturedSongs: SongSummary[] = mockSongs.filter((song) => song.is_featured);
