import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnnotationText } from '../components/AnnotationText';
import { CoverImage } from '../components/CoverImage';
import { DeveloperNotice } from '../components/DeveloperNotice';
import { LoadingText } from '../components/LoadingText';
import { trackSongView } from '../lib/analytics';
import { siteConfig } from '../lib/config';
import { Seo } from '../lib/seo';
import { getPublishedSongBySlug } from '../services/songService';
import type { SongDetail } from '../types/content';

const musicPlatforms = [
  { key: 'youtube_music_url', label: 'YouTube Music', icon: 'youtube' },
  { key: 'spotify_url', label: 'Spotify', icon: 'spotify' },
  { key: 'apple_music_url', label: 'Apple Music', icon: 'apple' },
  { key: 'soundcloud_url', label: 'SoundCloud', icon: 'soundcloud' },
] as const;

function PlatformIcon({ icon }: { icon: (typeof musicPlatforms)[number]['icon'] }) {
  if (icon === 'spotify') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" data-stroke />
        <path d="M7.4 9.1c3.2-1 6.8-.7 9.5.8" data-stroke />
        <path d="M8 12c2.6-.7 5.4-.5 7.7.8" data-stroke />
        <path d="M8.6 14.7c2-.5 4.1-.3 5.9.6" data-stroke />
      </svg>
    );
  }

  if (icon === 'apple') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M15.9 3.1c-.2 1.2-.8 2.2-1.6 2.9-.8.7-1.8 1.2-2.8 1.1.1-1.1.7-2.1 1.5-2.8.8-.8 1.9-1.3 2.9-1.2Z"
          data-fill
        />
        <path
          d="M19.1 16.9c-.4 1-.7 1.5-1.3 2.4-.8 1.2-1.9 2.7-3.3 2.7-1.2 0-1.5-.8-3.2-.8s-2 .8-3.2.8c-1.4.1-2.5-1.3-3.3-2.6-2.3-3.5-2.5-7.7-1.1-9.9 1-1.6 2.5-2.5 3.9-2.5 1.5 0 2.4.8 3.6.8 1.2 0 1.9-.8 3.6-.8 1.3 0 2.7.7 3.7 1.9-3.3 1.8-2.8 6.4.1 8Z"
          data-fill
        />
      </svg>
    );
  }

  if (icon === 'soundcloud') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.5 15.2a3.4 3.4 0 0 1 4-3.3 5.4 5.4 0 0 1 10.3 1.5 3.2 3.2 0 0 1-.4 6.4H4.7a2.3 2.3 0 0 1-.2-4.6Z"
          data-fill
        />
        <path d="M8.2 12.1v7.7M10.2 9.7v10.1M12.2 8.5v11.3" data-stroke />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" data-stroke />
      <path d="m10 8 6 4-6 4V8Z" data-fill />
    </svg>
  );
}

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

  useEffect(() => {
    if (!song) return;
    trackSongView({ slug: song.slug, title: song.title, album: song.album });
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
  const platformLinks = musicPlatforms
    .map((platform) => ({ ...platform, href: song[platform.key] }))
    .filter((platform) => Boolean(platform.href));

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
          <div className="song-page__media">
            <CoverImage src={song.cover_url} alt={`Обкладинка ${song.album ?? song.title}`} size="medium" />
            {platformLinks.length > 0 ? (
              <nav className="music-links" aria-label="Де послухати пісню">
                {platformLinks.map((platform) => (
                  <a
                    href={platform.href || '#'}
                    key={platform.key}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Слухати в ${platform.label}`}
                    title={platform.label}
                  >
                    <PlatformIcon icon={platform.icon} />
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </header>
        {song.short_description ? <p className="song-page__intro">{song.short_description}</p> : null}
        <DeveloperNotice />

        {linesWithSectionState.length > 0 ? (
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
        ) : (
          <p className="song-page__empty">Переклад готується. Ця сторінка вже створена, але текст і пояснення ще не додано.</p>
        )}

        <Link className="song-page__suggest" to="/contact">
          Знайшли неточність або маєте кращий варіант перекладу?
        </Link>
      </article>
    </>
  );
}
