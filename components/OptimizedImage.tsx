'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '@/lib/basePath';

interface OptimizedImageProps {
  /** Omit when no licensed photo exists — the component then renders nothing. */
  src?: string | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  /** Classes for the positioning box. Use this to size a `fill` image. */
  wrapperClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export const OptimizedImage = ({
  src,
  alt,
  fill = false,
  sizes,
  className = '',
  wrapperClassName = '',
  priority = false,
  width,
  height,
}: OptimizedImageProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imgSrc = src ? withBasePath(src) : null;

  // Server-rendered images — especially `priority` ones — routinely finish
  // loading or failing before React hydrates, and a synthetic onLoad/onError
  // is never dispatched for an event that already fired, which stranded cached
  // images at opacity-0. So reconcile against the element's settled state.
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    const img = imgRef.current;
    if (!img || !img.complete) return;

    if (img.naturalWidth === 0) setHasError(true);
    else setIsLoading(false);
  }, [imgSrc]);

  // Reviews without a licensed product photo render no image at all. We
  // deliberately do not substitute a placeholder graphic: an empty space is
  // honest, whereas a stand-in reads as "here is the product" and previously
  // led to the wrong product being shown.
  if (!imgSrc || hasError) return null;

  const img = (
    <Image
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      {...(fill ? { fill: true, sizes } : { width: width || 400, height: height || 300 })}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      priority={priority}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoading(false)}
    />
  );

  if (fill) {
    // A `fill` image is positioned against the nearest positioned ancestor, so
    // the wrapper must have a size. When the caller supplies wrapperClassName it
    // sizes the box itself; otherwise the call site has already established a
    // sized, positioned parent and the wrapper just has to cover it. Falling
    // back to `relative ${className}` instead collapsed the wrapper to zero
    // height, which silently blanked every card image.
    const wrapper = wrapperClassName ? `relative ${wrapperClassName}` : 'absolute inset-0';

    return (
      <div className={wrapper}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-lightest to-primary-light/30 animate-pulse rounded" />
        )}
        {img}
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-lightest to-primary-light/30 animate-pulse rounded"
          style={{ width: width || 'auto', height: height || 'auto' }}
        />
      )}
      {img}
    </div>
  );
};
