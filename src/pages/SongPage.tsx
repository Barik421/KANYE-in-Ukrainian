import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnnotationText } from '../components/AnnotationText';
import { CoverImage } from '../components/CoverImage';
import { DeveloperNotice } from '../components/DeveloperNotice';
import { LoadingText } from '../components/LoadingText';
import { siteConfig } from '../lib/config';
import { Seo } from '../lib/seo';
import { getPublishedSongBySlug } from '../services/songService';
import type { SongDetail } from '../types/content';

export default function SongPage() {
  const { slug } = useParams();
  const [song, setSong] = useState<SongDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadSong() {
      if (!slug) return;
      setIsLoading(true);
      setError('');
      try {
        const result = await getPublishedSongBySlug(slug);
        if (isCurrent) setSong(result);
      } catch (loadError) {
        if (isCurrent) setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити переклад.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadSong();
    return () => {
      isCurrent = false;
    };
  }, [slug]);

  const seo = useMemo(() => {
    if (!song) return null;
    const description = song.short_description
      ? `${song.title}: ${song.short_description}`
      : `${song.title}${song.album ? ` з альбому ${song.album}` : ''} — переклад українською з поясненнями.`;
    const path = `/song/${song.slug}`;
    return {
      title: `${song.title} — переклад українською | ${siteConfig.name}`,
      description,
      path,
      image: song.cover_url,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'MusicRecording',
          name: song.title,
          byArtist: { '@type': 'MusicGroup', name: 'Kanye West' },
          inAlbum: song.album ? { '@type': 'MusicAlbum', name: song.album } : undefined,
          datePublished: song.release_year?.toString(),
          url: `${siteConfig.url}${path}`,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: song.title, item: `${siteConfig.url}${path}` },
          ],
        },
      ],
    };
  }, [song]);

  if (isLoading) return <LoadingText label="Завантаження перекладу..." />;

  if (error) {
    return (
      <section className="narrow-page">
        <p className="state-text state-text--error">{error}</p>
      </section>
    );
  }

  if (!song) {
    return (
      <section className="narrow-page">
        <p className="state-text">Переклад не знайдено.</p>
        <Link className="text-link" to="/">
          На головну
        </Link>
      </section>
    );
  }

  const linesWithSectionState = song.lyrics_lines.map((line, index, lines) => ({
    line,
    showSection: Boolean(line.section && line.section !== lines[index - 1]?.section),
  }));

  return (
    <>
      {seo ? <Seo {...seo} /> : null}
      <article className="song-page">
        <Link className="back-link" to="/">
          ← Назад
        </Link>
        <header className="song-page__header">
          <div>
            <h1>{song.title} — переклад українською</h1>
            <p>
              {song.album || 'Альбом не вказано'}
              {song.release_year ? `, ${song.release_year}` : ''}
            </p>
          </div>
          <CoverImage src={song.cover_url} alt={`Обкладинка ${song.album ?? song.title}`} size="medium" />
        </header>
        {song.short_description ? <p className="song-page__intro">{song.short_description}</p> : null}
        <DeveloperNotice />

        <div className="lyrics" aria-label="Оригінальний текст і український переклад">
          {linesWithSectionState.map(({ line, showSection }) => {
            return (
              <div className="lyrics__group" key={line.id}>
                {showSection ? <h2 className="lyrics__section">{line.section}</h2> : null}
                <div className="lyrics__row">
                  <p className="lyrics__original">
                    <AnnotationText text={line.original_text} annotations={line.annotations} />
                  </p>
                  <p className="lyrics__translation">{line.translated_text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Link className="song-page__suggest" to="/contact">
          Знайшли неточність або маєте кращий варіант перекладу?
        </Link>
      </article>
    </>
  );
}
