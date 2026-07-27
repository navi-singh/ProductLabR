'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '@/lib/basePath';

const FALLBACK_SRC = '/images/item.png';

interface OptimizedImageProps {
  src: string;
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
  const [imgSrc, setImgSrc] = useState(() => withBasePath(src));
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    const fallback = withBasePath(FALLBACK_SRC);

    // First failure: retry with the placeholder and keep the loading shimmer up.
    // Surfacing the error state here would paint "Image unavailable" over a
    // placeholder that is about to load perfectly well.
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
      return;
    }

    // The placeholder itself is unreachable, so there is nothing left to show.
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Server-rendered images — especially `priority` ones — routinely finish
  // loading or failing before React hydrates, and a synthetic onLoad/onError
  // is never dispatched for an event that already fired. Left alone that
  // stranded a broken image with no fallback, and a cached image at opacity-0.
  // So reconcile against the element's settled state once on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;

    if (img.naturalWidth === 0) {
      handleError();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSrc]);

  if (fill) {
    return (
      <div className={`relative ${wrapperClassName || className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-lightest to-primary-light/30 animate-pulse rounded" />
        )}
        <Image
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-lightest to-primary-light/30">
            <div className="text-center text-primary-light">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Image unavailable</span>
            </div>
          </div>
        )}
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
      <Image
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-lightest to-primary-light/30 rounded">
          <div className="text-center text-primary-light">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

