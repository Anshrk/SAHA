import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroBanner from "@/components/hero-banner";
import FilterSidebar from "@/components/filter-sidebar";
import LawyerListing from "@/components/lawyer-listing";
import TrustBadges from "@/components/trust-badges";
import type { Lawyer, PracticeArea, ExperienceLevel } from "@shared/schema";

export type FilterOptions = {
  practiceAreas: PracticeArea[];
  minRating: number;
  maxPrice: number;
  experienceLevels: ExperienceLevel[];
  onlyAvailable: boolean;
  searchQuery: string;
};

export default function Home() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [filters, setFilters] = useState<FilterOptions>({
    practiceAreas: [],
    minRating: 3,
    maxPrice: 500,
    experienceLevels: [],
    onlyAvailable: false,
    searchQuery: "",
  });

  const { data: lawyers = [], isLoading } = useQuery<Lawyer[]>({
    queryKey: ["/api/lawyers"],
  });

  // Apply filters and sorting to lawyers
  const filteredLawyers = lawyers
    .filter((lawyer) => {
      // Filter by practice areas if any are selected
      if (filters.practiceAreas.length > 0) {
        if (!lawyer.practiceAreas.some(area => filters.practiceAreas.includes(area as PracticeArea))) {
          return false;
        }
      }

      // Filter by minimum rating
      if (lawyer.rating < filters.minRating) {
        return false;
      }

      // Filter by price range
      if (lawyer.hourlyRate > filters.maxPrice) {
        return false;
      }

      // Filter by experience level if any are selected
      if (filters.experienceLevels.length > 0) {
        if (!filters.experienceLevels.includes(lawyer.experienceLevel as ExperienceLevel)) {
          return false;
        }
      }

      // Filter by availability
      if (filters.onlyAvailable && !lawyer.availableForConsultation) {
        return false;
      }

      // Filter by search query
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        return (
          lawyer.name.toLowerCase().includes(searchLower) ||
          lawyer.location.toLowerCase().includes(searchLower) ||
          lawyer.bio.toLowerCase().includes(searchLower) ||
          lawyer.practiceAreas.some(area => area.toLowerCase().includes(searchLower))
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "price-low":
          return a.hourlyRate - b.hourlyRate;
        case "price-high":
          return b.hourlyRate - a.hourlyRate;
        default:
          return 0;
      }
    });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleClearFilters = () => {
    setFilters({
      practiceAreas: [],
      minRating: 3,
      maxPrice: 500,
      experienceLevels: [],
      onlyAvailable: false,
      searchQuery: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row">
          <FilterSidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />
          
          <LawyerListing 
            lawyers={filteredLawyers}
            isLoading={isLoading}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onToggleMobileFilter={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          />
        </div>
      </main>
      
      <TrustBadges />
    </div>
  );
}
