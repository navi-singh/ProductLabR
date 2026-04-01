import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import '../styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
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
    url: 'https://productlab.com',
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
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://productlab.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007ACC" />
      </head>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-700">
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        <main className="mx-auto max-w-[1280px] px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
