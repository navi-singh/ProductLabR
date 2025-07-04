import React from 'react';
import { PostMetadata } from '../PostMetadata';

interface ProsConsProps {
  pros?: PostMetadata['pros'];
  cons?: PostMetadata['cons'];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  if (!pros && !cons) return null;

  return (
    <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {pros && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-700 mb-3 flex items-center">
            <span className="mr-2">✓</span>
            Pros
          </h3>
          <ul className="space-y-2">
            {pros.map((pro: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                <span className="text-green-800">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-700 mb-3 flex items-center">
            <span className="mr-2">✗</span>
            Cons
          </h3>
          <ul className="space-y-2">
            {cons.map((con: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="text-red-600 mr-2 mt-1">•</span>
                <span className="text-red-800">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
