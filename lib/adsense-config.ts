// AdSense Configuration
export const ADSENSE_CONFIG = {
  // Replace with your actual AdSense Publisher ID
  // You can also set this via environment variable: NEXT_PUBLIC_GOOGLE_ADSENSE_ID
  publisherId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX',
  
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
  return ADSENSE_CONFIG.publisherId !== 'ca-pub-XXXXXXXXXXXXXXXX' && 
         ADSENSE_CONFIG.publisherId.startsWith('ca-pub-');
};

// Helper function to check if ads should be shown
export const shouldShowAds = () => {
  // In production, show ads if configured
  if (process.env.NODE_ENV === 'production') {
    return isAdSenseConfigured();
  }
  
  // In development, always show placeholders for layout testing
  return true;
};
