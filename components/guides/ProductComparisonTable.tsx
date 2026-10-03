import Link from 'next/link';
import { ScoreBadge } from '@/components/ScoreBadge';
import type { ComparisonColumn, ComparisonRow } from '@/lib/guide-data';

interface ProductComparisonTableProps {
  rows: ComparisonRow[];
  columns: ComparisonColumn[];
  title?: string;
  description?: string;
}

export function ProductComparisonTable({
  rows,
  columns,
  title = 'Product Comparison Table',
  description = 'Compare the core specs, strengths, and trade-offs before opening individual reviews.',
}: ProductComparisonTableProps) {
  if (rows.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <div className="mb-4">
        <p className="type-label text-accent">Compare</p>
        <h2 className="type-headline mt-1 text-neutral-900">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-neutral-200 bg-white py-3 pr-4 text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">
                Product
              </th>
              <th className="border-b border-neutral-200 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">
                Rating
              </th>
              <th className="border-b border-neutral-200 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">
                Price
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-neutral-200 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-neutral-500"
                >
                  {column.label}
                </th>
              ))}
              <th className="border-b border-neutral-200 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">
                Best For
              </th>
              <th className="border-b border-neutral-200 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">
                Main Trade-Off
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.href} className="group">
                <td className="sticky left-0 z-10 border-b border-neutral-100 bg-white py-3 pr-4 align-top">
                  <Link href={row.href} className="font-bold text-neutral-900 hover:text-accent">
                    {row.rank ? `#${row.rank} ` : ''}
                    {row.name}
                  </Link>
                  {row.keyStrength && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                      {row.keyStrength}
                    </p>
                  )}
                </td>
                <td className="border-b border-neutral-100 px-3 py-3 align-top">
                  {row.score != null ? <ScoreBadge score={row.score} size="sm" /> : '—'}
                </td>
                <td className="border-b border-neutral-100 px-3 py-3 align-top text-xs font-semibold text-neutral-700">
                  {row.price ?? '—'}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border-b border-neutral-100 px-3 py-3 align-top text-xs leading-relaxed text-neutral-700"
                  >
                    {row.specs?.[column.key] ?? '—'}
                  </td>
                ))}
                <td className="border-b border-neutral-100 px-3 py-3 align-top text-xs leading-relaxed text-neutral-700">
                  {row.bestFor ?? '—'}
                </td>
                <td className="border-b border-neutral-100 px-3 py-3 align-top text-xs leading-relaxed text-neutral-700">
                  {row.mainTradeoff ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
