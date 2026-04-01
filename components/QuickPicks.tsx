import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';

interface QuickPick {
  label: string;
  name: string;
  href: string;
  score: number;
  price: string;
}

interface QuickPicksProps {
  picks: QuickPick[];
}

export function QuickPicks({ picks }: QuickPicksProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Quick Picks</h3>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {picks.map((pick) => (
          <Link key={pick.href} href={pick.href} className="rounded-lg border border-primary-light bg-primary-lightest/50 p-3 text-center hover:bg-primary-lightest">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-accent">{pick.label}</div>
            <div className="mt-1 text-[13px] font-semibold text-neutral-900">{pick.name}</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <ScoreBadge score={pick.score} />
              <span className="text-[11px] text-neutral-500">— {pick.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
