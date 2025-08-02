import { useState } from "react";
import { 
  Zap, 
  Scissors, 
  Wrench, 
  Car, 
  Building, 
  Plus,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";

const serviceCategories = [
  {
    id: 1,
    title: "Electrical Services",
    description: "Electrical installations, repairs, and maintenance services",
    icon: Zap,
    category: "Technical",
    rating: 4.8,
    totalJobs: 156,
    isActive: true
  },
  {
    id: 2,
    title: "Tailoring Services", 
    description: "Custom clothing design, alterations, and garment repairs",
    icon: Scissors,
    category: "Fashion",
    rating: 4.9,
    totalJobs: 89,
    isActive: true
  },
  {
    id: 3,
    title: "Plumbing Services",
    description: "Pipe installations, leak repairs, and drainage solutions",
    icon: Wrench,
    category: "Technical",
    rating: 4.7,
    totalJobs: 203,
    isActive: false
  },
  {
    id: 4,
    title: "Automotive Repair",
    description: "Car servicing, repairs, and maintenance solutions",
    icon: Car,
    category: "Automotive",
    rating: 4.6,
    totalJobs: 127,
    isActive: true
  },
  {
    id: 5,
    title: "Construction Services",
    description: "Building construction, renovations, and maintenance",
    icon: Building,
    category: "Construction",
    rating: 4.5,
    totalJobs: 78,
    isActive: false
  }
];

export const Home = () => {
  const [services, setServices] = useState(serviceCategories);

  const toggleServiceStatus = (serviceId: number) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  const activeServices = services.filter(service => service.isActive);
  const totalEarnings = activeServices.reduce((sum, service) => sum + (service.totalJobs * 45), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Dashboard Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Salvatore Dashboard
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Manage your services and grow your business across multiple sectors
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Add New Service
                </button>
                <button className="border border-blue-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  View Analytics
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Services</p>
                    <p className="text-2xl font-bold">{activeServices.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">This Month</p>
                    <p className="text-2xl font-bold">23 Jobs</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Management Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Services
            </h2>
            <p className="text-gray-600">
              Manage your service offerings across different sectors
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              category={service.category}
              rating={service.rating}
              totalJobs={service.totalJobs}
              isActive={service.isActive}
              onToggle={() => toggleServiceStatus(service.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">View Bookings</h4>
              <p className="text-gray-600 text-sm">Check your upcoming appointments and manage your schedule</p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
              <p className="text-gray-600 text-sm">Track your performance and earnings across all services</p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Payments</h4>
              <p className="text-gray-600 text-sm">Manage your earnings and payment methods</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
