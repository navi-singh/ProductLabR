import React from 'react';
import { PostMetadata } from '../PostMetadata';

interface ProductSpecsProps {
  specs: PostMetadata['specs'];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  if (!specs) return null;

  return (
    <div className="p-2">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h4>
      <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
            <span className="font-medium text-gray-700">{key}:</span>
            <span className="text-gray-600">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
