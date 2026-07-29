import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { searchSongs } from '../services/songService';
import type { SongSummary } from '../types/content';

export function SearchBox() {
  const navigate = useNavigate();
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);

  useEffect(() => {
    let isCurrent = true;

    async function runSearch() {
      setError('');
      setActiveIndex(-1);
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const matches = await searchSongs(debouncedQuery);
        if (isCurrent) {
          setResults(matches);
          setIsOpen(true);
        }
      } catch (searchError) {
        if (isCurrent) {
          setError(searchError instanceof Error ? searchError.message : 'Не вдалося виконати пошук.');
          setIsOpen(true);
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void runSearch();
    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  function openSong(song: SongSummary) {
    setIsOpen(false);
    navigate(`/song/${song.slug}`);
  }

  return (
    <div className="search" ref={rootRef}>
      <label className="sr-only" htmlFor={inputId}>
        Знайти пісню або альбом
      </label>
      <input
        id={inputId}
        className="search__input"
        value={query}
        type="search"
        placeholder="Знайти пісню або альбом"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        onFocus={() => {
          if (query.trim().length >= 2) setIsOpen(true);
        }}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
            return;
          }
          if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            setIsOpen(true);
            return;
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, results.length - 1));
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
          }
          if (event.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
            event.preventDefault();
            openSong(results[activeIndex]);
          }
        }}
      />

      {isOpen ? (
        <div className="search__dropdown" id={listId} role="listbox" aria-label="Результати пошуку">
          {isLoading ? <p className="search__state">Шукаємо...</p> : null}
          {!isLoading && error ? <p className="search__state">{error}</p> : null}
          {!isLoading && !error && results.length === 0 ? (
            <p className="search__state">Нічого не знайдено.</p>
          ) : null}
          {!isLoading && !error
            ? results.map((song, index) => (
                <button
                  id={`${listId}-${index}`}
                  className="search__option"
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  key={song.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => openSong(song)}
                >
                  <span>{song.title}</span>
                  <small>
                    {song.album || 'Альбом не вказано'}
                    {song.release_year ? `, ${song.release_year}` : ''}
                  </small>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
