// This is for future use when we can fix the import issues
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  initialPosition?: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

const LocationMarker: React.FC<{
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}> = ({ position, onPositionChange }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onPositionChange(lat, lng);
    },
  });

  const handleDragEnd = useCallback((e: any) => {
    const marker = e.target;
    const { lat, lng } = marker.getLatLng();
    setMarkerPosition([lat, lng]);
    onPositionChange(lat, lng);
  }, [onPositionChange]);

  return (
    <Marker
      position={markerPosition}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialPosition = [28.6139, 77.2090], // Default to Delhi, India
  onLocationSelect,
  className = "",
}) => {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePositionChange = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          onLocationSelect(latitude, longitude);
          setIsLoading(false);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setError(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <p>Click on the map or drag the marker to set location</p>
          <p className="text-xs text-gray-500">
            Current: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Getting...' : 'Use Current Location'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          key={`${position[0]}-${position[1]}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker 
            position={position} 
            onPositionChange={handlePositionChange}
          />
        </MapContainer>
      </div>
    </div>
  );
};
