import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Newsletter } from '@/components/Newsletter';
import { getStationsBySlugs } from '@/lib/power-station-data';

export const metadata: Metadata = {
  title: 'EcoFlow Delta Pro Ultra X vs Anker SOLIX E10: Which Whole-Home System Wins? (2025)',
  description: 'Side-by-side comparison of the EcoFlow Delta Pro Ultra X and Anker SOLIX E10 whole-home backup systems. Expert analysis.',
};

export default function CompareEcoflowDeltaProUltraXVsAnkerSolixE10() {
  const [a, b] = getStationsBySlugs(['ecoflow_delta_pro_ultra_x', 'anker_solix_e10']);
  if (!a || !b) return null;
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Power Stations', href: '/best/power-stations' },
        { label: 'Compare' },
        { label: 'Delta Pro Ultra X vs SOLIX E10' },
      ]} />
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <div>
              <SectionLabel>Head-to-Head</SectionLabel>
              <h1 className="text-2xl font-extrabold text-neutral-900 mb-6">EcoFlow Delta Pro Ultra X vs Anker SOLIX E10</h1>
              <ComparisonCard
                a={a}
                b={b}
                verdict="The EcoFlow Delta Pro Ultra X wins on raw inverter power (12kW vs 7.6kW) and solar input (10kW vs 9kW), making it the choice for the largest residential solar arrays. The Anker SOLIX E10 wins on installation simplicity (wireless battery connections), silent operation (passive cooling), and surge capacity (37kW vs inconsistent EcoFlow surge handling). For most homeowners, the Anker's installation advantage makes it the better choice."
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
                <li><Link href="/best/power-stations/compare/bluetti-elite-200-v2-vs-anker-solix-c2000-gen2" className="text-neutral-600 hover:text-primary">Bluetti Elite 200 V2 vs Anker C2000 Gen 2 →</Link></li>
              </ul>
            </div>
            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
