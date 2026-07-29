create extension if not exists "pgcrypto";

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  album text,
  release_year integer,
  cover_url text,
  youtube_music_url text,
  spotify_url text,
  apple_music_url text,
  soundcloud_url text,
  short_description text,
  is_featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lyrics_lines (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  line_number integer not null,
  section text,
  original_text text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (song_id, line_number)
);

create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  line_id uuid not null references public.lyrics_lines(id) on delete cascade,
  phrase text not null,
  explanation text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text,
  email text,
  song_reference text,
  message text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new'
);

create index if not exists songs_slug_idx on public.songs (slug);
create index if not exists songs_title_idx on public.songs (title);
create index if not exists songs_album_idx on public.songs (album);
create index if not exists songs_published_idx on public.songs (published);
create index if not exists songs_is_featured_idx on public.songs (is_featured);
create index if not exists lyrics_lines_song_id_idx on public.lyrics_lines (song_id);
create index if not exists lyrics_lines_line_number_idx on public.lyrics_lines (line_number);
create index if not exists annotations_line_id_idx on public.annotations (line_id);

alter table public.songs enable row level security;
alter table public.lyrics_lines enable row level security;
alter table public.annotations enable row level security;
alter table public.suggestions enable row level security;

drop policy if exists "Published songs are readable" on public.songs;
create policy "Published songs are readable"
on public.songs for select
using (published = true);

drop policy if exists "Lines for published songs are readable" on public.lyrics_lines;
create policy "Lines for published songs are readable"
on public.lyrics_lines for select
using (
  exists (
    select 1 from public.songs
    where songs.id = lyrics_lines.song_id
    and songs.published = true
  )
);

drop policy if exists "Annotations for published songs are readable" on public.annotations;
create policy "Annotations for published songs are readable"
on public.annotations for select
using (
  exists (
    select 1
    from public.lyrics_lines
    join public.songs on songs.id = lyrics_lines.song_id
    where lyrics_lines.id = annotations.line_id
    and songs.published = true
  )
);

drop policy if exists "Visitors can create suggestions" on public.suggestions;
create policy "Visitors can create suggestions"
on public.suggestions for insert
with check (message <> '' and type <> '');

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at
before update on public.songs
for each row execute procedure public.set_updated_at();

drop trigger if exists lyrics_lines_set_updated_at on public.lyrics_lines;
create trigger lyrics_lines_set_updated_at
before update on public.lyrics_lines
for each row execute procedure public.set_updated_at();

drop trigger if exists annotations_set_updated_at on public.annotations;
create trigger annotations_set_updated_at
before update on public.annotations
for each row execute procedure public.set_updated_at();
