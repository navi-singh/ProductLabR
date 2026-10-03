import Link from 'next/link';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { GuideQuickPick } from '@/lib/guide-data';

interface QuickPickStripProps {
  picks: GuideQuickPick[];
}

export function QuickPickStrip({ picks }: QuickPickStripProps) {
  if (picks.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="type-label text-accent">Quick Picks</p>
          <h2 className="type-headline mt-1 text-neutral-900">Start with the right shortlist</h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-neutral-500">
          Fast routes for common buyers; full rankings and trade-offs continue below.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {picks.map((pick) => (
          <Link
            key={`${pick.label}-${pick.href}`}
            href={pick.href}
            className="group rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                {pick.label}
              </span>
              {pick.score != null && <ScoreBadge score={pick.score} size="sm" />}
            </div>
            <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-neutral-900 group-hover:text-accent">
              {pick.name}
            </h3>
            {pick.reason && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                {pick.reason}
              </p>
            )}
            {pick.price && <p className="mt-3 text-xs font-semibold text-primary">{pick.price}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
