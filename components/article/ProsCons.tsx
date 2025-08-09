'use client';

import React from 'react';
import { PostMetadata } from '../PostMetadata';

interface ProsConsProps {
  pros?: PostMetadata['pros'];
  cons?: PostMetadata['cons'];
}

// Icon components for better visual appeal
const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// Dynamic icon mapping for different types of pros/cons
const getProIcon = (text: string) => {
  if (text.toLowerCase().includes('fast') || text.toLowerCase().includes('quick') || text.toLowerCase().includes('speed')) {
    return <span className="text-emerald-500">⚡</span>;
  }
  if (text.toLowerCase().includes('build') || text.toLowerCase().includes('quality') || text.toLowerCase().includes('durable')) {
    return <span className="text-emerald-500">🔧</span>;
  }
  if (text.toLowerCase().includes('portable') || text.toLowerCase().includes('compact') || text.toLowerCase().includes('light')) {
    return <span className="text-emerald-500">🎒</span>;
  }
  if (text.toLowerCase().includes('battery') || text.toLowerCase().includes('power') || text.toLowerCase().includes('capacity')) {
    return <span className="text-emerald-500">🔋</span>;
  }
  if (text.toLowerCase().includes('design') || text.toLowerCase().includes('look') || text.toLowerCase().includes('aesthetic')) {
    return <span className="text-emerald-500">🎨</span>;
  }
  return <CheckIcon />;
};

const getConIcon = (text: string) => {
  if (text.toLowerCase().includes('expensive') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
    return <span className="text-red-500">💰</span>;
  }
  if (text.toLowerCase().includes('heavy') || text.toLowerCase().includes('weight') || text.toLowerCase().includes('bulky')) {
    return <span className="text-red-500">⚖️</span>;
  }
  if (text.toLowerCase().includes('warranty') || text.toLowerCase().includes('support') || text.toLowerCase().includes('service')) {
    return <span className="text-red-500">📋</span>;
  }
  if (text.toLowerCase().includes('noise') || text.toLowerCase().includes('loud') || text.toLowerCase().includes('sound')) {
    return <span className="text-red-500">🔊</span>;
  }
  if (text.toLowerCase().includes('setup') || text.toLowerCase().includes('complex') || text.toLowerCase().includes('difficult')) {
    return <span className="text-red-500">⚙️</span>;
  }
  return <XIcon />;
};

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
