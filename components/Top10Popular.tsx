import {reviews} from '@/lib/Reviews';

export const Top10Popular = () => {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">TOP 10 Popular</h3>
        <ul className="space-y-4">
          {reviews.slice(0, 5).map((review, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-2xl font-bold text-gray-300">{index + 1}</span>
              <p className="font-medium">{review.title}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  