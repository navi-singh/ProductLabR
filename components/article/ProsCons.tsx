interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  if (!pros?.length && !cons?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {pros && pros.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-success-light p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-green-800">✓ Pros</h4>
          <ul className="space-y-1.5">
            {pros.map((pro, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-neutral-700">• {pro}</li>
            ))}
          </ul>
        </div>
      )}
      {cons && cons.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-error-light p-4">
          <h4 className="mb-2 text-[13px] font-semibold text-error">✗ Cons</h4>
          <ul className="space-y-1.5">
            {cons.map((con, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-neutral-700">• {con}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
