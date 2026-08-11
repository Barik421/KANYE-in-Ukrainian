import { analyticsConfig } from './config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let isInitialized = false;
let skippedStaticInitialPageView = false;

export function initializeAnalytics() {
  const measurementId = analyticsConfig.gaMeasurementId;
  if (!measurementId || isInitialized || typeof window === 'undefined') return;

  if (window.gtag) {
    isInitialized = true;
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  isInitialized = true;
}

export function trackPageView(path: string, title: string) {
  const measurementId = analyticsConfig.gaMeasurementId;
  if (!measurementId || typeof window === 'undefined') return;

  const hasStaticGtag = Boolean(window.gtag) && !isInitialized;
  initializeAnalytics();
  if (hasStaticGtag && !skippedStaticInitialPageView) {
    skippedStaticInitialPageView = true;
    return;
  }

  const fullPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  window.gtag?.('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: fullPath || path,
    send_to: measurementId,
  });
}

export function trackSongView(song: { slug: string; title: string; album?: string | null }) {
  const measurementId = analyticsConfig.gaMeasurementId;
  if (!measurementId || typeof window === 'undefined') return;

  initializeAnalytics();
  window.gtag?.('event', 'song_view', {
    song_slug: song.slug,
    song_title: song.title,
    song_album: song.album ?? '',
    send_to: measurementId,
  });
}
