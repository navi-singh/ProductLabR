'use client';

import React from 'react';
import { PostMetadata } from '../PostMetadata';
import { CheckIcon, XIcon, getProIcon, getConIcon } from '../../lib/icons';

interface ProsConsProps {
  pros?: PostMetadata['pros'];
  cons?: PostMetadata['cons'];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  if (!pros && !cons) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros Section */}
        {pros && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-700 mb-4 flex items-center text-lg">
              <CheckIcon />
              <span className="ml-2">What We Liked</span>
            </h3>
            
            <ul className="space-y-2">
              {pros.map((pro: string, i: number) => (
                <li 
                  key={i} 
                  className="flex items-start"
                >
                  <span className="text-green-600 mr-2 mt-1 flex-shrink-0">•</span>
                  <span className="text-green-800 leading-relaxed">
                    {pro}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Cons Section */}
        {cons && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-700 mb-4 flex items-center text-lg">
              <XIcon />
              <span className="ml-2">Areas for Improvement</span>
            </h3>
            
            <ul className="space-y-2">
              {cons.map((con: string, i: number) => (
                <li 
                  key={i} 
                  className="flex items-start"
                >
                  <span className="text-red-600 mr-2 mt-1 flex-shrink-0">•</span>
                  <span className="text-red-800 leading-relaxed">
                    {con}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
