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
        wrapperClassName="aspect-[16/9] w-full"
        className="object-contain p-6"
        sizes="(max-width: 1024px) 100vw, 67vw"
        priority
      />
    </div>
  );
}
