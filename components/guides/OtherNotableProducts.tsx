import Link from 'next/link';
import type { ComparisonRow } from '@/lib/guide-data';

interface OtherNotableProductsProps {
  products: ComparisonRow[];
}

export function OtherNotableProducts({ products }: OtherNotableProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <p className="type-label text-accent">Also Considered</p>
      <h2 className="type-headline mt-1 text-neutral-900">Other notable products</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
        These models did not lead the ranking, but they may still fit a narrower use case or budget.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <Link
            key={product.href}
            href={product.href}
            className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-primary/40 hover:bg-white"
          >
            <h3 className="text-sm font-bold text-neutral-900">{product.name}</h3>
            {product.keyStrength && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                {product.keyStrength}
              </p>
            )}
            {product.mainTradeoff && (
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                <span className="font-bold text-accent">Trade-off:</span> {product.mainTradeoff}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
