import { useState } from "react";
import LawyerCard from "@/components/lawyer-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { Lawyer, PracticeArea } from "@shared/schema";

interface LawyerListingProps {
  lawyers: Lawyer[];
  isLoading: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
  onToggleMobileFilter: () => void;
}

// Quick filter categories
const practiceAreaFilters: { value: PracticeArea | 'all'; label: string }[] = [
  { value: 'all', label: 'All Areas' },
  { value: 'family_law', label: 'Family Law' },
  { value: 'criminal_defense', label: 'Criminal Defense' },
  { value: 'immigration_law', label: 'Immigration' },
  { value: 'personal_injury', label: 'Personal Injury' },
  { value: 'business_law', label: 'Business Law' },
];

export default function LawyerListing({
  lawyers,
  isLoading,
  sortBy,
  onSortChange,
  onToggleMobileFilter,
}: LawyerListingProps) {
  const [activePracticeArea, setActivePracticeArea] = useState<PracticeArea | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const lawyersPerPage = 9;

  // Filter by quick practice area filter if selected
  const filteredLawyers = activePracticeArea === 'all'
    ? lawyers
    : lawyers.filter(lawyer => lawyer.practiceAreas.includes(activePracticeArea));

  // Calculate pagination
  const indexOfLastLawyer = currentPage * lawyersPerPage;
  const indexOfFirstLawyer = indexOfLastLawyer - lawyersPerPage;
  const currentLawyers = filteredLawyers.slice(indexOfFirstLawyer, indexOfLastLawyer);
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of listing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeAreaFilter = (area: PracticeArea | 'all') => {
    setActivePracticeArea(area);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <div className="lg:w-3/4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline"
          className="w-full flex justify-between items-center p-3 text-navy-900"
          onClick={onToggleMobileFilter}
        >
          <span className="font-medium">Filters</span>
          <SlidersHorizontal className="h-5 w-5 text-navy-700" />
        </Button>
      </div>

      {/* Result Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <p className="text-gray-700 mb-3 sm:mb-0">
            <span className="font-semibold">{filteredLawyers.length}</span> lawyers found
          </p>
          <div className="flex items-center">
            <label htmlFor="sort-by" className="mr-2 text-gray-700">Sort by:</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Practice Area Quick Filters */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {practiceAreaFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activePracticeArea === filter.value ? "default" : "outline"}
              className={`whitespace-nowrap px-4 py-2 rounded-full ${
                activePracticeArea === filter.value
                  ? "bg-navy-900 text-white"
                  : "bg-white border border-navy-200 text-navy-800 hover:bg-navy-100"
              }`}
              onClick={() => handlePracticeAreaFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
          <Button
            variant="outline"
            className="whitespace-nowrap px-4 py-2 rounded-full bg-white border border-navy-200 text-navy-800 hover:bg-navy-100"
          >
            More
          </Button>
        </div>
      </div>

      {/* Lawyer Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredLawyers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentLawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-navy-900 mb-2">No lawyers found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!isLoading && filteredLawyers.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center">
            <Button
              variant="outline"
              className="mx-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {/* Generate pagination numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              
              // Logic to show appropriate page numbers
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  className={`mx-1 ${
                    currentPage === pageNum
                      ? "bg-navy-900 text-white border-navy-900"
                      : "text-navy-700"
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {/* Show ellipsis if needed */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-4 py-2 mx-1 text-gray-600">...</span>
            )}
            
            {/* Show last page if not included in the range */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Button
                variant="outline"
                className="mx-1 text-navy-700"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            )}
            
            <Button
              variant="outline"
              className="mx-1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
