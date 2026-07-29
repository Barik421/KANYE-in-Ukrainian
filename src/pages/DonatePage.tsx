import { contactConfig } from '../lib/config';
import { Seo } from '../lib/seo';

export default function DonatePage() {
  return (
    <>
      <Seo
        title="Донат | KANYE in Ukrainian"
        description="Підтримайте розвиток незалежного українського проєкту KANYE in Ukrainian."
        path="/donate"
      />
      <section className="text-page">
        <h1>Донат</h1>
        <p>
          Підтримка допоможе розвивати сайт, додавати нові переклади, пояснення, оплачувати інфраструктуру і доводити
          матеріали до кращого редакторського рівня.
        </p>
        {contactConfig.donateUrl ? (
          <a className="plain-button plain-button--link" href={contactConfig.donateUrl}>
            Підтримати проєкт
          </a>
        ) : (
          <p className="developer-notice" role="status">
            Додайте `VITE_DONATE_URL` перед публікацією, щоб увімкнути кнопку донату.
          </p>
        )}
      </section>
    </>
  );
}
