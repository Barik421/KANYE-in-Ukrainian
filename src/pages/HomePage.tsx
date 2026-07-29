import { useEffect, useState } from 'react';
import { DeveloperNotice } from '../components/DeveloperNotice';
import { LoadingText } from '../components/LoadingText';
import { SearchBox } from '../components/SearchBox';
import { SongCard } from '../components/SongCard';
import { siteConfig } from '../lib/config';
import { Seo } from '../lib/seo';
import { getFeaturedSongs } from '../services/songService';
import type { SongSummary } from '../types/content';

export default function HomePage() {
  const [songs, setSongs] = useState<SongSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      try {
        const featured = await getFeaturedSongs();
        if (isCurrent) setSongs(featured);
      } catch (loadError) {
        if (isCurrent) setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити пісні.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <>
      <Seo title={siteConfig.homeTitle} description={siteConfig.homeDescription} />
      <section className="hero" aria-labelledby="home-title">
        <div className="hero__blob" aria-hidden="true" />
        <p className="hero__brand">KANYE in Ukrainian</p>
        <h1 id="home-title">Зрозумій більше, ніж просто слова.</h1>
        <p className="hero__text">
          Авторські українські переклади пісень Kanye West із поясненням сленгу, гри слів, відсилок і культурного
          контексту.
        </p>
        <SearchBox />
        <DeveloperNotice />
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <h2 id="featured-title">Популярні переклади</h2>
        {isLoading ? <LoadingText label="Завантаження перекладів..." /> : null}
        {!isLoading && error ? <p className="state-text state-text--error">{error}</p> : null}
        {!isLoading && !error && songs.length === 0 ? <p className="state-text">Поки немає опублікованих перекладів.</p> : null}
        <div className="featured__grid">
          {songs.map((song) => (
            <SongCard song={song} key={song.id} />
          ))}
        </div>
      </section>
    </>
  );
}
