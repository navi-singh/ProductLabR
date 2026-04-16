'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface StickyBuyBarProps {
  productName: string;
  price?: string;
  primaryRetailerName: string;
  primaryRetailerUrl: string;
}

export function StickyBuyBar({
  productName,
  price,
  primaryRetailerName,
  primaryRetailerUrl,
}: StickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isDismissed) {
        setIsVisible(window.scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="bg-neutral-900 px-4 py-3 shadow-2xl sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          {/* Logo pill — hidden on mobile */}
          <span className="hidden shrink-0 rounded bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/60 sm:block">
            Product Lab
          </span>

          {/* Product name + price */}
          <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
            <span className="truncate text-sm font-medium text-white">{productName}</span>
            {price && (
              <>
                <span className="text-white/30">—</span>
                <span className="shrink-0 text-sm font-bold text-white">{price}</span>
              </>
            )}
          </div>

          {/* Mobile: price only */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:hidden">
            {price && <span className="text-sm font-bold text-white">{price}</span>}
          </div>

          {/* Buy button */}
          <a
            href={primaryRetailerUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-neutral-900"
            aria-label={`Buy ${productName} at ${primaryRetailerName}`}
          >
            <span className="hidden sm:inline">Buy at {primaryRetailerName}</span>
            <span className="sm:hidden">{primaryRetailerName}</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Dismiss buy bar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
