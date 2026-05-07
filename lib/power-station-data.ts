// lib/power-station-data.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface PowerStationEntry {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  price: string;
  priceNum: number;
  image: string;
  capacityWh: number;
  features: string[];
  score: number;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  retailerLinks: Record<string, string>;
}

const POSTS_DIR = path.join(process.cwd(), 'posts', 'portable-power-stations');

function parsePrice(price: string): number {
  const match = price.replace(/,/g, '').match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function calcScore(ratingBreakdown?: { metrics: { score: number }[] }): number {
  if (!ratingBreakdown?.metrics?.length) return 0;
  const avg = ratingBreakdown.metrics.reduce((sum, m) => sum + m.score, 0) / ratingBreakdown.metrics.length;
  return Math.round(avg * 10) / 10;
}

export const getAllPowerStations = cache((): PowerStationEntry[] => {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const slug = file.replace('.md', '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        subtitle: data.subtitle ?? '',
        date: data.date ?? '',
        price: data.price ?? '',
        priceNum: parsePrice(data.price ?? ''),
        image: data.productImage ?? data.image ?? '/images/item.png',
        capacityWh: data.capacityWh ?? 0,
        features: data.features ?? [],
        score: calcScore(data.ratingBreakdown),
        specs: data.specs ?? {},
        pros: data.pros ?? [],
        cons: data.cons ?? [],
        retailerLinks: data.retailerLinks ?? {},
      } satisfies PowerStationEntry;
    })
    .sort((a, b) => b.score - a.score);
});

export function getStationsByFeature(feature: string): PowerStationEntry[] {
  return getAllPowerStations().filter((s) => s.features.includes(feature));
}

export function getStationsUnderPrice(maxPrice: number): PowerStationEntry[] {
  return getAllPowerStations().filter((s) => s.priceNum > 0 && s.priceNum <= maxPrice);
}

export function getStationsBySlugs(slugs: string[]): PowerStationEntry[] {
  const all = getAllPowerStations();
  return slugs.map((slug) => all.find((s) => s.slug === slug)).filter(Boolean) as PowerStationEntry[];
}

export function getQuickPicks(entries: PowerStationEntry[]): {
  label: string; name: string; href: string; score: number; price: string;
}[] {
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const picks = [
    { label: 'Best Overall', entry: sorted[0] },
    { label: 'Best Value', entry: sorted.find((s, i) => i > 0 && s.priceNum < (sorted[0]?.priceNum ?? 0)) ?? sorted[1] },
    { label: 'Budget Pick', entry: [...entries].sort((a, b) => a.priceNum - b.priceNum)[0] },
  ];
  return picks
    .filter((p) => p.entry)
    .map((p) => ({
      label: p.label,
      name: p.entry!.title,
      href: `/articles/${p.entry!.slug}`,
      score: p.entry!.score,
      price: p.entry!.price,
    }));
}
