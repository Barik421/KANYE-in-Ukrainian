import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LoadingText } from './components/LoadingText';
import { usePageTracking } from './hooks/usePageTracking';

const HomePage = lazy(() => import('./pages/HomePage'));
const SongPage = lazy(() => import('./pages/SongPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export function App() {
  usePageTracking();

  return (
    <Suspense fallback={<LoadingText label="Завантаження..." />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="song/:slug" element={<SongPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="policy" element={<PolicyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
