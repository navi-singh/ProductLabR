import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://productlab.com';
  
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

  // Generate sitemap entries
  const sitemap: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path.includes('/best') ? 0.8 : 0.6,
  }));

  return sitemap;
}
