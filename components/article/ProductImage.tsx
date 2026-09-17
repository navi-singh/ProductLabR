'use client';

import { OptimizedImage } from '@/components/OptimizedImage';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        // Uncapped, 16:9 at full column width is ~680px tall on a laptop and
        // pushes the rating and verdict below the fold.
        wrapperClassName="aspect-[16/9] max-h-[360px] w-full"
        className="object-contain p-3"
        sizes="(max-width: 1024px) 100vw, 67vw"
        priority
      />
    </div>
  );
}
