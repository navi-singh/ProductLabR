import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Newsreader } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { CookieConsent } from '@/components/CookieConsent';
import { rootMetadata } from '@/lib/site-metadata';
import { SITE_URL } from '@/lib/site-url';
import getPostMetadata from '@/components/getPostMetadata';
import '../styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = rootMetadata;

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
    name: 'Verdict Hound',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
  };

  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A2540" />
        <link rel="apple-touch-icon" href={`${SITE_URL}/apple-touch-icon.png`} />
        <link rel="manifest" href={`${SITE_URL}/site.webmanifest`} />
      </head>
      <body className="bg-neutral-50 font-sans text-neutral-700 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script id="google-consent-defaults" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
try {
  if (localStorage.getItem('productlab-cookie-consent') === 'accepted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
  }
} catch (e) {}`}
        </Script>
        <Header posts={posts} />
        <main className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <CookieConsent />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
