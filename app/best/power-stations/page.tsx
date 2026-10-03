import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { PowerStationQuiz } from '@/components/PowerStationQuiz';
import { GuideTrustPanel } from '@/components/guides/GuideTrustPanel';
import { HowToChooseSection } from '@/components/guides/HowToChooseSection';
import { HowWeTestedPanel } from '@/components/guides/HowWeTestedPanel';
import { OtherNotableProducts } from '@/components/guides/OtherNotableProducts';
import { ProductComparisonTable } from '@/components/guides/ProductComparisonTable';
import { QuickPickStrip } from '@/components/guides/QuickPickStrip';
import { firstAvailableSpec, productNameFromTitle, type ComparisonRow } from '@/lib/guide-data';
import {
  getAllPowerStations,
  getQuickPicks,
  getStationsByFeature,
  getStationsUnderPrice,
  summarizeStations,
  type PowerStationEntry,
} from '@/lib/power-station-data';

export const metadata: Metadata = {
  alternates: { canonical: '/best/power-stations' },
  title: 'Best Power Stations 2025 - Expert Reviews & Buying Guides',
  description:
    'Expert-reviewed portable power solutions for every need and budget. From camping power stations to whole-home backup systems.',
};

type HubCard = {
  title: string;
  description: string;
  href: string;
  count: number;
  priceRange: string;
  features: string[];
};

function dedupeBySlug(entries: PowerStationEntry[]): PowerStationEntry[] {
  return entries.filter((s, i, arr) => arr.findIndex((x) => x.slug === s.slug) === i);
}

/**
 * Hub cards are built at render time so the advertised coverage always matches
 * what the hub itself will select. The four curated hubs still carry literal
 * stats because their line-ups are hand-picked inside their own page files
 * rather than derived from a feature tag.
 */
function getHubCards(): HubCard[] {
  const solar = dedupeBySlug([
    ...getStationsByFeature('solar'),
    ...getStationsByFeature('solar-kit'),
  ]);

  return [
    {
      title: 'Portable Power Stations',
      description: 'Versatile power stations for camping, emergencies, and outdoor activities',
      href: '/best/power-stations/portable-power-stations',
      count: 7,
      priceRange: '$429 – $3,699',
      features: ['500Wh – 1,500Wh', 'Multiple ports', 'Solar charging', 'Portable design'],
    },
    {
      title: 'House Backup Power Stations',
      description: 'High-capacity units for whole-home backup during outages',
      href: '/best/power-stations/house-backup-power-stations',
      count: 4,
      priceRange: '$1,199 – $7,699',
      features: ['3,000Wh+', 'Home integration', '240V capable', 'Extended runtime'],
    },
    {
      title: 'RV Power Stations',
      description:
        'Power stations with genuine 30A outlets and solar charging for RV and trailer use',
      href: '/best/power-stations/rv-power-stations',
      ...summarizeStations(getStationsByFeature('30a-rv')),
      features: ['30A RV outlet', 'Solar ready', 'High capacity', 'Expandable'],
    },
    {
      title: 'Solar Generators',
      description: 'High solar input units for off-grid and solar-primary setups',
      href: '/best/power-stations/solar-generators',
      ...summarizeStations(solar),
      features: ['800W+ solar', 'LiFePO4 battery', 'Off-grid ready', 'MPPT charging'],
    },
    {
      title: 'Camping Power Stations',
      description: 'Compact and lightweight power solutions for outdoor adventures',
      href: '/best/power-stations/camping-power-stations',
      count: 5,
      priceRange: '$199 – $999',
      features: ['200Wh – 1,000Wh', 'Ultra-portable', 'Weather resistant', 'Silent operation'],
    },
    {
      title: 'Van Life Power Stations',
      description: 'Compact, solar-capable units under 30 lbs built for life on the road',
      href: '/best/power-stations/van-life',
      ...summarizeStations(getStationsByFeature('van-life')),
      features: ['Under 30 lbs', 'Solar capable', 'Compact', 'DC output'],
    },
    {
      title: 'Under $500',
      description: 'Best portable power stations for every budget under $500',
      href: '/best/power-stations/under-500',
      ...summarizeStations(getStationsUnderPrice(500)),
      features: ['Budget friendly', 'Essential features', 'Portable', 'Reliable brands'],
    },
    {
      title: 'Under $1,000',
      description: 'Mid-range power stations offering the best value per dollar',
      href: '/best/power-stations/under-1000',
      ...summarizeStations(getStationsUnderPrice(1000)),
      features: ['Best value', 'Mid-range', '500Wh – 2,000Wh', 'Expert picks'],
    },
    {
      title: '240V Power Stations',
      description: 'Power stations with split-phase 240V output for dryers, AC, and EV charging',
      href: '/best/power-stations/240v-power-stations',
      ...summarizeStations(getStationsByFeature('240v')),
      features: ['240V output', 'Split-phase', 'Heavy loads', 'Home backup'],
    },
    {
      title: 'CPAP Power Stations',
      description: 'Quiet, lightweight power stations with enough capacity for overnight CPAP use',
      href: '/best/power-stations/for-cpap',
      ...summarizeStations(getStationsByFeature('cpap')),
      features: ['500–1,500Wh', 'Quiet operation', 'DC mode', 'Compact'],
    },
    {
      title: 'Carry-On Power Stations',
      description: 'TSA-approved power banks for travel and airline carry-on',
      href: '/best/power-stations/carry-on-power-stations',
      count: 3,
      priceRange: '$99 – $399',
      features: ['Under 100Wh', 'TSA compliant', 'Compact design', 'Fast charging'],
    },
  ];
}

const comparisonColumns = [
  { key: 'capacity', label: 'Battery' },
  { key: 'output', label: 'Output' },
  { key: 'solar', label: 'Solar Input' },
  { key: 'chemistry', label: 'Chemistry' },
  { key: 'weight', label: 'Weight' },
];

function featureLabel(feature: string | undefined): string | undefined {
  const labels: Record<string, string> = {
    cpap: 'CPAP',
    '30a-rv': 'RV',
    'van-life': 'Van Life',
    '240v': '240V',
    solar: 'Solar Charging',
    'solar-kit': 'Solar Kit',
  };
  if (feature && labels[feature]) return labels[feature];

  return feature
    ?.split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stationComparisonRow(station: PowerStationEntry, rank?: number): ComparisonRow {
  return {
    rank,
    name: productNameFromTitle(station.title),
    href: `/articles/${station.slug}`,
    score: station.score,
    price: station.price,
    bestFor: featureLabel(station.features[0]),
    keyStrength: station.pros[0],
    mainTradeoff: station.cons[0],
    specs: {
      capacity:
        firstAvailableSpec(station.specs, ['battery capacity', 'capacity']) ??
        (station.capacityWh ? `${station.capacityWh.toLocaleString('en-US')}Wh` : undefined) ??
        '—',
      output: firstAvailableSpec(station.specs, ['inverter output', 'output', 'wattage']) ?? '—',
      solar: firstAvailableSpec(station.specs, ['solar input', 'solar']) ?? '—',
      chemistry: firstAvailableSpec(station.specs, ['chemistry', 'battery type']) ?? '—',
      weight: firstAvailableSpec(station.specs, ['weight']) ?? '—',
    },
  };
}

export default function PowerStationsHub() {
  const powerStationCategories = getHubCards();
  const allStations = getAllPowerStations();
  const totalReviewed = allStations.length;
  const latestTimestamp = Math.max(
    ...allStations.map((station) => new Date(station.date).getTime()).filter(Number.isFinite),
  );
  const latestUpdate = Number.isFinite(latestTimestamp)
    ? new Date(latestTimestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : undefined;
  const quickPicks = getQuickPicks(allStations).map((pick) => ({
    ...pick,
    reason:
      pick.label === 'Best Overall'
        ? 'Highest-scoring all-around pick in the current power-station set.'
        : pick.label === 'Best Value'
          ? 'Strong score with a lower street price than the top premium units.'
          : 'Lowest-cost route into the current reviewed lineup.',
  }));
  const comparisonRows = allStations
    .slice(0, 10)
    .map((station, index) => stationComparisonRow(station, index + 1));
  const notableRows = allStations
    .slice(10, 16)
    .map((station, index) => stationComparisonRow(station, index + 11));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Best Of', href: '/best' },
          { label: 'Power Stations' },
        ]}
      />

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-featured">
        <div className="bg-gradient-to-br from-primary-lightest via-white to-neutral-50 px-6 py-10">
          <div className="mx-auto max-w-content">
            <div className="inline-flex items-center gap-2 rounded bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary shadow-sm ring-1 ring-neutral-200">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Buying Guide · Independent Evaluation
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Best Power Stations 2025
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600">
              Expert-reviewed portable power solutions for every need and budget. {totalReviewed}{' '}
              models reviewed for performance, reliability, and value.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                `${totalReviewed} Models Reviewed`,
                'Real-World Performance',
                'All Budgets Covered',
                'Zero Sponsored Reviews',
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <PowerStationQuiz />
            <QuickPickStrip picks={quickPicks} />
            <div>
              <SectionLabel>Categories</SectionLabel>
              <div className="space-y-4">
                {powerStationCategories.map((category) => (
                  <div
                    key={category.title}
                    className="rounded-xl border border-neutral-200 bg-white p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <h2 className="text-base font-bold text-neutral-900">{category.title}</h2>
                        <p className="mt-1 text-[13px] text-neutral-500">{category.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {category.features.map((feature) => (
                            <span
                              key={feature}
                              className="rounded-full bg-primary-lightest px-2.5 py-0.5 text-[11px] font-medium text-primary"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="text-xs text-neutral-400">{category.priceRange}</div>
                        <div className="text-xs text-neutral-400">
                          {category.count} models reviewed
                        </div>
                        <Link
                          href={category.href}
                          className="inline-flex items-center rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
                        >
                          View Guide →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ProductComparisonTable
              rows={comparisonRows}
              columns={comparisonColumns}
              title="Power Station Comparison Table"
              description="A fast side-by-side view of the highest-rated models before you open the individual reviews."
            />

            <HowWeTestedPanel
              title="How We Evaluate Power Stations"
              intro="Power stations are scored around the decisions that change real ownership: usable capacity, inverter output, charging flexibility, portability, battery chemistry, port layout, and value."
              metrics={[
                {
                  title: 'Capacity and runtime',
                  description:
                    'We compare usable watt-hours against the products a buyer is likely to run, not just the headline capacity printed on the box.',
                },
                {
                  title: 'Output and surge behavior',
                  description:
                    'Continuous inverter output, surge claims, and high-draw appliance use determine whether a unit belongs at camp, in an RV, or in home backup.',
                },
                {
                  title: 'Recharge flexibility',
                  description:
                    'AC charging speed, solar input, car charging, and dual-input support matter because a large battery is only useful if it can recover quickly.',
                },
                {
                  title: 'Portability and ownership',
                  description:
                    'Weight, handles, battery chemistry, expansion options, warranty context, and price per watt-hour all affect long-term value.',
                },
              ]}
            />

            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.categoryBottom}
              adFormat="auto"
              className="rounded-lg"
            />

            <HowToChooseSection
              title="How to Choose the Right Power Station"
              intro="Start with the load you need to run, then work backward through capacity, output, recharge speed, and weight. The most expensive station is not always the right station."
              advice={[
                {
                  title: 'Capacity Considerations',
                  body: 'Under 500Wh is best for phones, laptops, lights, and compact camp kits. 500–1,000Wh covers weekend use and small appliances. 1,000–2,000Wh starts to make sense for refrigerators, power tools, and RV weekends. Above 2,000Wh is where home-backup planning begins.',
                },
                {
                  title: 'Output matters as much as capacity',
                  body: 'A big battery with a weak inverter still cannot run demanding appliances. Check continuous watts, surge rating, and whether the outlets match the gear you actually plan to use.',
                },
                {
                  title: 'Do not ignore recharge speed',
                  body: 'Solar input, AC recharge time, and car-charging support decide whether the station can keep up on multi-day trips or during repeated outage cycles.',
                },
                {
                  title: 'Weight changes the use case',
                  body: 'A 70-pound unit can be excellent home backup and miserable camping gear. Treat portability as a primary spec, not an afterthought.',
                },
              ]}
            />

            <OtherNotableProducts products={notableRows} />
          </main>

          <aside className="space-y-5">
            <GuideTrustPanel
              reviewCount={totalReviewed}
              categoryName="Power Stations"
              latestUpdate={latestUpdate}
            />

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Compare Models
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000"
                    className="text-xs text-neutral-600 hover:text-primary"
                  >
                    EcoFlow Delta 3 Plus vs Anker C1000 →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2"
                    className="text-xs text-neutral-600 hover:text-primary"
                  >
                    Bluetti Elite 200 V2 vs Anker C2000 →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10"
                    className="text-xs text-neutral-600 hover:text-primary"
                  >
                    EcoFlow Delta Pro Ultra X vs Anker E10 →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Jump To
              </h3>
              <ul className="space-y-2 text-sm">
                {powerStationCategories.map((cat) => (
                  <li key={cat.href}>
                    <Link
                      href={cat.href}
                      className="text-neutral-600 hover:text-primary hover:underline"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Quick Finder
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Budget Pick', value: 'Under $500' },
                  { label: 'Best Overall', value: '$1,000–$2,000' },
                  { label: 'Home Backup', value: '$3,000+' },
                  { label: 'Travel Friendly', value: 'Under 100Wh' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-neutral-600">{item.label}</span>
                    <span className="font-medium text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <AdBanner
              adSlot={ADSENSE_CONFIG.adSlots.sidebar}
              adFormat="rectangle"
              style={{ minHeight: 250 }}
              className="rounded-lg"
            />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
