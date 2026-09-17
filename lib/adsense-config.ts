const PLACEHOLDER_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX';
const envPublisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

// Shipping the placeholder leaves the AdSense script loading against an invalid
// publisher ID, so no ad can fill and the impression is lost silently. This only
// warns rather than failing the build so that dev and preview work is not
// blocked; the deploy workflow is responsible for supplying the real value.
if (process.env.NODE_ENV === 'production' && !envPublisherId) {
  console.warn(
    'Warning: NEXT_PUBLIC_GOOGLE_ADSENSE_ID is not set. Ads will not display. See .env.example.'
  );
}

// AdSense Configuration
export const ADSENSE_CONFIG = {
  publisherId: envPublisherId || PLACEHOLDER_PUBLISHER_ID,
  
  // Ad Slot IDs - Replace with your actual slot IDs from AdSense
  adSlots: {
    // Article page ads
    articleTop: '1234567890',      // Top of article (rectangle)
    articleMid: '2345678901',      // Middle of article (rectangle)
    articleBottom: '3456789012',   // Bottom of article (rectangle)
    sidebar: '4567890123',         // Sidebar (vertical)
    
    // Home page ads
    homeHeaderMobile: '5678901234',   // Home header mobile (banner)
    homeHeaderDesktop: '6789012345',  // Home header desktop (leaderboard)
    homeBetweenCategories: '7890123456', // Between categories (rectangle)
    
    // Category page ads
    categoryTop: '8901234567',     // Top of category pages
    categoryBottom: '9012345678',  // Bottom of category pages
  }
};

// Ad formats
export const AD_FORMATS = {
  rectangle: 'rectangle',      // 300x250
  leaderboard: 'leaderboard',  // 728x90
  banner: 'banner',           // 320x50
  vertical: 'vertical',       // 160x600
  auto: 'auto'               // Responsive
};

// Helper function to check if AdSense is properly configured
export const isAdSenseConfigured = () => {
  return ADSENSE_CONFIG.publisherId !== PLACEHOLDER_PUBLISHER_ID &&
         ADSENSE_CONFIG.publisherId.startsWith('ca-pub-');
};

/**
 * The slot IDs above are still the scaffold's sequential placeholders. A real
 * slot is created per ad unit in the AdSense dashboard, so these resolve to
 * nothing and no unit can fill even once the publisher ID is valid.
 */
const PLACEHOLDER_SLOT = /^(?:1234567890|2345678901|3456789012|4567890123|5678901234|6789012345|7890123456|8901234567|9012345678)$/;

export const getPlaceholderAdSlots = (): string[] =>
  Object.entries(ADSENSE_CONFIG.adSlots)
    .filter(([, slot]) => PLACEHOLDER_SLOT.test(slot))
    .map(([name]) => name);

// Surfaced at build time because the failure is otherwise invisible: the
// AdSense script loads, the page looks correct, and every impression is lost.
if (process.env.NODE_ENV === 'production') {
  const placeholders = getPlaceholderAdSlots();
  if (placeholders.length > 0) {
    console.warn(
      `Warning: ${placeholders.length} AdSense slot ID(s) are still placeholders and cannot serve ads: ` +
        `${placeholders.join(', ')}. Replace them with real slot IDs from the AdSense dashboard.`
    );
  }
}

// Helper function to check if ads should be shown
export const shouldShowAds = () => {
  // In production, show ads if configured
  if (process.env.NODE_ENV === 'production') {
    return isAdSenseConfigured();
  }
  
  // In development, always show placeholders for layout testing
  return true;
};
