import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Playfair_Display } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TrustBar } from '@/components/TrustBar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { SITE_URL } from '@/lib/site-url';
import getPostMetadata from '@/components/getPostMetadata';
import '../styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Product Lab - Expert Reviews You Can Trust',
  description:
    'Expert reviews of power stations, cameras, and tech gear. Professional testing and honest comparisons to help you make informed buying decisions.',
  keywords:
    'product reviews, power stations, cameras, tech reviews, buying guides, expert testing',
  authors: [{ name: 'Product Lab Team' }],
  creator: 'Product Lab',
  publisher: 'Product Lab',
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
    title: 'Product Lab - Expert Reviews You Can Trust',
    description:
      'Expert reviews of power stations, cameras, and tech gear.',
    siteName: 'Product Lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Lab - Expert Reviews You Can Trust',
    description:
      'Expert reviews of power stations, cameras, and tech gear.',
    creator: '@productlab',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getPostMetadata().map((p) => ({
    title: p.title,
    slug: p.slug,
    category: p.category,
  }));

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Product Lab',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="canonical" href={SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007ACC" />
      </head>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-700">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header posts={posts} />
        <TrustBar />
        <main className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
