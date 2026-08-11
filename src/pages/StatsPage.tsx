import { analyticsConfig } from '../lib/config';
import { Seo } from '../lib/seo';

export default function StatsPage() {
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
          Тут зʼявиться рейтинг перекладів, які читачі відкривають найчастіше.
        </p>

        {dashboardUrl ? (
          <iframe
            className="stats-page__dashboard"
            title="Статистика переглядів перекладів"
            src={dashboardUrl}
            loading="lazy"
          />
        ) : (
          <div className="stats-page__placeholder">
            <h2>Рейтинг ще збирається</h2>
            <p>
              Ми не показуємо порожні таблиці. Коли накопичиться достатньо переглядів, тут буде компактна статистика
              найвідвідуваніших перекладів.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
