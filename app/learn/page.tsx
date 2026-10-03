import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Newsletter } from '@/components/Newsletter';
import { SectionLabel } from '@/components/SectionLabel';
import { canonicalUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Buying Advice & Learning Center | Product Lab',
  description:
    'Product Lab buying advice explains the specs, testing signals, and trade-offs that matter before you choose a product.',
  alternates: { canonical: canonicalUrl('/learn') },
};

const learningCards = [
  {
    title: 'How to choose a portable power station',
    description:
      'Start with the loads you need to run, then narrow by capacity, inverter output, recharge speed, and weight.',
    href: '/best/power-stations',
    label: 'Power stations',
  },
  {
    title: 'Battery capacity explained',
    description:
      'Why watt-hours, usable capacity, inverter losses, and battery chemistry matter more than a headline number.',
    href: '/best/power-stations',
    label: 'Explainer',
  },
  {
    title: 'What makes a good Product Lab score?',
    description:
      'How our ratings balance performance, build, usability, value, and category-specific trade-offs.',
    href: '/methodology',
    label: 'Methodology',
  },
  {
    title: 'Compare before you buy',
    description:
      'When two products look similar on paper, use side-by-side comparisons to find the actual compromise.',
    href: '/compare',
    label: 'Comparisons',
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Learning Center' }]} />

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-featured">
        <div className="bg-gradient-to-br from-primary-lightest via-white to-neutral-50 px-6 py-10">
          <div className="mx-auto max-w-content">
            <div className="inline-flex items-center gap-2 rounded bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary shadow-sm ring-1 ring-neutral-200">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Learning Center
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Buying advice that explains the trade-offs behind the rankings.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600">
              Start here when you need to understand which specs matter, which claims are mostly
              marketing, and how to choose between close products.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main>
            <SectionLabel>Buying Advice</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {learningCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
                >
                  <span className="type-label text-accent">{card.label}</span>
                  <h2 className="mt-2 text-lg font-bold leading-tight text-neutral-900">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {card.description}
                  </p>
                  <span className="mt-4 inline-block text-xs font-bold text-primary">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Start with guides
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                The Learning Center complements our ranked buying guides. Use it to understand the
                specs, then use the guides to pick a product.
              </p>
              <Link
                href="/best"
                className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
              >
                Browse buying guides →
              </Link>
            </div>
            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
