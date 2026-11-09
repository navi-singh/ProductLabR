import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { RankedProductCard } from '@/components/RankedProductCard';
import { QuickPicks } from '@/components/QuickPicks';
import { GuideTrustPanel } from '@/components/guides/GuideTrustPanel';
import { HowToChooseSection } from '@/components/guides/HowToChooseSection';
import { HowWeTestedPanel } from '@/components/guides/HowWeTestedPanel';
import { ProductComparisonTable } from '@/components/guides/ProductComparisonTable';
import { getPostsByCategory } from '@/lib/Posts';
import { articleScore } from '@/lib/articleUtils';
import { comparisonRowFromPost, productNameFromTitle } from '@/lib/guide-data';
import { categoryHref } from '@/lib/taxonomy';
import { canonicalUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Best 360 Cameras — Research-Based Reviews & Buying Guide',
  description:
    'Compare dedicated Insta360 and DJI 360 cameras for reframing, low light, lens repair, editing and value. Source-based scores, not claimed hands-on testing.',
  alternates: { canonical: canonicalUrl(categoryHref('360-cameras')) },
};

export default function Cameras360Page() {
  const posts = [...getPostsByCategory('360-cameras')]
    .filter((post) => articleScore(post) !== null)
    .sort(
      (a, b) =>
        articleScore(b)! - articleScore(a)! ||
        productNameFromTitle(a.title).localeCompare(productNameFromTitle(b.title)),
    );
  const rows = posts.map((post, index) => comparisonRowFromPost(post, index + 1));
  const picks = [
    { slug: 'insta360_x5', label: 'Balanced adventure pick' },
    { slug: 'insta360_x6', label: 'Premium imaging & runtime' },
    { slug: 'dji_osmo_360_ii', label: 'DJI creator pick' },
  ].flatMap(({ slug, label }) => {
    const post = posts.find((entry) => entry.slug === slug);
    return post
      ? [
          {
            label,
            name: productNameFromTitle(post.title),
            href: `/articles/${post.slug}`,
            score: articleScore(post)! / 10,
            summary: post.keyStrength,
            availabilityLabel: 'Check local availability',
          },
        ]
      : [];
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Buying guides', href: '/best' },
          { label: '360 Cameras' },
        ]}
      />
      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Buying guide
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Best dedicated 360 cameras
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
            Capture the whole scene, then choose the frame. Compare the editing work, lens risk and
            usable image quality behind the resolution headline.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-white/80">
            Research reviewed November 8, 2026. These are our editorial assessments of manufacturer
            documentation and independently reported testing. Verdict Hound has not tested these
            cameras hands-on.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="min-w-0 space-y-8">
            <QuickPicks picks={picks} />
            <section aria-labelledby="ranking">
              <h2 id="ranking" className="mb-4 text-xl font-bold text-neutral-900">
                Ranked reviews, not interchangeable recommendations
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-neutral-600">
                The order uses the mean of six equally weighted review metrics, displayed out of
                five; equal scores are ordered by product name. Quick picks reflect different jobs,
                not a second scoring system. Value considers documented launch pricing and ownership
                costs; compare current local offers before buying. Older cameras can make sense at a
                discount, not at their original flagship prices.
              </p>
              <ol className="space-y-4">
                {posts.map((post, index) => (
                  <li key={post.slug}>
                    <RankedProductCard
                      rank={index + 1}
                      name={productNameFromTitle(post.title)}
                      href={`/articles/${post.slug}`}
                      image={post.productImage}
                      summary={post.subtitle}
                      score={articleScore(post)! / 10}
                      specs={post.specs}
                    />
                  </li>
                ))}
              </ol>
            </section>
            <ProductComparisonTable
              rows={rows}
              columns={[
                { key: '360 Video', label: 'Spherical capture' },
                { key: 'Sensors', label: 'Sensor type' },
                { key: 'Lens Repair', label: 'Lens ownership' },
              ]}
              title="360 camera comparison"
              description="Video numbers cover the full sphere, not an equally detailed flat crop. Prices below are historical launch references, not live offers."
            />
            <HowToChooseSection
              title="What matters when buying a 360 camera"
              intro="Start with your final video and your editing device. Resolution alone does not tell you how much of the captured scene will survive a tight crop."
              advice={[
                {
                  title: '8K across a sphere is not 8K in every direction',
                  body: 'Reframing spends pixels. Keep distant subjects and aggressive zooms out of your plans; use wide framing for people and action nearby. The X4 improves daylight cropping over the X3, while X5 and X6 address more difficult light.',
                },
                {
                  title: 'Match the frame rate to the light and duration',
                  body: 'Osmo 360 II supports native 8K/60fps, but TechRadar reported a shutdown after about 19 minutes indoors without airflow at that setting. X6 supports 8K/50fps; its 136-minute reported battery test was at 8K/30fps. Neither finding predicts your conditions.',
                },
                {
                  title: 'Protect the stitch and the lenses',
                  body: 'Keep important faces away from the lens join and avoid close foreground objects. X5, X6 and Osmo 360 II have replaceable outer lenses. X4 guards protect lenses but do not make the underlying optics replaceable. Waterproof depth and clean underwater stitching are different questions; consult the exact dive-case instructions.',
                },
                {
                  title: 'Budget for the entire workflow',
                  body: 'A stick, a safe mount, a spare battery and storage may matter more than a bundle badge. TechRadar encountered X6 mobile-app crashes on beta software; check current phone support and try a sample edit. Free desktop editors handle local reframing; optional cloud products should not be confused with mandatory editing subscriptions.',
                },
                {
                  title: 'Tours and action are different purchases',
                  body: 'ONE RS 1-Inch 360 Edition has real dual 1-inch sensors, but its IPX3 protection and older 6K workflow make it a controlled-location specialist. X6 and DJI use square 1/1.1-inch sensors marketed as 1-inch-equivalent 360 imaging; that is not the same physical sensor designation.',
                },
                {
                  title: 'Check availability, not just currency conversion',
                  body: 'The DJI reviews report limited official US availability. A UK price is not a US price, and a third-party import can change warranty and service arrangements. Our reviews retain that uncertainty rather than invent a dollar offer.',
                },
              ]}
            />
            <HowWeTestedPanel
              title="How these research-based scores work"
              intro="Manufacturer information establishes modes and limits. Independent reviews establish reported practical results. Our analysis weighs both; scores are not copied reviewer ratings or laboratory measurements."
              metrics={[
                {
                  title: 'Image Quality',
                  description:
                    'Spherical detail, difficult light and useful reframing, rather than a megapixel headline.',
                },
                {
                  title: 'Stitching & Stabilization',
                  description:
                    'Reported joins, horizon control and movement limits; no claim that software repairs every obstruction.',
                },
                {
                  title: 'Design & Durability',
                  description:
                    'Protection, handling and repairability, with special treatment for exposed lenses.',
                },
                {
                  title: 'Editing & Usability',
                  description:
                    'Reported app behavior, manual reframing, storage and the effort to finish a video.',
                },
                {
                  title: 'Battery & Recording',
                  description:
                    'Mode-specific runtime and heat limits, distinguishing claims from observations.',
                },
                {
                  title: 'Value',
                  description:
                    'Launch-price context, accessories, availability and the opportunity cost of newer alternatives.',
                },
              ]}
            />
            <section className="rounded-xl border border-neutral-200 bg-white p-5">
              <h2 className="text-xl font-bold text-neutral-900">
                Verified models and evidence limits
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                All seven requested models are confirmed, including X6 and Osmo 360 II. X6&apos;s
                official launch announcement dates availability to August 12, 2026. DJI announced
                Osmo 360 II on September 3, 2026; TechRadar lists September 15 availability, so we
                distinguish announcement from retail timing. Digital Camera World still labels its
                Osmo 360 II coverage an early verdict; the scored review here also uses
                TechRadar&apos;s fuller recorded testing.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                We omit unverified sensor-superiority claims, projected AI features and promises of
                flawless underwater stitching. Ace Pro 2, GO 3S and conventional Osmo Action cameras
                are not included: standard wide-angle capture is not spherical capture. Dedicated
                models remain in this category even when they also offer a single-lens mode.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.insta360.com/blog/insta360-x6-launch.html"
                    className="text-primary hover:underline"
                  >
                    Insta360 X6 official announcement
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.dji.com/media-center/announcements/dji-release-osmo-360-2"
                    className="text-primary hover:underline"
                  >
                    DJI Osmo 360 II official announcement
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.techradar.com/cameras/360-cameras/dji-osmo-360-ii-review"
                    className="text-primary hover:underline"
                  >
                    TechRadar Osmo 360 II testing and conditions
                  </a>
                </li>
              </ul>
            </section>
            <AffiliateDisclosure variant="box" />
          </main>
          <aside className="space-y-5">
            <GuideTrustPanel latestUpdate="November 2026" />
            <section className="rounded-xl border border-neutral-200 bg-white p-5">
              <h2 className="text-base font-bold text-neutral-900">Keep exploring</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <Link href="/reviews" className="text-primary hover:underline">
                    Review archive — choose 360 Cameras
                  </Link>
                </li>
                <li>
                  <Link href={categoryHref('cameras')} className="text-primary hover:underline">
                    Conventional cameras &amp; photography
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="text-primary hover:underline">
                    Our scoring methodology
                  </Link>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
