import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { canonicalUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Privacy Policy | Product Lab',
  description:
    'What data Product Lab collects, how advertising and analytics cookies are used, and the choices available to you.',
  alternates: { canonical: canonicalUrl(`/privacy`) },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy policy' }]} />

      <article className="mt-5">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          Product Lab is a static website. We do not ask you to create an account and we do not
          collect personal information directly. This page explains what third parties may collect
          when you visit.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Advertising</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            We use Google AdSense to display advertising. Third-party vendors, including Google, use
            cookies to serve ads based on your prior visits to this and other websites. Google&apos;s
            use of advertising cookies enables it and its partners to serve ads to you based on your
            visit to this site and other sites on the internet.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            You can opt out of personalised advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary hover:underline"
            >
              Google Ads Settings
            </a>
            , or opt out of third-party vendor cookies at{' '}
            <a
              href="https://www.aboutads.info/choices/"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary hover:underline"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Affiliate links</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Retailer links on this site are usually affiliate links. When you follow one, the
            retailer may set a cookie to attribute any resulting purchase to us. We receive
            aggregate commission reporting from these programs; we do not receive your name, address
            or payment details. See the{' '}
            <a href="/disclosure" className="text-primary hover:underline">
              affiliate disclosure
            </a>{' '}
            for more.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Analytics and logs</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            This site is served as static files by our hosting provider, which may record standard
            request logs such as IP address, user agent and requested URL for security and
            operational purposes.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            We also use Google Analytics to understand which reviews people read and how they found
            them. It sets cookies to recognise returning visits and reports to us only in aggregate
            &mdash; page views, referring sites, approximate region and device type. We do not
            receive your name, email address or any information that identifies you personally, and
            we do not sell or share this data.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            You can prevent this collection entirely with the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="text-primary hover:underline"
            >
              Google Analytics opt-out browser add-on
            </a>
            , or by blocking cookies as described below. Blocking analytics does not affect access
            to any content on this site.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Your choices</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            You can block or delete cookies in your browser settings at any time. Blocking
            advertising cookies does not affect access to any content on this site.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Changes</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            If this policy changes materially, the updated version will be published on this page.
          </p>
        </section>
      </article>
    </main>
  );
}
