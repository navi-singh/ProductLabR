'use client';
import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { shouldShowAds } from '@/lib/adsense-config';

interface ResponsiveAdProps {
  mobileAdSlot: string;
  desktopAdSlot: string;
  className?: string;
}

export default function ResponsiveAd({ 
  mobileAdSlot, 
  desktopAdSlot, 
  className = "" 
}: ResponsiveAdProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render if ads shouldn't be shown
  if (!shouldShowAds()) {
    return null;
  }

  if (!mounted) {
    return <div className={`ad-placeholder ${className}`} style={{ height: '90px' }} />;
  }

  return (
    <>
      {isMobile ? (
        <AdBanner 
          adSlot={mobileAdSlot}
          adFormat="banner"
          className={className}
        />
      ) : (
        <AdBanner 
          adSlot={desktopAdSlot}
          adFormat="leaderboard"
          className={className}
        />
      )}
    </>
  );
}
