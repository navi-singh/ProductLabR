import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Newsletter } from '@/components/Newsletter';
import { getStationsBySlugs } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'Bluetti Elite 200 V2 vs Anker SOLIX C2000 Gen 2: Which Should You Buy? (2025)',
  description: 'Side-by-side comparison of the Bluetti Elite 200 V2 and Anker SOLIX C2000 Gen 2. Expert analysis of efficiency, solar input, and value.',
};

export default function CompareBluettiElite200V2VsAnkerC2000Gen2() {
  const [a, b] = getStationsBySlugs(['bluetti_elite_200_v2', 'anker_solix_c2000_gen2']);
  if (!a || !b) return null;
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Compare' },
        { label: 'Elite 200 V2 vs C2000 Gen 2' },
      ]} />
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <div>
              <SectionLabel>Head-to-Head</SectionLabel>
              <h1 className="text-2xl font-extrabold text-neutral-900 mb-6">Bluetti Elite 200 V2 vs Anker SOLIX C2000 Gen 2</h1>
              <ComparisonCard
                a={a}
                b={b}
                verdict="The Bluetti Elite 200 V2 wins on efficiency (94% vs 89%) and solar input (1,000W vs 800W) — the right pick if you cycle daily or rely heavily on solar. The Anker SOLIX C2000 Gen 2 wins on price ($799 vs $1,099), display quality, outlet count, and weight — the better all-rounder for most buyers. If budget is the priority, Anker wins clearly."
                buyA={a.retailerLinks?.Amazon ?? '#'}
                buyB={b.retailerLinks?.Amazon ?? '#'}
              />
            </div>
          </main>
          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Also Compare</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/power-stations/compare/ecoflow-delta-3-plus-vs-anker-solix-c1000" className="text-neutral-600 hover:text-primary">EcoFlow Delta 3 Plus vs Anker SOLIX C1000 →</Link></li>
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
