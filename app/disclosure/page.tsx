import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Product Lab',
  description:
    'How Product Lab makes money, what an affiliate link is, and why commissions do not affect our scores or rankings.',
  alternates: { canonical: `${SITE_URL}/disclosure` },
};

export default function DisclosurePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Affiliate disclosure' }]} />

      <article className="mt-5">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">Affiliate disclosure</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          Product Lab is reader-supported. Some links on this site are affiliate links, which means
          we may earn a commission if you buy something after clicking one. It never costs you
          extra, and a link only earns us anything when we have an active partnership with that
          retailer.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">What that means in practice</h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-primary">
                •
              </span>
              <span>
                Retailer buttons and price links on our reviews and buying guides carry an
                affiliate tag when we have a partnership with that retailer. Where we do not, the
                link still works — we simply earn nothing from it.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-primary">
                •
              </span>
              <span>
                You pay the same price you would pay going to the retailer directly. The commission
                comes out of the retailer&apos;s margin, not your wallet.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-primary">
                •
              </span>
              <span>
                We also run display advertising. Ad placement is automated and advertisers have no
                input into editorial content.
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Why it does not change our scores</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Scores come from a fixed rubric and are set during editorial review, before retailer
            links are attached to an article. Commission rates are not an input to that rubric, and
            ranking order in our guides follows the scores. A product with no affiliate program
            available can and does win a category.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            We do not accept payment for coverage, for a higher score, or for placement in a
            ranking. Brands do not see reviews before publication. You can read the full process on
            our{' '}
            <a href="/methodology" className="text-primary hover:underline">
              methodology page
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Prices and availability</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Prices change constantly. Any price shown on this site is the price at the time of
            writing or of the last update, and the retailer&apos;s current price is authoritative.
            Always confirm the price and the exact model on the retailer&apos;s page before buying.
          </p>
        </section>
      </article>
    </main>
  );
}
