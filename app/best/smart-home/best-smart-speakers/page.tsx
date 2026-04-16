import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SectionLabel } from '@/components/SectionLabel';
import { QuickPicks } from '@/components/QuickPicks';
import { RankedProductCard } from '@/components/RankedProductCard';
import { Newsletter } from '@/components/Newsletter';
import AdBanner from '@/components/ads/AdBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Smart Speakers 2025 - Expert Reviews',
  description: 'Top smart speakers tested for sound quality, voice assistant performance, and smart home integration. Find the best Echo, HomePod, or Nest speaker.',
};

interface SpeakerEntry {
  rank: number; name: string; href: string; image: string; summary: string;
  score: number; price: string; badge?: 'best-overall' | 'best-value' | 'budget-pick';
  specs?: Record<string, string>;
}

const speakers: SpeakerEntry[] = [
  {
    rank: 1,
    name: 'Amazon Echo (4th Gen)',
    href: '/articles/amazon_echo_4th_gen',
    image: '/images/item.png',
    summary: 'Best all-around smart speaker with improved audio quality, built-in Zigbee smart home hub, and Alexa with the widest smart home device compatibility.',
    score: 8.8,
    price: '$99',
    badge: 'best-overall' as const,
    specs: { 'Speaker Driver': '3.0" woofer + 0.8" tweeter', 'Smart Assistant': 'Alexa', Connectivity: 'Wi-Fi, Bluetooth', Audio: 'Dolby processing', Hub: 'Zigbee, Matter, Thread' },
  },
  {
    rank: 2,
    name: 'Apple HomePod mini',
    href: '/articles/apple_homepod_mini',
    image: '/images/item.png',
    summary: 'Best smart speaker for Apple households with exceptional spatial audio for its size, seamless AirPlay 2, and HomePod intercom features.',
    score: 8.7,
    price: '$99',
    badge: 'best-value' as const,
    specs: { 'Speaker Driver': 'Full-range + passive radiators', 'Smart Assistant': 'Siri', Connectivity: 'Wi-Fi 4, Bluetooth 5', Audio: 'Spatial Audio', Hub: 'Thread, Matter' },
  },
  {
    rank: 3,
    name: 'Amazon Echo Dot (5th Gen)',
    href: '/articles/amazon_echo_dot_5th_gen',
    image: '/images/item.png',
    summary: 'The best budget smart speaker with improved bass response, built-in temperature sensor, and full Alexa functionality in a compact package.',
    score: 8.4,
    price: '$49',
    badge: 'budget-pick' as const,
    specs: { 'Speaker Driver': '1.73" full-range', 'Smart Assistant': 'Alexa', Connectivity: 'Wi-Fi, Bluetooth', Audio: 'Improved bass', Hub: 'Eero Wi-Fi' },
  },
  {
    rank: 4,
    name: 'Google Nest Audio',
    href: '/articles/google_nest_audio',
    image: '/images/item.png',
    summary: 'Google Assistant-powered smart speaker with surprisingly good audio quality, adaptive sound, and excellent integration with Google services.',
    score: 8.6,
    price: '$99',
    specs: { 'Speaker Driver': '3.0" woofer + 0.75" tweeter', 'Smart Assistant': 'Google Assistant', Connectivity: 'Wi-Fi, Bluetooth 5', Audio: 'Adaptive Sound', Hub: 'Matter (via update)' },
  },
];

const quickPicks = [
  { label: 'Best Overall', name: 'Amazon Echo (4th Gen)', href: '/articles/amazon_echo_4th_gen', score: 8.8, price: '$99' },
  { label: 'Best for Apple', name: 'Apple HomePod mini', href: '/articles/apple_homepod_mini', score: 8.7, price: '$99' },
  { label: 'Budget Pick', name: 'Echo Dot (5th Gen)', href: '/articles/amazon_echo_dot_5th_gen', score: 8.4, price: '$49' },
];

export default function BestSmartSpeakersPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Best Of', href: '/best' },
        { label: 'Smart Home', href: '/best/smart-home' },
        { label: 'Best Smart Speakers' },
      ]} />

      <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white">
        <div className="mx-auto max-w-content">
          <SectionLabel className="text-white/70">Buying Guide</SectionLabel>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Best Smart Speakers 2025</h1>
          <p className="mt-2 max-w-2xl text-base text-white/80">
            Top smart speakers tested for audio quality, voice assistant responsiveness, smart home compatibility, and ease of setup and use.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Sound Quality Measured', 'Voice Recognition Tested', 'Smart Home Integration Verified'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white/90">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
          <main className="space-y-6">
            <QuickPicks picks={quickPicks} />

            <div>
              <SectionLabel>Ranked List</SectionLabel>
              <div className="space-y-4">
                {speakers.map((speaker, i) => (
                  <div key={speaker.rank}>
                    <RankedProductCard {...speaker} />
                    {i === 2 && (
                      <div className="mt-4">
                        <AdBanner adSlot={ADSENSE_CONFIG.adSlots.categoryBottom} adFormat="auto" className="rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-6">
              <SectionLabel>Methodology</SectionLabel>
              <h2 className="mb-4 text-lg font-bold text-neutral-900">Alexa vs Google Assistant vs Siri</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: 'Alexa (Amazon Echo)', items: ['Widest smart home device compatibility', 'Largest library of third-party skills', 'Best for mixed smart home ecosystems', 'Zigbee hub built into Echo (4th Gen)', 'Works great with Ring security products'] },
                  { title: 'Google Assistant & Siri', items: ['Google: Best for information queries and search', 'Siri: Best integrated with iPhone and Apple devices', 'HomePod: Best audio quality among smart speakers', 'Google Nest: Great for YouTube Music and Chromecast', 'Matter support future-proofs all three ecosystems'] },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-2 text-sm font-semibold text-primary">{section.title}</h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item} className="text-xs text-neutral-600">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="space-y-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Jump To</h3>
              <ul className="space-y-2 text-sm">
                {speakers.map((speaker) => (
                  <li key={speaker.rank}>
                    <Link href={speaker.href} className="flex items-center gap-2 text-neutral-600 hover:text-primary">
                      <span className="text-[10px] text-neutral-400">#{speaker.rank}</span>
                      {speaker.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Related Guides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/best/smart-home" className="text-neutral-700 hover:text-primary hover:underline">All Smart Home</Link></li>
                <li><Link href="/best/smart-home/best-robot-vacuums" className="text-neutral-700 hover:text-primary hover:underline">Best Robot Vacuums</Link></li>
                <li><Link href="/best/smart-home/best-video-doorbells" className="text-neutral-700 hover:text-primary hover:underline">Best Video Doorbells</Link></li>
              </ul>
            </div>

            <AdBanner adSlot={ADSENSE_CONFIG.adSlots.sidebar} adFormat="rectangle" style={{ minHeight: 250 }} className="rounded-lg" />

            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
