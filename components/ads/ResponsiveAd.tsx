'use client';
import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { shouldShowAdSlot } from '@/lib/adsense-config';
import { useGoogleConsent } from '@/components/CookieConsent';

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
  const consent = useGoogleConsent();
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

  const adSlot = isMobile ? mobileAdSlot : desktopAdSlot;

  if (consent !== 'accepted' || !shouldShowAdSlot(adSlot) || !mounted) {
    return null;
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
