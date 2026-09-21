import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';

interface QuickPick {
  label: string;
  name: string;
  href: string;
  score: number;
  price: string;
  buyUrl?: string;
  summary?: string;
}

interface QuickPicksProps {
  picks: QuickPick[];
}

export function QuickPicks({ picks }: QuickPicksProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="type-label text-accent">Lab Decision Matrix</p>
          <h2 className="type-headline mt-1 text-neutral-900">Quick Recommendations</h2>
        </div>
        <span className="type-label rounded-full bg-primary-lightest px-3 py-1 text-primary">
          Best fits at a glance
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {picks.map((pick) => (
          <article
            key={pick.name}
            className="group flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white hover:shadow-card-hover"
          >
            <Link href={pick.href} className="block flex-1">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  {pick.label}
                </span>
                <ScoreBadge score={pick.score} />
              </div>
              <h3 className="mt-3 text-[15px] font-bold leading-snug text-neutral-900 group-hover:text-accent">
                {pick.name}
              </h3>
              {pick.summary && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                  {pick.summary}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Street price: <strong className="text-neutral-900">{pick.price}</strong>
                </span>
                <span className="font-semibold text-success">In stock</span>
              </div>
            </Link>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-200 pt-3">
              <Link
                href={pick.href}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-lightest text-xs font-bold text-primary hover:bg-primary-light"
              >
                Read Review
              </Link>
              {pick.buyUrl ? (
                <a
                  href={pick.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white hover:bg-accent/90"
                >
                  Check Price
                </a>
              ) : (
                <Link
                  href={`${pick.href}#where-to-buy`}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white hover:bg-accent/90"
                >
                  See Price
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
