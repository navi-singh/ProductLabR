import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Menu className="h-6 w-6" />
          <h1 className="text-2xl font-bold">PRODUCT LAB</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
          {["Latest", "Buyers Guides", "Reviews", "Tech", "Gadgets", "Home", "Topics", "From Our Partners"].map((link) => (
            <Link key={link} href="#" className="hover:text-gray-300">{link}</Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="default" className="bg-orange-500 hover:bg-orange-600">SUBSCRIBE</Button>
          <Search className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
};
