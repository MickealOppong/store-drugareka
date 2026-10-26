
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

const SITE_NAME = 'kasoa.pl';

export default function SEO({
  title,
  description,
  canonical,
}: SEOProps) {
  const pageTitle = `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      {canonical && (
        <link rel="canonical" href={canonical} />
      )}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
    </Helmet>
  );
}
