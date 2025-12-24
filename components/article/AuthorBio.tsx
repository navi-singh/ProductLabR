'use client';

import React from 'react';

interface AuthorBioProps {
  authorBio: string;
  authorName?: string;
  authorTitle?: string;
}

export default function AuthorBio({ 
  authorBio, 
  authorName = "ProductLab Editorial Team",
  authorTitle = "Senior Product Reviewer"
}: AuthorBioProps) {

  return (
    <footer className="mt-12 border-t pt-8">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">About the Author</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-trustworthy">{authorName}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600 text-sm">{authorTitle}</span>
          </div>
        </div>
        
        <div className="text-gray-700 text-sm leading-relaxed mb-4">
          {authorBio}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-800 font-medium mb-1">
            📝 Editorial Standards
          </div>
          <div className="text-xs text-blue-700">
            Our reviews are based on thorough hands-on testing and professional expertise to provide you with detailed product insights.
          </div>
        </div>
      </div>
    </footer>
  );
}