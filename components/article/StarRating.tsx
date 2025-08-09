'use client';

import React, { useState, useEffect } from 'react';

interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showBreakdown?: boolean;
}

export default function StarRating({ 
  rating, 
  showValue = true, 
  size = 'md',
  animated = true,
  interactive = false,
  onRatingChange,
  showBreakdown = false
}: StarRatingProps) {
  const [displayRating, setDisplayRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl'
  };

  const containerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  // Animate rating reveal on mount
  useEffect(() => {
    if (animated) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        let current = 0;
        const increment = rating / 20; // 20 steps for smooth animation
        const interval = setInterval(() => {
          current += increment;
          if (current >= rating) {
            setDisplayRating(rating);
            clearInterval(interval);
            setIsAnimating(false);
          } else {
            setDisplayRating(current);
          }
        }, 50);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setDisplayRating(rating);
    }
  }, [rating, animated]);

  const currentRating = interactive ? (hoverRating || displayRating) : displayRating;
  
  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      const newRating = starIndex + 1;
      onRatingChange(newRating);
      setDisplayRating(newRating);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const stars = Array.from({ length: 5 }).map((_, i) => {
    const isFilled = i < Math.floor(currentRating);
    const isPartial = i === Math.floor(currentRating) && currentRating % 1 > 0;
    const fillPercentage = isPartial ? (currentRating % 1) * 100 : 0;
    
    return (
      <div 
        key={i} 
        className={`relative cursor-pointer transform transition-all duration-200 ${
          interactive ? 'hover:scale-110' : ''
        } ${containerSizes[size]} flex items-center justify-center`}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarHover(i)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background star (gray) */}
        <svg 
          className={`absolute inset-0 w-full h-full text-gray-300 transition-all duration-300 ${
            interactive && hoverRating > i ? 'scale-110' : ''
          }`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        
        {/* Filled star overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <svg 
            className={`w-full h-full text-yellow-400 transition-all duration-500 ${
              isAnimating ? 'animate-pulse' : ''
            } ${interactive && hoverRating > i ? 'scale-110 text-yellow-500' : ''}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{
              clipPath: isFilled 
                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                : isPartial 
                ? `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0 100%)`
                : 'polygon(0 0, 0 0, 0 100%, 0 100%)'
            }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Sparkle effect for high ratings */}
        {isFilled && currentRating >= 4.5 && animated && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75`}></div>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Stars Container */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {stars}
        </div>
        
        {showValue && (
          <div className="ml-3 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {currentRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              out of 5
            </span>
          </div>
        )}
      </div>

      {/* Rating Breakdown */}
      {showBreakdown && (
        <div className="bg-gray-50 rounded-lg p-3 text-xs">
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              // Mock data for demonstration - in real app, this would come from props
              const percentage = star === 5 ? 67 : star === 4 ? 23 : star === 3 ? 8 : star === 2 ? 2 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-4 text-gray-600">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-gray-600">{percentage}%</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-center">
            <span className="text-gray-600">Based on 247 reviews</span>
          </div>
        </div>
      )}

      {/* Interactive Rating Hint */}
      {interactive && (
        <div className="text-xs text-gray-500 text-center">
          {hoverRating > 0 ? `Rate ${hoverRating} star${hoverRating !== 1 ? 's' : ''}` : 'Click to rate'}
        </div>
      )}
    </div>
  );
}
