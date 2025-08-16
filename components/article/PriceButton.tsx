'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLinkIcon, ShoppingIcon } from '../../lib/icons';

interface RetailerLinksProps {
  retailerLinks?: {
    amazon?: string;
    bestBuy?: string;
    manufacturer?: string;
    [key: string]: string | undefined;
  };
  productName?: string;
}

export default function RetailerLinks({ 
  retailerLinks = {},
  productName = "this product"
}: RetailerLinksProps) {
  
  const handleRetailerClick = (url: string, retailerName: string) => {
    // Track click for analytics (in a real app)
    console.log(`Clicked ${retailerName} link for ${productName}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getRetailerIcon = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'amazon':
        return (
          <div className="w-16 h-8 relative flex items-center justify-center">
            <Image
              src="/images/amazon.png"
              alt="Amazon"
              width={48}
              height={32}
              className="object-contain"
            />
          </div>
        );
      case 'ebay':
        return (
          <div className="w-8 h-6 relative flex items-center justify-center">
            <Image
              src="/images/ebay.svg"
              alt="eBay"
              width={48}
              height={32}
              className="object-contain"
            />
          </div>
        );
      case 'ecoflow':
        return <div className="w-8 h-6 bg-green-500 text-white rounded text-xs font-bold flex items-center justify-center">EC</div>;
      case 'evo':
        return <div className="w-8 h-6 bg-green-600 text-white rounded text-xs font-bold flex items-center justify-center">E</div>;
      case 'rei':
        return <div className="w-8 h-6 bg-green-700 text-white rounded text-xs font-bold flex items-center justify-center">R</div>;
      case 'backcountry':
        return <div className="w-8 h-6 bg-orange-600 text-white rounded text-xs font-bold flex items-center justify-center">B</div>;
      case 'bestbuy':
        return <div className="w-8 h-6 relative flex items-center justify-center">
            <Image
              src="/images/bestbuy.jpg"
              alt="bestbuy"
              width={48}
              height={32}
              className="object-contain"
            />
            </div>;
      default:
        return <ShoppingIcon />;
    }
  };

  const getRetailerDisplayName = (retailer: string) => {
    switch (retailer.toLowerCase()) {
      case 'amazon':
        return 'Amazon';
      case 'ebay':
        return 'eBay';
      case 'ecoflow':
        return 'EcoFlow';
      case 'bestbuy':
        return 'Best Buy';
      case 'rei':
        return 'REI';
      case 'evo':
        return 'Evo';
      case 'backcountry':
        return 'Backcountry';
      case 'manufacturer':
        return 'Direct from Manufacturer';
      default:
        return retailer.charAt(0).toUpperCase() + retailer.slice(1);
    }
  };

  // Simple retailer links layout
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-3 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-sm font-semibold text-gray-800">🛒 Where to Buy</div>
        <div className="text-xs text-gray-500">Click to visit retailer</div>
      </div>

      {/* Retailer Links - Horizontal Layout */}
      <div className="space-y-2">
        {Object.entries(retailerLinks).map(([retailer, url]) => {
          if (!url) return null;
          
          return (
            <button
              key={retailer}
              onClick={() => handleRetailerClick(url, retailer)}
              className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-trustworthy rounded-lg transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-4">
                {getRetailerIcon(retailer)}
                <span className="font-semibold text-lg text-gray-900">
                  {getRetailerDisplayName(retailer)}
                </span>
              </div>
              <div className="text-trustworthy">
                <ExternalLinkIcon />
              </div>
            </button>
          );
        })}
      </div>


    </div>
  );
}
