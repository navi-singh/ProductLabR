import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import "../styles/global.css";

export const metadata: Metadata = {
  title: 'Product Lab - Expert Reviews You Can Trust',
  description: 'Expert reviews of power stations, cameras, and tech gear. Professional testing and honest comparisons to help you make informed buying decisions.',
  keywords: 'product reviews, power stations, cameras, tech reviews, buying guides, expert testing',
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
    description: 'Expert reviews of power stations, cameras, and tech gear.',
    siteName: 'Product Lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Lab - Expert Reviews You Can Trust',
    description: 'Expert reviews of power stations, cameras, and tech gear.',
    creator: '@productlab',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://productlab.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
      </head>
        <body className="antialiased">
        <div className="w-full lg:w-3/4 lg:mx-auto px-6">
        <Header />
        {children}
        <Footer />
        </div>
      </body>
    </html>
  );
}
