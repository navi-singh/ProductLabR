import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/basePath';
import { isSafeUrl } from '../../lib/utils';
import { affiliateRel, hasAffiliateProgram, withAffiliateTag } from '@/lib/affiliate';

interface RetailerLinksProps {
  retailerLinks?: Record<string, string | undefined>;
  productName?: string;
}

interface RetailerInfo {
  name: string;
  note: string;
  logo?: string;
  color?: string;
}

// Notes describe what the reader can check on the retailer page, never a
// claim about price or stock that a static site cannot keep true.
const RETAILERS: Record<string, RetailerInfo> = {
  amazon: { name: 'Amazon', note: "Today's price and buyer reviews", logo: '/images/amazon.png' },
  bestbuy: {
    name: 'Best Buy',
    note: 'Price and store pickup options',
    logo: '/images/bestbuy.jpg',
  },
  walmart: { name: 'Walmart', note: 'Price and pickup options', color: '#0071DC' },
  newegg: { name: 'Newegg', note: "Today's price and stock", color: '#E35205' },
  bhphoto: { name: 'B&H Photo', note: "Today's price and stock", color: '#1A1A1A' },
  adorama: { name: 'Adorama', note: "Today's price and stock", color: '#C8102E' },
  homedepot: { name: 'The Home Depot', note: 'Price and store pickup options', color: '#F96302' },
  lowes: { name: "Lowe's", note: 'Price and store pickup options', color: '#004990' },
  costco: { name: 'Costco', note: 'Member price and availability', color: '#E31837' },
  rei: { name: 'REI', note: 'Price and member perks', color: '#3B7A3B' },
  ebay: { name: 'eBay', note: 'New and used listings', logo: '/images/ebay.svg' },
  evo: { name: 'Evo', note: "Today's price and stock", color: '#1F7A3A' },
  backcountry: { name: 'Backcountry', note: "Today's price and stock", color: '#D9531E' },
};

const normalize = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

// Unknown keys are usually the brand's own store; reuse the product name's
// casing (EcoFlow, BLUETTI) when the key matches one of its words.
function describeRetailer(key: string, productName: string): RetailerInfo {
  const known = RETAILERS[normalize(key)];
  if (known) return known;

  const brandWord = productName.split(/\s+/).find((word) => normalize(word) === normalize(key));
  if (brandWord || normalize(key) === 'manufacturer') {
    const name = brandWord ?? 'Manufacturer';
    return { name, note: `Buy direct from the official ${name} store` };
  }

  const name = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, (c) => c.toUpperCase());
  return { name, note: "Today's price and stock" };
}

function RetailerMark({ info }: { info: RetailerInfo }) {
  return (
    <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white">
      {info.logo ? (
        <Image
          src={withBasePath(info.logo)}
          alt=""
          width={36}
          height={24}
          className="max-h-6 w-auto object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: info.color ?? '#475569' }}
        >
          {info.name.replace(/^The /, '').charAt(0)}
        </span>
      )}
    </span>
  );
}

export default function RetailerLinks({
  retailerLinks = {},
  productName = 'this product',
}: RetailerLinksProps) {
  const retailers = Object.entries(retailerLinks).filter(
    (entry): entry is [string, string] => Boolean(entry[1]) && isSafeUrl(entry[1]!),
  );
  if (retailers.length === 0) return null;

  return (
    <section
      id="where-to-buy"
      aria-labelledby="where-to-buy-heading"
      className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-featured"
    >
      <p className="type-label text-accent">Where to Buy</p>
      <h3 id="where-to-buy-heading" className="mt-1 text-[15px] font-bold text-neutral-900">
        {retailers.length > 1
          ? `Compare prices at ${retailers.length} retailers`
          : 'Check the current price'}
      </h3>
      <p className="mt-1 text-xs text-neutral-500">Prices change often, so check before you buy.</p>

      <ul className="mt-3 space-y-2">
        {retailers.map(([key, url]) => {
          const info = describeRetailer(key, productName);
          return (
            <li key={key}>
              <a
                href={withAffiliateTag(url)}
                target="_blank"
                rel={affiliateRel()}
                aria-label={`Check the price of ${productName} at ${info.name} (opens in a new tab)`}
                className="group flex min-h-[56px] items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2.5 transition hover:-translate-y-px hover:border-accent hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:flex-wrap"
              >
                <RetailerMark info={info} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-neutral-900">{info.name}</span>
                  <span className="block text-xs leading-snug text-neutral-500">{info.note}</span>
                </span>
                <span className="inline-flex shrink-0 items-center justify-center gap-1 rounded-md bg-accent px-3 py-2 text-xs font-bold text-white transition group-hover:bg-accent/90 lg:basis-full">
                  Check price
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11px] leading-snug text-neutral-500">
        {hasAffiliateProgram()
          ? 'We may earn a commission when you buy through these links. It never affects our scores. '
          : 'Retailer links never affect our scores. '}
        <Link href="/disclosure" className="underline hover:text-accent">
          How we make money
        </Link>
      </p>
    </section>
  );
}
