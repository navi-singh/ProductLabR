'use client';

import React from 'react';

interface PriceButtonProps {
  price: string;
}

export default function PriceButton({ price }: PriceButtonProps) {
  const handleViewProduct = () => {
    // TODO: Implement product view logic (redirect to product page, open modal, etc.)
    console.log('View product clicked for:', price);
  };

  return (
    <div className="bg-trustworthy/10 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="text-2xl font-bold text-trustworthy">{price}</p>
        </div>
        <button 
          onClick={handleViewProduct}
          className="bg-trustworthy hover:bg-trustworthy/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          VIEW PRODUCT
        </button>
      </div>
    </div>
  );
}
