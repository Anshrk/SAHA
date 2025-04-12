import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import type { FilterOptions } from "@/pages/home";
import type { PracticeArea, ExperienceLevel } from "@shared/schema";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const practiceAreas: { value: PracticeArea; label: string }[] = [
  { value: "family_law", label: "Family Law" },
  { value: "criminal_defense", label: "Criminal Defense" },
  { value: "immigration_law", label: "Immigration Law" },
  { value: "personal_injury", label: "Personal Injury" },
  { value: "estate_planning", label: "Estate Planning" },
  { value: "tax_law", label: "Tax Law" },
  { value: "employment_law", label: "Employment Law" },
  { value: "business_law", label: "Business Law" },
  { value: "intellectual_property", label: "Intellectual Property" },
  { value: "real_estate_law", label: "Real Estate Law" },
];

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: "junior", label: "Junior (1-3 years)" },
  { value: "mid", label: "Mid-level (4-9 years)" },
  { value: "senior", label: "Senior (10+ years)" },
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isMobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

  useEffect(() => {
    setLocalMaxPrice(filters.maxPrice);
  }, [filters.maxPrice]);

  const handlePracticeAreaChange = (practiceArea: PracticeArea, checked: boolean) => {
    if (checked) {
      onFilterChange({
        practiceAreas: [...filters.practiceAreas, practiceArea],
      });
    } else {
      onFilterChange({
        practiceAreas: filters.practiceAreas.filter((area) => area !== practiceArea),
      });
    }
  };

  const handleExperienceLevelChange = (level: ExperienceLevel, checked: boolean) => {
    if (checked) {
      onFilterChange({
        experienceLevels: [...filters.experienceLevels, level],
      });
    } else {
      onFilterChange({
        experienceLevels: filters.experienceLevels.filter((l) => l !== level),
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ minRating: rating });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalMaxPrice(value[0]);
  };

  const handlePriceChangeEnd = (value: number[]) => {
    onFilterChange({ maxPrice: value[0] });
  };

  const handleAvailabilityChange = (checked: boolean) => {
    onFilterChange({ onlyAvailable: checked });
  };

  const sidebarClasses = `lg:w-1/4 mb-6 lg:mb-0 lg:pr-6 ${
    isMobileOpen 
      ? "fixed inset-0 z-50 bg-gray-800 bg-opacity-50 lg:static lg:bg-transparent lg:z-auto" 
      : "lg:block hidden"
  }`;

  const filterContentClasses = `bg-white rounded-lg shadow-md p-5 ${
    isMobileOpen 
      ? "fixed right-0 top-0 bottom-0 w-[80%] max-w-md overflow-auto" 
      : "sticky top-24"
  }`;

  return (
    <aside className={sidebarClasses} id="filter-sidebar">
      <div className={filterContentClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold font-montserrat text-navy-900">Filters</h2>
          <div className="flex items-center gap-2">
            <button 
              className="text-navy-700 hover:text-navy-900 text-sm font-medium" 
              onClick={onClearFilters}
            >
              Reset All
            </button>
            {isMobileOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden" 
                onClick={onCloseMobile}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Practice Area Filter */}
        <div className="mb-6">
          <h3 className="text-navy-800 font-semibold mb-3">Practice Area</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {practiceAreas.map((area) => (
              <div key={area.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`practice-${area.value}`} 
                  checked={filters.practiceAreas.includes(area.value)}
                  onCheckedChange={(checked) => 
                    handlePracticeAreaChange(area.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`practice-${area.value}`}
                  className="text-gray-700 cursor-pointer"
                >
                  {area.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-navy-800 font-semibold mb-3">Hourly Rate</h3>
          <div className="px-2">
            <Slider
              defaultValue={[filters.maxPrice]}
              max={500}
              min={50}
              step={10}
              value={[localMaxPrice]}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceChangeEnd}
              className="mb-4"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>$50</span>
              <span className="font-semibold">Up to ${localMaxPrice}/hr</span>
              <span>$500</span>
            </div>
          </div>
        </div>

        {/* Star Rating Filter */}
        <div className="mb-6">
          <h3 className="text-navy-800 font-semibold mb-3">Minimum Rating</h3>
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button 
                key={rating}
                className={`px-3 py-1 rounded-md ${
                  filters.minRating === rating 
                    ? "bg-navy-900 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleRatingChange(rating)}
              >
                {rating}★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Showing lawyers with {filters.minRating}+ stars
          </p>
        </div>

        {/* Experience Filter */}
        <div className="mb-6">
          <h3 className="text-navy-800 font-semibold mb-3">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`experience-${level.value}`} 
                  checked={filters.experienceLevels.includes(level.value)}
                  onCheckedChange={(checked) => 
                    handleExperienceLevelChange(level.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`experience-${level.value}`}
                  className="text-gray-700 cursor-pointer"
                >
                  {level.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Available for Consultation */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="available-for-consultation" 
              checked={filters.onlyAvailable}
              onCheckedChange={(checked) => 
                handleAvailabilityChange(checked as boolean)
              }
            />
            <Label 
              htmlFor="available-for-consultation"
              className="text-gray-700 font-medium cursor-pointer"
            >
              Available for Consultation
            </Label>
          </div>
        </div>

        {isMobileOpen && (
          <Button 
            className="w-full bg-navy-900 hover:bg-navy-800 text-white py-2 rounded-md transition duration-300 lg:hidden mt-4" 
            onClick={onCloseMobile}
          >
            Apply Filters
          </Button>
        )}
      </div>
    </aside>
  );
}
