'use client';

import React from 'react';
import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import { ExternalLinkIcon, ShoppingIcon } from '../../lib/icons';
import { isSafeUrl } from '../../lib/utils';
import { affiliateRel, withAffiliateTag } from '@/lib/affiliate';

interface RetailerLinksProps {
  retailerLinks?: {
    amazon?: string;
    bestBuy?: string;
    manufacturer?: string;
    [key: string]: string | undefined;
  };
  productName?: string;
}

export default function RetailerLinks({
  retailerLinks = {},
  productName = 'this product',
}: RetailerLinksProps) {
  const getRetailerIcon = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'amazon':
        return (
          <div className="relative flex h-6 w-8 shrink-0 items-center justify-center">
            <Image
              src={withBasePath('/images/amazon.png')}
              alt="Amazon"
              width={32}
              height={24}
              className="object-contain"
            />
          </div>
        );
      case 'ebay':
        return (
          <div className="relative flex h-6 w-8 items-center justify-center">
            <Image
              src={withBasePath('/images/ebay.svg')}
              alt="eBay"
              width={48}
              height={32}
              className="object-contain"
            />
          </div>
        );
      case 'ecoflow':
        return (
          <div className="flex h-6 w-8 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
            EC
          </div>
        );
      case 'evo':
        return (
          <div className="flex h-6 w-8 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
            E
          </div>
        );
      case 'rei':
        return (
          <div className="flex h-6 w-8 items-center justify-center rounded bg-green-700 text-xs font-bold text-white">
            R
          </div>
        );
      case 'backcountry':
        return (
          <div className="flex h-6 w-8 items-center justify-center rounded bg-orange-600 text-xs font-bold text-white">
            B
          </div>
        );
      case 'bestbuy':
        return (
          <div className="relative flex h-6 w-8 items-center justify-center">
            <Image
              src={withBasePath('/images/bestbuy.jpg')}
              alt="Best Buy"
              width={48}
              height={32}
              className="object-contain"
            />
          </div>
        );
      default:
        return <ShoppingIcon />;
    }
  };

  const getRetailerDisplayName = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'amazon':
        return 'Amazon';
      case 'ebay':
        return 'eBay';
      case 'ecoflow':
        return 'EcoFlow';
      case 'bestbuy':
        return 'Best Buy';
      case 'rei':
        return 'REI';
      case 'evo':
        return 'Evo';
      case 'backcountry':
        return 'Backcountry';
      case 'manufacturer':
        return 'Manufacturer';
      default:
        return retailer.charAt(0).toUpperCase() + retailer.slice(1);
    }
  };

  const safeRetailers = Object.entries(retailerLinks).filter(([, url]) => url && isSafeUrl(url));
  if (safeRetailers.length === 0) return null;

  const [primaryRetailer, ...secondaryRetailers] = safeRetailers;

  return (
    <section
      id="where-to-buy"
      className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-featured"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="type-label text-accent">Where to Buy</p>
          <h3 className="mt-1 text-[15px] font-bold text-neutral-900">Current retailer options</h3>
        </div>
        <span className="text-xs font-semibold text-neutral-500">
          Affiliate links never affect scores
        </span>
      </div>

      <a
        href={withAffiliateTag(primaryRetailer[1]!)}
        target="_blank"
        rel={affiliateRel()}
        aria-label={`Buy ${productName} at ${getRetailerDisplayName(primaryRetailer[0])}`}
        className="flex w-full items-center justify-between gap-2 rounded-lg bg-accent px-4 py-3 text-white transition-colors hover:bg-accent/90"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="rounded bg-white p-1.5 text-neutral-900">
            {getRetailerIcon(primaryRetailer[0])}
          </span>
          <span className="truncate font-bold">
            Check price at {getRetailerDisplayName(primaryRetailer[0])}
          </span>
        </span>
        <ExternalLinkIcon />
      </a>

      {secondaryRetailers.length > 0 && (
        <div className="mt-2 grid grid-cols-1 gap-2">
          {secondaryRetailers.map(([retailer, url]) => (
            <a
              key={retailer}
              href={withAffiliateTag(url!)}
              target="_blank"
              rel={affiliateRel()}
              aria-label={`Buy ${productName} at ${getRetailerDisplayName(retailer)}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:border-accent hover:text-accent"
            >
              <span className="flex min-w-0 items-center gap-2">
                {getRetailerIcon(retailer)}
                <span className="truncate">{getRetailerDisplayName(retailer)}</span>
              </span>
              <ExternalLinkIcon />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
