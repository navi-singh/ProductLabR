interface GuideTrustPanelProps {
  reviewCount: number;
  categoryName: string;
  latestUpdate?: string;
}

export function GuideTrustPanel({ reviewCount, categoryName, latestUpdate }: GuideTrustPanelProps) {
  const stats = [
    [`${reviewCount}`, `${categoryName.toLowerCase()} reviewed`],
    ['0', 'sponsored rankings'],
    ['Fixed', 'scoring rubric'],
    [latestUpdate ?? 'Current', 'latest refresh'],
  ];

  return (
    <section className="rounded-xl border border-neutral-200 bg-primary text-white shadow-featured">
      <div className="p-5">
        <p className="type-label text-white/70">Why Trust Product Lab</p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Rankings built around repeatable buyer criteria.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Products are compared against the same category rubric. Affiliate links can support the
          site, but they never change the order, score, or verdict.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-lg bg-white/10 p-3">
              <div className="text-xl font-extrabold tabular-nums">{value}</div>
              <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
