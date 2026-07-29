with song as (
  insert into public.songs (
    title,
    slug,
    album,
    release_year,
    cover_url,
    youtube_music_url,
    spotify_url,
    apple_music_url,
    soundcloud_url,
    short_description,
    is_featured,
    published
  )
  values (
    'Runaway',
    'runaway',
    'My Beautiful Dark Twisted Fantasy',
    2010,
    null,
    'https://music.youtube.com/search?q=Kanye%20West%20Runaway',
    'https://open.spotify.com/search/Runaway%20Kanye%20West',
    'https://music.apple.com/search?term=Kanye%20West%20Runaway',
    null,
    'Тестовий запис для перевірки сторінки пісні, пошуку, перекладу й пояснень.',
    true,
    true
  )
  on conflict (slug) do update set
    title = excluded.title,
    album = excluded.album,
    release_year = excluded.release_year,
    cover_url = excluded.cover_url,
    youtube_music_url = excluded.youtube_music_url,
    spotify_url = excluded.spotify_url,
    apple_music_url = excluded.apple_music_url,
    soundcloud_url = excluded.soundcloud_url,
    short_description = excluded.short_description,
    is_featured = excluded.is_featured,
    published = excluded.published
  returning id
),
line as (
  insert into public.lyrics_lines (
    song_id,
    line_number,
    section,
    original_text,
    translated_text
  )
  select
    song.id,
    1,
    'Intro',
    '[original line placeholder]',
    'Тестовий рядок перекладу для перевірки сторінки.'
  from song
  on conflict (song_id, line_number) do update set
    section = excluded.section,
    original_text = excluded.original_text,
    translated_text = excluded.translated_text
  returning id
),
removed_annotations as (
  delete from public.annotations
  where line_id in (select id from line)
)
insert into public.annotations (
  line_id,
  phrase,
  explanation
)
select
  line.id,
  'placeholder',
  'Тестове пояснення: тут згодом буде розбір сленгу, гри слів або культурного контексту.'
from line;
