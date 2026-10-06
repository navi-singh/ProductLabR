export const ARTICLE_REDIRECTS = {
  jackery_1000_v2: 'jackery_explorer_1000_v2',
  testing_the_anker_f3800: 'anker_solix_f3800',
  ecoflow_river_2_pro_power_station: 'ecoflow_river_2_pro',
  camping_ecoflow_delta_2_max: 'ecoflow_delta_2_max',
  ecoflow_trail_300dc: 'ecoflow_trail_300_dc',
  anker_f3000: 'anker_solix_f3000',
  testing_the_ecoflow_delta_pro_ultra: 'ecoflow_delta_pro_ultra',
} as const;

export type RedirectSlug = keyof typeof ARTICLE_REDIRECTS;

export function getArticleRedirect(slug: string): string | undefined {
  return ARTICLE_REDIRECTS[slug as RedirectSlug];
}

export function getArticleRedirectSlugs(): string[] {
  return Object.keys(ARTICLE_REDIRECTS);
}
