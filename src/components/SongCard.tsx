import { Link } from 'react-router-dom';
import type { SongSummary } from '../types/content';
import { CoverImage } from './CoverImage';

interface SongCardProps {
  song: SongSummary;
}

export function SongCard({ song }: SongCardProps) {
  return (
    <Link className="song-card" to={`/song/${song.slug}`}>
      <CoverImage src={song.cover_url} alt={`Обкладинка ${song.album ?? song.title}`} />
      <span className="song-card__text">
        <strong>{song.title}</strong>
        <span>{song.album || 'Альбом не вказано'}</span>
      </span>
      <span className="song-card__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
