import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Lawyer } from "@shared/schema";
import { Star, MapPin, Mail, Phone, ChevronLeft, Clock, Award, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function LawyerDetail() {
  const [, params] = useRoute<{ id: string }>("/lawyer/:id");
  const lawyerId = params?.id ? parseInt(params.id) : -1;

  const { data: lawyer, isLoading, error } = useQuery<Lawyer>({
    queryKey: [`/api/lawyers/${lawyerId}`],
    enabled: lawyerId > 0,
  });

  if (isLoading) {
    return <LawyerDetailSkeleton />;
  }

  if (error || !lawyer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to load lawyer details</h1>
        <p className="text-gray-600 mb-6">The lawyer you are looking for might not exist or there was an error.</p>
        <Link href="/">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Lawyers
          </Button>
        </Link>
      </div>
    );
  }

  const renderPracticeAreas = () => {
    return lawyer.practiceAreas.map((area, index) => (
      <span 
        key={index} 
        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded mr-2 mb-2 inline-block"
      >
        {area.replace('_', ' ').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    ));
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Lawyers
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Lawyer info */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="min-w-[200px] h-[250px] rounded-md overflow-hidden">
                  <img src={lawyer.profileImage} alt={lawyer.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <h1 className="text-3xl font-bold text-navy-900">{lawyer.name}</h1>
                    <div className="bg-navy-900 text-white px-3 py-1 rounded-md inline-flex items-center">
                      <span className="font-bold">${lawyer.hourlyRate}</span>
                      <span className="text-sm">/hr</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(lawyer.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({lawyer.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-gray-700">
                    <MapPin className="h-4 w-4 text-navy-700" />
                    <span>{lawyer.location}</span>
                  </div>

                  <div className="mb-4 flex flex-wrap">
                    {renderPracticeAreas()}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {lawyer.experienceLevel === 'junior' ? '1-3 years' : 
                         lawyer.experienceLevel === 'mid' ? '4-9 years' : '10+ years'}
                      </span>
                    </div>
                    {lawyer.availableForConsultation && (
                      <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        <Clock className="h-4 w-4" />
                        <span>Available for consultation</span>
                      </div>
                    )}
                    {lawyer.featured && (
                      <div className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        <Award className="h-4 w-4" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-700">{lawyer.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Contact info */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-navy-100 p-2 rounded-md">
                    <Mail className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{lawyer.contactEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-navy-100 p-2 rounded-md">
                    <Phone className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{lawyer.contactPhone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-navy-100 p-2 rounded-md">
                    <MapPin className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{lawyer.address}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-navy-900 hover:bg-navy-800">
                Schedule Consultation
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {renderPracticeAreas()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LawyerDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="w-[200px] h-[250px] rounded-md" />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <Skeleton className="h-6 w-36 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-28" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
