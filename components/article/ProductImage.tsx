'use client';

import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={withBasePath(src)}
          alt={alt}
          fill
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 67vw"
          priority
        />
      </div>
    </div>
  );
}
