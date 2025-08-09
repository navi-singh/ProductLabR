'use client';

import React from 'react';

interface RatingBadgeProps {
  rating: number;
  isEditorChoice?: boolean;
}

// Trophy Icon for exceptional products
const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// Star Icon for high recommendations
const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Shield Icon for verified products
const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// Thumbs up icon for good choice
const ThumbsUpIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
  </svg>
);

// Warning icon for consider alternatives
const WarningIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

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
    <div className="flex flex-col gap-2">
      {/* Main Rating Badge */}
      <div className={`${config.className} rounded-lg px-4 py-2 text-center`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-lg">{config.icon}</span>
          <span className="font-bold text-sm">{config.text}</span>
        </div>
        <div className="text-xs opacity-90">{config.subtext}</div>
      </div>

      {/* Editor's Choice Badge */}
      {isEditorChoice && (
        <div className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full border border-purple-200 text-center">
          <span className="mr-1">🏆</span>
          Editor's Choice
        </div>
      )}
    </div>
  );
}
