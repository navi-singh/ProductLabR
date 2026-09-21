'use client';

import { OptimizedImage } from '@/components/OptimizedImage';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-featured">
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        wrapperClassName="aspect-[16/9] max-h-[380px] w-full bg-gradient-to-br from-primary-lightest to-neutral-50"
        className="object-contain p-4"
        sizes="(max-width: 1024px) 100vw, 67vw"
        priority
      />
    </div>
  );
}
