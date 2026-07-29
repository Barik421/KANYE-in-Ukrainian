import { contactConfig } from '../lib/config';
import { Seo } from '../lib/seo';

function buildMailto(subject: string, body = '') {
  if (!contactConfig.email) return '';
  const params = new URLSearchParams({ subject, body });
  return `mailto:${contactConfig.email}?${params.toString()}`;
}

export default function ContactPage() {
  const hasEmail = Boolean(contactConfig.email);

  return (
    <>
      <Seo
        title="Контакти | KANYE in Ukrainian"
        description="Запропонуйте пісню, повідомте про неточність або напишіть автору KANYE in Ukrainian."
        path="/contact"
      />
      <section className="text-page">
        <h1>Контакти</h1>
        <p>
          Якщо хочете запропонувати пісню, повідомити про неточність у перекладі або просто написати автору, найпростіше
          зробити це через пошту.
        </p>

        {hasEmail ? (
          <div className="link-list" aria-label="Контактні дії">
            <a href={buildMailto('Пропозиція пісні для KANYE in Ukrainian', 'Пісня або посилання:\n\nЧому саме вона:\n')}>
              Запропонувати пісню
            </a>
            <a
              href={buildMailto(
                'Неточність у перекладі на KANYE in Ukrainian',
                'Пісня:\nРядок:\nЩо варто змінити:\n',
              )}
            >
              Повідомити про неточність
            </a>
            <a href={buildMailto('Контакт із KANYE in Ukrainian')}>Написати автору</a>
          </div>
        ) : (
          <p className="developer-notice" role="status">
            Додайте `VITE_CONTACT_EMAIL` перед публікацією, щоб увімкнути поштові посилання.
          </p>
        )}
      </section>
    </>
  );
}
