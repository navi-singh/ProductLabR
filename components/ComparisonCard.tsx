// components/ComparisonCard.tsx
import { PowerStationEntry } from '@/lib/power-station-data';
import { OptimizedImage } from './OptimizedImage';
import { ScoreBadge } from './ScoreBadge';

interface ComparisonCardProps {
  a: PowerStationEntry;
  b: PowerStationEntry;
  verdict: string;
  buyA: string;
  buyB: string;
}

type SpecRow = { label: string; keyA: string; keyB: string; higherIsBetter: boolean };

const SPEC_ROWS: SpecRow[] = [
  { label: 'Capacity', keyA: 'Battery Capacity', keyB: 'Battery Capacity', higherIsBetter: true },
  { label: 'Inverter', keyA: 'Inverter Power', keyB: 'Inverter Power', higherIsBetter: true },
  { label: 'Solar Input', keyA: 'Solar Input', keyB: 'Solar Input', higherIsBetter: true },
  { label: 'Weight', keyA: 'Weight', keyB: 'Weight', higherIsBetter: false },
  { label: 'Efficiency', keyA: 'Efficiency', keyB: 'Efficiency', higherIsBetter: true },
];

function extractNum(val: string | undefined): number {
  if (!val) return 0;
  const match = val.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function ComparisonCard({ a, b, verdict, buyA, buyB }: ComparisonCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 divide-x divide-neutral-200">
        {[{ entry: a, buyUrl: buyA }, { entry: b, buyUrl: buyB }].map(({ entry, buyUrl }) => (
          <div key={entry.slug} className="p-5 flex flex-col items-center text-center gap-3">
            <div className="relative h-32 w-full">
              <OptimizedImage src={entry.image} alt={entry.title} fill sizes="250px" className="object-contain" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">{entry.title}</h3>
            <div className="flex items-center gap-2">
              <ScoreBadge score={entry.score} showLabel />
              <span className="font-bold text-neutral-900">{entry.price}</span>
            </div>
            <a href={buyUrl} target="_blank" rel="noopener noreferrer nofollow"
              className="inline-flex items-center rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent/90">
              Buy Now →
            </a>
          </div>
        ))}
      </div>

      {/* Spec table */}
      <div className="border-t border-neutral-200">
        <table className="w-full text-xs">
          <tbody>
            {SPEC_ROWS.map((row) => {
              const valA = a.specs?.[row.keyA] ?? '—';
              const valB = b.specs?.[row.keyB] ?? '—';
              const numA = extractNum(valA);
              const numB = extractNum(valB);
              const aWins = numA !== numB && (row.higherIsBetter ? numA > numB : numA < numB);
              const bWins = numA !== numB && (row.higherIsBetter ? numB > numA : numB < numA);
              return (
                <tr key={row.label} className="border-t border-neutral-100">
                  <td className={`px-4 py-2.5 font-medium ${aWins ? 'bg-green-50 text-green-700' : 'text-neutral-700'}`}>{valA}</td>
                  <td className="px-4 py-2.5 text-center text-neutral-400 text-[10px] font-semibold uppercase">{row.label}</td>
                  <td className={`px-4 py-2.5 font-medium text-right ${bWins ? 'bg-green-50 text-green-700' : 'text-neutral-700'}`}>{valB}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200">
        {[a, b].map((entry) => (
          <div key={entry.slug} className="p-4 space-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600 mb-1">Pros</p>
              <ul className="space-y-0.5">{entry.pros.slice(0, 3).map((p) => <li key={p} className="text-xs text-neutral-600">+ {p}</li>)}</ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-500 mb-1">Cons</p>
              <ul className="space-y-0.5">{entry.cons.slice(0, 3).map((c) => <li key={c} className="text-xs text-neutral-600">− {c}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="border-t border-neutral-200 bg-primary-lightest/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Verdict</p>
        <p className="text-sm text-neutral-700 leading-relaxed">{verdict}</p>
      </div>
    </div>
  );
}
