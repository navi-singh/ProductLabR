'use client';

import React, { useState } from 'react';
import { PostMetadata } from '../PostMetadata';

interface ProductSpecsProps {
  specs: PostMetadata['specs'];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!specs) return null;

  const specsEntries = Object.entries(specs);
  const displaySpecs = isExpanded ? specsEntries : specsEntries.slice(0, 4);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-2 hover:bg-slate-100 rounded-lg p-2 transition-colors"
      >
        <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="text-lg">📋</span>
          Technical Specifications
        </h4>
        <span className="text-sm text-gray-500">
          {isExpanded ? '▲' : '▼'} {specsEntries.length} specs
        </span>
      </button>

      {/* Compact Grid Format */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {displaySpecs.map(([key, value], index) => (
            <div 
              key={key}
              className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              <span className="font-medium text-gray-700 text-sm flex-shrink-0 w-1/2">
                {key}
              </span>
              <span className="text-gray-900 text-sm text-right w-1/2">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isExpanded && specsEntries.length > 4 && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full mt-2 text-xs text-trustworthy hover:text-trustworthy/80 transition-colors"
        >
          + {specsEntries.length - 4} more specifications
        </button>
      )}
    </div>
  );
}
