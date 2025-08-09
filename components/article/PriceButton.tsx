'use client';

import React from 'react';

interface PriceButtonProps {
  price: string;
  retailerLinks?: {
    amazon?: string;
    bestBuy?: string;
    manufacturer?: string;
    [key: string]: string | undefined;
  };
  productName?: string;
}

// Retailer Icons
const AmazonIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.069.324-.056.556.035.06.024.098.062.115.11.017.048.006.104-.034.168-.186.25-.489.33-.909.238-2.993.867-6.013 1.301-9.058 1.301-4.238 0-8.314-1.002-12.228-3.007-.116-.058-.193-.127-.232-.206-.039-.08-.038-.156.002-.234.04-.078.098-.129.174-.153l.633-.662zm23.565-1.108c.062.031.099.076.111.135.012.059-.003.12-.044.183-.041.063-.099.098-.173.104-.074.006-.148-.013-.223-.057-.897-.548-1.854-.822-2.87-.822-.737 0-1.454.15-2.15.45-.695.3-1.305.727-1.829 1.282-.524.555-.901 1.197-1.131 1.927-.23.73-.346 1.506-.346 2.329v.329c0 .413-.095.743-.284.99-.19.247-.46.37-.812.37-.352 0-.622-.123-.812-.37-.189-.247-.284-.577-.284-.99v-.329c0-1.177.174-2.289.523-3.335.349-1.046.843-1.969 1.482-2.769.639-.8 1.407-1.431 2.304-1.894.897-.463 1.895-.694 2.994-.694 1.322 0 2.554.369 3.695 1.107z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ShoppingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
  </svg>
);

export default function PriceButton({ 
  price, 
  retailerLinks = {},
  productName = "this product"
}: PriceButtonProps) {
  
  const handleRetailerClick = (retailer: string, url: string) => {
    // Track click for analytics (in a real app)
    console.log(`Clicked ${retailer} link for ${productName}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getRetailerIcon = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'amazon':
        return <AmazonIcon />;
      default:
        return <ShoppingIcon />;
    }
  };

  const getRetailerName = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'amazon':
        return 'Amazon';
      case 'bestbuy':
        return 'Best Buy';
      case 'manufacturer':
        return 'Direct from Manufacturer';
      default:
        return retailer.charAt(0).toUpperCase() + retailer.slice(1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-3 border border-gray-200">
      {/* Compact Price Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-600">Current Price</div>
          <div className="text-xl font-bold text-trustworthy">{price}</div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          🛒 Where to Buy
        </div>
      </div>

      {/* Compact Retailer Links */}
      <div className="space-y-1.5">
        {Object.entries(retailerLinks).map(([retailer, url]) => {
          if (!url) return null;
          
          return (
            <button
              key={retailer}
              onClick={() => handleRetailerClick(retailer, url)}
              className="w-full flex items-center justify-between p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:border-trustworthy group text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full group-hover:bg-trustworthy group-hover:text-white transition-colors">
                  {getRetailerIcon(retailer)}
                </div>
                <span className="font-medium text-gray-900 text-sm">
                  {getRetailerName(retailer)}
                </span>
              </div>
              <ExternalLinkIcon />
            </button>
          );
        })}
      </div>

      {/* Compact Editorial Note */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-600 text-center">
          <span className="text-blue-600">ⓘ</span> We may earn a commission from retailer links
        </div>
      </div>
    </div>
  );
}
