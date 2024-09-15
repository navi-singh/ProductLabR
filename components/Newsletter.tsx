import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Join Product Labs Newsletter</h3>
      <p className="mb-4">Sign up to receive Product Lab content direct to your inbox.</p>
      <Input className="mb-4" placeholder="Enter your email" type="email" />
      <Button className="w-full bg-orange-500 hover:bg-orange-600">SUBSCRIBE NOW</Button>
    </div>
  );
};
