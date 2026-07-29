import { Link } from 'react-router-dom';
import { Seo } from '../lib/seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Сторінку не знайдено | KANYE in Ukrainian" description="Сторінку не знайдено." path="/404" />
      <section className="narrow-page">
        <h1>Сторінку не знайдено.</h1>
        <Link className="text-link" to="/">
          На головну
        </Link>
      </section>
    </>
  );
}
