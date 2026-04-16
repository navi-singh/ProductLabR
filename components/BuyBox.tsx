import { ExternalLink } from 'lucide-react';

interface BuyBoxProps {
  price?: string;
  retailerLinks?: Record<string, string>;
  productName?: string;
}

export function BuyBox({ price, retailerLinks, productName }: BuyBoxProps) {
  if (!retailerLinks || Object.keys(retailerLinks).length === 0) return null;

  const retailers = Object.entries(retailerLinks);
  const primaryRetailer = retailers[0];
  const secondaryRetailers = retailers.slice(1, 3);

  return (
    <div className="rounded-xl border border-neutral-200 bg-amber-50 border-l-4 border-l-accent p-6">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Best Price</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {price && (
            <>
              <div className="text-3xl font-extrabold text-neutral-900">{price}</div>
              <div className="mt-0.5 text-xs text-neutral-500">Check current price →</div>
            </>
          )}
          {!price && <div className="text-xs text-neutral-400">Best price across retailers</div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={primaryRetailer[1]}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-accent/90"
            aria-label={`Buy ${productName || 'product'} at ${primaryRetailer[0]}`}
          >
            Buy at {primaryRetailer[0]}
            <ExternalLink className="h-3 w-3" />
          </a>
          {secondaryRetailers.map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-neutral-300 bg-white px-4 py-2.5 text-[13px] font-medium text-neutral-600 transition-colors hover:border-accent hover:text-accent"
              aria-label={`Buy ${productName || 'product'} at ${name}`}
            >
              {name}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
