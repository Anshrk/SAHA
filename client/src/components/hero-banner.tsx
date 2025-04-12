import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroBannerProps {
  onSearch: (query: string) => void;
}

export default function HeroBanner({ onSearch }: HeroBannerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <section className="bg-navy-900 text-white py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-4">
            Find the Right Attorney for Your Legal Needs
          </h1>
          <p className="text-lg mb-8 text-gray-100">
            Connect with qualified lawyers specializing in various practice areas who can help resolve your legal matters.
          </p>
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row">
            <div className="flex-grow mb-3 md:mb-0 md:mr-3 relative">
              <Input
                type="text"
                placeholder="Search by name, location, or practice area"
                className="w-full px-4 py-6 rounded border-0 focus-visible:ring-2 focus-visible:ring-navy-600 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <Button 
              type="submit" 
              className="bg-yellow-500 hover:bg-yellow-600 text-navy-900 font-semibold px-6 py-6 h-auto"
            >
              Search Lawyers
            </Button>
          </form>
        </div>
      </div>
      
      {/* Background overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-center bg-cover"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
        }}
      ></div>
    </section>
  );
}
