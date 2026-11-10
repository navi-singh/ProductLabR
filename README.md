# Verdict Hound

Verdict Hound is an editorial product-review site built with [Next.js](https://nextjs.org) and deployed on GitHub Pages at [verdicthound.com](https://verdicthound.com/).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## GitHub Pages

The Pages workflow configures the deployment base path and site URL during the static export.

## Publishing categories

Edit [`data/category-publication.json`](data/category-publication.json) to set each category's public route slug to `true` or `false`. For example, `"cameras": false` hides the cameras category and its reviews. The `power-stations` setting controls reviews stored in `posts/portable-power-stations`. Categories missing from the file are disabled; unknown keys and non-boolean values fail the build.

Disabled categories and reviews are removed from navigation, search, sitemaps, and public routes. Their source files remain in the repository. This is a publishing control, not a way to make repository content or previously cached copies private.

Changes take effect when the site is rebuilt and deployed. A push to `main` triggers the GitHub Pages workflow; there is no live admin toggle or per-review setting. Use `npm run build` for static exports so the postbuild step removes unpublished pages before deployment.
