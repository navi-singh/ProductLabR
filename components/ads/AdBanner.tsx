'use client';
import { useEffect } from 'react';
import { ADSENSE_CONFIG, shouldShowAds, isAdSenseConfigured } from '@/lib/adsense-config';

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ 
  adSlot, 
  adFormat = "auto", 
  fullWidthResponsive = true,
  className = "",
  style = {}
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);

  // Don't render anything if ads shouldn't be shown
  if (!shouldShowAds()) {
    return null;
  }
  
  // Show placeholder in development when configured
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`ad-placeholder bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 ${className}`} style={style}>
        <div className="text-sm">AdSense Placeholder</div>
        <div className="text-xs">Slot: {adSlot}</div>
        <div className="text-xs">Format: {adFormat}</div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}
