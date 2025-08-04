import { useState } from "react";
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const bookingsData = [
  {
    id: 1,
    customerName: "John Smith",
    service: "Electrical Services",
    date: "2025-08-05",
    time: "09:00 AM",
    location: "123 Main St, Downtown",
    phone: "+1 (555) 123-4567",
    status: "confirmed",
    description: "Install new ceiling fan and light fixture",
    price: 180,
    estimatedDuration: "2 hours"
  },
  {
    id: 2,
    customerName: "Sarah Johnson",
    service: "Tailoring Services",
    date: "2025-08-06",
    time: "02:30 PM",
    location: "456 Fashion Ave, Downtown",
    phone: "+1 (555) 234-5678",
    status: "pending",
    description: "Dress alterations for wedding",
    price: 120,
    estimatedDuration: "1.5 hours"
  },
  {
    id: 3,
    customerName: "Mike Wilson",
    service: "Automotive Repair",
    date: "2025-08-07",
    time: "11:00 AM",
    location: "789 Auto District, East Side",
    phone: "+1 (555) 345-6789",
    status: "completed",
    description: "Oil change and brake inspection",
    price: 95,
    estimatedDuration: "1 hour"
  },
  {
    id: 4,
    customerName: "Emily Davis",
    service: "Electrical Services",
    date: "2025-08-08",
    time: "03:00 PM",
    location: "321 Oak St, Suburbs",
    phone: "+1 (555) 456-7890",
    status: "cancelled",
    description: "Kitchen outlet installation",
    price: 150,
    estimatedDuration: "1.5 hours"
  }
];

const statusConfig = {
  confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Confirmed" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pending" },
  completed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Completed" },
  cancelled: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" }
};

export const Bookings = () => {
  const [bookings] = useState(bookingsData);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings = bookings.filter(booking => 
    filterStatus === "all" || booking.status === filterStatus
  );

  const getStatusInfo = (status: keyof typeof statusConfig) => statusConfig[status];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">Manage your appointments and track your schedule</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${bookings.reduce((sum, b) => sum + b.price, 0)}
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {["all", "confirmed", "pending", "completed", "cancelled"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status as keyof typeof statusConfig);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.customerName}
                      </h3>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <p className="text-blue-600 font-medium mb-2">{booking.service}</p>
                    <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {booking.time} ({booking.estimatedDuration})
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {booking.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {booking.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:items-end gap-2">
                    <div className="text-2xl font-bold text-gray-900">
                      ${booking.price}
                    </div>
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                            Confirm
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {filterStatus !== "all" 
                ? `No ${filterStatus} bookings at the moment`
                : "You don't have any bookings yet"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
