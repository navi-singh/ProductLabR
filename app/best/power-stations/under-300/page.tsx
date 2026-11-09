import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { QuickPickStrip } from '@/components/guides/QuickPickStrip';
import { RankedProductCard } from '@/components/RankedProductCard';
import { SectionLabel } from '@/components/SectionLabel';
import { getQuickPicks, getStationsUnderPrice } from '@/lib/power-station-data';

export const metadata: Metadata = {
  alternates: { canonical: '/best/power-stations/under-300' },
  title: 'Best Power Stations Under $300',
  description:
    'Compare reviewed portable power stations with listed prices under $300. Check battery capacity, continuous output, charging, and trade-offs.',
};

export default function PowerStationsUnder300Page() {
  const stations = getStationsUnderPrice(300).filter(
    (station) => !/\bnot a power station\b/i.test(station.title),
  );
  const quickPicks = getQuickPicks(stations)
    .filter(
      (pick, index, picks) =>
        picks.findIndex((candidate) => candidate.href === pick.href) === index,
    )
    .map((pick) => ({
      ...pick,
      price: undefined,
      reason:
        pick.label === 'Budget Pick'
          ? 'Lowest listed starting price among the reviewed models in this range.'
          : 'Selected from reviews with a listed starting price under $300.',
    }));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Best Of', href: '/best' },
          { label: 'Power Stations', href: '/best/power-stations' },
          { label: 'Under $300' },
        ]}
      />
      <header className="bg-primary px-6 py-9 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Power stations by budget</SectionLabel>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Best Power Stations Under $300
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">
            These reviews have a listed starting price of $300 or less. Prices change, and an
            inexpensive station may not have enough capacity or output for your appliance, so check
            both before buying.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-content space-y-6 px-4 py-8 sm:px-6">
        {quickPicks.length > 0 && <QuickPickStrip picks={quickPicks} />}
        <section>
          <SectionLabel>Reviewed models</SectionLabel>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            {stations.length} reviews in this price range
          </h2>
          {stations.length > 0 ? (
            <div className="space-y-4">
              {stations.map((station, index) => (
                <RankedProductCard
                  key={station.slug}
                  rank={index + 1}
                  name={station.title}
                  href={`/articles/${station.slug}`}
                  image={station.image}
                  summary={station.subtitle}
                  score={station.score}
                  price={station.price}
                  priceLabel="Recorded price:"
                  specs={station.specs}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-700">
                No reviews currently have a confirmed listed price under $300.
              </p>
              <Link
                href="/best/power-stations/under-500"
                className="mt-3 inline-block font-semibold text-primary underline-offset-2 hover:underline"
              >
                Browse reviews under $500 →
              </Link>
            </div>
          )}
        </section>
        <p className="text-sm leading-relaxed text-neutral-600">
          The price filter uses the starting price recorded in each review and may not reflect
          current promotions. Compare the{' '}
          <Link
            href="/best/power-stations"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            full power-station guide
          </Link>{' '}
          for models at other prices.
        </p>
      </main>
    </div>
  );
}
