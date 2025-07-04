import React from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
}

export default function ProductImage({ src, alt, aspectRatio = 'aspect-[2/1]' }: ProductImageProps) {
  return (
    <div className="mb-4">
      <div className={`relative w-full ${aspectRatio} bg-gray-50 rounded-xl overflow-hidden`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover w-full h-full"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
