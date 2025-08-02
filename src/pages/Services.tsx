import { useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, Zap, Scissors, Wrench, Car, Building } from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";

const iconMap = {
  Zap,
  Scissors,
  Wrench,
  Car,
  Building
};

const allServices = [
  {
    id: 1,
    title: "Electrical Services",
    description: "Electrical installations, repairs, and maintenance services for residential and commercial properties",
    icon: Zap,
    category: "Technical",
    rating: 4.8,
    totalJobs: 156,
    isActive: true,
    hourlyRate: 65,
    location: "Downtown Area"
  },
  {
    id: 2,
    title: "Tailoring Services", 
    description: "Custom clothing design, alterations, and garment repairs with premium quality materials",
    icon: Scissors,
    category: "Fashion",
    rating: 4.9,
    totalJobs: 89,
    isActive: true,
    hourlyRate: 45,
    location: "Fashion District"
  },
  {
    id: 3,
    title: "Plumbing Services",
    description: "Pipe installations, leak repairs, and drainage solutions for homes and businesses",
    icon: Wrench,
    category: "Technical",
    rating: 4.7,
    totalJobs: 203,
    isActive: false,
    hourlyRate: 70,
    location: "Citywide"
  },
  {
    id: 4,
    title: "Automotive Repair",
    description: "Car servicing, repairs, and maintenance solutions for all vehicle types",
    icon: Car,
    category: "Automotive",
    rating: 4.6,
    totalJobs: 127,
    isActive: true,
    hourlyRate: 80,
    location: "Auto District"
  },
  {
    id: 5,
    title: "Construction Services",
    description: "Building construction, renovations, and maintenance for residential projects",
    icon: Building,
    category: "Construction",
    rating: 4.5,
    totalJobs: 78,
    isActive: false,
    hourlyRate: 90,
    location: "Suburban Areas"
  }
];

export const Services = () => {
  const [services, setServices] = useState(allServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "Technical", "Fashion", "Automotive", "Construction"];

  const toggleServiceStatus = (serviceId: number) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Services</h1>
          <p className="text-gray-600">Manage your service offerings and track performance</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-5 w-5" />
                <span>Add Service</span>
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="relative group">
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                category={service.category}
                rating={service.rating}
                totalJobs={service.totalJobs}
                isActive={service.isActive}
                onToggle={() => toggleServiceStatus(service.id)}
              />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
              
              {/* Additional Service Info */}
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Hourly Rate</p>
                    <p className="font-semibold text-green-600">${service.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Service Area</p>
                    <p className="font-semibold text-gray-900">{service.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first service offering"
              }
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Add Your First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
