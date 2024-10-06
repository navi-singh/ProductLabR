import Image from 'next/image';
import { reviews } from '@/lib/Reviews';

export const ReviewsList = () => {
  return (
    <div className="md:col-span-2">
      <h2 className="mb-4 text-4xl font-bold">Reviews</h2>
      <p className="mb-8 text-gray-600">
        Read our objective tests and assessments of the latest products.
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {reviews.map((review, index) => (
          <article key={index} className="border-b pb-8 hover:bg-white hover:shadow-lg">
            <Image
              src={review.image}
              alt={review.title}
              width={400}
              height={300}
              className="mb-4 h-48 w-full object-cover"
            />
            <h3 className="mb-2 text-2xl font-bold">{review.title}</h3>
            <p className="mb-2 text-gray-600">{review.description}</p>
            <span className="text-gray-500">{review.date}</span>
          </article>
        ))}
      </div>
    </div>
  );
};
