import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { getPostBySlug } from './Posts';
import type { PostMetadata } from '../components/PostMetadata';

/**
 * Trending is read from a build-time snapshot rather than computed at runtime,
 * so the site stays fully static.
 *
 * The homepage previously labelled the five newest posts as "Trending", which
 * claimed a popularity signal the site does not collect. The rule here is that
 * the label only appears when there is real measured data behind it: no
 * snapshot, a stale snapshot, or too few entries all mean the section does not
 * render at all, and the caller falls back to an honest recency list.
 */
export interface TrendingEntry {
  slug: string;
  views: number;
  priorViews: number;
  /** Relative growth over the previous window; see scripts/fetch-trending.js. */
  lift: number;
}

export interface TrendingSnapshot {
  generatedAt: string;
  windowDays: number;
  items: TrendingEntry[];
}

export interface TrendingPost extends TrendingEntry {
  post: PostMetadata;
}

const SNAPSHOT_PATH = path.join(process.cwd(), 'data', 'trending.json');

/**
 * A months-old snapshot is not trending data, it is history. Past this age the
 * section hides itself rather than presenting stale rankings as current.
 */
export const MAX_SNAPSHOT_AGE_DAYS = 14;

/** Fewer entries than this looks broken and ranks noise, so we show nothing. */
export const MIN_TRENDING_ITEMS = 3;

function readSnapshot(): TrendingSnapshot | null {
  try {
    if (!fs.existsSync(SNAPSHOT_PATH)) return null;
    const parsed = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed as TrendingSnapshot;
  } catch (error) {
    console.error('Could not read trending snapshot:', error);
    return null;
  }
}

export function isSnapshotFresh(
  snapshot: TrendingSnapshot,
  now: number = Date.now()
): boolean {
  const generated = Date.parse(snapshot.generatedAt);
  if (Number.isNaN(generated)) return false;
  const ageDays = (now - generated) / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays <= MAX_SNAPSHOT_AGE_DAYS;
}

/**
 * Trending posts, already joined to their review. Returns an empty array
 * whenever the data cannot honestly support the label, so callers can simply
 * check `length` before rendering.
 */
export const getTrendingPosts = cache((limit = 5): TrendingPost[] => {
  const snapshot = readSnapshot();
  if (!snapshot || !isSnapshotFresh(snapshot)) return [];

  const resolved: TrendingPost[] = [];
  for (const item of snapshot.items) {
    // A slug can disappear if a review was renamed or unpublished after the
    // snapshot was taken; skip rather than render a dead link.
    const post = getPostBySlug(item.slug);
    if (!post) continue;
    resolved.push({ ...item, post: post.metadata });
    if (resolved.length >= limit) break;
  }

  return resolved.length >= MIN_TRENDING_ITEMS ? resolved : [];
});
