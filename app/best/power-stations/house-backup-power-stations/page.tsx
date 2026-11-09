import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PowerStationRuntimeCalculator } from '@/components/PowerStationRuntimeCalculator';
import { QuickPickStrip } from '@/components/guides/QuickPickStrip';
import { RankedProductCard } from '@/components/RankedProductCard';
import { SectionLabel } from '@/components/SectionLabel';
import {
  getAllPowerStations,
  getQuickPicks,
  parseStationAcOutputW,
  type PowerStationEntry,
} from '@/lib/power-station-data';

export const metadata: Metadata = {
  alternates: { canonical: '/best/power-stations/house-backup-power-stations' },
  title: 'Power Stations for Home Backup During Outages',
  description:
    'Compare high-capacity battery stations for selected home backup loads. Check output, capacity, expansion, and connection requirements.',
};

function capacityWh(station: PowerStationEntry): number {
  if (station.capacityWh > 0) return station.capacityWh;
  const capacity = Object.entries(station.specs).find(([name]) =>
    /^(battery )?capacity$/i.test(name),
  )?.[1];
  const match = capacity?.match(/([\d,]+)\s*wh/i);
  return match ? Number(match[1].replace(/,/g, '')) : 0;
}

export default function HomeBackupPowerStationsPage() {
  const matchingStations = getAllPowerStations()
    .map((station) => ({ station, capacityWh: capacityWh(station) }))
    .filter(
      ({ station, capacityWh: capacity }) =>
        capacity >= 2000 || station.features.includes('home-backup'),
    )
    .map(({ station }) => station);
  const stations = matchingStations.slice(0, 12);
  const quickPicks = getQuickPicks(stations).map((pick) => ({
    ...pick,
    price: undefined,
    reason:
      'Ranked from the current home-backup review set. Confirm the price and model specs in the article.',
  }));
  const runtimeStations = stations.map((station) => ({
    slug: station.slug,
    name: station.title,
    capacityWh: capacityWh(station),
    outputW: parseStationAcOutputW(station.specs),
    score: station.score,
  }));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Best Of', href: '/best' },
          { label: 'Power Stations', href: '/best/power-stations' },
          { label: 'Home Backup' },
        ]}
      />
      <header className="bg-primary px-6 py-9 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Power stations by use case</SectionLabel>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Power Stations for Home Backup
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">
            Compare higher-capacity reviewed models for selected essential loads during an outage. A
            portable station does not automatically power an entire house; confirm your loads,
            output, runtime, and connection method.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-content space-y-6 px-4 py-8 sm:px-6">
        <PowerStationRuntimeCalculator stations={runtimeStations} />
        {quickPicks.length > 0 && <QuickPickStrip picks={quickPicks} />}
        <section>
          <SectionLabel>Higher-capacity reviews</SectionLabel>
          <h2 className="mb-2 text-xl font-bold text-neutral-900">
            Top {stations.length} of {matchingStations.length} matching reviews by rubric score
          </h2>
          <p className="mb-4 text-sm text-neutral-600">
            Includes models with at least 2,000Wh rated capacity or a home-backup feature. Listed
            prices come from the review and are not live quotes.
          </p>
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
            <p className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
              No matching product reviews are available yet.{' '}
              <Link href="/best/power-stations" className="font-semibold text-primary">
                Compare all reviewed power stations.
              </Link>
            </p>
          )}
        </section>
        <aside className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <strong>Home wiring safety:</strong> Never connect a power station to house wiring through
          an ordinary wall outlet. Use only a manufacturer-approved connection method and qualified
          electrical help for transfer equipment or panel integration. Fuel generators must be
          operated outdoors according to their safety instructions.
        </aside>
      </main>
    </div>
  );
}
