# Google AdSense Integration Setup

## 🚀 Quick Setup Guide

### 1. Apply for Google AdSense
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Add your website URL: `https://your-domain.com`
4. Wait for approval (can take 1-14 days)

### 2. Get Your Publisher ID
After approval:
1. Go to AdSense dashboard
2. Navigate to **Account** → **Account Information**
3. Copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### 3. Create Ad Units
1. Go to **Ads** → **By ad unit**
2. Create the following ad units:

#### Article Page Ads:
- **Article Top**: Display ad, Responsive, name: "Article Top"
- **Article Mid**: Display ad, Responsive, name: "Article Mid" 
- **Article Bottom**: Display ad, Responsive, name: "Article Bottom"
- **Sidebar**: Display ad, Vertical rectangle, name: "Sidebar"

#### Home Page Ads:
- **Home Header Mobile**: Display ad, Banner (320×50), name: "Home Header Mobile"
- **Home Header Desktop**: Display ad, Leaderboard (728×90), name: "Home Header Desktop"
- **Home Between Categories**: Display ad, Responsive, name: "Home Between Categories"

### 4. Update Configuration
Edit `lib/adsense-config.ts`:

```typescript
export const ADSENSE_CONFIG = {
  // Replace with YOUR actual Publisher ID
  publisherId: 'ca-pub-YOUR-ACTUAL-ID-HERE',
  
  // Replace with YOUR actual Ad Slot IDs
  adSlots: {
    articleTop: 'YOUR-ARTICLE-TOP-SLOT-ID',
    articleMid: 'YOUR-ARTICLE-MID-SLOT-ID', 
    articleBottom: 'YOUR-ARTICLE-BOTTOM-SLOT-ID',
    sidebar: 'YOUR-SIDEBAR-SLOT-ID',
    homeHeaderMobile: 'YOUR-HOME-MOBILE-SLOT-ID',
    homeHeaderDesktop: 'YOUR-HOME-DESKTOP-SLOT-ID',
    homeBetweenCategories: 'YOUR-HOME-BETWEEN-SLOT-ID',
  }
};
```

### 5. Deploy to Production
AdSense only works on live websites, not localhost:

```bash
# Deploy to Vercel
vercel --prod

# Or your preferred hosting platform
```

### 6. Test Your Ads
1. Visit your live website
2. Check that ad placeholders appear
3. Ads may take 24-48 hours to start showing
4. Monitor performance in AdSense dashboard

## 📍 Ad Placement Strategy

### High-Revenue Locations:
1. **Article Top** - First impression, high visibility
2. **Article Mid** - Best performing, mid-content engagement  
3. **Article Bottom** - Post-read engagement
4. **Sidebar** - Persistent visibility
5. **Home Header** - Site-wide exposure

### Expected Performance:
- **Article pages**: Highest CPM ($0.50-$2.00)
- **Home page**: Good traffic volume
- **Category pages**: Browse traffic

## 🎯 Revenue Optimization Tips

### Content Strategy:
- **High-value keywords**: "best", "review", "buying guide"
- **Long-form content**: 1500+ words perform better
- **Product comparisons**: Higher commercial intent

### Technical Optimization:
- **Page speed**: Faster sites = better ad performance
- **Mobile responsive**: 60%+ traffic is mobile
- **SEO optimization**: More traffic = more revenue

### Ad Optimization:
- **A/B test positions**: Try different placements
- **Monitor metrics**: CTR, CPC, RPM in AdSense
- **Seasonal adjustments**: Holiday shopping increases CPM

## 🚨 Important Notes

### Development vs Production:
- **Development**: Shows ad placeholders (for testing layout and positioning)
- **Production**: Shows real ads (after approval and configuration)

### Controlling Ad Display:
```bash
# Development shows placeholders by default (current behavior)
# No environment variables needed for basic development

# Configure your AdSense ID for production
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-YOUR-ACTUAL-ID
```

### AdSense Policies:
- **No click fraud**: Don't click your own ads
- **Quality content**: Original, valuable content required
- **User experience**: Don't overwhelm with ads

### Revenue Timeline:
- **Month 1**: $0-50 (building traffic)
- **Month 3**: $50-200 (established traffic)
- **Month 6+**: $200+ (optimized performance)

## 📊 Monitoring & Analytics

### Key Metrics to Track:
- **Page RPM**: Revenue per 1000 page views
- **CTR**: Click-through rate
- **CPC**: Cost per click
- **Traffic sources**: Organic vs direct vs social

### Tools:
- **Google AdSense**: Revenue tracking
- **Google Analytics**: Traffic analysis  
- **Search Console**: SEO performance

## 🆘 Troubleshooting

### Ads Not Showing:
1. Check Publisher ID is correct
2. Verify ad slot IDs match AdSense
3. Ensure site is live (not localhost)
4. Wait 24-48 hours for ads to appear

### Low Revenue:
1. Increase traffic through SEO
2. Optimize ad placements
3. Improve content quality
4. Target higher-value keywords

### Policy Violations:
1. Review AdSense policies
2. Fix content issues
3. Request review if needed
4. Monitor email for notifications

## 📈 Scaling Revenue

### Traffic Growth:
- **SEO optimization**: Target product review keywords
- **Content marketing**: Regular publishing schedule
- **Social media**: Share reviews and guides
- **Email newsletter**: Build subscriber list

### Monetization Expansion:
- **Affiliate marketing**: Amazon Associates, manufacturer programs
- **Sponsored content**: Paid product reviews
- **Premium content**: Exclusive buying guides
- **Email sponsorships**: Newsletter advertising

---

**Need help?** Check the [AdSense Help Center](https://support.google.com/adsense/) or contact support.
