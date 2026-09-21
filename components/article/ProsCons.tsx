interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  if (!pros?.length && !cons?.length) return null;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {pros && pros.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-success-light p-4">
          <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-success">
            Lab Verified Strengths
          </h4>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-neutral-700">
                <span className="font-bold text-success" aria-hidden="true">
                  ✓
                </span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons && cons.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-error-light p-4">
          <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-error">
            Verified Trade-Offs
          </h4>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-neutral-700">
                <span className="font-bold text-error" aria-hidden="true">
                  ×
                </span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
