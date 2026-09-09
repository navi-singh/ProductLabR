/**
 * Affiliate tagging for outbound retailer links.
 *
 * The disclosure page tells readers the site earns commission on these links.
 * That claim is only true if a tag actually reaches the retailer, so tagging
 * happens here in one place rather than being hand-written into 149 markdown
 * files where it silently rots.
 *
 * IDs come from env — never hardcode a partner ID into the repo.
 */

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG;
const IMPACT_ID = process.env.NEXT_PUBLIC_IMPACT_PUBLISHER_ID;

/** Query parameter each retailer expects, keyed by hostname suffix. */
const TAG_PARAMS: ReadonlyArray<{ host: string; param: string; value?: string }> = [
  { host: 'amazon.com', param: 'tag', value: AMAZON_TAG },
  { host: 'bestbuy.com', param: 'irclickid', value: IMPACT_ID },
  { host: 'walmart.com', param: 'irclickid', value: IMPACT_ID },
];

/**
 * True when at least one affiliate program is configured. The disclosure page
 * reads this so the site never claims commission revenue it cannot earn.
 */
export function hasAffiliateProgram(): boolean {
  return TAG_PARAMS.some((entry) => Boolean(entry.value));
}

/**
 * Appends the configured affiliate parameter for the link's retailer.
 * Returns the URL untouched when the retailer has no configured tag, so an
 * unconfigured deploy still produces working (just unmonetized) links.
 */
export function withAffiliateTag(rawUrl: string): string {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (url.protocol !== 'https:') return rawUrl;

  const match = TAG_PARAMS.find(
    (entry) => url.hostname === entry.host || url.hostname.endsWith(`.${entry.host}`)
  );

  if (!match?.value || url.searchParams.has(match.param)) return rawUrl;

  url.searchParams.set(match.param, match.value);
  return url.toString();
}

/**
 * `sponsored` is required by Google for monetized outbound links; `nofollow`
 * keeps unmonetized retailer links from passing rank we did not vouch for.
 */
export function affiliateRel(): string {
  return hasAffiliateProgram()
    ? 'sponsored noopener noreferrer'
    : 'nofollow noopener noreferrer';
}
