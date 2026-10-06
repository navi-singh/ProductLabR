'use client';
import { useEffect } from 'react';
import { ADSENSE_CONFIG, shouldShowAdSlot } from '@/lib/adsense-config';
import { useGoogleConsent } from '@/components/CookieConsent';

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
  const consent = useGoogleConsent();

  useEffect(() => {
    try {
      if (consent === 'accepted' && shouldShowAdSlot(adSlot)) {
        ((window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle =
          (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, [adSlot, consent]);

  if (consent !== 'accepted' || !shouldShowAdSlot(adSlot)) {
    return null;
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
