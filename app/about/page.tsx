import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CATEGORIES } from '@/lib/taxonomy';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'About Product Lab',
  description:
    'Who we are, what we cover, and the standards behind every Product Lab review and buying guide.',
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      <article className="mt-5">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">About Product Lab</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          Product Lab exists to answer one question well: which of these should I actually buy? Most
          product coverage either restates a spec sheet or ranks whatever pays best. We would rather
          publish fewer reviews that commit to a recommendation and explain the trade-off behind it.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">What we cover</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            We focus on categories where the choice is genuinely hard — where products look
            interchangeable on paper and differ sharply in use.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <a
                  href={`/best/${category.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <span aria-hidden="true">{category.icon}</span>
                  <span>{category.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">How we work</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Every review is built from an evidence brief, checked against a fixed rubric, and held to
            objective publish thresholds covering depth, competitive comparison and originality. A
            draft that misses any of them is revised rather than published. The full process and the
            current thresholds are documented on{' '}
            <a href="/methodology" className="text-primary hover:underline">
              our methodology page
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Independence</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            We are reader-supported through affiliate links and display advertising. No brand can pay
            for coverage, a score, or a ranking position, and scores are fixed before retailer links
            are attached. See the{' '}
            <a href="/disclosure" className="text-primary hover:underline">
              affiliate disclosure
            </a>{' '}
            for specifics.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Get in touch</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Corrections, product suggestions and questions about a review are all welcome. If
            something in a review is wrong, tell us and we will fix it in place.
          </p>
        </section>
      </article>
    </main>
  );
}
