import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { PowerStationRuntimeCalculator } from '@/components/PowerStationRuntimeCalculator';
import { HowToChooseSection } from '@/components/guides/HowToChooseSection';
import { HowWeTestedPanel } from '@/components/guides/HowWeTestedPanel';
import { OtherNotableProducts } from '@/components/guides/OtherNotableProducts';
import { ProductComparisonTable } from '@/components/guides/ProductComparisonTable';
import { QuickPickStrip } from '@/components/guides/QuickPickStrip';
import {
  firstAvailableSpec,
  productNameFromTitle,
  type ComparisonRow,
  type GuideQuickPick,
} from '@/lib/guide-data';
import {
  getAllPowerStations,
  parseStationAcOutputW,
  type PowerStationEntry,
} from '@/lib/power-station-data';

export const metadata: Metadata = {
  alternates: { canonical: '/best/power-stations' },
  title: 'Best Portable Power Stations: Home Backup, Camping & More',
  description:
    'Compare portable power stations for home outages, camping, RVs, and CPAP use. Check appliance runtime estimates, output, capacity, price, and trade-offs.',
};

type HubCard = {
  title: string;
  description: string;
  href: string;
};

const useCaseGuides: HubCard[] = [
  {
    title: 'Home backup & outages',
    description: 'Compare larger systems, expandable batteries, and home-integration options.',
    href: '/best/power-stations/house-backup-power-stations',
  },
  {
    title: 'Camping',
    description: 'Find a size and output level suited to the gear you plan to bring.',
    href: '/best/power-stations/camping-power-stations',
  },
  {
    title: 'RV power',
    description: 'Focus on outlet type, continuous output, solar input, and battery capacity.',
    href: '/best/power-stations/rv-power-stations',
  },
  {
    title: 'CPAP',
    description: 'Estimate runtime using your device draw, including humidifier settings.',
    href: '/best/power-stations/for-cpap',
  },
  {
    title: 'Solar charging',
    description: 'Compare stations with solar input and solar-kit options.',
    href: '/best/power-stations/solar-generators',
  },
  {
    title: '240V output',
    description: 'For appliances and home systems that specifically require split-phase power.',
    href: '/best/power-stations/240v-power-stations',
  },
];

const budgetGuides: HubCard[] = [
  {
    title: 'Under $300',
    description: 'Smaller-capacity and entry-level options, ranked by listed price.',
    href: '/best/power-stations/under-300',
  },
  {
    title: 'Under $500',
    description: 'Compare lower-cost models and check the output limits before buying.',
    href: '/best/power-stations/under-500',
  },
  {
    title: 'Under $1,000',
    description: 'A wider range of capacities, recharge features, and inverter outputs.',
    href: '/best/power-stations/under-1000',
  },
];

const comparisonColumns = [
  { key: 'capacity', label: 'Capacity' },
  { key: 'output', label: 'AC output' },
  { key: 'solar', label: 'Solar input' },
  { key: 'pricePerWh', label: 'Listed $/Wh' },
  { key: 'ups', label: 'UPS / pass-through' },
  { key: 'expansion', label: 'Expansion' },
];

function findSpec(specs: Record<string, string>, names: RegExp): string | undefined {
  const entry = Object.entries(specs).find(([name]) => names.test(name));
  return entry?.[1];
}

function parseCapacityWh(station: PowerStationEntry): number {
  if (station.capacityWh > 0) return station.capacityWh;
  const raw = findSpec(station.specs, /^(battery )?capacity$/i);
  const match = raw?.match(/([\d,]+)\s*wh/i);
  return match ? Number(match[1].replace(/,/g, '')) : 0;
}

function formatReviewDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value || 'Date not listed';
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString(
    'en-US',
    { month: 'short', year: 'numeric' },
  );
}

function stationComparisonRow(station: PowerStationEntry, rank?: number): ComparisonRow {
  const capacityWh = parseCapacityWh(station);
  const ups = findSpec(station.specs, /^(ups|pass[- ]?through charging)$/i);
  const expansion = findSpec(station.specs, /(battery )?(expansion|expandable capacity)/i);
  return {
    rank,
    name: productNameFromTitle(station.title),
    href: `/articles/${station.slug}`,
    score: station.score,
    price: station.price,
    bestFor: formatReviewDate(station.date),
    keyStrength: station.pros[0],
    mainTradeoff: station.cons[0],
    specs: {
      capacity:
        firstAvailableSpec(station.specs, ['battery capacity', 'capacity']) ??
        (capacityWh ? `${capacityWh.toLocaleString('en-US')}Wh` : undefined) ??
        '—',
      output:
        findSpec(
          station.specs,
          /^(continuous output|ac output|rated output|inverter output|inverter power)$/i,
        ) ?? 'Not listed',
      solar: findSpec(station.specs, /^solar input$/i) ?? 'Not listed',
      pricePerWh:
        station.priceNum > 0 && capacityWh > 0
          ? `$${(station.priceNum / capacityWh).toFixed(2)}`
          : '—',
      ups: ups ?? 'Not listed',
      expansion: expansion ?? 'Not listed',
    },
  };
}

const faqItems = [
  {
    question: 'How long will a power station run a refrigerator?',
    answer:
      'It depends on the refrigerator’s average draw, how often its compressor cycles, and the station’s usable capacity. Use the runtime estimate as a starting point, then check the fridge label or measure its energy use. Also verify the station can handle compressor startup.',
  },
  {
    question: 'Can a portable power station run a house during an outage?',
    answer:
      'A portable station can run selected appliances or circuits if its output, capacity, and connection method are suitable. It does not automatically power a whole house. Follow the station maker’s instructions and use a qualified electrician for home wiring or transfer equipment.',
  },
  {
    question: 'What is the difference between a power station and a solar generator?',
    answer:
      'The terms are often used for the same battery-based product. A solar panel is an optional or bundled charging source; check whether the panel is included and whether its voltage and power are compatible with the station.',
  },
  {
    question: 'Can I use a power station as a UPS?',
    answer:
      'Only rely on a model with a documented UPS or backup mode and a switchover time appropriate for your equipment. Pass-through charging alone does not establish that it will behave like a dedicated UPS.',
  },
  {
    question: 'How much power does a CPAP need overnight?',
    answer:
      'The draw varies by device, pressure, heated humidifier, and heated hose. Check the CPAP manufacturer’s power figures or measure your setup, then enter that wattage in the runtime estimator. A heated humidifier can materially reduce runtime.',
  },
  {
    question: 'Can I take a power station on an airplane?',
    answer:
      'Many power stations are too large for passenger aircraft. Battery capacity limits and approval rules depend on the airline and applicable aviation rules; check with your carrier before travel. No product should be described as TSA-approved.',
  },
  {
    question: 'How do I choose between a power station and a gas generator?',
    answer:
      'A battery station is quiet at the point of use and can be recharged from AC or compatible solar panels, but its stored energy is finite. Fuel generators can run longer with fuel but produce exhaust and must be operated outdoors according to their safety instructions.',
  },
];

function getHubQuickPicks(entries: PowerStationEntry[]): GuideQuickPick[] {
  const used = new Set<string>();
  const picks: GuideQuickPick[] = [];

  function addPick(
    label: string,
    candidates: PowerStationEntry[],
    reason: string,
    byValuePerWh = false,
  ) {
    const available = candidates.filter(
      (station) =>
        !used.has(station.slug) &&
        (!byValuePerWh || (station.priceNum > 0 && parseCapacityWh(station) > 0)),
    );
    const station = byValuePerWh
      ? available.sort(
          (a, b) =>
            b.score / (b.priceNum / parseCapacityWh(b)) -
            a.score / (a.priceNum / parseCapacityWh(a)),
        )[0]
      : available.sort((a, b) => b.score - a.score)[0];
    if (!station) return;
    used.add(station.slug);
    picks.push({
      label,
      name: productNameFromTitle(station.title),
      href: `/articles/${station.slug}`,
      score: station.score,
      price: station.price,
      reason,
    });
  }

  const getWeightPounds = (station: PowerStationEntry): number | undefined => {
    const value = findSpec(station.specs, /weight/i);
    const match = value?.match(/([\d.]+)\s*(lb|lbs|pounds?|kg)\b/i);
    if (!match) return undefined;
    const weight = Number(match[1]);
    return match[2].toLowerCase() === 'kg' ? weight * 2.20462 : weight;
  };
  const homeBackup = entries.filter((station) => parseCapacityWh(station) >= 2000);

  addPick('Best Overall', entries, 'Highest score among the current reviews.');
  addPick(
    'Home Backup',
    homeBackup,
    'Highest-scoring reviewed model with at least 2,000Wh rated capacity.',
  );
  addPick(
    'Under $500',
    entries.filter((station) => station.priceNum > 0 && station.priceNum <= 500),
    'Highest-scoring remaining review with a listed starting price under $500.',
  );
  addPick(
    'Portable',
    entries.filter((station) => (getWeightPounds(station) ?? Infinity) < 30),
    'Highest-scoring remaining review with a listed weight under 30lb.',
  );
  addPick(
    'RV',
    entries.filter((station) => station.features.includes('30a-rv')),
    'Highest-scoring remaining review tagged for 30A RV use.',
  );
  addPick(
    'Value per Wh',
    entries,
    'Balances review score against listed starting price per rated watt-hour.',
    true,
  );

  return picks;
}

export default function PowerStationsHub() {
  const allStations = getAllPowerStations();
  const latestTimestamp = Math.max(
    ...allStations.map((station) => new Date(station.date).getTime()).filter(Number.isFinite),
  );
  const latestReview = Number.isFinite(latestTimestamp)
    ? new Date(latestTimestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : undefined;
  const quickPicks = getHubQuickPicks(allStations);
  const runtimeStations = allStations
    .map((station) => ({
      slug: station.slug,
      name: productNameFromTitle(station.title),
      capacityWh: parseCapacityWh(station),
      outputW: parseStationAcOutputW(station.specs),
      score: station.score,
    }))
    .filter((station) => station.capacityWh > 0);
  const comparisonRows = allStations
    .slice(0, 10)
    .map((station, index) => stationComparisonRow(station, index + 1));
  const notableRows = allStations
    .slice(10, 16)
    .map((station, index) => stationComparisonRow(station, index + 11));
  const brandPicks = [
    { label: 'EcoFlow', pattern: /ecoflow/i },
    { label: 'Anker SOLIX', pattern: /anker/i },
    { label: 'BLUETTI', pattern: /bluetti/i },
    { label: 'Jackery', pattern: /jackery/i },
  ]
    .map(({ label, pattern }) => ({
      label,
      station: allStations.find((station) => pattern.test(station.title)),
    }))
    .filter(
      (item): item is { label: string; station: PowerStationEntry } => item.station !== undefined,
    );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Best Of', href: '/best' },
          { label: 'Power Stations' },
        ]}
      />

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="grid gap-8 bg-primary px-6 py-9 text-white md:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)] md:items-end md:px-10">
          <div className="mx-auto max-w-content">
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Power a fridge, CPAP, or outage backup
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/80">
              Pick an appliance, enter its wattage, and compare estimated runtime against reviewed
              capacity and output.
            </p>
          </div>
          <div className="border-t border-white/20 pt-4 text-sm leading-relaxed text-white/80 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="font-semibold text-white">
              {allStations.length} product reviews · shared scoring rubric
            </p>
            <p className="mt-1">
              Evidence, sources, and known limits are explained in each review.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(16rem,3fr)]">
          <main className="space-y-6">
            <PowerStationRuntimeCalculator stations={runtimeStations} />
            <QuickPickStrip picks={quickPicks} />
            <section id="buying-guides" className="scroll-mt-6">
              <SectionLabel>Shop by use case</SectionLabel>
              <h2 className="mb-4 text-xl font-bold text-neutral-900">
                What do you need to power?
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {useCaseGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="group rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="font-semibold text-neutral-900 group-hover:text-primary">
                      {guide.title} <span aria-hidden="true">→</span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-neutral-600">
                      {guide.description}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-neutral-900">Shop by budget</h3>
                <div className="flex flex-wrap gap-2">
                  {budgetGuides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {guide.title}
                    </Link>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-600">
                Also compare{' '}
                <Link
                  href="/best/power-stations/van-life"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  van-life options
                </Link>{' '}
                and{' '}
                <Link
                  href="/best/power-stations/carry-on-power-stations"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  small power banks for travel
                </Link>
                . Airline rules vary; check with your carrier before flying with a battery.
              </p>
            </section>

            <ProductComparisonTable
              id="comparison"
              rows={comparisonRows}
              columns={comparisonColumns}
              title="Compare reviewed power stations"
              bestForLabel="Review date"
              description="The top-scoring reviews in this collection. Prices are listed starting prices and may change; a missing spec means it was not available in the review data."
            />
            <p className="-mt-4 text-xs leading-relaxed text-neutral-500">
              Listed $/Wh divides the review&apos;s starting price by rated capacity. Review dates
              are publication dates, not necessarily the date a product was last rechecked.
            </p>

            <HowWeTestedPanel
              title="How we evaluate power stations"
              intro="Reviews use a shared scoring rubric and synthesize manufacturer specifications with independent sources. We do not describe a review as hands-on testing unless that specific article documents hands-on work."
              metrics={[
                {
                  title: 'Capacity and appliance fit',
                  description:
                    'We compare rated watt-hours with likely loads and explain that usable runtime varies by device, conversion losses, and operating conditions.',
                },
                {
                  title: 'Output and surge claims',
                  description:
                    'We separate continuous output from surge ratings and note when a demanding appliance may exceed a station’s limits.',
                },
                {
                  title: 'Recharge and ownership',
                  description:
                    'We compare AC, solar, and vehicle charging, plus battery chemistry, expansion, warranty details, and listed price when sources provide them.',
                },
                {
                  title: 'Evidence and trade-offs',
                  description:
                    'Each article cites its sources and calls out unknowns. Scores summarize the rubric; they are not a substitute for checking model-specific requirements.',
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

            <section id="brand-comparisons" className="scroll-mt-6">
              <SectionLabel>Compare brands</SectionLabel>
              <h2 className="mb-2 text-xl font-bold text-neutral-900">
                Review-led picks from popular brands
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                Each link opens the highest-scoring review currently in our collection for that
                brand. The model-level details below are drawn from that review, not generalized to
                every product the brand sells. This is not a controlled, same-day head-to-head test.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {brandPicks.map(({ label, station }) => (
                  <Link
                    key={label}
                    href={`/articles/${station.slug}`}
                    className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="block text-sm font-bold text-neutral-900">{label}</span>
                    <span className="mt-1 block text-sm text-neutral-700">
                      {productNameFromTitle(station.title)}
                    </span>
                    <span className="mt-2 block text-xs text-neutral-500">
                      Score {station.score.toFixed(1)} · {station.price || 'Price not listed'} ·
                      Read review →
                    </span>
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-neutral-200 pt-3 text-xs">
                      {[
                        {
                          label: 'Capacity',
                          value:
                            firstAvailableSpec(station.specs, ['battery capacity', 'capacity']) ??
                            'Not listed',
                        },
                        {
                          label: 'AC output',
                          value:
                            findSpec(
                              station.specs,
                              /^(continuous output|ac output|rated output|inverter output|inverter power)$/i,
                            ) ?? 'Not listed',
                        },
                        {
                          label: 'Chemistry',
                          value:
                            findSpec(station.specs, /battery chemistry|chemistry/i) ?? 'Not listed',
                        },
                        {
                          label: 'Warranty',
                          value: findSpec(station.specs, /warranty/i) ?? 'Not listed',
                        },
                        {
                          label: 'App',
                          value: findSpec(station.specs, /app( control)?/i) ?? 'Not listed',
                        },
                        {
                          label: 'Expansion',
                          value:
                            findSpec(
                              station.specs,
                              /(battery )?(expansion|expandable capacity)/i,
                            ) ?? 'Not listed',
                        },
                      ].map((spec) => (
                        <div key={spec.label} className="min-w-0">
                          <dt className="font-semibold text-neutral-500">{spec.label}</dt>
                          <dd className="mt-0.5 break-words text-neutral-800">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Link>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
                <h3 className="text-sm font-bold text-neutral-900">Head-to-head reviews</h3>
                <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    {
                      label: 'EcoFlow Delta 3 Plus vs Anker SOLIX C1000',
                      href: '/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000',
                    },
                    {
                      label: 'BLUETTI Elite 200 V2 vs Anker SOLIX C2000 Gen 2',
                      href: '/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2',
                    },
                    {
                      label: 'EcoFlow Delta Pro Ultra X vs Anker SOLIX E10',
                      href: '/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10',
                    },
                  ].map((comparison) => (
                    <li key={comparison.href}>
                      <Link
                        href={comparison.href}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {comparison.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="power-options" className="scroll-mt-6">
              <SectionLabel>Understand the options</SectionLabel>
              <h2 className="mb-4 text-xl font-bold text-neutral-900">
                Power station vs. generator, UPS, or power bank
              </h2>
              <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white px-4">
                {[
                  {
                    title: 'Gas generator',
                    body: 'A battery station is quiet at the point of use and stores a finite amount of energy. A fuel generator can run while fuel is available, but produces exhaust and must be used outdoors.',
                  },
                  {
                    title: 'UPS',
                    body: 'A UPS is designed for backup switching and power conditioning. Use a power station for that job only when the exact model documents a suitable UPS mode and transfer time.',
                  },
                  {
                    title: 'Power bank',
                    body: 'Small USB power banks are for personal electronics. Portable power stations typically add larger batteries and AC outlets, but their size and weight vary widely.',
                  },
                  {
                    title: 'Solar generator',
                    body: 'The label often describes a battery power station paired with solar panels. Check what is included and verify panel compatibility rather than assuming a panel comes in the box.',
                  },
                  {
                    title: 'Installed home battery (such as Tesla Powerwall)',
                    body: 'An installed home battery is designed around fixed home wiring and installation; a portable station is a movable unit with model-specific capacity and output. Compare the circuits, installation, and runtime you need rather than treating them as direct equivalents.',
                  },
                ].map((item) => (
                  <div key={item.title} className="py-4 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-4">
                    <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600 sm:mt-0">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="power-station-faq" className="scroll-mt-6">
              <SectionLabel>Common questions</SectionLabel>
              <h2 className="mb-4 text-xl font-bold text-neutral-900">
                Power station questions, answered
              </h2>
              <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white px-4">
                {faqItems.map((item) => (
                  <details key={item.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                      {item.question}
                      <span className="text-primary group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: faqItems.map((item) => ({
                      '@type': 'Question',
                      name: item.question,
                      acceptedAnswer: { '@type': 'Answer', text: item.answer },
                    })),
                  }).replace(/</g, '\\u003c'),
                }}
              />
            </section>

            <OtherNotableProducts products={notableRows} />
          </main>

          <aside className="space-y-5">
            <section className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                About this guide
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {allStations.length} product reviews use a shared scoring rubric. Check each review
                for its sources, known limits, and evidence type.
              </p>
              <p className="mt-3 text-xs text-neutral-500">
                Latest review published {latestReview ?? 'date unavailable'}; this is not a page
                refresh date.
              </p>
            </section>

            <nav
              aria-label="On this page"
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                On this page
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#runtime-calculator" className="text-neutral-600 hover:text-primary">
                    Runtime estimator
                  </a>
                </li>
                <li>
                  <a href="#buying-guides" className="text-neutral-600 hover:text-primary">
                    Shop by use case
                  </a>
                </li>
                <li>
                  <a href="#comparison" className="text-neutral-600 hover:text-primary">
                    Compare models
                  </a>
                </li>
                <li>
                  <a href="#brand-comparisons" className="text-neutral-600 hover:text-primary">
                    Brand reviews
                  </a>
                </li>
                <li>
                  <a href="#power-options" className="text-neutral-600 hover:text-primary">
                    Power options explained
                  </a>
                </li>
                <li>
                  <a href="#power-station-faq" className="text-neutral-600 hover:text-primary">
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>

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
