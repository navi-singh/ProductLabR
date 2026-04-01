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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4">
      <div>
        {price && <div className="text-xl font-bold text-neutral-900">{price}</div>}
        <div className="text-xs text-neutral-400">Best price across retailers</div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={primaryRetailer[1]}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-accent/90"
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
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-4 py-2.5 text-[13px] font-medium text-neutral-500 hover:border-neutral-300"
            aria-label={`Buy ${productName || 'product'} at ${name}`}
          >
            {name}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
