import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';

interface QuickPick {
  label: string;
  name: string;
  href: string;
  score: number;
  price: string;
  buyUrl?: string;
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
          <div
            key={pick.name}
            className="rounded-lg border border-primary-light bg-primary-lightest/50 p-3 text-center hover:bg-primary-lightest hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <Link href={pick.href} className="block">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-accent">{pick.label}</div>
              <div className="mt-1 text-[13px] font-semibold text-neutral-900">{pick.name}</div>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <ScoreBadge score={pick.score} />
                <span className="text-[11px] font-bold text-neutral-900">{pick.price}</span>
              </div>
            </Link>
            <div className="mt-2">
              {pick.buyUrl ? (
                <a
                  href={pick.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Buy →
                </a>
              ) : (
                <Link
                  href={`${pick.href}#where-to-buy`}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  See Price →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
