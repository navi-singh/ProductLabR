const configured = process.env.NEXT_PUBLIC_SITE_URL;

// A production build without this set silently ships localhost canonicals,
// OpenGraph URLs, JSON-LD links and sitemap entries. CI supplies it from the
// GitHub Pages base_url; warn loudly if that ever stops happening.
if (!configured && process.env.NODE_ENV === 'production') {
  console.warn(
    '[site-url] NEXT_PUBLIC_SITE_URL is unset in a production build. ' +
      'Canonical URLs and the sitemap will point at http://localhost:3000.'
  );
}

export const SITE_URL = (configured ?? 'http://localhost:3000').replace(/\/$/, '');

/**
 * Builds an absolute URL in the same trailing-slash form the static export
 * serves. GitHub Pages resolves a slashless path to a redirect, so emitting
 * the slashless form in a sitemap or JSON-LD advertises a URL that is one hop
 * away from the real one - and disagrees with the canonical tag Next emits.
 */
export function canonicalUrl(path = ''): string {
  const normalized = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
  return normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized}/`;
}
