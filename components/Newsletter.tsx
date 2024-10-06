import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Newsletter = () => {
  return (
    <div className="rounded-lg bg-gray-100 p-6">
      <h3 className="mb-4 text-xl font-bold">Join Product Labs Newsletter</h3>
      <p className="mb-4">Sign up to receive Product Lab content direct to your inbox.</p>
      <Input className="mb-4" placeholder="Enter your email" type="email" />
      <Button className="w-full bg-orange-500 hover:bg-orange-600">SUBSCRIBE NOW</Button>
    </div>
  );
};
