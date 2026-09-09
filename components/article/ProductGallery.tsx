import { OptimizedImage } from '@/components/OptimizedImage';

interface GalleryImage {
  src: string;
  credit?: string;
  source?: string;
  license?: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
      {images.map((image, index) => (
        <div
          key={image.src}
          className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
        >
          <OptimizedImage
            src={image.src}
            alt={`${alt} — additional angle ${index + 1}`}
            fill
            wrapperClassName="aspect-square w-full"
            className="object-contain p-2"
            sizes="(max-width: 640px) 33vw, 20vw"
          />
        </div>
      ))}
    </div>
  );
}
