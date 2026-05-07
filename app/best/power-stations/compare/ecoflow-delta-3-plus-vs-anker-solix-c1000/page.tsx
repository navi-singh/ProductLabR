import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Newsletter } from '@/components/Newsletter';
import { getStationsBySlugs } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'EcoFlow Delta 3 Plus vs Anker SOLIX C1000: Which Should You Buy? (2025)',
  description: 'Side-by-side comparison of the EcoFlow Delta 3 Plus and Anker SOLIX C1000. Expert analysis of specs, performance, and value.',
};

export default function CompareEcoflowDelta3PlusVsAnkerC1000() {
  const [a, b] = getStationsBySlugs(['ecoflow_delta_3_plus', 'anker_solix_c1000']);
  if (!a || !b) return null;
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Compare' },
        { label: 'Delta 3 Plus vs C1000' },
      ]} />
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <div>
              <SectionLabel>Head-to-Head</SectionLabel>
              <h1 className="text-2xl font-extrabold text-neutral-900 mb-6">EcoFlow Delta 3 Plus vs Anker SOLIX C1000</h1>
              <ComparisonCard
                a={a}
                b={b}
                verdict="The EcoFlow Delta 3 Plus wins on UPS functionality, X-Boost technology, and ecosystem depth — worth the premium for home backup users who need smart home integration. The Anker SOLIX C1000 Gen 2 wins on value: nearly identical capacity at $449 with faster charging and better solar input. For most buyers prioritizing cost, Anker is the smarter choice."
                buyA={a.retailerLinks?.Amazon ?? '#'}
                buyB={b.retailerLinks?.Amazon ?? '#'}
              />
            </div>
          </main>
          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Also Compare</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2" className="text-neutral-600 hover:text-primary">Bluetti Elite 200 V2 vs Anker C2000 Gen 2 →</Link></li>
                <li><Link href="/best/power-stations/compare/ecoflow-delta-pro-ultra-x-vs-anker-solix-e10" className="text-neutral-600 hover:text-primary">EcoFlow Delta Pro Ultra X vs Anker SOLIX E10 →</Link></li>
              </ul>
            </div>
            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
