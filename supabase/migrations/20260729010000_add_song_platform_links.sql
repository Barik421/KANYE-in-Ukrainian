alter table public.songs
  add column if not exists youtube_music_url text,
  add column if not exists spotify_url text,
  add column if not exists apple_music_url text,
  add column if not exists soundcloud_url text;
