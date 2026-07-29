interface CoverImageProps {
  src: string | null | undefined;
  alt: string;
  size?: 'small' | 'medium';
}

export function CoverImage({ src, alt, size = 'small' }: CoverImageProps) {
  if (!src) {
    return (
      <div className={`cover-placeholder cover-placeholder--${size}`} aria-label={alt}>
        <span>K</span>
      </div>
    );
  }

  return (
    <img
      className={`cover-image cover-image--${size}`}
      src={src}
      alt={alt}
      width={size === 'small' ? 64 : 112}
      height={size === 'small' ? 64 : 112}
      loading="lazy"
      decoding="async"
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}
