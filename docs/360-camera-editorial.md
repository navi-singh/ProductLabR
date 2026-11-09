# Dedicated 360 cameras

`360-cameras` is a separate taxonomy/content directory, not a filter inside
conventional `cameras`. Its bespoke guide is `/best/360-cameras`; shared taxonomy
derivation supplies desktop/mobile navigation, the `/best` catalog, `/reviews`
category filter, article return links and sitemap entries. Existing conventional
camera routes and content remain unchanged.

## Editorial contract

The initial seven reviews cover Insta360 X3, X4, X5, X6, ONE RS 1-Inch 360 Edition,
DJI Osmo 360 and Osmo 360 II. All have manufacturer existence evidence and
independently reported practical testing. X6 is confirmed by Insta360's August 12,
2026 launch announcement; DJI announced Osmo 360 II September 3, 2026. Its reported
September 15 retail arrival is a different milestone. No requested model was
excluded as unverified.

Each article names its sources in frontmatter and links them in the prose.
`evidenceLevel: independent-source-synthesis` means the Verdict Hound Team has not
performed hands-on testing. Do not change that provenance without actual testing.
TechRadar supplies the principal independent testing; Digital Camera World's Osmo
360 II early verdict is supplementary, not a complete endurance test.

Use the same six equally weighted metrics across this category:

- **Image Quality:** useful spherical detail, difficult light and reframed output.
- **Stitching & Stabilization:** reported joins, motion handling and horizon control.
- **Design & Durability:** controls, seals, protection and optical repairability.
- **Editing & Usability:** supported devices, workflow and reported software behavior.
- **Battery & Recording:** mode-specific endurance and thermal limits.
- **Value:** documented launch-price context, accessories and regional support.

Scores are the team's analysis, not copied third-party ratings or test measurements.
`ratingBreakdown.metrics` remains the single source of truth. The guide sorts the
mean through existing score helpers; equal scores sort by product name. UI
components convert the 0–10 metrics to five-point presentation. Quick picks
represent different jobs and need not be identical to rank order.

Prices are explicitly historical launch references, not checked current offers.
The guide's QuickPicks omit prices and opt into `availabilityLabel` rather than
claiming live stock. Existing callers retain their previous defaults. Ranked cards
also omit prices, preserving the publication's no-prices-on-cards convention.
Retailer search links carry no fabricated product IDs or affiliate tags.

## Claims requiring particular care

- X3 has 8K **timelapse**, not ordinary 8K spherical video.
- X4's 135-minute manufacturer claim is at 5.7K/30fps, not 8K.
- X4 removable guards are not X5/X6-style replaceable underlying optics.
- X6 and both DJI models use square 1/1.1-inch sensors described as
  1-inch-equivalent panoramic imaging. ONE RS uses physical dual 1-inch sensors.
- Osmo 360's official faster spherical mode is 6K/60fps; 5K/60fps is single lens.
- Osmo 360 II's normal spherical maximum is 8K/60fps. Vortex 8K/120fps is a special
  mode, 16K is timelapse, and AI-interpolated 480fps is not native capture.
- Osmo 360 II's reported indoor 8K/60fps heat shutdown occurred after roughly
  19 minutes without airflow. Its cited battery observation is partial, not a full
  verification of the 100-minute manufacturer claim.
- X6's reported 136-minute run was at 8K/30fps. Mobile failures were observed on
  beta software; neither universal current failure nor a later fix is established.
- ONE RS is IPX3 and must not be submerged. Its “coming soon” tour-platform copy
  does not establish current integrations.
- Waterproof survival depth is not evidence of clean camera-only underwater
  stitching. Follow the exact manufacturer's dive-case guidance.
- Older launch dates are attributed to independent reporting where an exact
  contemporary manufacturer announcement was not established.

Ace Pro 2, GO 3S and conventional Osmo Action products are excluded because they
do not capture a full sphere. A dedicated 360 camera remains eligible when it also
has a complementary single-lens mode.

## Images and provenance

Ten licensed Commons photographs are included: X3 four, X4 two, X5 one and X6
three. `data/product-images.json` records the exact source page, download URL,
author, reusable license and descriptive alt text. Existing ingestion creates
WebP assets, caps width/page weight and strips metadata. Main photos lead articles;
additional views appear alongside relevant prose with source and license links.
CC BY-SA derivatives remain CC BY-SA 4.0, as stated visibly in their captions.
These are third-party product photographs, never purported team test images.

The five-image editorial target is not filled with duplicates, footage taken by a
camera, retail dummy photographs, update screenshots or unrelated accessories.
Both DJI reviews and ONE RS intentionally have no product image. No explicitly
reusable DJI photograph was established. The ONE RS Commons candidate was
780×780px and failed the existing 800px source-long-edge policy; it was omitted
rather than enlarged or accepted through a relaxed quality floor. Image shortages
are recorded in the existing `data/image-exceptions.json` mechanism with precise
reasons; that does not authorize a lower-quality or unlicensed asset. Public manufacturer images
and protected publisher test photographs are not automatically licensed for reuse.

## Focused validation

No browser or preview server is required:

```bash
npm run type-check
npx playwright test --config playwright.source.config.ts e2e/360-cameras-source.spec.ts
npm run editorial:qa -- --category 360-cameras
npm run editorial:audit -- --category 360-cameras
npm run images:ingest -- --category 360-cameras --dry-run
```

The source suite checks navigation/catalog/archive/static enumeration, canonical
URLs, review/evidence/score contracts, guide derivation, structured data, image
absence and local asset provenance. Editorial QA compares these reviews against
the full loaded corpus even when output is category-scoped. Do not run a bulk
content rewrite or add `--report` just to validate. Full build and rendered UI
validation are separate finalization steps subject to job authorization.
