import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { GATES } from '@/lib/editorial-standards';
import { SITE_URL } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'How We Test and Score | Product Lab',
  description:
    'The rubric, evidence rules and automated quality gate every Product Lab review must clear before it is published.',
  alternates: { canonical: `${SITE_URL}/methodology` },
};

const RUBRIC = [
  {
    name: 'Real-world performance',
    detail:
      'How the product behaves in the situations people actually buy it for, not just on a spec sheet. Sustained output, battery endurance, thermal behaviour and measured throughput carry more weight than peak numbers.',
  },
  {
    name: 'Design and build',
    detail:
      'Materials, serviceability, port selection, controls and how well the hardware holds up to repeated handling.',
  },
  {
    name: 'Value',
    detail:
      'Scored against current street price and the closest competitors, not MSRP. A product can lose points purely for being outpriced by an equivalent rival.',
  },
  {
    name: 'Ecosystem and software',
    detail:
      'App quality, update history, subscription requirements and how much the product depends on a vendor service that could change.',
  },
];

const PIPELINE = [
  {
    step: 'Audit',
    detail:
      'Every published review is scored continuously for depth, evidence density and originality. Anything that regresses re-enters the queue.',
  },
  {
    step: 'Evidence brief',
    detail:
      'Specifications, pricing and measurements are collected from manufacturer documentation and established testing outlets before any prose is written.',
  },
  {
    step: 'Draft',
    detail:
      'The review is written against the evidence brief, with a mandatory competitive comparison and an explicit "who should buy" verdict.',
  },
  {
    step: 'Editorial review',
    detail:
      'A second pass checks that the piece answers a real buying question, commits to a recommendation, and does not hedge.',
  },
  {
    step: 'Fact check',
    detail:
      'Claims, specifications and retailer links are verified. Unverifiable claims are cut rather than softened.',
  },
  {
    step: 'Quality gate',
    detail:
      'An automated gate blocks publication until the thresholds below are met. It is a hard gate, not a warning.',
  },
];

export default function MethodologyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'How we test' }]} />

      <article className="mt-5">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">How we test and score</h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          A review is only useful if you can tell how it was produced. This page describes the
          rubric we score against, the process every review goes through, and the objective
          thresholds a review must clear before it goes live.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">What we score</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Each review carries a breakdown rather than a single opaque number, so you can weight
            the dimensions that matter to you. A product that scores well on value and poorly on
            software is a different recommendation than the reverse, even at the same overall score.
          </p>
          <dl className="mt-4 space-y-4">
            {RUBRIC.map((item) => (
              <div key={item.name} className="rounded-lg border border-neutral-200 p-4">
                <dt className="text-sm font-semibold text-neutral-900">{item.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-neutral-600">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">How a review is produced</h2>
          <ol className="mt-4 space-y-4">
            {PIPELINE.map((stage, index) => (
              <li key={stage.step} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-neutral-900">{stage.step}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-neutral-600">
                    {stage.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">The publish gate</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            These are the current thresholds. A draft that misses any one of them is sent back for
            revision rather than published with a caveat.
          </p>
          <ul className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
            <li className="flex items-baseline justify-between gap-4 p-3 text-sm">
              <span className="text-neutral-600">Minimum length</span>
              <span className="font-semibold text-neutral-900">{GATES.minWords} words</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 p-3 text-sm">
              <span className="text-neutral-600">Distinct sections</span>
              <span className="font-semibold text-neutral-900">{GATES.minH2Sections}</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 p-3 text-sm">
              <span className="text-neutral-600">Answered buyer questions</span>
              <span className="font-semibold text-neutral-900">{GATES.minFaqPairs}</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 p-3 text-sm">
              <span className="text-neutral-600">Named competitors compared</span>
              <span className="font-semibold text-neutral-900">{GATES.minNamedCompetitors}</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 p-3 text-sm">
              <span className="text-neutral-600">Concrete numeric claims</span>
              <span className="font-semibold text-neutral-900">{GATES.minNumericClaims}</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 p-3 text-sm">
              <span className="text-neutral-600">Maximum similarity to any other review</span>
              <span className="font-semibold text-neutral-900">
                {Math.round(GATES.maxCorpusSimilarity * 100)}%
              </span>
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            The similarity ceiling exists to stop near-duplicate reviews. If two products genuinely
            warrant the same analysis, they belong in one comparison, not two reviews.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">How we make money</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Product Lab is reader-supported through affiliate links and display advertising. We do
            not accept payment for coverage, for a higher score, or for a place in a ranking, and
            advertisers get no advance sight of a review. Scores are set before retailer links are
            attached. Read the full{' '}
            <a href="/disclosure" className="text-primary hover:underline">
              affiliate disclosure
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">Corrections</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            If a specification, price or claim in a review is wrong, we want to fix it. Reviews are
            revised in place and the update date on the article reflects the change.
          </p>
        </section>
      </article>
    </main>
  );
}
