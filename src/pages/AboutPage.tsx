import { Seo } from '../lib/seo';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="Про нас | KANYE in Ukrainian"
        description="KANYE in Ukrainian — незалежний український проєкт з авторськими перекладами пісень Kanye West і поясненнями культурного контексту."
        path="/about"
      />
      <section className="text-page">
        <h1>Про нас</h1>
        <p>
          KANYE in Ukrainian — незалежний український проєкт про пісні Kanye West. Тут важливий не буквальний переклад, а
          сенс: інтонація, сленг, гра слів, відсилки, культурний і біографічний контекст.
        </p>
        <p>
          Мета сайту — зробити тексти зрозумілішими українською мовою і не втратити те, що часто зникає при прямому
          перекладі.
        </p>
      </section>
    </>
  );
}
