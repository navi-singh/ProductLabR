import type { Metadata } from 'next';
import { SITE_URL } from './site-url';

export const rootMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Verdict Hound - Expert Reviews You Can Trust',
    template: '%s | Verdict Hound',
  },
  description:
    'Expert reviews of power stations, cameras, and tech gear. Evidence-based scoring and honest comparisons to help you make informed buying decisions.',
  keywords:
    'product reviews, power stations, cameras, tech reviews, buying guides, product comparisons',
  authors: [{ name: 'Verdict Hound Team' }],
  creator: 'Verdict Hound',
  publisher: 'Verdict Hound',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Verdict Hound - Expert Reviews You Can Trust',
    description: 'Expert reviews of power stations, cameras, and tech gear.',
    siteName: 'Verdict Hound',
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Verdict Hound - Independent reviews, clearer decisions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verdict Hound - Expert Reviews You Can Trust',
    description: 'Expert reviews of power stations, cameras, and tech gear.',
    images: [`${SITE_URL}/og-default.png`],
  },
} satisfies Metadata;
