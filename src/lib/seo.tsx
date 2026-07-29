import { Helmet } from 'react-helmet-async';
import { siteConfig } from './config';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({ title, description, path = '/', image, jsonLd }: SeoProps) {
  const canonical = `${siteConfig.url}${path}`;
  const graphImage = image || undefined;

  return (
    <Helmet>
      <html lang="uk" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {graphImage ? <meta property="og:image" content={graphImage} /> : null}
      <meta name="twitter:card" content={graphImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {graphImage ? <meta name="twitter:image" content={graphImage} /> : null}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
