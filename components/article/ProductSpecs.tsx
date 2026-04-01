'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ProductSpecsProps {
  specs?: Record<string, string>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const [expanded, setExpanded] = useState(false);
  if (!specs || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs);
  const visibleEntries = expanded ? entries : entries.slice(0, 4);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between">
        <h3 className="text-[15px] font-semibold text-neutral-900">Full Specifications</h3>
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          {expanded ? 'Collapse' : 'Expand'}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div className="mt-3">
        <AnimatePresence initial={false}>
          <motion.div
            key={expanded ? 'expanded' : 'collapsed'}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-[140px_1fr] text-[13px]">
              {visibleEntries.map(([key, value], i) => (
                <div key={key} className="contents">
                  <div className={`py-2 text-neutral-400 ${i < visibleEntries.length - 1 ? 'border-b border-neutral-100' : ''}`}>{key}</div>
                  <div className={`py-2 text-neutral-700 ${i < visibleEntries.length - 1 ? 'border-b border-neutral-100' : ''}`}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
