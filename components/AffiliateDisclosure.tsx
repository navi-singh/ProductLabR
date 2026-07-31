interface AffiliateDisclosureProps {
  variant?: 'inline' | 'box';
}

/**
 * Required on any page carrying retailer links.
 *
 * The FTC requires affiliate relationships to be disclosed clearly and near the
 * links themselves, and search quality guidelines treat a visible disclosure as
 * a trust signal for commercial content. Articles previously carried retailer
 * links with no disclosure anywhere on the page.
 */
export function AffiliateDisclosure({ variant = 'inline' }: AffiliateDisclosureProps) {
  const text = (
    <>
      Product Lab is reader-supported. When you buy through links on this page we may earn an
      affiliate commission, at no extra cost to you. Commissions never influence our scores or
      rankings — see{' '}
      <a href="/methodology" className="underline hover:text-primary">
        how we test and score
      </a>
      .
    </>
  );

  if (variant === 'box') {
    return (
      <aside className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-500">
        {text}
      </aside>
    );
  }

  return <p className="text-xs leading-relaxed text-neutral-400">{text}</p>;
}
