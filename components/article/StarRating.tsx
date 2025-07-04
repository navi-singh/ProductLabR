import React from 'react';

interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, showValue = true, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  };

  const stars = Array.from({ length: 5 }).map((_, i) => {
    const isFilled = i < Math.floor(rating);
    const isHalfFilled = i === Math.floor(rating) && rating % 1 >= 0.5;
    
    return (
      <div key={i} className={`relative ${sizeClasses[size]}`}>
        {isFilled ? (
          <span className="text-yellow-400">★</span>
        ) : isHalfFilled ? (
          <>
            <span className="text-gray-300">★</span>
            <span 
              className="absolute left-0 top-0 text-yellow-400 overflow-hidden" 
              style={{ width: '50%' }}
            >
              ★
            </span>
          </>
        ) : (
          <span className="text-gray-300">★</span>
        )}
      </div>
    );
  });

  return (
    <div className="flex items-center gap-1">
      {stars}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          ({rating.toFixed(1)}/5)
        </span>
      )}
    </div>
  );
}
