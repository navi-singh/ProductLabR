import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { Newsletter } from '@/components/Newsletter';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { getComparisons, type Comparison } from '@/lib/comparisons';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Head-to-Head Comparisons | Product Lab',
  description:
    'Side-by-side product comparisons from Product Lab. When two products are close, we put them directly against each other and pick one.',
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default function ComparePage() {
  const comparisons = getComparisons();
  const byCategory = comparisons.reduce<Record<string, Comparison[]>>((acc, comparison) => {
    (acc[comparison.categoryName] ??= []).push(comparison);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Comparisons' }]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Head to head</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Comparisons</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Two products, one recommendation. When the specs are close enough that a ranking does
            not settle it, we put them side by side and commit to an answer.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-8">
            {Object.entries(byCategory).map(([categoryName, items]) => (
              <section key={categoryName}>
                <SectionLabel>{categoryName}</SectionLabel>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {items.map((comparison) => (
                    <li key={comparison.href}>
                      <Link
                        href={comparison.href}
                        className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:border-primary/40 hover:shadow-md"
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                          Head to head
                        </span>
                        <span className="mt-1.5 text-sm font-semibold leading-snug text-neutral-900">
                          {comparison.title}
                        </span>
                        <span className="mt-auto pt-3 text-xs font-semibold text-primary">
                          Read the comparison →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {comparisons.length === 0 && (
              <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
                No comparisons published yet.
              </p>
            )}

            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h2 className="text-sm font-bold text-neutral-900">Not sure where to start?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                If you have not narrowed it to two products yet, the category guides rank everything
                we have tested.
              </p>
              <Link
                href="/best"
                className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
              >
                Browse the buying guides →
              </Link>
            </div>

            <AffiliateDisclosure variant="box" />
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Explore
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/reviews"
                    className="block rounded-md px-3 py-2 text-neutral-700 hover:bg-primary-lightest"
                  >
                    All reviews
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best"
                    className="block rounded-md px-3 py-2 text-neutral-700 hover:bg-primary-lightest"
                  >
                    Buying guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="block rounded-md px-3 py-2 text-neutral-700 hover:bg-primary-lightest"
                  >
                    How we test
                  </Link>
                </li>
              </ul>
            </div>

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
