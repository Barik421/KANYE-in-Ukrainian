import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LoadingText } from './components/LoadingText';

const HomePage = lazy(() => import('./pages/HomePage'));
const SongPage = lazy(() => import('./pages/SongPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export function App() {
  return (
    <Suspense fallback={<LoadingText label="Завантаження..." />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="song/:slug" element={<SongPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
