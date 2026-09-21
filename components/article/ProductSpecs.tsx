'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductSpecsProps {
  specs?: Record<string, string>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const [expanded, setExpanded] = useState(false);
  if (!specs || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs);
  const visibleEntries = expanded ? entries : entries.slice(0, 6);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-featured">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="type-label text-accent">Technical Specs</p>
          <h3 className="mt-1 text-[15px] font-bold text-neutral-900">Measured configuration</h3>
        </div>
        {entries.length > 6 && (
          <span className="flex items-center gap-1 text-xs font-bold text-primary">
            {expanded ? 'Collapse' : 'Expand'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </span>
        )}
      </button>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visibleEntries.map(([key, value]) => (
          <div key={key} className="rounded-lg bg-neutral-50 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-neutral-500">
              {key}
            </span>
            <span className="mt-1 block text-[13px] font-semibold leading-snug text-neutral-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
