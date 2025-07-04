import React from 'react';

interface RatingBadgeProps {
  rating: number;
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  const getRatingConfig = (rating: number) => {
    if (rating >= 4.5) {
      return {
        text: '★ Exceptional Product',
        className: 'text-green-600 font-semibold'
      };
    }
    if (rating >= 4) {
      return {
        text: '⭐ Highly Recommended',
        className: 'text-trustworthy font-semibold'
      };
    }
    if (rating >= 3) {
      return {
        text: '👍 Good Choice',
        className: 'text-orange-600 font-semibold'
      };
    }
    return {
      text: '⚠️ Consider Alternatives',
      className: 'text-red-600 font-semibold'
    };
  };

  const config = getRatingConfig(rating);

  return (
    <div className="text-sm md:text-base">
      <span className={config.className}>{config.text}</span>
    </div>
  );
}
