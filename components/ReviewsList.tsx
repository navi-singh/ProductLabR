import Image from "next/image";
import {reviews} from '@/lib/Reviews';

export const ReviewsList = () => {
  return (
    <div className="md:col-span-2">
      <h2 className="text-4xl font-bold mb-4">Reviews</h2>
      <p className="text-gray-600 mb-8">Read our objective tests and assessments of the latest products.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review, index) => (
          <article key={index} className="border-b pb-8 hover:shadow-lg hover:bg-white">
            <Image src={review.image} alt={review.title} width={400} height={300} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-2xl font-bold mb-2">{review.title}</h3>
            <p className="text-gray-600 mb-2">{review.description}</p>
            <span className="text-gray-500">{review.date}</span>
          </article>
        ))}
      </div>
    </div>
  );
};
