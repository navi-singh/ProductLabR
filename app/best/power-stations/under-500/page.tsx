import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import { getStationsUnderPrice, getQuickPicks } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'Best Portable Power Stations Under $500 (2025)',
  description: 'The best portable power stations under $500 — expert tested for value, reliability, and real-world performance.',
};

export default function Under500Page() {
  const stations = getStationsUnderPrice(500);
  const quickPicks = getQuickPicks(stations);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Under $500' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Portable Power Stations Under $500</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Expert-tested portable power stations under $500 — ranked for value, reliability, and real-world performance at every price tier.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Under $500', 'Best Value', 'Expert Tested'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <QuickPicks picks={quickPicks} />

            <div>
              <SectionLabel>Ranked List</SectionLabel>
              <div className="space-y-4">
                {stations.map((station, i) => (
                  <div key={station.slug}>
                    <RankedProductCard
                      rank={i + 1}
                      name={station.title}
                      href={`/articles/${station.slug}`}
                      image={station.image}
                      summary={station.subtitle}
                      score={station.score}
                      specs={station.specs}
                    />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Buying Guide</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Choosing a Power Station Under $500</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'What You Get at Each Price Point',
                    items: [
                      '$99–$199: USB/DC only, 100–200Wh, no AC outlet',
                      '$200–$350: Small AC outlet, 200–400Wh, limited ports',
                      '$350–$500: 500–700Wh, proper AC outlets, solar input',
                    ],
                  },
                  {
                    title: 'Budget vs Mid-Range Trade-offs',
                    items: [
                      'Budget units often use Li-ion vs LiFePO4 (shorter lifespan)',
                      'Fewer AC outlets and lower wattage output',
                      'Solar input often proprietary or absent',
                      'Warranty typically shorter (1 year vs 2–5 years)',
                    ],
                  },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-2 text-sm font-semibold text-primary">{section.title}</h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item} className="text-xs text-neutral-600">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {stations.slice(0, 8).map((s, i) => (
                  <li key={s.slug}>
                    <a href={`#rank-${i + 1}`} className="text-neutral-600 hover:text-primary">
                      #{i + 1} {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Price Band Comparison</h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <p><strong>$99–$199:</strong> USB and DC only, 100–200Wh. Good for charging phones and small devices.</p>
                <p><strong>$200–$350:</strong> Small AC outlet, 200–400Wh. Powers small appliances for short periods.</p>
                <p><strong>$350–$500:</strong> 500–700Wh with proper AC outlets and solar input. Handles real-world camping loads.</p>
              </div>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
