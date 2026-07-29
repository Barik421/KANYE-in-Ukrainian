import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingText } from '../components/LoadingText';
import { Seo } from '../lib/seo';
import { getCatalogSongs } from '../services/songService';
import type { SongSummary } from '../types/content';

interface AlbumGroup {
  album: string;
  releaseYear: number | null;
  songs: SongSummary[];
}

const unknownAlbum = 'Без альбому';
const artistStats = {
  studioAlbums: 11,
  spotifyTracks: 486,
  updatedAt: '29 липня 2026',
  albumSourceUrl: 'https://yewiki.org/Ye_Chronology_%28Albums%29',
  trackSourceUrl: 'https://kworb.net/spotify/artist/5K4W6rqBFWDnAN6FQUkS6x_songs.html',
};

function formatTrackCount(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} треків`;
  if (lastDigit === 1) return `${count} трек`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} треки`;
  return `${count} треків`;
}

function groupByAlbum(songs: SongSummary[]): AlbumGroup[] {
  const groups = new Map<string, AlbumGroup>();

  for (const song of songs) {
    const album = song.album || unknownAlbum;
    const existing = groups.get(album);

    if (existing) {
      existing.songs.push(song);
      if (!existing.releaseYear && song.release_year) existing.releaseYear = song.release_year;
      continue;
    }

    groups.set(album, {
      album,
      releaseYear: song.release_year,
      songs: [song],
    });
  }

  return Array.from(groups.values()).sort((a, b) => {
    const yearA = a.releaseYear ?? Number.MAX_SAFE_INTEGER;
    const yearB = b.releaseYear ?? Number.MAX_SAFE_INTEGER;
    if (yearA !== yearB) return yearA - yearB;
    return a.album.localeCompare(b.album);
  });
}

export default function CatalogPage() {
  const [songs, setSongs] = useState<SongSummary[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadCatalog() {
      try {
        const catalogSongs = await getCatalogSongs();
        if (isCurrent) setSongs(catalogSongs);
      } catch (loadError) {
        if (isCurrent) setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити каталог.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadCatalog();
    return () => {
      isCurrent = false;
    };
  }, []);

  const albums = useMemo(() => groupByAlbum(songs), [songs]);
  const activeAlbum = albums.find((album) => album.album === selectedAlbum) ?? albums[0];
  const albumCount = albums.length;
  const trackCount = songs.length;

  return (
    <>
      <Seo
        title="Каталог перекладів | KANYE in Ukrainian"
        description="Каталог українських перекладів Kanye West за альбомами і треками."
        path="/catalog"
      />
      <section className="catalog-page" aria-labelledby="catalog-title">
        <h1 id="catalog-title">Каталог</h1>
        <p className="catalog-page__intro">
          Альбоми й треки, для яких у базі вже є опубліковані українські переклади або тестові записи.
        </p>

        <section className="artist-overview" aria-labelledby="artist-overview-title">
          <div className="artist-overview__copy">
            <h2 id="artist-overview-title">Статистика Kanye West</h2>
            <p>
              Орієнтир по повному каталогу артиста, щоб було видно масштаб роботи над перекладами. Ці цифри
              оновлюються вручну, бо релізи, фіти й колаборації різні сервіси рахують по-різному.
            </p>
          </div>
          <dl className="artist-overview__stats">
            <div>
              <dt>Студійних альбомів</dt>
              <dd>{artistStats.studioAlbums}</dd>
            </div>
            <div>
              <dt>Треків у Spotify-каталозі</dt>
              <dd>{artistStats.spotifyTracks}</dd>
            </div>
          </dl>
          <p className="artist-overview__source">
            Дані звірено {artistStats.updatedAt}:{' '}
            <a href={artistStats.albumSourceUrl} target="_blank" rel="noreferrer">
              YeWiki
            </a>{' '}
            і{' '}
            <a href={artistStats.trackSourceUrl} target="_blank" rel="noreferrer">
              Kworb
            </a>
            .
          </p>
        </section>

        {isLoading ? <LoadingText label="Завантаження каталогу..." /> : null}
        {!isLoading && error ? <p className="state-text state-text--error">{error}</p> : null}
        {!isLoading && !error && songs.length === 0 ? <p className="state-text">У каталозі поки немає пісень.</p> : null}

        {!isLoading && !error && songs.length > 0 ? (
          <>
            <dl className="catalog-stats" aria-label="Статистика каталогу">
              <div>
                <dt>Альбомів у базі</dt>
                <dd>{albumCount}</dd>
              </div>
              <div>
                <dt>Треків у базі</dt>
                <dd>{trackCount}</dd>
              </div>
            </dl>

            <div className="catalog-browser">
              <aside className="album-list" aria-label="Альбоми">
                {albums.map((album) => (
                  <button
                    className="album-list__button"
                    type="button"
                    aria-pressed={album.album === activeAlbum?.album}
                    key={album.album}
                    onClick={() => setSelectedAlbum(album.album)}
                  >
                    <span>{album.album}</span>
                    <small>
                      {album.releaseYear ? `${album.releaseYear} · ` : ''}
                      {formatTrackCount(album.songs.length)}
                    </small>
                  </button>
                ))}
              </aside>

              {activeAlbum ? (
                <section className="track-list" aria-labelledby="tracks-title">
                  <div className="track-list__header">
                    <h2 id="tracks-title">{activeAlbum.album}</h2>
                    {activeAlbum.releaseYear ? <p>{activeAlbum.releaseYear}</p> : null}
                  </div>
                  <ol>
                    {activeAlbum.songs.map((song) => (
                      <li key={song.id}>
                        <Link to={`/song/${song.slug}`}>
                          <span>{song.title}</span>
                          <small>Відкрити переклад</small>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
