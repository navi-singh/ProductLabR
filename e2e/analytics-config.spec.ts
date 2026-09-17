import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { getPlaceholderAdSlots, isAdSenseConfigured } from '../lib/adsense-config';

/**
 * The deploy workflow once passed only NEXT_PUBLIC_SITE_URL, so every
 * NEXT_PUBLIC_* value the app reads at build time was undefined in production.
 * Analytics never rendered and AdSense shipped its placeholder publisher ID, so
 * the site collected no traffic data and could not fill a single ad — for as
 * long as it had been live, with nothing surfacing either failure.
 *
 * These assertions are cheap and catch that class of silent outage: a value the
 * app depends on being dropped somewhere between the workflow and the build.
 */

const REPO_ROOT = path.join(__dirname, '..');
const workflow = fs.readFileSync(
  path.join(REPO_ROOT, '.github/workflows/nextjs.yml'),
  'utf-8'
);

function buildEnvBlock(): string {
  const start = workflow.indexOf('name: Build with Next.js');
  expect(start, 'the build step should exist in the deploy workflow').toBeGreaterThan(-1);
  const end = workflow.indexOf('- name:', start + 1);
  return workflow.slice(start, end === -1 ? undefined : end);
}

test('the deploy workflow passes analytics configuration into the build', () => {
  const env = buildEnvBlock();

  // Next.js inlines NEXT_PUBLIC_* at build time, so a value absent here is
  // absent from every page that ships.
  expect(env, 'GA measurement ID must reach the production build').toContain(
    'NEXT_PUBLIC_GA_ID:'
  );
  expect(env, 'AdSense publisher ID must reach the production build').toContain(
    'NEXT_PUBLIC_GOOGLE_ADSENSE_ID:'
  );
  expect(env, 'canonical URLs depend on the site URL').toContain('NEXT_PUBLIC_SITE_URL:');
});

test('shipping analytics requires disclosing it in the privacy policy', () => {
  const env = buildEnvBlock();
  const gaLine = env.split('\n').find((line) => line.includes('NEXT_PUBLIC_GA_ID:')) ?? '';
  const shipsMeasurementId = /G-[A-Z0-9]{6,}/.test(gaLine);

  test.skip(!shipsMeasurementId, 'no measurement ID is baked into the workflow');

  const privacy = fs.readFileSync(
    path.join(REPO_ROOT, 'app/privacy/page.tsx'),
    'utf-8'
  );

  // Running Google's analytics cookies without saying so is the kind of gap
  // that is trivial to fix before launch and awkward afterwards.
  expect(privacy, 'privacy policy must disclose Google Analytics').toContain(
    'Google Analytics'
  );
});

test('a configured publisher ID is not paired with placeholder ad slots', () => {
  const placeholders = getPlaceholderAdSlots();

  if (!isAdSenseConfigured()) {
    // AdSense is not set up yet. The guard itself still has to work, or it will
    // not warn when it finally matters.
    expect(placeholders.length).toBeGreaterThan(0);
    return;
  }

  // Once a real publisher ID is in place, leftover placeholder slots are the
  // remaining reason an ad unit silently fails to fill.
  expect(
    placeholders,
    `these ad slots still hold scaffold IDs and cannot serve: ${placeholders.join(', ')}`
  ).toEqual([]);
});
