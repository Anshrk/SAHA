import { Users, Scale, MapPin, CheckCircle } from "lucide-react";

export default function TrustBadges() {
  return (
    <section className="bg-gray-50 py-12 mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold font-montserrat text-navy-900 text-center mb-8">
          Trusted By Thousands of Clients
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md">
              <Users className="text-navy-900 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-1">10,000+</h3>
            <p className="text-navy-600">Satisfied Clients</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md">
              <Scale className="text-navy-900 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-1">5,000+</h3>
            <p className="text-navy-600">Qualified Lawyers</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md">
              <MapPin className="text-navy-900 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-1">50+</h3>
            <p className="text-navy-600">States Covered</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md">
              <CheckCircle className="text-navy-900 h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-1">98%</h3>
            <p className="text-navy-600">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
