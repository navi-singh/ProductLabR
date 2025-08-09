export interface PostMetadata {
    title: string;
    date: string;
    subtitle: string;
    slug: string;
    image?: string;
    heroImage?: string;
    productImage?: string;
    author?: string;
    specs?: Record<string, string>;
    pros?: string[];
    cons?: string[];
    authorBio?: string;
    price?: string;
    rating?: number;
    retailerLinks?: Record<string, string>;
    ratingBreakdown?: {
      overallScore?: number;
      overallRank?: string;
      metrics: { name: string; score: number }[];
    };
  }