import { analyticsConfig } from '../lib/config';
import { Seo } from '../lib/seo';

export default function StatsPage() {
  const hasGa = Boolean(analyticsConfig.gaMeasurementId);
  const dashboardUrl = analyticsConfig.dashboardUrl;

  return (
    <>
      <Seo
        title="Статистика | KANYE in Ukrainian"
        description="Статистика переглядів українських перекладів Kanye West."
        path="/stats"
      />
      <section className="stats-page" aria-labelledby="stats-title">
        <h1 id="stats-title">Статистика</h1>
        <p className="stats-page__intro">
          Сайт уже підготовлений до Google Analytics: кожна сторінка перекладу надсилає перегляд сторінки й окрему
          подію song_view з назвою пісні, альбомом і slug.
        </p>

        <dl className="stats-page__status" aria-label="Стан аналітики">
          <div>
            <dt>Google Analytics</dt>
            <dd>{hasGa ? 'Підключено' : 'Очікує VITE_GA_MEASUREMENT_ID'}</dd>
          </div>
          <div>
            <dt>Публічний звіт</dt>
            <dd>{dashboardUrl ? 'Підключено' : 'Очікує VITE_ANALYTICS_DASHBOARD_URL'}</dd>
          </div>
        </dl>

        {dashboardUrl ? (
          <iframe
            className="stats-page__dashboard"
            title="Статистика переглядів перекладів"
            src={dashboardUrl}
            loading="lazy"
          />
        ) : (
          <div className="stats-page__placeholder">
            <h2>Рейтинг перекладів зʼявиться після підключення звіту</h2>
            <p>
              Для GitHub Pages не варто напряму підключати приватний Google Analytics Data API у браузері. Безпечний
              варіант: зробити звіт у Looker Studio за подією song_view і вставити публічний embed URL сюди через
              змінну середовища.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
