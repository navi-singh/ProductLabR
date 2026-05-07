import { MetadataRoute } from 'next';
import { getAllPostSlugs } from '../lib/Posts';
import { SITE_URL } from '../lib/site-url';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages = [
    '',
    '/best',
    '/best/power-stations',
    '/best/power-stations/portable-power-stations',
    '/best/power-stations/house-backup-power-stations',
    '/best/power-stations/camping-power-stations',
    '/best/power-stations/carry-on-power-stations',
    '/best/cameras',
    '/best/cameras/hybrid-cameras',
    '/best/cameras/hybrid-cameras-under-3000',
    '/best/cameras/professional-cameras',
    '/best/cameras/professional-photo-cameras',
  ];

  // Generate static page entries
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path.includes('/best') ? 0.8 : 0.6,
  }));

  // Generate dynamic article entries from actual post files
  const slugs = getAllPostSlugs();
  const articleEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
