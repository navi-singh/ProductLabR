'use client';

import React from 'react';

interface RatingBadgeProps {
  rating: number;
  isEditorChoice?: boolean;
}

// Rating badge icons are kept as emojis since they provide better visual context
// and are more universally recognizable than SVG icons for rating badges

export default function RatingBadge({ 
  rating, 
  isEditorChoice = false 
}: RatingBadgeProps) {
  const getRatingConfig = (rating: number) => {
    if (rating >= 4.5) {
      return {
        text: 'Highly Recommended',
        subtext: 'Outstanding Performance',
        className: 'bg-green-600 text-white',
        icon: '⭐'
      };
    }
    if (rating >= 4.0) {
      return {
        text: 'Recommended',
        subtext: 'Great Choice',
        className: 'bg-blue-600 text-white',
        icon: '👍'
      };
    }
    if (rating >= 3.0) {
      return {
        text: 'Good Choice',
        subtext: 'Solid Option',
        className: 'bg-orange-600 text-white',
        icon: '👌'
      };
    }
    return {
      text: 'Consider Alternatives',
      subtext: 'Room for Improvement',
      className: 'bg-red-600 text-white',
      icon: '⚠️'
    };
  };

  const config = getRatingConfig(rating);

  return (
    <div className="flex items-center gap-3 relative">
      {/* Main Rating Badge */}
      <div className={`${config.className} rounded-lg px-4 py-2 text-center`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-lg">{config.icon}</span>
          <span className="font-bold text-sm">{config.text}</span>
        </div>
        <div className="text-xs opacity-90">{config.subtext}</div>
      </div>

      {/* Editor's Choice Badge - Rotated Stamp Style */}
      {isEditorChoice && (
        <div className="relative">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-lg border-2 border-amber-600 shadow-lg transform rotate-12 hover:rotate-6 transition-transform duration-300">
            <div className="flex items-center gap-1">
              <span className="text-base">🏆</span>
              <div className="text-center leading-tight">
                <div className="text-[10px] font-black uppercase tracking-wider">Editor's</div>
                <div className="text-[10px] font-black uppercase tracking-wider">Choice</div>
              </div>
            </div>
            {/* Stamp-like border effect */}
            <div className="absolute inset-0 border-2 border-dashed border-amber-200 rounded-lg opacity-50"></div>
          </div>
        </div>
      )}
    </div>
  );
}
