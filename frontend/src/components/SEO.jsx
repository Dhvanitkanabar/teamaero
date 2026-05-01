import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://vanguard-aero.vercel.app'; // update with your production URL
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEO Component
 * Injects dynamic title, meta description, Open Graph, Twitter Card,
 * and Schema.org structured data (JSON-LD) for every page.
 *
 * Usage:
 *   <SEO title="Dashboard" description="Your squadron overview" schema={...} />
 */
const SEO = ({
  title,
  description = 'Vanguard AERO — A real-time squadron management and operations platform for coordinated team performance.',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema = null,
  noindex = false,
}) => {
  const fullTitle = title ? `${title} | Vanguard AERO` : 'Vanguard AERO — Squadron Operations Platform';
  const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      {/* ── Primary ──────────────────────────────────────────────────────── */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* ── Open Graph ───────────────────────────────────────────────────── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Vanguard AERO" />
      <meta property="og:locale" content="en_US" />

      {/* ── Twitter Card ─────────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ── Additional ───────────────────────────────────────────────────── */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="application-name" content="Vanguard AERO" />
      <meta name="keywords" content="vanguard, aero, squadron, team management, leaderboard, operations, gaming, esports" />

      {/* ── Structured Data (Schema.org JSON-LD) ─────────────────────────── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
