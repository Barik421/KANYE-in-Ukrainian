import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

/* global fetch */

const albums = [
  {
    title: 'The College Dropout',
    year: 2004,
    releaseId: 'da13b81f-7b09-3fb6-b5c9-8551f22c797e',
    coverUrl: 'https://coverartarchive.org/release/da13b81f-7b09-3fb6-b5c9-8551f22c797e/front-250',
    featuredTracks: ['All Falls Down'],
  },
  {
    title: 'Late Registration',
    year: 2005,
    releaseId: '428e7920-b3e6-45d2-a61d-aa75101dfe5e',
    coverUrl: 'https://coverartarchive.org/release/428e7920-b3e6-45d2-a61d-aa75101dfe5e/front-250',
    featuredTracks: [],
  },
  {
    title: 'Graduation',
    year: 2007,
    releaseId: '64c600c3-6db4-4dfa-b5be-32badcc4e56a',
    coverUrl: 'https://coverartarchive.org/release/64c600c3-6db4-4dfa-b5be-32badcc4e56a/front-250',
    featuredTracks: [],
  },
  {
    title: '808s & Heartbreak',
    year: 2008,
    releaseId: '6cf64bc8-c7c8-34fe-ad15-b8b92f1a197d',
    coverUrl: 'https://coverartarchive.org/release/6cf64bc8-c7c8-34fe-ad15-b8b92f1a197d/front-250',
    featuredTracks: [],
  },
  {
    title: 'My Beautiful Dark Twisted Fantasy',
    year: 2010,
    releaseId: '2fcfcaaa-6594-4291-b79f-2d354139e108',
    coverUrl: 'https://coverartarchive.org/release/2fcfcaaa-6594-4291-b79f-2d354139e108/front-250',
    featuredTracks: ['Runaway'],
  },
  {
    title: 'Yeezus',
    year: 2013,
    releaseId: 'e1cd2cd9-3cd6-40bf-9802-9aa2d231fc2d',
    coverUrl: 'https://coverartarchive.org/release/e1cd2cd9-3cd6-40bf-9802-9aa2d231fc2d/front-250',
    featuredTracks: [],
  },
  {
    title: 'The Life of Pablo',
    year: 2016,
    releaseId: '03f03619-385a-4ed9-9974-cdcdf6404cf5',
    coverUrl: 'https://coverartarchive.org/release/03f03619-385a-4ed9-9974-cdcdf6404cf5/front-250',
    featuredTracks: [],
  },
  {
    title: 'ye',
    year: 2018,
    releaseId: '59c3d788-8880-44ae-9897-bb098a80e663',
    coverUrl: 'https://coverartarchive.org/release/59c3d788-8880-44ae-9897-bb098a80e663/front-250',
    featuredTracks: [],
  },
  {
    title: 'Jesus Is King',
    year: 2019,
    releaseId: '78881e0a-b2bd-4e7e-8aa8-0d524f8da328',
    coverUrl: 'https://coverartarchive.org/release/78881e0a-b2bd-4e7e-8aa8-0d524f8da328/front-250',
    featuredTracks: [],
  },
  {
    title: 'Donda',
    year: 2021,
    releaseId: 'ae190b5a-6ede-4e0d-bb6b-2ca387d8716b',
    coverUrl: 'https://coverartarchive.org/release/ae190b5a-6ede-4e0d-bb6b-2ca387d8716b/front-250',
    featuredTracks: [],
  },
  {
    title: 'Donda 2',
    year: 2022,
    releaseId: 'ca35d880-1fa8-415f-9733-6f80d940c522',
    coverUrl: '',
    featuredTracks: [],
  },
];

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function serviceSearchUrl(service, songTitle) {
  const query = encodeURIComponent(`Kanye West ${songTitle}`);
  if (service === 'youtube') return `https://music.youtube.com/search?q=${query}`;
  if (service === 'spotify') return `https://open.spotify.com/search/${query}`;
  return `https://music.apple.com/search?term=${query}`;
}

async function getTracks(releaseId) {
  const response = await fetch(`https://musicbrainz.org/ws/2/release/${releaseId}?inc=recordings&fmt=json`, {
    headers: {
      'User-Agent': 'KanyeInUkrainian/0.1 (local metadata seed)',
    },
  });

  if (!response.ok) throw new Error(`MusicBrainz request failed for ${releaseId}: ${response.status}`);
  const release = await response.json();
  return (release.media ?? []).flatMap((medium) => medium.tracks ?? []).map((track) => track.title);
}

const songs = [];

for (const album of albums) {
  const tracks = await getTracks(album.releaseId);

  for (const title of tracks) {
    songs.push({
      title,
      slug: slugify(title),
      album: album.title,
      release_year: album.year,
      cover_url: album.coverUrl,
      youtube_music_url: serviceSearchUrl('youtube', title),
      spotify_url: serviceSearchUrl('spotify', title),
      apple_music_url: serviceSearchUrl('apple', title),
      soundcloud_url: '',
      short_description: `Сторінка пісні з альбому ${album.title}. Переклад і пояснення буде додано поступово.`,
      is_featured: album.featuredTracks.includes(title),
      published: true,
      lyrics_lines: [],
    });
  }

  await sleep(1100);
}

await writeFile(resolve('data/kanye-studio-albums.json'), `${JSON.stringify({ songs }, null, 2)}\n`);
console.log(`Generated ${songs.length} songs from ${albums.length} albums.`);
