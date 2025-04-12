import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lawyer } from "@shared/schema";

interface LawyerCardProps {
  lawyer: Lawyer;
}

export default function LawyerCard({ lawyer }: LawyerCardProps) {
  // Format practice areas for display
  const formatPracticeArea = (practiceArea: string) => {
    return practiceArea
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="lawyer-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img 
          src={lawyer.profileImage} 
          alt={lawyer.name} 
          className="w-full h-48 object-cover"
        />
        {lawyer.featured && (
          <span className="absolute top-3 right-3 bg-navy-900 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-navy-900 to-transparent p-3">
          <div className="flex items-center text-white">
            {renderStars(lawyer.rating)}
            <span className="font-bold mx-1">{lawyer.rating.toFixed(1)}</span>
            <span className="text-sm">({lawyer.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold font-montserrat text-navy-900">{lawyer.name}</h3>
          <span className="text-lg font-semibold text-navy-700">${lawyer.hourlyRate}/hr</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {lawyer.practiceAreas.slice(0, 3).map((area, index) => (
            <span key={index} className="bg-navy-100 text-navy-800 text-xs font-medium px-2 py-1 rounded">
              {formatPracticeArea(area)}
            </span>
          ))}
          {lawyer.practiceAreas.length > 3 && (
            <span className="bg-navy-100 text-navy-800 text-xs font-medium px-2 py-1 rounded">
              +{lawyer.practiceAreas.length - 3} more
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {lawyer.bio}
        </p>
        
        <div className="flex items-center text-navy-900 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{lawyer.location}</span>
        </div>
        
        <Link href={`/lawyer/${lawyer.id}`}>
          <Button 
            className="w-full bg-navy-900 hover:bg-navy-800 text-white py-2 rounded-md transition duration-300"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
