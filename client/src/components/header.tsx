import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScaleIcon, Menu } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <ScaleIcon className="text-navy-900 h-6 w-6" />
            <h1 className="text-2xl font-bold font-montserrat text-navy-900">Legal<span className="text-yellow-500">Aid</span></h1>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-6 text-navy-700">
          <Link href="/">
            <a className="hover:text-navy-900 font-medium">Home</a>
          </Link>
          <a href="#" className="hover:text-navy-900 font-medium">How It Works</a>
          <a href="#" className="hover:text-navy-900 font-medium">Practice Areas</a>
          <a href="#" className="hover:text-navy-900 font-medium">About Us</a>
          <a href="#" className="hover:text-navy-900 font-medium">Contact</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="default" 
            className="hidden md:block bg-navy-900 hover:bg-navy-800 text-white"
          >
            Sign In
          </Button>
          <Button 
            variant="ghost" 
            className="md:hidden text-navy-900 p-2" 
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4 border-t border-gray-100">
          <Link href="/">
            <a className="block py-2 text-navy-700 hover:text-navy-900 font-medium">Home</a>
          </Link>
          <a href="#" className="block py-2 text-navy-700 hover:text-navy-900 font-medium">How It Works</a>
          <a href="#" className="block py-2 text-navy-700 hover:text-navy-900 font-medium">Practice Areas</a>
          <a href="#" className="block py-2 text-navy-700 hover:text-navy-900 font-medium">About Us</a>
          <a href="#" className="block py-2 text-navy-700 hover:text-navy-900 font-medium">Contact</a>
          <Button 
            variant="default" 
            className="mt-3 w-full bg-navy-900 hover:bg-navy-800 text-white"
          >
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}
