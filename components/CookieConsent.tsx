'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { ADSENSE_CONFIG, isAdSenseConfigured } from '@/lib/adsense-config';

type ConsentChoice = 'accepted' | 'rejected';

const CONSENT_STORAGE_KEY = 'productlab-cookie-consent';
const CONSENT_CHANGE_EVENT = 'productlab-cookie-consent-change';

const grantedConsent = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const;

const deniedConsent = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

function readStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

function updateGoogleConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', choice === 'accepted' ? grantedConsent : deniedConsent);
}

function saveConsent(choice: ConsentChoice) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  updateGoogleConsent(choice);
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useGoogleConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    const syncChoice = () => setChoice(readStoredConsent());
    syncChoice();
    window.addEventListener(CONSENT_CHANGE_EVENT, syncChoice);
    window.addEventListener('storage', syncChoice);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, syncChoice);
      window.removeEventListener('storage', syncChoice);
    };
  }, []);

  return choice;
}

export function CookieConsent() {
  const choice = useGoogleConsent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(readStoredConsent() === null);

    const openSettings = () => setIsOpen(true);
    window.addEventListener('productlab-open-cookie-settings', openSettings);
    return () => window.removeEventListener('productlab-open-cookie-settings', openSettings);
  }, []);

  const handleChoice = (nextChoice: ConsentChoice) => {
    saveConsent(nextChoice);
    setIsOpen(false);
  };

  const canLoadAds = choice === 'accepted' && isAdSenseConfigured();

  return (
    <>
      {canLoadAds && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      {isOpen && (
        <section
          aria-labelledby="cookie-consent-title"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl sm:p-5"
        >
          <div className="gap-4 sm:flex sm:items-start sm:justify-between">
            <div>
              <h2 id="cookie-consent-title" className="text-sm font-bold text-neutral-900">
                Cookie choices
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Product Lab uses Google Analytics and AdSense cookies to measure readership and fund
                the site. You can accept or reject those cookies; content stays available either way.
              </p>
            </div>
            <div className="mt-4 flex shrink-0 flex-col gap-2 sm:mt-0 sm:w-36">
              <button
                type="button"
                onClick={() => handleChoice('accepted')}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleChoice('rejected')}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Reject
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('productlab-open-cookie-settings'))}
      className="text-sm text-neutral-400 hover:text-primary-light"
    >
      Cookie settings
    </button>
  );
}
