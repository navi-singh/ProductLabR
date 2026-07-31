import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '../lib/Posts';
import { SITE_URL } from '../lib/site-url';

export const dynamic = 'force-static';

/**
 * Walks the App Router tree for statically rendered pages.
 *
 * This used to be a hand-maintained array of twelve paths covering only power
 * stations and cameras, which left roughly 38 of the 50 `/best` pages — the
 * highest commercial-intent pages on the site, including seven category hubs —
 * entirely absent from the sitemap. Deriving the list means a new route is
 * announced to search engines the moment it exists.
 */
function getStaticRoutes(): string[] {
  const appDir = path.join(process.cwd(), 'app');
  const routes: string[] = [];

  function walk(dir: string, segments: string[]): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const name = entry.name;
      // Dynamic segments are enumerated from content, route groups and private
      // folders are not routable, and api routes are not pages.
      if (name.startsWith('[') || name.startsWith('(') || name.startsWith('_') || name === 'api') {
        continue;
      }

      const nextSegments = [...segments, name];
      const childDir = path.join(dir, name);

      if (fs.existsSync(path.join(childDir, 'page.tsx'))) {
        routes.push(`/${nextSegments.join('/')}`);
      }

      walk(childDir, nextSegments);
    }
  }

  walk(appDir, []);
  return routes.sort();
}

function priorityFor(route: string): number {
  if (route === '') return 1;
  if (route === '/best' || route === '/reviews') return 0.9;
  if (route.startsWith('/best/')) return 0.8;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = ['', ...getStaticRoutes()].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: priorityFor(route),
  }));

  const articleEntries: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
