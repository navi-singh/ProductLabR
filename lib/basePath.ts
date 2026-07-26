/**
 * The basePath the app was built with.
 *
 * On GitHub Pages this project is served from a subpath (/ProductLabR), and the
 * deploy workflow text-injects `basePath` into next.config.mjs at build time.
 * Reading the resolved value here keeps this helper working no matter who sets
 * basePath, and stays empty in local dev where there is no subpath.
 *
 * Next.js inlines this value into both the server and client bundles at build
 * time, so SSR and hydration agree.
 */
export const BASE_PATH = process.env.__NEXT_ROUTER_BASEPATH ?? '';

/**
 * Prefixes a root-relative asset path with the app's basePath.
 *
 * `next/image` normally does this for you, but not when `images.unoptimized` is
 * true — which the GitHub Pages deploy sets, because static exports cannot run
 * the image optimizer. Without this, every local image 404s in production.
 */
export function withBasePath(src: string): string {
  if (!BASE_PATH) return src;

  // Leave absolute and protocol-relative URLs, and data/blob URIs, untouched.
  if (!src.startsWith('/') || src.startsWith('//')) return src;

  // Idempotent: never double-prefix.
  if (src === BASE_PATH || src.startsWith(`${BASE_PATH}/`)) return src;

  return `${BASE_PATH}${src}`;
}
